import "react-native-gesture-handler";

import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import {
  dropDbTablesAsync,
  fetchSheep,
  init,
  insertBreedData,
  insertColorData,
  insertMarkingData,
  insertSheepData,
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
      const currentSchemaVersion = 0;
      const expectedSchemaVersion = 2; // The version your app expects

      if (currentSchemaVersion !== expectedSchemaVersion) {
        await executeMigration();
        await updateSchemaVersion(expectedSchemaVersion);
      }
      try {
        //  await dropDbTablesAsync();
        await init();
        await insertBreedData();
        await insertColorData();
        await insertMarkingData();
        //  await insertSheepData();
      } catch (e) {
        console.log("!e", e);
      }
      await fetchSheep()
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
