import { parse, set } from "date-fns";
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
  setActiveCardId,
  setCardMenuOpen,
  setFormData,
  setFormTitle,
  setShowConfirmationDialog,
  setShowFormDialog,
  setShowSnackbar,
  setSmallFormTitle,
  uiSelector,
} from "../store/slices/ui";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigation } from "@react-navigation/native";
import { age } from "./utils/Age";
import IconMenu from "./IconMenu";
import Icon from "react-native-vector-icons/FontAwesome5";
import ButtonWithIcon from "./ButtonWithIcon";

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

const Sheep = ({ item, index }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const { activeCardId } = useSelector(uiSelector);
  const [menuVisible, setMenuVisible] = useState(initialMenuState);
  const { sheep } = useSelector(sheepDataSelector);

  useEffect(() => {
    if (activeCardId !== item.sheep_id) {
      setMenuVisible(initialMenuState);
    }
  }, [activeCardId]);

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
    if (activeCardId !== item.sheep_id) {
      dispatch(setActiveCardId(item.sheep_id));
    }
    //set menu visible if it equals the menu passed in, the rest are false
    setMenuVisible({
      MEDICAL: menu === MEDICAL ? !menuVisible.MEDICAL : false,
      BREEDING: menu === BREEDING ? !menuVisible.BREEDING : false,
      REMOVE: menu === REMOVE ? !menuVisible.REMOVE : false,
    });
  };

  const onDeleteSheep = (item) => {
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

    const formattedData = {
      breed: item.breed_id,
      color: item.color_id,
      marking: item.marking_id,
      sire: item.sire,
      dam: item.dam,
      name: item.name,
      dob: item.dob,
      dop: item.dop,
      dod: item.dod,
      dos: item.dos,
      tag_id: item.tag_id,
      scrapie_id: item.scrapie_id,
      id: item.sheep_id,
      sex: item.sex,
      weight_at_birth: item.weight_at_birth,
      //    sex:

      //   { id: "1", title: "Male", label: "m" },
      // { id: "2", title: "Female", label: "f" },
      // {/ id: "3", title: "Weather", label: "w" },
    };

    dispatch(setFormData(formattedData));
    dispatch(setShowFormDialog(true));
  };

  const onDeleteConfirm = (id) => {
    deleteSheep(id)
      .then((res) => {
        dispatch(deleteSheepRedux(id));
        dispatch(resetShowConfirmationDialog());
        dispatch(
          setShowSnackbar({
            visible: true,
            error: false,
            message: `Sheep ${item.name} deleted`,
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
    <View
      style={
        index === sheep.length - 1
          ? [styles.SheepWrapper, styles.SheepWrapperLast]
          : styles.SheepWrapper
      }
    >
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        <IconButton
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
              contentStyle={{ flexDirection: "row-reverse" }}
              name="skull"
              label="Death"
              onPress={() => console.log("press")}
            />
            <ButtonWithIcon
              contentStyle={{ flexDirection: "row-reverse" }}
              name="dollar-sign"
              label="Sale"
              onPress={() => console.log("press")}
            />
            <ButtonWithIcon
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
                  source={item.picture ? { uri: item.picture } : placeholder}
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
                    icon="pencil"
                    iconColor={theme.colors.secondary}
                    size={25}
                    onPress={() => onEditSheep(item)}
                  />

                  {!item.dod && (
                    <View>
                      <IconButton
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
                            name="prescription-bottle-alt"
                            label="Meds"
                            onPress={() => {
                              toggleModal("test title");
                            }}
                          />
                          <ButtonWithIcon
                            name="syringe"
                            label="Vaccines"
                            onPress={() => console.log("press")}
                          />
                          <ButtonWithIcon
                            name="weight"
                            label="Weight"
                            onPress={() => console.log("press")}
                          />
                        </View>
                      )}
                    </View>
                  )}
                  {!item.dod && item.sex === "f" && (
                    <View>
                      <IconButton
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
                            contentStyle={{ flexDirection: "row-reverse" }}
                            name="venus-mars"
                            label="Breeding Date"
                            onPress={() => console.log("press")}
                          />
                          <ButtonWithIcon
                            contentStyle={{ flexDirection: "row-reverse" }}
                            name="plus-circle"
                            label="New Lamb"
                            onPress={() => console.log("press")}
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
                <Text>{item.sex}</Text>
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
                <Text>{item.breed_name}</Text>
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
                <Text>{item.color_name ? item.color_name : "NA"}</Text>
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>Marking: </Text>
                <Text>{item.marking_name ? item.marking_name : "NA"}</Text>
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <ConfirmationDialog onConfirm={(id) => onDeleteConfirm(id)} />
    </View>
  );
};

export default Sheep;

const makeStyles = (theme) =>
  StyleSheet.create({
    SheepWrapper: {
      backgroundColor: theme.colors.background,
      borderRadius: 15,
      elevation: 8,
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingRight: 14,
      paddingTop: 16,
      margin: 16,
      flexDirection: "column",
      paddingBottom: 16,
    },
    SheepWrapperLast: {
      marginBottom: 96,
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
