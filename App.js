import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import {
  initializeDatabase,
  fetchAllSheep,
  insertBreedData,
  insertColorData,
  insertMarkingData,
  insertMedData,
  insertMedList,
  insertSheepData,
  insertVaxData,
  insertVaxList,
  setCurrentSchemaVersion,
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
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("isReady:", isReady);
  }, [isReady]);

  async function initDb() {
    try {
      // Initialize database FIRST
      await initializeDatabase();

      let currentSchemaVersion = await getCurrentSchemaVersion();
      const expectedSchemaVersion = 5;

      console.log(
        `📊 Schema version: current=${currentSchemaVersion}, expected=${expectedSchemaVersion}`,
      );

      if (currentSchemaVersion === 0) {
        console.log("🆕 Fresh install, setting schema to v5");
        await setCurrentSchemaVersion(expectedSchemaVersion);
        currentSchemaVersion = expectedSchemaVersion;
      }

      if (currentSchemaVersion < expectedSchemaVersion) {
        console.log(
          `⬆️  Upgrading schema from v${currentSchemaVersion} to v${expectedSchemaVersion}`,
        );
        await executeMigration();
        await updateSchemaVersion(expectedSchemaVersion);
        console.log("✅ Schema migration complete");
      } else {
        console.log("✅ Schema is up to date");
      }

      try {
        await insertBreedData();
        await insertColorData();
        await insertMarkingData();
        await insertMedList();
        await insertVaxList();
        //test and demo data. uncomment for production releases
        //await insertSheepData();
        //await insertMedData();
        //await insertVaxData();
      } catch (e) {
        SplashScreen.hide();
        console.error("Error inserting initial data:", e);
      }

      const allSheep = await fetchAllSheep();
      dispatch(setSheep(allSheep || []));

      setIsReady(true);
      console.log("Database initialized and data inserted successfully.");
      await SplashScreen.hideAsync();
      console.log("Splash screen hidden successfully.");
    } catch (e) {
      console.error("Database initialization error:", e);
      setError(e.message);

      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    initDb();
  }, []);

  return (
    <SafeAreaProvider>
      {isReady ? (
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </View>
      )}
    </SafeAreaProvider>
  );
}
