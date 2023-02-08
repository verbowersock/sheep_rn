import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar";
import AddSheepBtn from "./AddSheepBtn";
import SheepList from "./Sheeplist";
import AddForm from "./AddForm";

const MainContainer = ({ toggleModal, isModalVisible }) => {
  return (
    <View style={styles.mainContainer}>
      <SearchBar />
      <SheepList />
      <AddSheepBtn toggleModal={toggleModal} />
      <AddForm toggleModal={toggleModal} isModalVisible={isModalVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
export default MainContainer;
