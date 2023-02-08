import AppLoading from "expo-app-loading";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "./components/Header";
import { Provider as PaperProvider } from "react-native-paper";
import MainContainer from "./components/MainContainer";
import {
  dropDbTablesAsync,
  fetchBreeds,
  fetchColors,
  fetchFemales,
  fetchMales,
  fetchMarkings,
  fetchSheep,
  init,
  insertBreedData,
  insertColorData,
  insertMarkingData,
  insertSheepData,
} from "./services/db";

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [sheep, setSheep] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
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
      setSheep(await fetchSheep());
      setDbInitialized(true);
    }
    loadData();
  }, []);

  if (!dbInitialized) {
    //  console.log("sheep", sheep);
    return <AppLoading />;
  }

  return (
    <SheepContext.Provider sheepList={sheep}>
      <PaperProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Header />
          <MainContainer
            isModalVisible={isModalVisible}
            toggleModal={toggleModal}
          />
        </View>
      </PaperProvider>
    </SheepContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
