import AppLoading from "expo-app-loading";
import "react-native-gesture-handler";

import React, { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { ToastProvider } from "react-native-paper-toast";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import store from "./store/Config";
import MainScreen from "./components/MainScreen";
import ErrorBoundary from "react-native-error-boundary";
import Error from "./components/Error";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <ErrorBoundary FallbackComponent={Error}>
          <MainScreen />
        </ErrorBoundary>
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
