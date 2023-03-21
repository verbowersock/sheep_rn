import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import SearchBar from "./SearchBar";
import AddSheepBtn from "./AddSheepBtn";
import SheepList from "./Sheeplist";
import AddForm from "./AddForm";
import { useSelector } from "react-redux";
import { sheepDataSelector } from "../store/slices/sheep";
import { Checkbox } from "react-native-paper";

const MainContainer = ({ toggleModal, isModalVisible }) => {
  const { sheep } = useSelector(sheepDataSelector);
  const [filteredSheep, setFilteredSheep] = useState(sheep);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [checked, setChecked] = useState(true);
  const [showDead, setShowDead] = useState(true);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  useEffect(() => {
    if (sheep) {
      if (showDead === true) {
        setFilteredSheep(sheep);
      } else if (showDead === false) {
        const liveSheep = sheep.filter(
          (el) => el.dod === "" || el.dod === null
        );
        setFilteredSheep(liveSheep);
      }
    }
  }, [sheep, showDead]);

  useEffect(() => {
    if (searchQuery !== "") {
      setCheckboxDisabled(true);
      setFilteredSheep(
        sheep.filter((el) =>
          el[searchTag].toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setCheckboxDisabled(false);
      setFilteredSheep(sheep);
    }
  }, [searchQuery, searchTag]);

  return (
    <View style={styles.mainContainer}>
      <SearchBar
        onQueryChange={(el) => setSearchQuery(el)}
        onSearchTagChange={(el) => {
          setSearchTag(el);
        }}
      />
      <Checkbox.Item
        disabled={checkboxDisabled}
        label="Show deceased"
        position="trailing"
        labelStyle={{ color: "#9C27B0" }}
        style={{ width: "50%", alignSelf: "flex-end" }}
        color="#9C27B0"
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
          setShowDead(!showDead);
        }}
      />
      {filteredSheep && <SheepList sheep={filteredSheep} />}
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
