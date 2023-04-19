import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, List, Searchbar, useTheme } from "react-native-paper";

//import { SearchBarWrapper } from './SearchBar.styles';

const SearchBar = ({ onQueryChange, onSearchTagChange }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [selections, setSelections] = React.useState([
    { id: 1, label: "tag", selected: true },
    { id: 2, label: "name", selected: false },
    { id: 3, label: "breed", selected: false },
    { id: 4, label: "sex", selected: false },
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [tagSelected, setTagSelected] = React.useState("");

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    onQueryChange(query);
  };

  useEffect(() => {
    const selectedEl = selections.filter((el) => {
      if (el.selected === true) {
        return el;
      }
    });
    setTagSelected(selectedEl[0].label);
    if (selectedEl[0].label === "tag") {
      onSearchTagChange("tag_id");
      onChangeSearch("");
    } else if (selectedEl[0].label === "breed") {
      onSearchTagChange("breed_name");
      onChangeSearch("");
    } else {
      onSearchTagChange(selectedEl[0].label);
      onChangeSearch("");
    }
  }, [selections]);

  const handleIconClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectionPress = (val) => {
    setSelections(
      selections.map((el) =>
        el.id === val ? { ...el, selected: true } : { ...el, selected: false }
      )
    );
    setDropdownVisible(false);
  };

  return (
    <>
      <Searchbar
        icon={() => (
          <IconButton icon="chevron-down-circle" size={40} color="#c2875a" />
        )}
        placeholder={`search by ${tagSelected}`}
        onChangeText={onChangeSearch}
        value={searchQuery}
        onIconPress={() => {
          handleIconClick();
        }}
      />
      {dropdownVisible && (
        <View style={styles.optionListContainer}>
          {selections.map((el) => (
            <List.Item
              key={el.id}
              title={`by ${el.label}`}
              onPress={() => {
                handleSelectionPress(el.id);
              }}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default SearchBar;

const makeStyles = (theme) =>
  StyleSheet.create({
    optionListContainer: {
      position: "absolute",
      top: 50,
      left: 10,
      width: 140,
      elevation: 3,
      zIndex: 2,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.background,
    },
  });
