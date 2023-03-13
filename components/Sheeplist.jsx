import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import { FlatList } from "react-native";
import Sheep from "./Sheep";
import { sheepDataSelector } from "../store/slices/sheep";
import { useSelector } from "react-redux";

const renderSheep = ({ item }) => {
  return <Sheep item={item} />;
};

const SheepList = () => {
  const { sheep } = useSelector(sheepDataSelector);
  // console.log(sheep);
  return (
    <View style={styles.SheepListWrapper}>
      {sheep.length !== 0 ? (
        <FlatList data={sheep} renderItem={renderSheep} />
      ) : (
        <View style={styles.NothingFound}>
          <Text style={styles.NothingFoundText}>Sorry, no sheep found!</Text>
        </View>
      )}
    </View>
  );
};
export default SheepList;

const styles = StyleSheet.create({
  SheepListWrapper: {
    flex: 1,
    paddingBottom: 50,
  },
  NothingFound: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  NothingFoundText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
