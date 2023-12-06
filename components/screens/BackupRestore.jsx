import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import DocPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import ConfirmationSnackbar from "../ConfirmationSnackbar";
import { setShowSnackbar } from "../../store/slices/ui";
import { useState } from "react";
import { fetchAllSheep } from "../../services/db";
import { setSheep } from "../../store/slices/sheep";

const BackupRestore = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function checkPermissions() {
    if (Platform.constants["Release"] >= 13) {
      return true;
    } else {
      let granted;
      try {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "myFlock App Permission",
            message: "This app needs permission to acess storage.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
      } catch (err) {
        console.warn(err);
        dispatch(
          setShowSnackbar({
            visible: true,
            error: true,
            message: "Something went wrong. Please try again",
          })
        );
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  async function restoreDB() {
    setLoading(true);
    if (checkPermissions()) {
      try {
        const rsPicker = await DocPicker.pickSingle();
        const filePath = rsPicker.uri;
        await RNFS.copyFile(
          filePath,
          "/data/user/0/com.sheeprn/files/SQLite/sheep.db"
        );
        setLoading(false);
        await fetchAllSheep().then((res) => {
          dispatch(setSheep(res));
        });
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: "Database restored successfully",
          })
        );
      } catch (e) {
        setLoading(false);
        dispatch(
          setShowSnackbar({
            visible: true,
            error: true,
            message: "Something went wrong. Please try again",
          })
        );
        console.log(e);
      }
    } else {
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Storage Permission denied",
        })
      );
      return false;
    }
  }

  async function backupDB() {
    setLoading(true);
    if (await checkPermissions()) {
      try {
        const currDate = format(new Date(), "dd_MM_yyyy_HHmmss");
        const destPath =
          RNFS.DownloadDirectoryPath + "/myFlockDB_" + currDate + ".db";
        await RNFS.copyFile(
          "/data/user/0/com.sheeprn/files/SQLite/sheep.db",
          destPath
        );
        setLoading(false);
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: "Database saved to Downloads folder",
          })
        );
      } catch (e) {
        setLoading(false);
        dispatch(
          setShowSnackbar({
            visible: true,
            error: true,
            message: "Something went wrong. Please try again",
          })
        );
        console.log(e);
      }
    } else {
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Storage Permission denied",
        })
      );
      return false;
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
        onPress={() => {
          backupDB();
        }}
      >
        Backup
      </Button>
      <Text style={styles.title}>Restore from backup</Text>
      <Button
        buttonColor={theme.colors.primary}
        dark
        style={{ width: "40%", marginTop: 15 }}
        mode="contained"
        onPress={() => {
          restoreDB();
        }}
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
