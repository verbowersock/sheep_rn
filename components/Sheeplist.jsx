import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FlatList } from "react-native";
import Sheep from "./Sheep";
import { ScrollView } from "react-native-gesture-handler";

const renderSheep = ({ item, index }) => {
  return <Sheep item={item} index={index} />;
};

const SheepList = ({ sheep }) => {
  // console.log(sheep);
  return (
    <ScrollView style={styles.SheepListWrapper}>
      {sheep.length !== 0 ? (
        <FlatList data={sheep} renderItem={renderSheep} />
      ) : (
        <View style={styles.NothingFound}>
          <Text style={styles.NothingFoundText}>Sorry, no sheep found!</Text>
        </View>
      )}
    </ScrollView>
  );
};
export default SheepList;

const styles = StyleSheet.create({
  SheepListWrapper: {
    flex: 1,
  },
  NothingFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  NothingFoundText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
