import "react-native-gesture-handler";

import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import MainScreen from "./components/MainScreen";

import * as SplashScreen from "expo-splash-screen";
import { useDispatch } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import About from "./components/About";
import Header from "./components/Header";

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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Backup from "./components/BackupRestore";
import BackupRestore from "./components/BackupRestore";
import { useTheme } from "react-native-paper";

const Drawer = createDrawerNavigator();

export default function App() {
  const theme = useTheme();
  console.log(theme);
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  useEffect(() => {
    async function initDb() {
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log("loading data");
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
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Main"
        screenOptions={{
          drawerPosition: "right",
          drawerActiveBackgroundColor: theme.colors.secondary,
          drawerActiveTintColor: theme.colors.background,
          drawerInactiveTintColor: theme.colors.text,
          header: () => <Header />,
        }}
      >
        <Drawer.Screen
          name="Main"
          component={MainScreen}
          options={{
            drawerLabel: "Your Flock",
            drawerIcon: ({ color, size }) => (
              <Icon name="barn" color={color} size={25} />
            ),
          }}
        />
        <Drawer.Screen
          name="Backup"
          component={BackupRestore}
          options={{
            drawerLabel: "Backup and Restore",
            drawerIcon: ({ color }) => (
              <Icon name="database-check-outline" color={color} size={25} />
            ),
          }}
        />
        <Drawer.Screen
          name="About"
          component={About}
          options={{
            drawerLabel: "About the app",
            drawerIcon: ({ color, size }) => (
              <Icon name="help-circle-outline" color={color} size={25} />
            ),
          }}
        />
      </Drawer.Navigator>
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
