import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "./SearchBar";
import AddSheepBtn from "./AddSheepBtn";
import SheepList from "./Sheeplist";
import AddForm from "./AddForm";
import { useSelector } from "react-redux";
import { sheepDataSelector } from "../store/slices/sheep";
import { Checkbox, useTheme } from "react-native-paper";

const MainContainer = ({ toggleModal, isModalVisible }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { sheep } = useSelector(sheepDataSelector);
  const [filteredSheep, setFilteredSheep] = useState(sheep);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [deadChecked, setDeadChecked] = useState(true);

  const [soldChecked, setSoldChecked] = useState(false);

  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  useEffect(() => {
    if (sheep) {
      if (deadChecked === true && soldChecked === true) {
        // Both checkboxes are selected, return default data
        setFilteredSheep(sheep);
      } else if (deadChecked === true) {
        // Only checkbox 1 is selected, filter data by criteria 1
        const filteredSheep = sheep.filter(
          (sheep) => sheep.dos === "" || sheep.dos === null
        );
        setFilteredSheep(filteredSheep);
      } else if (soldChecked === true) {
        // Only checkbox 2 is selected, filter data by criteria 2
        const filteredSheep = sheep.filter(
          (sheep) => sheep.dod === "" || sheep.dod === null
        );
        setFilteredSheep(filteredSheep);
      } else {
        // Neither checkbox is selected, remove items that meet criteria 1 and criteria 2
        const filteredSheep = sheep
          .filter((sheep) => sheep.dos === "" || sheep.dos === null)
          .filter((sheep) => sheep.dod === "" || sheep.dod === null);
        setFilteredSheep(filteredSheep);
      }
    }
  }, [sheep, deadChecked, soldChecked]);

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
      <View style={styles.checkboxContainer}>
        <Checkbox.Item
          disabled={checkboxDisabled}
          label="Show deceased"
          position="trailing"
          labelStyle={{ color: theme.colors.accent }}
          color={theme.colors.accent}
          status={deadChecked ? "checked" : "unchecked"}
          onPress={() => {
            setDeadChecked(!deadChecked);
          }}
        />
        <Checkbox.Item
          disabled={checkboxDisabled}
          label="Show sold"
          position="trailing"
          labelStyle={{ color: theme.colors.accent }}
          color={theme.colors.accent}
          status={soldChecked ? "checked" : "unchecked"}
          onPress={() => {
            setSoldChecked(!soldChecked);
          }}
        />
      </View>
      {filteredSheep && <SheepList sheep={filteredSheep} />}
      <AddSheepBtn toggleModal={toggleModal} />
      {isModalVisible && (
        <AddForm toggleModal={toggleModal} isModalVisible={isModalVisible} />
      )}
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    checkboxContainer: {
      width: "50%",
      alignSelf: "flex-end",
    },
  });
export default MainContainer;
