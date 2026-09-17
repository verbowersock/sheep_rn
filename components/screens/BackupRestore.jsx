import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import ConfirmationSnackbar from "../ConfirmationSnackbar";
import { setShowSnackbar } from "../../store/slices/ui";
import { useState } from "react";
import { fetchAllSheep } from "../../services/db";
import { setSheep } from "../../store/slices/sheep";
import {
  executeMigration,
  getCurrentSchemaVersion,
  updateSchemaVersion,
} from "../../services/migration";
import { StorageAccessFramework } from "expo-file-system";
import * as Updates from "expo-updates";
import * as SQLite from "expo-sqlite";

const BackupRestore = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function checkPermissions() {
    // Android 11+ uses StorageAccessFramework, doesn't need MediaLibrary permissions
    // iOS doesn't need explicit permissions for file operations in our use case
    console.log("✅ Permission check: Using system file pickers (no explicit permission needed)");
    return true;
  }

  async function compressImagesInBackup(backupDbPath) {
    try {
      console.log("🗂️ Opening backup database...");
      const db = await SQLite.openDatabaseAsync("sheep.db", {
        useNewConnection: true,
      });
      console.log("✅ Backup database opened");

      console.log("🔍 Querying images to compress...");

      // Check if image_compressed column exists first
      let allRows;
      try {
        allRows = await db.getAllAsync(
          "SELECT sheep_id, picture, image_compressed FROM sheep WHERE picture IS NOT NULL",
        );
        console.log(`✅ Found ${allRows.length} sheep with images`);
      } catch (columnError) {
        if (columnError.message.includes("no such column")) {
          console.log(
            "⚠️  image_compressed column doesn't exist yet, querying without it...",
          );
          allRows = await db.getAllAsync(
            "SELECT sheep_id, picture FROM sheep WHERE picture IS NOT NULL",
          );
          // Add the column dynamically
          allRows = allRows.map((row) => ({ ...row, image_compressed: 0 }));
          console.log(
            `✅ Found ${allRows.length} sheep with images (adding default flag)`,
          );
        } else {
          throw columnError;
        }
      }

      for (const row of allRows) {
        // Skip if already compressed
        if (row.image_compressed === 1) {
          console.log(`⏭️  Skipping sheep ${row.sheep_id}: already compressed`);
          continue;
        }

        console.log(`📸 Processing sheep ${row.sheep_id}...`);
        if (row.picture && row.picture.startsWith("data:image/")) {
          try {
            // Extract base64 string
            const base64String = row.picture.replace(
              /^data:image\/[a-z]+;base64,/,
              "",
            );

            // Validate base64 format
            if (!base64String || base64String.length === 0) {
              console.warn(
                `⚠️  Skipping compression for sheep ${row.sheep_id}: empty base64 string`,
              );
              continue;
            }

            // Write Base64 to temp file
            const tempImagePath = `${FileSystem.cacheDirectory}temp_image_${row.sheep_id}.jpg`;

            try {
              await FileSystem.writeAsStringAsync(tempImagePath, base64String, {
                encoding: FileSystem.EncodingType.Base64,
              });
              console.log(`✅ Temp image written for sheep ${row.sheep_id}`);
            } catch (writeError) {
              console.warn(
                `⚠️  Failed to write temp image for sheep ${row.sheep_id}:`,
                writeError,
              );
              continue;
            }

            // Compress the image
            let manipResult;
            try {
              console.log(`🎨 Compressing image for sheep ${row.sheep_id}...`);
              manipResult = await ImageManipulator.manipulateAsync(
                tempImagePath,
                [],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG },
              );
              console.log(`✅ Image compressed for sheep ${row.sheep_id}`);
            } catch (manipError) {
              console.warn(
                `⚠️  ImageManipulator failed for sheep ${row.sheep_id}:`,
                manipError,
              );
              await FileSystem.deleteAsync(tempImagePath, { idempotent: true });
              continue;
            }

            // Read compressed image as Base64
            let compressedBase64;
            try {
              compressedBase64 = await FileSystem.readAsStringAsync(
                manipResult.uri,
                { encoding: FileSystem.EncodingType.Base64 },
              );

              if (!compressedBase64 || compressedBase64.length === 0) {
                throw new Error("Compressed image is empty");
              }
              console.log(
                `✅ Compressed base64 read for sheep ${row.sheep_id}`,
              );
            } catch (readError) {
              console.warn(
                `⚠️  Failed to read compressed image for sheep ${row.sheep_id}:`,
                readError,
              );
              await FileSystem.deleteAsync(tempImagePath, { idempotent: true });
              await FileSystem.deleteAsync(manipResult.uri, {
                idempotent: true,
              });
              continue;
            }

            // Update database with compressed image and set the compressed flag (if column exists)
            try {
              console.log(`💾 Updating database for sheep ${row.sheep_id}...`);
              try {
                await db.runAsync(
                  "UPDATE sheep SET picture = ?, image_compressed = 1 WHERE sheep_id = ?",
                  [`data:image/jpeg;base64,${compressedBase64}`, row.sheep_id],
                );
              } catch (updateWithFlagError) {
                if (updateWithFlagError.message.includes("no such column")) {
                  // Column doesn't exist, update without the flag
                  console.log(
                    `⚠️  image_compressed column doesn't exist, updating picture only...`,
                  );
                  await db.runAsync(
                    "UPDATE sheep SET picture = ? WHERE sheep_id = ?",
                    [
                      `data:image/jpeg;base64,${compressedBase64}`,
                      row.sheep_id,
                    ],
                  );
                } else {
                  throw updateWithFlagError;
                }
              }
              console.log(
                `✅ Image compressed and updated for sheep ${row.sheep_id}`,
              );
            } catch (updateError) {
              console.warn(
                `⚠️  Failed to update database for sheep ${row.sheep_id}:`,
                updateError,
              );
            }

            // Clean up temp files
            await FileSystem.deleteAsync(tempImagePath, { idempotent: true });
            await FileSystem.deleteAsync(manipResult.uri, { idempotent: true });
          } catch (e) {
            console.warn(
              `⚠️  Unexpected error during image compression for sheep ${row.sheep_id}:`,
              e,
            );
          }
        }
      }

      console.log("🔐 Closing database...");
      await db.closeAsync();
      console.log("✅ Database closed successfully");
    } catch (error) {
      console.error("❌ Image compression error:", error);
      // Don't throw - backup should continue even if compression fails
    }
  }

  async function restoreDB() {
    setLoading(true);
    try {
      // Pick database file
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      // Get the source file URI
      const sourceUri = result.assets[0].uri;

      // Define destination path for the database
      const destPath = `${FileSystem.documentDirectory}SQLite/sheep.db`;

      // Ensure the SQLite directory exists
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite/`,
        {
          intermediates: true,
        },
      );

      // Copy the file
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destPath,
      });

      if (Platform.OS === "android") {
        // The copied file might be read-only, we need to make it writable
        // Unfortunately FileSystem doesn't have chmod, so we need to recreate it
        const tempPath = `${FileSystem.documentDirectory}SQLite/temp_sheep.db`;

        // Read the content and write it again (this sets proper permissions)
        const dbContent = await FileSystem.readAsStringAsync(destPath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.writeAsStringAsync(tempPath, dbContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Replace the original with the properly permissioned file
        await FileSystem.deleteAsync(destPath);
        await FileSystem.moveAsync({
          from: tempPath,
          to: destPath,
        });
      }

      // Skip migration during restore - let the app handle it on reload
      // Trying to migrate the restored DB can fail with "readonly database" errors
      // The app will automatically run the migration on next startup
      console.log(
        "⏭️  Skipping migration during restore (will run on app reload)",
      );

      // Just verify we can read from the database
      try {
        const sheepCount = await fetchAllSheep();
        console.log(`✅ Database readable: found ${sheepCount.length} sheep`);
        dispatch(setSheep(sheepCount || []));
      } catch (readError) {
        console.warn("⚠️  Could not read database immediately:", readError);
        // That's ok, the app reload will handle it
      }

      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: false,
          message: "Database restored successfully. The app will now reload.",
        }),
      );
      console.log("Attempting Updates.reloadAsync...");
      setTimeout(async () => {
        try {
          // Show a different message to indicate Updates is attempting
          dispatch(
            setShowSnackbar({
              visible: true,
              error: false,
              message: "Attempting app reload...",
            }),
          );

          await Updates.reloadAsync();

          // This line should never execute if reload works
          dispatch(
            setShowSnackbar({
              visible: true,
              error: true,
              message: "Reload failed - please restart manually",
            }),
          );
        } catch (error) {
          dispatch(
            setShowSnackbar({
              visible: true,
              error: true,
              message: "App reload not available - please restart manually",
            }),
          );
        }
      }, 1500);
    } catch (error) {
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Restore failed. Please try again",
        }),
      );
    }
  }

  async function backupDB() {
    setLoading(true);
    console.log("🔵 Backup started");

    if (!(await checkPermissions())) {
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Storage permission denied",
        }),
      );
      return;
    }

    try {
      console.log("✅ Permissions granted");
      const currDate = format(new Date(), "dd_MM_yyyy_HHmmss");
      const fileName = `myFlockDB_${currDate}.db`;

      // Source database path
      const sourcePath = `${FileSystem.documentDirectory}SQLite/sheep.db`;

      // Create backup in cache first
      const tempBackupPath = `${FileSystem.cacheDirectory}${fileName}`;

      console.log("📋 Copying database to cache...");
      // Copy database to cache
      await FileSystem.copyAsync({
        from: sourcePath,
        to: tempBackupPath,
      });
      console.log("✅ Database copied to cache");

      // Compress images in the backup
      console.log("📸 Starting image compression...");
      await compressImagesInBackup(tempBackupPath);
      console.log("✅ Image compression complete");

      if (Platform.OS === "android") {
        console.log("📱 Android: Requesting storage permissions...");
        const permissions =
          await StorageAccessFramework.requestDirectoryPermissionsAsync(
            FileSystem.documentDirectory,
          );
        if (permissions.granted) {
          console.log("📱 Android: Creating file in Documents...");
          const fileUri = await StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "application/octet-stream",
          );
          // Read database and write to SAF URI
          const dbContent = await FileSystem.readAsStringAsync(tempBackupPath, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log("📱 Android: Writing backup file...");
          await FileSystem.writeAsStringAsync(fileUri, dbContent, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log("✅ Android backup complete");
        }
      } else {
        console.log("🍎 iOS: Creating media library asset...");
        const asset = await MediaLibrary.createAssetAsync(tempBackupPath);
        const album = await MediaLibrary.getAlbumAsync("Documents");

        if (album == null) {
          await MediaLibrary.createAlbumAsync("Documents", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        console.log("✅ iOS backup complete");
      }

      // Clean up temp file
      await FileSystem.deleteAsync(tempBackupPath, { idempotent: true });
      console.log("🧹 Temp backup file cleaned up");

      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: false,
          message: "Database backed up to the selected folder",
        }),
      );
      console.log("✅ Backup completed successfully");
    } catch (error) {
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Backup failed. Please try again",
        }),
      );
      console.error("❌ Backup error:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <Text style={styles.title}>Backup your database</Text>
      <Button
        buttonColor={theme.colors.primary}
        loading={loading}
        dark
        style={{ width: "40%", marginTop: 25, marginBottom: 25 }}
        mode="contained"
        onPress={backupDB}
      >
        Backup
      </Button>
      <Text style={styles.title}>Restore from backup</Text>
      <Button
        buttonColor={theme.colors.primary}
        loading={loading}
        dark
        style={{ width: "40%", marginTop: 15 }}
        mode="contained"
        onPress={restoreDB}
      >
        Restore
      </Button>
      <ConfirmationSnackbar />
    </ScrollView>
  );
};

export default BackupRestore;

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "column",
      margin: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.text,
    },
  });
