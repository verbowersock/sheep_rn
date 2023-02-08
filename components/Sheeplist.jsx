import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import { FlatList } from "react-native";
import Sheep from "./Sheep";
import { SheepContext } from "../context/SheepContext";

const renderSheep = ({ item }) => {
  return <Sheep item={item} />;
};

const SheepList = () => {
  const sheepList = React.useContext(SheepContext);

  render(
    <View style={styles.SheepListWrapper}>
      <FlatList data={sheepList} renderItem={renderSheep} />
    </View>
  );
};
export default SheepList;

const styles = StyleSheet.create({
  SheepListWrapper: {
    flex: 1,
  },
});
