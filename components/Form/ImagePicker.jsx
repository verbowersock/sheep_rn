import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FAB, useTheme } from "react-native-paper";
import * as mediaLibrary from "expo-media-library";

const ImagePickerComponent = ({ value, onChange }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [file, setFile] = useState(value);
  const [FABstate, setFABState] = React.useState({ open: false });
  const onFABStateChange = ({ open }) => setFABState({ open });
  const { open } = FABstate;

  // Request permissions when component mounts
  useEffect(() => {
  const getPermissions = async () => {
    // Request camera permission
    await ImagePicker.requestCameraPermissionsAsync();
    // // Request media library permission
    // const { status } = await mediaLibrary.requestPermissionsAsync();
    // if (status !== 'granted') {
    //   console.warn('Media library permission not granted');
    //   dispatch(
    //     setShowSnackbar({
    //       visible: true,
    //       error: true,
    //       message: "Media library permission not granted",
    //     })
    //   );
    // }
  };
  
  getPermissions();
}, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:  ['images'],
      quality: 1,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = result.assets[0].base64;
      setFile(`data:image/png;base64,${base64}`);
      onChange(`data:image/png;base64,${base64}`);
      setFABState({ open: false });
    }
  };

  const takePhoto = async () => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes:  ['images'],
    quality: 1,
    base64: true,
  });
  if (!result.canceled && result.assets && result.assets.length > 0) {
    const base64 = result.assets[0].base64;
    setFile(`data:image/png;base64,${base64}`);
    onChange(`data:image/png;base64,${base64}`);
    setFABState({ open: false });
  }
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
            style: { 
              backgroundColor: theme.colors.secondary,
            },
            label: "Open Camera",
            labelStyle: { color: "white" },
            onPress: takePhoto,
          },
          {
            icon: "folder-upload",
            color: "white",
            style: { 
              backgroundColor: theme.colors.secondary,
            },
            label: "Upload Image",
            labelStyle: { color: "white" },
            onPress: pickImage,
          },
        ]}
        onStateChange={onFABStateChange}
      />
    </View>
  );
};

export default ImagePickerComponent;

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      justifyContent: "center",
      padding: 11,
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
