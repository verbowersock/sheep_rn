import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import MainContainer from "../MainContainer";
import { Portal, useTheme } from "react-native-paper";
import ConfirmationSnackbar from "../ConfirmationSnackbar";

export default function MainScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <Portal.Host>

      <View style={styles.container}>
        <StatusBar style="auto" />
        <MainContainer />
      
      </View>

        <ConfirmationSnackbar />

    </Portal.Host>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
