import { formatDuration, intervalToDuration, parse, parseISO } from "date-fns";
import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

const placeholder = require("../assets/images/placeholder.jpg");

//import { HeaderWrapper } from './Header.styles';

const Sheep = ({ item }) => {
  const age = () => {
    const today = new Date();
    if (item.dob) {
      const dob = parseISO(item.dob, "MM/dd/yyyy", new Date());
      let units = ["years", "months"];
      let duration = intervalToDuration({ start: dob, end: today });
      if (duration.months === 0 && duration.years === 0) {
        units.push("weeks");
        if (!duration.weeks) {
          duration.weeks = (duration.days / 7) | 0;
          duration.days = duration.days - duration.weeks * 7;
        }
        if (duration.weeks === 0) {
          units.push("days");
        }
      }
      return formatDuration(duration, {
        format: units,
        delimiter: ", ",
      });
    } else {
      return "N/A";
    }
  };
  return (
    <View style={styles.SheepWrapper}>
      <View style={styles.cardTitleWrapper}>
        <Text style={styles.cardTitle}>
          {item.name ? item.name : item.tag_id}
        </Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.photoWrapper}>
          <Image
            source={placeholder}
            resizeMode="contain"
            style={{
              height: 150,
              width: 150,
            }}
          />
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
            <Text>{item.dob}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Sex: </Text>
            <Text>{item.sex}</Text>
          </Text>
          {item.purchase_date && (
            <Text style={styles.info}>
              <Text style={styles.label}>Purchase Date: </Text>
              <Text>{item.purchase_date}</Text>
            </Text>
          )}
          {item.date_deceased ? (
            <Text style={styles.info}>
              <Text style={styles.label}>Date Deceased: </Text>

              <Text>{item.date_deceased}</Text>
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
            <Text>{item.sire?.name ? item.sire?.name : "N/A"}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Mother: </Text>
            <Text>{item.mother_name ? item.mother_name : "N/A"}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Color: </Text>
            <Text>
              {item.color?.color_name ? item.color?.color_name : "N/A"}
            </Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Marking: </Text>
            <Text>
              {item.marking?.marking_name ? item.marking?.marking_name : "N/A"}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Sheep;

const styles = StyleSheet.create({
  SheepWrapper: {
    height: 270,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 8,
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 14,
    paddingTop: 16,
    margin: 16,
    flexDirection: "column",
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
