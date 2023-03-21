import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput, Button, IconButton, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MyTextInput from "./MyTextInput";
import {
  addBreed,
  addColor,
  addMarking,
  deleteBreed,
  deleteColor,
  deleteMarking,
} from "../services/db";
import { useDispatch, useSelector } from "react-redux";
import {
  addColor as addColorRedux,
  addMarking as addMarkingRedux,
  addBreed as addBreedRedux,
  deleteColor as deleteColorRedux,
  deleteMarking as deleteMarkingRedux,
  deleteBreed as deleteBreedRedux,
  attributesDataSelector,
} from "../store/slices/attributes";

import {
  resetShowConfirmationDialog,
  setShowConfirmationDialog,
  setShowSnackbar,
} from "../store/slices/ui";
import ConfirmationDialog from "./ConfirmationDialog";
import ConfirmationSnackbar from "./ConfirmationSnackbar";

const Item = ({ item, onPress, value, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.modalItemStyle}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.modalItemTextStyle}
      >
        {item.title}
      </Text>
      <View style={styles.modalIconStyle}>
        {value && item.id.toString() === value.toString() && (
          <Icon name="sheep" size={20} color="#68c25a" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const MyDropdown = ({
  data,
  label,
  onChange,
  value,
  error,
  searchable = true,
  field,
}) => {
  const dispatch = useDispatch();
  const { colors, markings, breeds } = useSelector(attributesDataSelector);
  const attributeData =
    field === "color"
      ? colors
      : field === "marking"
      ? markings
      : field === "breed"
      ? breeds
      : data;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState({
    id: null,
    title: null,
  });
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [modalData, setModalData] = useState(data);
  const [newValue, setNewValue] = useState("");
  const [newInput, setNewInput] = useState(false);
  const [newInputError, setNewInputError] = useState("");

  const validateNewValue = (val) => {
    if (val.length > 0) {
      if (attributeData.some((item) => item.title === val)) {
        setNewInputError("This value already exists");
      } else {
        setNewInputError("");
        addNewValue(newValue, field);
      }
    } else {
      setNewInputError("This field is empty. Please enter a new value");
    }
  };

  const addNewValue = async (val, field) => {
    switch (field) {
      case "color":
        const newColorId = await addColor(val);
        if (newColorId) {
          const newColor = { id: newColorId, title: val };
          dispatch(addColorRedux(newColor));
          setModalData([...attributeData, newColor]);
          setNewInput(false);
          setNewValue("");
        }
        break;
      case "breed":
        const newBreedId = await addBreed(val);
        if (newBreedId) {
          const newBreed = { id: newBreedId, title: val };
          dispatch(addBreedRedux(newBreed));
          setModalData([...attributeData, newBreed]);
          setNewInput(false);
          setNewValue("");
        }
        break;
      case "marking":
        const newMarkingId = await addMarking(val);
        if (newMarkingId) {
          const newMarking = { id: newMarkingId, title: val };
          dispatch(addMarkingRedux(newMarking));
          setModalData([...attributeData, newMarking]);
          setNewInput(false);
          setNewValue("");
        }
        break;
      default:
        break;
    }
  };

  const deleteValue = async (id, field, title) => {
    switch (field) {
      case "color":
        deleteColor(id)
          .then(() => {
            dispatch(deleteColorRedux(id));
            dispatch(resetShowConfirmationDialog());
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Color ${title} deleted`,
              })
            );
            setModalData(modalData.filter((item) => item.id !== id));
          })
          .catch((err) => {
            if (err.message.includes("FOREIGN KEY constraint failed")) {
              dispatch(resetShowConfirmationDialog());
              dispatch(
                setShowSnackbar({
                  visible: true,
                  error: true,
                  message: `Color ${title} is used by some sheep records. Please delete sheep records first`,
                })
              );
            } else {
              dispatch(
                setShowSnackbar({
                  visible: true,
                  error: true,
                  message: `Something went wrong. Please try again`,
                })
              );
            }
          });

        break;

      case "breed":
        deleteBreed(id)
          .then(() => {
            dispatch(deleteBreedRedux(id));
            dispatch(resetShowConfirmationDialog());
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Breed ${title} deleted`,
              })
            );
            setModalData(modalData.filter((item) => item.id !== id));
          })
          .catch((err) => {
            if (err.message.includes("FOREIGN KEY constraint failed")) {
              dispatch(resetShowConfirmationDialog());
              dispatch(
                setShowSnackbar({
                  visible: true,
                  error: true,
                  message: `Breed ${title} is used by some sheep records. Please delete sheep records first`,
                })
              );
            } else {
              dispatch(resetShowConfirmationDialog());
              dispatch(
                setShowSnackbar({
                  visible: true,
                  error: true,
                  message: `Something went wrong. Please try again`,
                })
              );
            }
          });
        break;

      case "marking":
        deleteMarking(id)
          .then(() => {
            dispatch(deleteMarkingRedux(id));
            dispatch(resetShowConfirmationDialog());
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Marking ${title} deleted`,
              })
            );
            setModalData(modalData.filter((item) => item.id !== id));
          })
          .catch((err) => {
            if (err.message.includes("FOREIGN KEY constraint failed")) {
              dispatch(resetShowConfirmationDialog());
              dispatch(
                setShowSnackbar({
                  visible: true,
                  error: true,
                  message: `Marking ${title} is used by some sheep records. Please delete sheep records first`,
                })
              );
            } else {
              dispatch(resetShowConfirmationDialog());
              dispatch(
                setShowSnackbar({
                  visible: true,
                  error: true,
                  message: `Something went wrong. Please try again`,
                })
              );
            }
          });

      default:
        break;
    }
  };

  const closeModal = (event) => {
    event.target == event.currentTarget && setModalOpen(false);
    setNewValue("");
    setNewInput(false);
  };

  useEffect(() => {
    if (query.length > 0) {
      setFilteredData(
        attributeData.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      );
      setTimeout(() => {
        setModalData(filteredData);
      }, 800);
    } else {
      setTimeout(() => {
        setModalData(attributeData);
      }, 800);
    }
  }, [query]);

  const showConfirmation = (item) => {
    dispatch(
      setShowConfirmationDialog({
        visible: true,
        id: item.id,
        title: item.title,
        field: field,
      })
    );
  };

  const inputRef = useRef(null);
  const searchRef = useRef(null);

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        value={selectedValue.id}
        onLongPress={() => {
          showConfirmation(item);
        }}
        onPress={() => {
          inputRef.current.blur();
          setQuery("");
          setNewInput(false);
          setSelectedValue(item);
          setModalOpen(false);
          onChange(item.id);
        }}
      />
    );
  };

  const handleNewValuePress = () => {
    if (modalData.length === 0) {
      addNewValue(query, field);
    } else {
      setNewInput(true);
    }
  };

  const findSelectedValue = (value) => {
    const selected = attributeData.find(
      (item) => item.id.toString() === value.toString()
    );
    console.log("!!!selected", selected);
    setSelectedValue(selected);
  };

  useEffect(() => {
    if (value) {
      findSelectedValue(value);
    }
  }, [value]);

  return (
    <View style={styles.selectContainer}>
      <MyTextInput
        error={error}
        ref={inputRef}
        label={label}
        value={selectedValue.title}
        showSoftInputOnFocus={false}
        onFocus={() => {
          setModalOpen(true);
          inputRef.current.blur();
        }}
      />

      <Modal
        isVisible={modalOpen}
        onRequestClose={(event) => {
          closeModal(event);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
          onPress={(event) => {
            closeModal(event);
          }}
        >
          <KeyboardAvoidingView
            style={styles.modal}
            keyboardShouldPersistTaps="handled"
          >
            {searchable && (
              <TextInput
                ref={searchRef}
                mode="outlined"
                outlineColor="#68c25a"
                activeOutlineColor="#68c25a"
                style={styles.modalSearch}
                value={query}
                onFocus={() => {
                  setNewInput(false);
                }}
                onChangeText={(q) => {
                  setQuery(q);
                  setNewInput(false);
                }}
                placeholder="Search"
                right={
                  <TextInput.Icon
                    name="close"
                    color="#68c25a"
                    style={{ textAlign: "center" }}
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
            {["marking", "color", "breed"].indexOf(field) !== -1 && (
              <View>
                {!newInput || modalData.length === 0 ? (
                  <Button
                    color="#68c25a"
                    dark
                    style={{ width: "40%", marginTop: 15 }}
                    mode="contained"
                    onPress={() => {
                      handleNewValuePress();
                    }}
                  >
                    Add new
                  </Button>
                ) : (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "space-between",
                      }}
                    >
                      <TextInput
                        mode="outlined"
                        outlineColor="#68c25a"
                        activeOutlineColor="#68c25a"
                        style={{
                          height: 40,
                          width: "80%",
                        }}
                        value={newValue}
                        right={
                          <TextInput.Icon
                            name="close"
                            color="#68c25a"
                            style={{ marginTop: 10 }}
                            onPress={() => {
                              setNewValue("");
                            }}
                          />
                        }
                        onChangeText={(v) => setNewValue(v)}
                      ></TextInput>
                      <IconButton
                        icon="check"
                        color="#68c25a"
                        dark
                        style={{ marginLeft: 15 }}
                        onPress={() => validateNewValue(newValue)}
                      />
                    </View>
                    <Text style={{ color: "#c25a5a" }}>{newInputError}</Text>
                  </View>
                )}
              </View>
            )}
          </KeyboardAvoidingView>
        </Pressable>
        {["marking", "color", "breed"].indexOf(field) !== -1 && (
          <ConfirmationDialog
            onConfirm={(id, field, title) => deleteValue(id, field, title)}
          />
        )}
        {["marking", "color", "breed"].indexOf(field) !== -1 && (
          <ConfirmationSnackbar />
        )}
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
    // minHeight: 200,
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
