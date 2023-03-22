import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";

import MainContainer from "./MainContainer";

import { Portal } from "react-native-paper";
import ConfirmationSnackbar from "./ConfirmationSnackbar";
import {
  resetFormData,
  setFormTitle,
  setShowFormDialog,
  uiSelector,
} from "../store/slices/ui";

export default function MainScreen() {
  const dispatch = useDispatch();
  const { isFormDialogVisible } = useSelector(uiSelector);

  const toggleModal = () => {
    dispatch(resetFormData());
    dispatch(setFormTitle("Add New Sheep"));
    dispatch(setShowFormDialog(!isFormDialogVisible));
  };

  return (
    <Portal.Host>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Header />
        <MainContainer
          isModalVisible={isFormDialogVisible}
          toggleModal={toggleModal}
        />
        <ConfirmationSnackbar />
      </View>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
