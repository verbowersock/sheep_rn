import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import SearchBar from "./SearchBar";
import AddSheepBtn from "./AddSheepBtn";
import SheepList from "./Sheeplist";
import AddForm from "./Form/AddForm";
import { useDispatch, useSelector } from "react-redux";
import { sheepDataSelector } from "../store/slices/sheep";
import {
  Divider,
  IconButton,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import {
  resetFormData,
  setFormTitle,
  setShowFormDialog,
  setShowSecondaryFormDialog,
  uiSelector,
} from "../store/slices/ui";
import SecondaryForm from "./Form/SecondaryForm";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";

const MainContainer = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { sheep } = useSelector(sheepDataSelector);
  const [sortedSheep, setSortedSheep] = useState([]);
  const [filteredSheep, setFilteredSheep] = useState([]);
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [sortItems, setSortItems] = useState([
    {
      label: "Name",
      value: "name_asc",
      icon: () => <Icon name="sort-alpha-asc" size={18} color="grey" />,
    },
    {
      label: "Name",
      value: "name_desc",
      icon: () => <Icon name="sort-alpha-desc" size={18} color="grey" />,
    },
    {
      label: "Age",
      value: "age_asc",
      icon: () => <Icon name="sort-numeric-asc" size={18} color="grey" />,
    },
    {
      label: "Age",
      value: "age_desc",
      icon: () => <Icon name="sort-numeric-desc" size={18} color="grey" />,
    },
    {
      label: "Tag ID",
      value: "tag_id_asc",
      icon: () => <Icon name="sort-alpha-asc" size={18} color="grey" />,
    },
    {
      label: "Tag ID",
      value: "tag_id_desc",
      icon: () => <Icon name="sort-alpha-desc" size={18} color="grey" />,
    },
  ]);

  const [sortValue, setSortValue] = useState(sortItems[0].value);

  const dateFromString = (dateString) => {
    const [month, day, year] = dateString.split("/");
    return new Date(year, month - 1, day);
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

    if (sortValue === "name_asc") {
      let list = [...filteredSheep].sort((a, b) => {
        if (!a.name) return 1; // a is larger if name is empty
        if (!b.name) return -1; // b is larger if name is empty
        return a.name.localeCompare(b.name);
      });
      setSortedSheep(list);
    } else if (sortValue === "name_desc") {
      let list = [...filteredSheep].sort((a, b) => {
        if (!a.name) return 1; // a is larger if name is empty
        if (!b.name) return -1; // b is larger if name is empty
        return b.name.localeCompare(a.name);
      });

      setSortedSheep(list);
    } else if (sortValue === "age_asc") {
      setSortedSheep(
        [...filteredSheep].sort(
          (a, b) => dateFromString(b.dob) - dateFromString(a.dob)
        )
      );
    } else if (sortValue === "age_desc") {
      setSortedSheep(
        [...filteredSheep].sort(
          (a, b) => dateFromString(a.dob) - dateFromString(b.dob)
        )
      );
    } else if (sortValue === "tag_id_asc") {
      setSortedSheep([...filteredSheep].sort((a, b) => a.tag_id - b.tag_id));
    } else if (sortValue === "tag_id_desc") {
      setSortedSheep([...filteredSheep].sort((a, b) => b.tag_id - a.tag_id));
    }
  }, [deadChecked, soldChecked, searchQuery, searchTag, sortValue, sheep]);

  const toggleDrawer = (event) => {
    event.preventDefault();
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <View style={styles.mainContainer}>
      <SearchBar
        onQueryChange={(el) => setSearchQuery(el)}
        onSearchTagChange={(el) => {
          setSearchTag(el);
        }}
      />

      <View
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 24,
            fontWeight: "bold",
            lineHeight: 30,
          }}
        >
          Total Sheep: {sortedSheep.length}
        </Text>
        <View
          style={{
            position: "absolute",
            right: 10,
          }}
        >
          {!isDrawerOpen ? (
            <IconButton
              icon={() => (
                <Entypo
                  name="sound-mix"
                  size={24}
                  color={theme.colors.secondary}
                />
              )}
              onPress={(event) => toggleDrawer(event)}
            />
          ) : (
            <IconButton
              icon={() => (
                <Entypo name="cross" size={24} color={theme.colors.secondary} />
              )}
              onPress={(event) => toggleDrawer(event)}
            />
          )}
        </View>
      </View>
      {isDrawerOpen && (
        <View
          style={{
            width: "100%",
            height: "20%",
            minHeight: 250,
            paddingTop: 10,
            backgroundColor: theme.colors.background,

            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginVertical: 30,
            }}
          >
            {/* <Text style={styles.sortLabel}>Sort by...</Text> */}
            <DropDownPicker
              open={sortDropdownOpen}
              value={sortValue}
              items={sortItems}
              setOpen={setSortDropdownOpen}
              setValue={setSortValue}
              setItems={setSortItems}
              placeholder={sortItems[0].label}
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary,
                width: "70%",
                alignSelf: "center",
              }}
              dropDownContainerStyle={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary,
                width: "70%",
                alignSelf: "center",
                maxHeight: 150,
              }}
            />
          </View>
          <Divider />
          <View style={styles.checkboxContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Show deceased</Text>
              <Switch
                value={deadChecked}
                onValueChange={() => {
                  setDeadChecked(!deadChecked);
                }}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Show sold</Text>
              <Switch
                value={soldChecked}
                onValueChange={() => {
                  setSoldChecked(!soldChecked);
                }}
              />
            </View>
          </View>
        </View>
      )}
      {sortedSheep && <SheepList sheep={sortedSheep} />}

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
      position: "relative",
    },
    checkboxContainer: {
      flexDirection: "column",
      width: "70%",
      alignItems: "center",
    },
    switchLabel: {
      fontSize: 18,
      color: theme.colors.text,
    },
    sortLabel: {
      fontSize: 18,
      color: theme.colors.text,
      marginVertical: 20,
    },
    switchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginVertical: 10,
    },
  });
export default MainContainer;
