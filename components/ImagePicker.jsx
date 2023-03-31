import React, { useState } from "react";

import {
  StyleSheet,
  View,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";

import RNFetchBlob from "rn-fetch-blob";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { FAB, useTheme } from "react-native-paper";

const ImagePicker = ({ value, onChange }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [filePath, setFilePath] = useState(value);

  const [FABstate, setFABState] = React.useState({ open: false });

  const onFABStateChange = ({ open }) => setFABState({ open });

  const { open } = FABstate;

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission",
          }
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "External Storage Write Permission",
            message: "App needs write permission",
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert("Write permission err", err);
      }
      return false;
    } else return true;
  };
  const getUniqueFileName = (fileExt) => {
    //It is better naming file with current timestamp to achieve unique name
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var fileName = "IMG" + year + month + date + hour + minute + "." + fileExt;
    return fileName;
  };

  const writeFileToStorage = async (base64Data, fileName) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message:
            "This app need your permission to save pictures to internal storage ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const dirs = RNFetchBlob.fs.dirs;
        var folderPath = dirs.PictureDir + "/MyFlockImages/";
        var fullPath = folderPath + fileName;
        RNFetchBlob.fs.writeFile(fullPath, base64Data, "base64").then((res) => {
          console.log("!!!file saved", res);
          RNFetchBlob.fs
            .stat(fullPath)
            .then((stats) => {
              console.log("!!!stats", stats);
              setFilePath(`file:\/\/${stats.path}`);
              onChange(`file:\/\/${stats.path}`);
              console.log("!!!filepath", filePath);
            })

            .catch((err) => {
              console.log(err);
            });
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      saveToPhotos: true,
      includeBase64: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, async (response) => {
        if (response.didCancel) {
          alert("User cancelled camera picker");
          return;
        } else if (response.errorCode == "camera_unavailable") {
          alert("Camera not available on device");
          return;
        } else if (response.errorCode == "permission") {
          alert("Permission not satisfied");
          return;
        } else if (response.errorCode == "others") {
          alert(response.errorMessage);
          return;
        }
        console.log(response);
        /*   RNFS.exists(RNFS.CachesDirectoryPath)
          .then((success) => {
            console.log(RNFS.CachesDirectoryPath);
            console.log(success); // <--- here RNFS can read the file and returns this
          })
          .catch((err) => {
            console.log("Exists Error: " + err.message);
          });
        RNFS.copyFile(
          //remove first 9 characters from response.assets[0].path
          `${RNFS.CachesDirectoryPath}/${response.assets[0].fileName}`,
          `${RNFS.DocumentDirectoryPath}/${response.assets[0].fileName}`
        )
          .then((success) => console.log("!!!", success))
          .catch((err) => console.log("!!!", err));
          */
        // saveToStorage(
        //   response.assets[0].path,
        //   response.assets[0].fileName
        // );
        //setFilePath(
        //  `${RNFS.DocumentDirectoryPath}/${response.assets[0].fileName}`
        //);
        const base64Data = response.assets[0].base64;
        const fileName = getUniqueFileName("jpg");
        writeFileToStorage(base64Data, fileName);

        // onChange(filePath);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        alert("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        alert(response.errorMessage);
        return;
      }
      console.log(response);
      writeFileToStorage(
        response.assets[0].base64,
        response.assets[0].fileName
      );
    });
  };

  return (
    <View style={styles.container}>
      {filePath === null ? (
        <Image
          source={require("../assets/images/placeholder.jpg")}
          style={styles.imageStyle}
          resizeMode="contain"
        />
      ) : (
        <Image source={{ uri: filePath }} style={styles.imageStyle} />
      )}

      <FAB.Group
        open={open}
        color={theme.colors.background}
        backgroundColor={theme.colors.primary}
        fabStyle={{ backgroundColor: theme.colors.primary }}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        backdropColor={"transparent"}
        icon={open ? "camera" : "plus"}
        actions={[
          {
            icon: "camera",
            label: "Open Camera",
            onPress: () => captureImage("photo"),
          },
          {
            icon: "folder-upload",
            label: "Upload Image",
            onPress: () => chooseFile("photo"),
          },
        ]}
        onStateChange={onFABStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
      {/* <Text>Take Photo</Text>
        <IconButton
          icon="camera"
          color={"green"}
          size={40}
          onPress={() => captureImage("photo")}
        />
        <Text>Upload Image</Text>
        <IconButton
          icon="folder-upload"
          color={"green"}
          size={40}
          onPress={() => chooseFile("photo")}
        />*/}
    </View>
  );
};

export default ImagePicker;

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      justifyContent: "center",
    },
    titleText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      paddingVertical: 20,
    },
    textStyle: {
      padding: 10,
      color: theme.colors.text,
      textAlign: "center",
    },
    buttonStyle: {
      alignItems: "center",
      backgroundColor: theme.colors.secondary,
      padding: 5,
      marginVertical: 10,
      width: 250,
    },
    imageStyle: {
      width: 200,
      height: 200,
      margin: 5,
    },
  });
