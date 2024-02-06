import { format, parse, set } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, IconButton, Title, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { deleteSheep } from "../services/db";
import {
  deleteSheep as deleteSheepRedux,
  sheepDataSelector,
} from "../store/slices/sheep";
import {
  resetShowConfirmationDialog,
  setFormData,
  setFormTitle,
  setShowConfirmationDialog,
  setShowFormDialog,
  setShowSnackbar,
  uiSelector,
} from "../store/slices/ui";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigation } from "@react-navigation/native";
import { age } from "./utils/Age";

import ButtonWithIcon from "./ButtonWithIcon";
import { forms } from "../Constants";
import { capitalize, toggleSecondaryFormModal } from "./utils/SharedFunctions";

const placeholder = require("../assets/images/placeholder.jpg");
const dead = require("../assets/images/dead.png");
const male = require("../assets/images/male.png");
const female = require("../assets/images/female.png");
const wether = require("../assets/images/wether.png");
const MEDICAL = "medical";
const BREEDING = "breeding";
const REMOVE = "remove";
const initialMenuState = {
  MEDICAL: false,
  BREEDING: false,
  REMOVE: false,
};

const Sheep = React.memo(function Sheep({ item, index }) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();

  const [menuVisible, setMenuVisible] = useState(initialMenuState);

  const { isSecondaryFormDialogVisible } = useSelector(uiSelector);
  const sex = [
    { id: "m", title: "Ram" },
    { id: "f", title: "Ewe" },
    { id: "w", title: "Wether" },
  ];
  // useEffect(() => {
  //   if (activeCardId !== item.sheep_id) {
  //    setMenuVisible(initialMenuState);
  //   }
  // }, [activeCardId]);

  //parse date of birth to string in format dd/mm/yyyy
  const date = (date) => {
    if (date) {
      const parsedDate = parse(date, "MM/dd/yyyy", new Date());
      const d = parsedDate.toLocaleDateString();
      return d;
    } else {
      return "NA";
    }
  };

  const toggleMenuVisible = (menu) => {
    // if (activeCardId !== item.sheep_id) {
    //  dispatch(setActiveCardId(item.sheep_id));
    // }
    //set menu visible if it equals the menu passed in, the rest are false
    setMenuVisible({
      MEDICAL: menu === MEDICAL ? !menuVisible.MEDICAL : false,
      BREEDING: menu === BREEDING ? !menuVisible.BREEDING : false,
      REMOVE: menu === REMOVE ? !menuVisible.REMOVE : false,
    });
  };

  const onDeleteSheep = (item) => {
    toggleMenuVisible(REMOVE);
    //stop event bubbling up to the card
    dispatch(
      setShowConfirmationDialog({
        visible: true,
        id: item.sheep_id,
        name: item.name,
        tag_id: item.tag_id,
        title: null,
        field: "sheep",
      })
    );
  };
  const onEditSheep = (item) => {
    dispatch(setFormTitle("Edit Sheep"));
    dispatch(setFormData(item));
    dispatch(setShowFormDialog(true));
  };

  const onAddLamb = (item) => {
    const formattedData = {
      dam: item.sheep_id,
    };
    dispatch(setFormTitle("Add Lamb"));
    dispatch(setFormData(formattedData));
    dispatch(setShowFormDialog(true));
  };

  const onDeleteConfirm = (id, field, title, name) => {
    deleteSheep(id)
      .then((res) => {
        dispatch(deleteSheepRedux(id));
        dispatch(resetShowConfirmationDialog());
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: `Sheep ${name} deleted`,
          })
        );
      })
      .catch((err) => {
        if (err.message.includes("FOREIGN KEY constraint failed")) {
          dispatch(resetShowConfirmationDialog());
          dispatch(
            setShowSnackbar({
              visible: true,
              error: true,
              message: `This Sheep is someone's parent, please delete the child first`,
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
  };

  //calculate age

  const getCornerImage = () => {
    if (item.dod !== null && item.dod !== undefined && item.dod !== "") {
      return dead;
    } else {
      if (item.sex === "m") {
        return male;
      } else if (item.sex === "f") {
        return female;
      } else if (item.sex === "w") {
        return wether;
      }
    }
  };

  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate("Details", item);
  };

  return (
    <View style={styles.SheepWrapper}>
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        <IconButton
          accessible={true}
          accessibilityLabel="Delete"
          icon="delete"
          iconColor={
            menuVisible.REMOVE ? theme.colors.onPrimary : theme.colors.accent
          }
          mode={menuVisible.REMOVE ? "contained" : "text"}
          containerColor={
            menuVisible.REMOVE ? theme.colors.accent : theme.colors.onPrimary
          }
          size={25}
          onPress={() => toggleMenuVisible(REMOVE)}
          // onPress={(event) => onDeleteSheep(item, event)}
        />
        {menuVisible.REMOVE && (
          <View style={styles.iconMenuContainerRemove}>
            <ButtonWithIcon
              accessible={true}
              accessibilityLabel="Report Death"
              contentStyle={{ flexDirection: "row-reverse" }}
              name="skull"
              label="Death"
              onPress={() => {
                toggleMenuVisible(REMOVE);
                toggleSecondaryFormModal(
                  forms.DEATH,
                  item.sheep_id,
                  isSecondaryFormDialogVisible,
                  dispatch
                );
              }}
            />
            <ButtonWithIcon
              accessible={true}
              accessibilityLabel="Report Sale"
              contentStyle={{ flexDirection: "row-reverse" }}
              name="dollar-sign"
              label="Sale"
              onPress={() => {
                toggleMenuVisible(REMOVE);
                toggleSecondaryFormModal(
                  forms.SALE,
                  item.sheep_id,
                  isSecondaryFormDialogVisible,
                  dispatch
                );
              }}
            />
            <ButtonWithIcon
              accessible={true}
              accessibilityLabel="Remove from list"
              contentStyle={{ flexDirection: "row-reverse" }}
              name="trash-alt"
              label="Remove"
              onPress={() => onDeleteSheep(item)}
            />
          </View>
        )}
      </View>
      <Image
        source={getCornerImage()}
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <View>
        <View style={styles.cardTitleWrapper}>
          <Text style={styles.cardTitle}>
            {item.name ? item.name : item.tag_id}
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={handleCardPress}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: "100%",
            }}
          >
            <View
              style={{
                width: 170,
                flexDirection: "column",
              }}
            >
              <View style={styles.photoWrapper}>
                <Image
                  source={
                    item.picture &&
                    /^data:image\/[a-zA-Z]*;base64,/.test(item.picture)
                      ? { uri: item.picture }
                      : placeholder
                  }
                  resizeMode="cover"
                  style={{
                    height: 150,
                    width: 150,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    overflow: "visible",
                    paddingTop: 10,

                    width: 100,
                  }}
                >
                  <IconButton
                    accessible={true}
                    accessibilityLabel="Edit Sheep Data"
                    icon="pencil"
                    iconColor={theme.colors.secondary}
                    size={25}
                    onPress={() => onEditSheep(item)}
                  />

                  {!item.dod && (
                    <View>
                      <IconButton
                        accessible={true}
                        accessibilityLabel="Edit Medical Information"
                        icon="medical-bag"
                        iconColor={
                          menuVisible.MEDICAL
                            ? theme.colors.onPrimary
                            : theme.colors.secondary
                        }
                        mode={menuVisible.MEDICAL ? "contained" : "text"}
                        containerColor={
                          menuVisible.MEDICAL
                            ? theme.colors.primary
                            : theme.colors.onPrimary
                        }
                        size={25}
                        onPress={() => toggleMenuVisible(MEDICAL)}
                      />
                      {menuVisible.MEDICAL && (
                        <View style={styles.iconMenuContainerMeds}>
                          <ButtonWithIcon
                            accessible={true}
                            accessibilityLabel="Add Medication"
                            name="prescription-bottle-alt"
                            label="Meds"
                            onPress={() => {
                              toggleMenuVisible(MEDICAL);
                              toggleSecondaryFormModal(
                                forms.MEDS,
                                item.sheep_id,
                                isSecondaryFormDialogVisible,
                                dispatch
                              );
                            }}
                          />
                          <ButtonWithIcon
                            name="syringe"
                            label="Vaccines"
                            accessible={true}
                            accessibilityLabel="Add Vaccination"
                            onPress={() => {
                              toggleMenuVisible(MEDICAL);
                              toggleSecondaryFormModal(
                                forms.VAX,
                                item.sheep_id,
                                isSecondaryFormDialogVisible,
                                dispatch
                              );
                            }}
                          />
                          <ButtonWithIcon
                            name="weight"
                            label="Weight"
                            accessible={true}
                            accessibilityLabel="Add Weight"
                            onPress={() => {
                              toggleMenuVisible(MEDICAL);
                              toggleSecondaryFormModal(
                                forms.WEIGHT,
                                item.sheep_id,
                                isSecondaryFormDialogVisible,
                                dispatch
                              );
                            }}
                          />
                        </View>
                      )}
                    </View>
                  )}
                  {!item.dod && item.sex === "f" && (
                    <View>
                      <IconButton
                        accessible={true}
                        accessibilityLabel="Edit Breeding information"
                        icon="calendar-heart"
                        size={25}
                        iconColor={
                          menuVisible.BREEDING
                            ? theme.colors.onPrimary
                            : theme.colors.secondary
                        }
                        mode={menuVisible.BREEDING ? "contained" : "text"}
                        containerColor={
                          menuVisible.BREEDING
                            ? theme.colors.primary
                            : theme.colors.onPrimary
                        }
                        onPress={() => toggleMenuVisible(BREEDING)}
                      />
                      {menuVisible.BREEDING && (
                        <View style={styles.iconMenuContainerBreeding}>
                          <ButtonWithIcon
                            accessible={true}
                            accessibilityLabel="Add Breeding Date"
                            contentStyle={{ flexDirection: "row-reverse" }}
                            name="venus-mars"
                            label="Breeding Date"
                            onPress={() => {
                              toggleMenuVisible(BREEDING);
                              toggleSecondaryFormModal(
                                forms.BREEDING,
                                item.sheep_id,
                                isSecondaryFormDialogVisible,
                                dispatch
                              );
                            }}
                          />
                          <ButtonWithIcon
                            accessible={true}
                            accessibilityLabel="Report New Lamb"
                            contentStyle={{ flexDirection: "row-reverse" }}
                            name="plus-circle"
                            label="New Lamb"
                            onPress={() => onAddLamb(item)}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.infoWrapper}>
              <Text style={styles.info}>
                <Text style={styles.label}>Tag ID: </Text>
                <Text>{item.tag_id}</Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Scrapie Tag ID: </Text>
                <Text>{item.scrapie_id ? item.scrapie_id : "NA"}</Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>DOB: </Text>
                <Text>{date(item.dob)}</Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Sex: </Text>
                <Text>{sex.find((s) => s.id === item.sex)?.title}</Text>
              </Text>
              {item.purchase_date && (
                <Text style={styles.info}>
                  <Text style={styles.label}>Purchase Date: </Text>
                  <Text>{date(item.purchase_date)}</Text>
                </Text>
              )}
              {item.date_deceased ? (
                <Text style={styles.info}>
                  <Text style={styles.label}>Date Deceased: </Text>
                  <Text>{date(item.date_deceased)}</Text>
                </Text>
              ) : (
                <Text style={styles.info}>
                  <Text style={styles.label}>Age: </Text>
                  <Text>{age(item)}</Text>
                </Text>
              )}
              <Text style={styles.info}>
                <Text style={styles.label}>Breed: </Text>
                <Text>{capitalize(item.breed_name)}</Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Father: </Text>
                <Text>
                  {item.father_name
                    ? item.father_name
                    : item.father_tag_id
                    ? item.father_tag_id
                    : "NA"}
                </Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Mother: </Text>
                <Text>
                  {item.mother_name
                    ? item.mother_name
                    : item.mother_tag_id
                    ? item.mother_tag_id
                    : "NA"}
                </Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Color: </Text>
                <Text>
                  {item.color_name ? capitalize(item.color_name) : "NA"}
                </Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Marking: </Text>
                <Text>
                  {item.marking_name ? capitalize(item.marking_name) : "NA"}
                </Text>
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <ConfirmationDialog
        onConfirm={(id, field, title, name) =>
          onDeleteConfirm(id, field, title, name)
        }
      />
    </View>
  );
});

export default Sheep;

const makeStyles = (theme) =>
  StyleSheet.create({
    SheepWrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      elevation: 6,
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingRight: 14,
      paddingTop: 16,
      margin: 16,
      flexDirection: "column",
      paddingBottom: 16,
    },
    cardTitleWrapper: {
      width: "100%",
      marginBottom: 7,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: "bold",
      textAlign: "center",
    },
    label: {
      fontWeight: "bold",
    },
    infoWrapper: {
      flexShrink: 1,
    },
    info: {
      fontSize: 15,
      width: "100%",
    },
    photoWrapper: {
      height: 150,
      width: 150,
      marginRight: 20,
    },
    iconMenuContainerMeds: {
      flexDirection: "column",
      position: "absolute",
      width: 150,
      bottom: 50,
      left: 0,
      flexDirection: "column",
      alignItems: "flex-start",
    },
    iconMenuContainerBreeding: {
      position: "absolute",
      flexDirection: "column",
      alignItems: "flex-end",
      width: 120,
      bottom: 50,
      left: -70,
    },
    iconMenuContainerRemove: {
      position: "absolute",
      flexDirection: "column",
      alignItems: "flex-end",
      width: 120,
      top: 50,
      right: 10,
    },
  });
