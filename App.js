import "react-native-gesture-handler";

import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import {
  addBasicData,
  addMedicalData,
  dropDbTablesAsync,
  fetchAllSheep,
  init,
  insertBreedData,
  insertColorData,
  insertMarkingData,
  insertMedData,
  insertMedList,
  insertSheepData,
  insertVaxData,
  insertVaxList,
} from "./services/db";
import { setSheep } from "./store/slices/sheep";

import { useTheme } from "react-native-paper";
import DrawerNavigator from "./components/Navigation/DrawerNavigator";
import {
  executeMigration,
  getCurrentSchemaVersion,
  updateSchemaVersion,
} from "./services/migration";

export default function App() {
  const theme = useTheme();

  const dispatch = useDispatch();

  async function initDb() {
    try {
      await SplashScreen.preventAutoHideAsync();
      //const currentSchemaVersion = await getCurrentSchemaVersion();
      const currentSchemaVersion = 2;
      const expectedSchemaVersion = 2; // The version your app expects

      if (currentSchemaVersion !== expectedSchemaVersion) {
        await executeMigration();
        await updateSchemaVersion(expectedSchemaVersion);
      }
      try {
        await init();
        await insertBreedData();
        await insertColorData();
        await insertMarkingData();
        await insertSheepData();
        await insertMedList();
        await insertVaxList();
        await insertMedData();
        await insertVaxData();
      } catch (e) {
        console.log("!e", e);
      }
      await fetchAllSheep()
        .then((res) => {
          dispatch(setSheep(res));
        })
        .then(() => SplashScreen.hideAsync());
    } catch (e) {
      console.warn(e);
    }
  }

  useEffect(() => {
    initDb();
  }, []);

  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
