import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "./SearchBar";
import AddSheepBtn from "./AddSheepBtn";
import SheepList from "./Sheeplist";
import AddForm from "./Form/AddForm";
import { useDispatch, useSelector } from "react-redux";
import { sheepDataSelector } from "../store/slices/sheep";
import { Checkbox, Text, useTheme } from "react-native-paper";
import {
  resetFormData,
  setFormTitle,
  setShowFormDialog,
  setShowSecondaryFormDialog,
  uiSelector,
} from "../store/slices/ui";
import SecondaryForm from "./Form/SecondaryForm";

const MainContainer = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { sheep } = useSelector(sheepDataSelector);
  const [filteredSheep, setFilteredSheep] = useState(sheep);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [deadChecked, setDeadChecked] = useState(false);

  const [soldChecked, setSoldChecked] = useState(false);

  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  const dispatch = useDispatch();
  const { isMainFormDialogVisible } = useSelector(uiSelector);
  const { isSecondaryFormDialogVisible } = useSelector(uiSelector);

  const toggleMainModal = () => {
    dispatch(resetFormData());
    dispatch(setFormTitle("Add New Sheep"));
    dispatch(setShowFormDialog(!isMainFormDialogVisible));
  };

  const toggleSecondaryModal = () => {
    dispatch(setShowSecondaryFormDialog(!isSecondaryFormDialogVisible));
  };

  useEffect(() => {
    let filteredSheep = sheep;

    // Apply checkbox filters
    if (deadChecked === true && soldChecked === true) {
      // Both checkboxes are selected, return default data
      filteredSheep = sheep;
    } else if (deadChecked === true) {
      // Only checkbox 1 is selected, filter data by criteria 1
      filteredSheep = sheep.filter(
        (sheep) => sheep.dos === "" || sheep.dos === null
      );
    } else if (soldChecked === true) {
      // Only checkbox 2 is selected, filter data by criteria 2
      filteredSheep = sheep.filter(
        (sheep) => sheep.dod === "" || sheep.dod === null
      );
    } else {
      // Neither checkbox is selected, remove items that meet criteria 1 and criteria 2
      filteredSheep = sheep
        .filter((sheep) => sheep.dos === "" || sheep.dos === null)
        .filter((sheep) => sheep.dod === "" || sheep.dod === null);
    }

    // Apply search query filter
    if (searchQuery !== "") {
      // setCheckboxDisabled(true);
      filteredSheep = filteredSheep.filter((el) => {
        if (el[searchTag]) {
          return el[searchTag]
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return false;
      });
    } else {
      setCheckboxDisabled(false);
    }

    setFilteredSheep(filteredSheep);
  }, [sheep, deadChecked, soldChecked, searchQuery, searchTag]);

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
          style={{ flexDirection: "row-reverse" }}
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
          style={{ flexDirection: "row-reverse" }}
          color={theme.colors.accent}
          status={soldChecked ? "checked" : "unchecked"}
          onPress={() => {
            setSoldChecked(!soldChecked);
          }}
        />
      </View>
      <View style={{ display: "flex", width: "100%", paddingBottom: 10 }}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 21,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Total Count: {filteredSheep.length}
        </Text>
      </View>

      {filteredSheep && <SheepList sheep={filteredSheep} />}

      <AddSheepBtn toggleModal={toggleMainModal} />
      {isMainFormDialogVisible && (
        <AddForm
          toggleModal={toggleMainModal}
          isModalVisible={isMainFormDialogVisible}
        />
      )}
      {isSecondaryFormDialogVisible && (
        <SecondaryForm
          toggleModal={toggleSecondaryModal}
          isModalVisible={isSecondaryFormDialogVisible}
        />
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
      flexDirection: "row",
      width: "100%",
      alignSelf: "flex-end",
    },
  });
export default MainContainer;
