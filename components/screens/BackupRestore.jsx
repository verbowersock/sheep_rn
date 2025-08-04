import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
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

const BackupRestore = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function checkPermissions() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Permission error:', error);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Permission request failed. Please try again",
        })
      );
      return false;
    }
  }

  async function restoreDB() {
    setLoading(true);
    try {
      // Pick database file
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
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
      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite/`, { 
        intermediates: true 
      });
      
      // Copy the file
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destPath,
      });

      // Handle schema migration
      const currentSchemaVersion = await getCurrentSchemaVersion();
      const expectedSchemaVersion = 4;

      if (currentSchemaVersion !== expectedSchemaVersion) {
        await executeMigration();
        await updateSchemaVersion(expectedSchemaVersion);
      }

      // Refresh the app data
      const sheepData = await fetchAllSheep();
      dispatch(setSheep(sheepData));
      
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: false,
          message: "Database restored successfully",
        })
      );
    } catch (error) {
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Restore failed. Please try again",
        })
      );
      console.log('Restore error:', error);
    }
  }

  async function backupDB() {
    setLoading(true);
    
    if (!(await checkPermissions())) {
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Storage permission denied",
        })
      );
      return;
    }

    try {
      const currDate = format(new Date(), "dd_MM_yyyy_HHmmss");
      const fileName = `myFlockDB_${currDate}.db`;
      
      // Source database path
      const sourcePath = `${FileSystem.documentDirectory}SQLite/sheep.db`;
      
      // Create backup in cache first
      const tempBackupPath = `${FileSystem.cacheDirectory}${fileName}`;
      
      // Copy database to cache
      await FileSystem.copyAsync({
        from: sourcePath,
        to: tempBackupPath,
      });

      // Save to device's Downloads folder
      const asset = await MediaLibrary.createAssetAsync(tempBackupPath);
      const album = await MediaLibrary.getAlbumAsync('Download');
      
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      // Clean up temp file
      await FileSystem.deleteAsync(tempBackupPath, { idempotent: true });
      
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: false,
          message: "Database backed up to Downloads folder",
        })
      );
    } catch (error) {
      setLoading(false);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Backup failed. Please try again",
        })
      );
      console.log('Backup error:', error);
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