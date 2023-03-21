import {
  formatDuration,
  intervalToDuration,
  parse,
  parseISO,
  isValid,
} from "date-fns";
import React from "react";
import { Image, StyleSheet, View, Text, ImageBackground } from "react-native";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { deleteSheep } from "../services/db";
import LinearGradient from "react-native-linear-gradient";
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
} from "../store/slices/ui";
import ConfirmationDialog from "./ConfirmationDialog";
import ConfirmationSnackbar from "./ConfirmationSnackbar";

const placeholder = require("../assets/images/placeholder.jpg");
const dead = require("../assets/images/dead.png");
const male = require("../assets/images/male.png");
const female = require("../assets/images/female.png");
const wether = require("../assets/images/wether.png");
//import { HeaderWrapper } from './Header.styles';

const Sheep = ({ item, index }) => {
  const dispatch = useDispatch();
  const { sheep } = useSelector(sheepDataSelector);
  //console.log("item", item);
  //parse date of birth to string in format dd/mm/yyyy
  const date = (date) => {
    if (date) {
      const parsedDate = parse(date, "MM/dd/yyyy", new Date());
      const d = parsedDate.toLocaleDateString();
      return d;
    } else {
      return "N/A";
    }
  };

  const onDeleteSheep = (item) => {
    // console.log(item);
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
      tag_id: item.tag_id,
      scrapie_id: item.scrapie_id,
      id: item.sheep_id,
      sex: item.sex,
      //    sex:

      //   { id: "1", title: "Male", label: "m" },
      // { id: "2", title: "Female", label: "f" },
      // {/ id: "3", title: "Weather", label: "w" },
    };

    dispatch(setFormData(formattedData));
    dispatch(setShowFormDialog(true));
  };

  const onDeleteConfirm = (id) => {
    // console.log("delete sheep", id);
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
      const parsedDob = parse(item.dob, "MM/dd/yyyy", new Date());
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

  const getCornerImage = () => {
    //console.log(item.dod);
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

  return (
    <View
      style={
        index === sheep.length - 1
          ? [styles.SheepWrapper, styles.SheepWrapperLast]
          : styles.SheepWrapper
      }
    >
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
      <View style={styles.cardTitleWrapper}>
        <Text style={styles.cardTitle}>
          {item.name ? item.name : item.tag_id}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: 200,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flexDirection: "column" }}>
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
    width: "80%",
  },
  info: {
    fontSize: 15,
  },
  photoWrapper: {
    height: 150,
    width: 150,
    marginRight: 20,
  },
  linearGradient: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 200,
    width: 350,
  },
  /*
  card_background_male: {
  background: linear-gradient(
      to top left,
      rgba(255, 255, 255, 0) 50%,
      #5a76c2 50.1%
    )
    top left/40px 40px no-repeat !important"

  }
card_background_deceased: {
  background: linear-gradient(
      to top left,
      rgba(255, 255, 255, 0) 50%,
      #000 50.1%
    )
    top left/40px 40px no-repeat !important;
},

card_background_wether: {
  background: linear-gradient(
      to top left,
      rgba(255, 255, 255, 0) 50%,
      #68c25a 50.1%
    )
    top left/40px 40px no-repeat !important;
}*/
});
