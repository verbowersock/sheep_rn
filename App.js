import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from "expo-splash-screen";
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

  async function initDb() {
    try {
      await SplashScreen.preventAutoHideAsync();
      
      // Initialize database FIRST
      await initializeDatabase();
      console.log('Database initialized');
      
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
        console.log('Initial data inserted');
      } catch (e) {
        console.log("Error inserting initial data:", e);
      }

      // FIXED: Add await here!
      const allSheep = await fetchAllSheep();
      console.log('Fetched sheep:', allSheep?.length || 0);
      dispatch(setSheep(allSheep || []));
      
      await SplashScreen.hideAsync();
      setIsReady(true);
    } catch (e) {
      console.error("Database initialization error:", e);
      setError(e.message);
      await SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    initDb();
  }, []); // Empty dependency array is correct here

  if (error) {
    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', textAlign: 'center', padding: 20 }}>
            Database Error: {error}
          </Text>
        </View>
    );
  }

  if (!isReady) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Setting up database...</Text>
        </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}