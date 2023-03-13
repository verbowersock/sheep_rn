import {
  formatDuration,
  intervalToDuration,
  parse,
  parseISO,
  isValid,
} from "date-fns";
import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { deleteSheep } from "../services/db";
import { deleteSheep as deleteSheepRedux } from "../store/slices/sheep";
import {
  resetShowConfirmationDialog,
  setFormData,
  setShowConfirmationDialog,
  setShowFormDialog,
  setShowSnackbar,
} from "../store/slices/ui";
import ConfirmationDialog from "./ConfirmationDialog";
import ConfirmationSnackbar from "./ConfirmationSnackbar";

const placeholder = require("../assets/images/placeholder.jpg");

//import { HeaderWrapper } from './Header.styles';

const Sheep = ({ item }) => {
  const dispatch = useDispatch();

  //parse date of birth to string in format dd/mm/yyyy
  const date = (date) => {
    if (date) {
      const parsedDate = parse(date, "dd/MM/yyyy", new Date());
      const d = parsedDate.toLocaleDateString();
      return d;
    } else {
      return "N/A";
    }
  };

  const onDeleteSheep = (item) => {
    console.log(item);
    dispatch(
      setShowConfirmationDialog({
        visible: true,
        id: item.sheep_id,
        title: null,
        field: "sheep",
      })
    );
  };

  const onEditSheep = (item) => {
    const formattedData = {
      breed: { id: item.breed_id, title: item.breed_name },
      color: { id: item.color_id, title: item.color_name },
      marking: { id: item.marking_id, title: item.marking_name },
      sire: { id: item.sire_id, title: item.father_name },
      dam: { id: item.dam_id, title: item.mother_name },
      name: item.name,
      dob: item.dob,
      dop: item.dop,
      tag_id: item.tag_id,
      scrapieTagId: item.scrapie_id,
    };
    dispatch(setFormData(formattedData));
    dispatch(setShowFormDialog(true));
  };

  const onDeleteConfirm = (id) => {
    console.log("delete sheep", id);
    deleteSheep(id)
      .then((res) => {
        //  console.log(res);
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

  const age = () => {
    let sheepAge;
    const today = new Date();
    if (item.dob) {
      const parsedDob = parse(item.dob, "dd/MM/yyyy", new Date());
      if (isValid(parsedDob)) {
        let units = ["years", "months"];
        if (parsedDob < today) {
          let duration = intervalToDuration({ start: parsedDob, end: today });
          if (
            duration.months === 0 &&
            duration.years === 0 &&
            duration.days === 0
          ) {
            units.push("weeks");
            if (!duration.weeks) {
              duration.weeks = (duration.days / 7) | 0;
              duration.days = duration.days - duration.weeks * 7;
            }
            if (duration.weeks === 0) {
              units.push("days");
            }
          }
          return formatDuration(duration, { format: units, delimiter: ", " });
        } else {
          sheepAge = "Invalid Date";
        }
      } else {
        sheepAge = "Invalid Date";
      }
    } else {
      sheepAge = "No birthdate provided";
    }
    return sheepAge;
  };

  return (
    <View style={styles.SheepWrapper}>
      <View style={styles.cardTitleWrapper}>
        <Text style={styles.cardTitle}>
          {item.name ? item.name : item.tag_id}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={styles.photoWrapper}>
            <Image
              source={item.picture ? { uri: item.picture } : placeholder}
              resizeMode="contain"
              style={{
                height: 150,
                width: 150,
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 20,
              }}
            >
              <IconButton
                icon="pencil"
                color="#c2875a"
                size={25}
                onPress={() => onEditSheep(item)}
              />
              <IconButton
                icon="delete"
                color="#9C27B0"
                size={25}
                onPress={() => onDeleteSheep(item)}
              />
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

            <Text>{item.scrapie_id ? item.scrapie_id : "N/A"}</Text>
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
              <Text>{age()}</Text>
            </Text>
          )}
          <Text style={styles.info}>
            <Text style={styles.label}>Breed: </Text>
            <Text>{item.breed_name}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Father: </Text>
            <Text>{item.father_name ? item.father_name : "N/A"}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Mother: </Text>
            <Text>{item.mother_name ? item.mother_name : "N/A"}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Color: </Text>
            <Text>{item.color_name ? item.color_name : "N/A"}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Marking: </Text>
            <Text>{item.marking_name ? item.marking_name : "N/A"}</Text>
          </Text>
        </View>
      </View>
      <ConfirmationDialog onConfirm={(id) => onDeleteConfirm(id)} />
    </View>
  );
};

export default Sheep;

const styles = StyleSheet.create({
  SheepWrapper: {
    backgroundColor: "white",
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
  info: {
    fontSize: 15,
  },
  photoWrapper: {
    height: 150,
    width: 150,
    marginRight: 20,
  },
});
