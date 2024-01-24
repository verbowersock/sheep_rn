import React, { useState } from "react";

import {
  StyleSheet,
  View,
  Image,
  Platform,
  PermissionsAndroid,
} from "react-native";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { FAB, useTheme } from "react-native-paper";

const ImagePicker = ({ value, onChange }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [file, setFile] = useState(value);
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
    if (isCameraPermitted) {
      const result = await launchCamera(options, async (response) => {
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
        const base64 = response.assets[0].base64;
        setFile(`data:image/png;base64,${base64}`);
        onChange(`data:image/png;base64,${base64}`);
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
      setFile(`data:image/png;base64,${response.assets[0].base64}`);
      onChange(`data:image/png;base64,${response.assets[0].base64}`);
    });
  };

  return (
    <View style={styles.container}>
      {file && /^data:image\/[a-zA-Z]*;base64,/.test(file) ? (
        <Image source={{ uri: file }} style={styles.imageStyle} />
      ) : (
        <Image
          source={require("../../assets/images/placeholder.jpg")}
          style={styles.imageStyle}
          resizeMode="contain"
        />
      )}

      <FAB.Group
        open={open}
        color={theme.colors.background}
        backgroundColor={theme.colors.secondary}
        fabStyle={{ backgroundColor: theme.colors.secondary }}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        backdropColor={theme.colors.backdrop}
        icon={open ? "camera" : "plus"}
        actions={[
          {
            icon: "camera",
            color: "white",
            style: { backgroundColor: theme.colors.secondary },
            label: "Open Camera",
            labelStyle: { color: "white" },
            onPress: () => captureImage("photo"),
          },
          {
            icon: "folder-upload",
            color: "white",
            style: { backgroundColor: theme.colors.secondary },
            label: "Upload Image",
            labelStyle: { color: "white" },
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
