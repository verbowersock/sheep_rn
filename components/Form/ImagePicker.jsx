import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FAB, useTheme, IconButton } from "react-native-paper";
import { clearSheepImage } from "../../services/db";
import { useDispatch } from "react-redux";
import { setShowSnackbar } from "../../store/slices/ui";

const ImagePickerComponent = ({ value, onChange, sheepId }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const [file, setFile] = useState(value);
  const [FABstate, setFABState] = React.useState({ open: false });
  const onFABStateChange = ({ open }) => setFABState({ open });
  const { open } = FABstate;

  // Permissions are now handled automatically by expo-image-picker using the system Photo Picker API
  // on Android 13+ (API 33+), which complies with Google Play requirements

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.6,
        base64: true,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64 = result.assets[0].base64;
        setFile(`data:image/jpeg;base64,${base64}`);
        onChange(`data:image/jpeg;base64,${base64}`);
        setFABState({ open: false });
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: "Image uploaded successfully",
          }),
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Failed to pick image",
        }),
      );
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.6,
        base64: true,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64 = result.assets[0].base64;
        setFile(`data:image/png;base64,${base64}`);
        onChange(`data:image/png;base64,${base64}`);
        setFABState({ open: false });
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: "Photo taken successfully",
          }),
        );
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      dispatch(
        setShowSnackbar({
          visible: true,
          error: true,
          message: "Failed to take photo",
        }),
      );
    }
  };

  const deleteImage = async () => {
    if (sheepId) {
      try {
        await clearSheepImage(sheepId);
        setFile(null);
        onChange(null);
        setFABState({ open: false });
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: "Image deleted successfully",
          }),
        );
      } catch (error) {
        console.error("Error deleting image:", error);
        dispatch(
          setShowSnackbar({
            visible: true,
            error: true,
            message: "Failed to delete image",
          }),
        );
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
          fabStyle={{ backgroundColor: theme.colors.secondary }}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          backdropColor="rgba(0, 0, 0, 0.8)"
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
            ...(file && sheepId
              ? [
                  {
                    icon: "image-remove",
                    color: "white",
                    style: {
                      backgroundColor: theme.colors.error,
                    },
                    label: "Delete Image",
                    labelStyle: { color: "white" },
                    onPress: deleteImage,
                  },
                ]
              : []),
          ]}
          onStateChange={onFABStateChange}
        />
      </View>
    </View>
  );
};

export default ImagePickerComponent;

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
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
    imageStyle: {
      width: 200,
      height: 200,
      margin: 55,
    },
  });
