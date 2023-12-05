import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

const IconMenu = () => {
  const theme = useTheme();

  const buttonStyles = {
    mode: "contained",
    containerColor: theme.colors.secondary,
    iconColor: theme.colors.onPrimary,
    size: 25,
  };

  return (
    <View style={styles.container}>
      <IconButton icon="calendar-heart" {...buttonStyles} />
      <IconButton icon="calendar-heart" {...buttonStyles} />
      <IconButton icon="calendar-heart" {...buttonStyles} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    position: "absolute",
    bottom: 50,
    left: 0,
    alignItems: "center",
  },
});

export default IconMenu;
