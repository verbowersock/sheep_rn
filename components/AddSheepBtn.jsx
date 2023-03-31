import React from "react";
import { FAB, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";

const AddSheepBtn = ({ toggleModal }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <FAB
      icon="plus"
      style={styles.fab}
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
    },
  });

export default AddSheepBtn;
