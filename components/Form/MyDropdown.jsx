import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, KeyboardAvoidingView } from "react-native";
import { TextInput, Button, IconButton, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MyTextInput from "./MyTextInput";
import {
  addBreed,
  addColor,
  addMarking,
  addNewMedication,
  addNewVaccine,
  deleteBreed,
  deleteColor,
  deleteMarking,
} from "../../services/db";
import { useDispatch, useSelector } from "react-redux";
import {
  addColor as addColorRedux,
  addMarking as addMarkingRedux,
  addBreed as addBreedRedux,
  deleteColor as deleteColorRedux,
  deleteMarking as deleteMarkingRedux,
  deleteBreed as deleteBreedRedux,
} from "../../store/slices/attributes";

import {
  addNewMed,
  addNewVax,
  resetLoading,
  resetShowConfirmationDialog,
  setShowConfirmationDialog,
  setShowSnackbar,
} from "../../store/slices/ui";
import ConfirmationDialog from "../ConfirmationDialog";
import ConfirmationSnackbar from "../ConfirmationSnackbar";
import { capitalize, sortAlphabetically } from "../utils/SharedFunctions";

const Item = ({ item, onPress, value, onLongPress }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <TouchableOpacity
      style={styles.modalItemStyle}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={styles.modalItemTextStyle}
      >
        {item.title}
      </Text>
      <View style={styles.modalIconStyle}>
        {value && item.id.toString() === value.toString() && (
          <Icon name="sheep" size={20} color={theme.colors.primary} />
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
  name,
  error,
  searchable = true,
  field,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState({
    id: null,
    title: null,
  });
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [modalData, setModalData] = useState(data);
  const [searchResult, setSearchResult] = useState(modalData);
  const [loading, setLoading] = useState(false);
  const [deletable, setDeletable] = useState(false);

  useEffect(() => {
    console.log("field", field);
    ["marking", "color", "breed", "medication", "vaccination"].indexOf(
      field
    ) !== -1
      ? setDeletable(true)
      : setDeletable(false);
  }, [field]);

  const addNewValue = async (val, field) => {
    switch (field) {
      case "color":
        setLoading(true);
        const newColorId = await addColor(val);
        if (newColorId) {
          setLoading(false);
          const newColor = { id: newColorId, title: capitalize(val) };
          dispatch(addColorRedux(newColor));
          //sort modaldata alphabetically
          const newData = [...modalData, newColor];
          const sortedData = sortAlphabetically(newData, "title");
          setModalData(sortedData);
        }
        break;
      case "breed":
        const newBreedId = await addBreed(val);
        if (newBreedId) {
          const newBreed = { id: newBreedId, title: capitalize(val) };
          dispatch(addBreedRedux(newBreed));
          const newData = [...modalData, newBreed];
          const sortedData = sortAlphabetically(newData, "title");
          setModalData(sortedData);
        }
        break;
      case "marking":
        const newMarkingId = await addMarking(val);
        if (newMarkingId) {
          const newMarking = { id: newMarkingId, title: capitalize(val) };
          dispatch(addMarkingRedux(newMarking));
          const newData = [...modalData, newMarking];
          const sortedData = sortAlphabetically(newData, "title");
          setModalData(sortedData);
        }
        break;
      case "medication":
        const newMedId = await addNewMedication(val);
        if (newMedId) {
          const newMed = { id: newMedId, title: capitalize(val) };
          dispatch(addNewMed(newMed));
          const newData = [...modalData, newMed];
          const sortedData = sortAlphabetically(newData, "title");
          setModalData(sortedData);
        }
        break;
      case "vaccination":
        const newVaxId = await addNewVaccine(val);
        if (newVaxId) {
          const newVax = { id: newVaxId, title: capitalize(val) };
          dispatch(addNewVax(newVax));
          const newData = [...modalData, newVax];
          const sortedData = sortAlphabetically(newData, "title");
          setModalData(sortedData);
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
                  message: `Color ${title} is used by some sheep records. Please delete or edit those sheep records first`,
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
          })
          .finally(() => {
            dispatch(resetLoading());
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
          })
          .finally(() => {
            dispatch(resetLoading());
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
          })
          .finally(() => {
            dispatch(resetLoading());
          });

      default:
        break;
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (query.length > 0) {
      setFilteredData(
        modalData.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
        )
      );

      setSearchResult(filteredData);
    } else {
      setSearchResult(modalData);
    }
  }, [query, modalData]);

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

  useEffect(() => {
    if (query.length > 0) {
      setSearchResult(filteredData);
    }
  }, [filteredData, query]);

  const inputRef = useRef(null);
  const searchRef = useRef(null);

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        value={selectedValue.id}
        onLongPress={() => {
          deletable && showConfirmation(item);
        }}
        onPress={() => {
          inputRef.current.blur();
          setQuery("");
          setSelectedValue(item);
          setModalOpen(false);
          onChange(item.id);
        }}
      />
    );
  };

  const handleNewValuePress = async () => {
    await addNewValue(query, field);
  };

  const findSelectedValue = (value) => {
    const selected = modalData.find(
      (item) => item.id.toString() === value.toString()
    );
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
        customBackdrop={
          <View style={{ flex: 1, backgroundColor: "black" }}>
            <TouchableOpacity
              accessibilityLabel="Close Modal"
              style={{ flex: 1 }}
              onPress={closeModal}
            ></TouchableOpacity>
          </View>
        }
        isVisible={modalOpen}
        onRequestClose={() => {
          closeModal();
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
          onPress={() => {
            closeModal();
          }}
        >
          <KeyboardAvoidingView
            style={styles.modal}
            keyboardShouldPersistTaps="handled"
          >
            {modalData.length === 0 && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  icon="close"
                  onPress={() => {
                    setModalOpen(false);
                  }}
                ></IconButton>
                <Text style={{ fontSize: 18, textAlign: "center" }}>
                  No applicable {field === "last_bred_to" ? "ram" : field}s
                  found. Please add a new one or try again
                </Text>
              </View>
            )}
            {searchable && modalData.length > 0 && (
              <TextInput
                accessible={true}
                accessibilityLabel="Search"
                ref={searchRef}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.primary}
                value={query}
                onChangeText={(q) => {
                  setQuery(q);
                }}
                placeholder="Search or add new"
                right={
                  <TextInput.Icon
                    accessible={true}
                    accessibilityLabel="Clear"
                    icon="close"
                    style={{
                      textAlign: "center",
                    }}
                    onPress={(event) => {
                      if (query === "") {
                        closeModal(event);
                      } else {
                        setQuery("");
                      }
                    }}
                  />
                }
              ></TextInput>
            )}
            <FlatList
              data={searchResult}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id}
              extraData={selectedValue}
            />
            {deletable && (
              <View>
                {searchResult.length === 0 ? (
                  <View>
                    <Text>
                      This {field} was not found. Click button below to add it
                      to your {field}s.
                    </Text>
                    <Button
                      buttonColor={theme.colors.primary}
                      loading={loading}
                      dark
                      style={{ width: "60%", marginTop: 15 }}
                      mode="contained"
                      onPress={() => {
                        handleNewValuePress();
                      }}
                    >
                      Add new
                    </Button>
                  </View>
                ) : null}
              </View>
            )}
          </KeyboardAvoidingView>
        </Pressable>
        {deletable && (
          <ConfirmationDialog
            onConfirm={(id, field, title) => deleteValue(id, field, title)}
          />
        )}
        {deletable && <ConfirmationSnackbar />}
      </Modal>
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
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
      fontSize: 18,
    },
    modalIconStyle: {
      width: 30,
      marginLeft: 10,
      justifyContent: "center",
      alignContent: "center",
      height: 30,
    },
    modal: {
      backgroundColor: theme.colors.background,
      padding: 15,
      margin: 15,
      borderRadius: 14,
      maxHeight: 400,
      flexGrow: 0,
    },
  });

export default MyDropdown;
