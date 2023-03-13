import AppLoading from "expo-app-loading";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import {
  dropDbTablesAsync,
  fetchSheep,
  init,
  insertBreedData,
  insertColorData,
  insertMarkingData,
  insertSheepData,
} from "../services/db";

import MainContainer from "./MainContainer";
import { setSheep } from "../store/slices/sheep";
import ConfirmationDialog from "./ConfirmationDialog";
import { Portal } from "react-native-paper";
import ConfirmationSnackbar from "./ConfirmationSnackbar";
import { setShowFormDialog, uiSelector } from "../store/slices/ui";

export default function MainScreen() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const dispatch = useDispatch();
  const { isFormDialogVisible } = useSelector(uiSelector);

  const toggleModal = () => {
    dispatch(setShowFormDialog(!isFormDialogVisible));
  };

  useEffect(() => {
    console.log("loading data");
    async function loadData() {
      try {
        await dropDbTablesAsync();
        await init();
        await insertBreedData();
        await insertColorData();
        await insertMarkingData();
        await insertSheepData();
      } catch (e) {
        console.log("!e", e);
      }
      await fetchSheep().then((res) => {
        dispatch(setSheep(res));
      });
      setDbInitialized(true);
    }
    loadData();
  }, []);

  if (!dbInitialized) {
    //  console.log("sheep", sheep);
    return <AppLoading />;
  }
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
