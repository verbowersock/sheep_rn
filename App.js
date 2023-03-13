import AppLoading from "expo-app-loading";
import "react-native-gesture-handler";

import React, { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { ToastProvider } from "react-native-paper-toast";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import store from "./store/Config";
import MainScreen from "./components/MainScreen";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <MainScreen />
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
