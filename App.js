import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import {
  initializeDatabase, // Add this import
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
      const expectedSchemaVersion = 4;

      if (currentSchemaVersion === 0) {
        await setCurrentSchemaVersion(expectedSchemaVersion);
        currentSchemaVersion = expectedSchemaVersion;
      }

      if (currentSchemaVersion < expectedSchemaVersion) {
        await executeMigration();
        await updateSchemaVersion(expectedSchemaVersion);
      }

      try {
        await insertBreedData();
        await insertColorData();
        await insertMarkingData();
        await insertMedList();
        await insertVaxList();
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    )}
  </SafeAreaProvider>
);
}