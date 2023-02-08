import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import { TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MyTextInput from "./MyTextInput";

const Item = ({ item, onPress, value }) => (
  <TouchableOpacity style={styles.modalItemStyle} onPress={onPress}>
    <Text style={styles.modalItemTextStyle}>{item.title}</Text>
    <View style={styles.modalIconStyle}>
      {item.id === value && <Icon name="sheep" size={20} color="#68c25a" />}
    </View>
  </TouchableOpacity>
);

const MyDropdown = ({ data, label, onSelect, value, searchable = true }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [query, setQuery] = useState("");
  const [modalData, setModalData] = useState(data);

  //useEffect(() => {
  //  console.log("useEffect", selectedValue);
  //}, [selectedValue]);

  useEffect(() => {
    if (query.length > 0) {
      const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => {
        setModalData(filteredData);
      }, 1200);
    } else {
      setTimeout(() => {
        setModalData(data);
      }, 1200);
    }
  }, [query]);

  const inputRef = useRef(null);
  const searchRef = useRef(null);

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        value={selectedValue.id}
        onPress={() => {
          console.log("pressed", item);
          onSelect(item);
          inputRef.current.blur();
          setQuery("");
          setSelectedValue(item);
          setModalOpen(false);
        }}
      />
    );
  };

  return (
    <View style={styles.selectContainer}>
      <MyTextInput
        ref={inputRef}
        label={label}
        value={selectedValue.title}
        showSoftInputOnFocus={false}
        onFocus={() => {
          setModalOpen(true);
          inputRef.current.blur();
        }}
      />
      <Modal height="auto" isVisible={modalOpen}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
          onPress={(event) =>
            event.target == event.currentTarget && setModalOpen(false)
          }
        >
          <ScrollView style={styles.modal} keyboardShouldPersistTaps="handled">
            {searchable && (
              <TextInput
                ref={searchRef}
                mode="outlined"
                outlineColor="#68c25a"
                activeOutlineColor="#68c25a"
                style={styles.modalSearch}
                value={query}
                onChangeText={(q) => setQuery(q)}
                placeholder="Search"
                //add clear button
                right={
                  <TextInput.Icon
                    name="close"
                    color="#68c25a"
                    onPress={() => {
                      setQuery("");
                    }}
                  />
                }
              ></TextInput>
            )}
            <FlatList
              data={modalData}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id}
              extraData={selectedValue}
            />
          </ScrollView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sheepTextInput: {
    width: "100%",
  },
  selectContainer: {
    width: "100%",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  modalItemStyle: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    height: 50,
  },
  modalItemTextStyle: {
    fontSize: 20,
  },
  modalIconStyle: {
    width: 30,
    marginLeft: 10,
    justifyContent: "center",
    alignContent: "center",
    height: 30,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 14,
    minHeight: 200,
    flexGrow: 0,
  },
  modalSearch: {
    height: 40,
  },
  placeholderStyles: {
    color: "grey",
  },
});

export default MyDropdown;
