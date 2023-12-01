import React from "react";
import { FAB, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const AddSheepBtn = ({ toggleModal, icon = "plus", style }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <FAB
      icon={icon}
      style={[styles.fab, style]}
      onPress={toggleModal}
      color={theme.colors.background}
    />
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    fab: {
      position: "absolute",
      backgroundColor: theme.colors.secondary,
      bottom: 20,
      alignSelf: "center",
      borderRadius: 50,
    },
  });

export default AddSheepBtn;
