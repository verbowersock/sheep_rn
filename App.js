import "react-native-gesture-handler";

import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import MainScreen from "./components/MainScreen";

import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";

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

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function initDb() {
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log("loading data");
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
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    initDb();
  }, []);
  return <MainScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
