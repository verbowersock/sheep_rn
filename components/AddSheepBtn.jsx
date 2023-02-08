import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";

const AddSheepBtn = ({ toggleModal }) => {
  return (
    <FAB icon="plus" style={styles.fab} onPress={toggleModal} color="white" />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    backgroundColor: "#c2875a",
    bottom: 20,
    alignSelf: "center",
  },
});

export default AddSheepBtn;
