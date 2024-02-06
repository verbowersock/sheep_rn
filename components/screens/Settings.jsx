import { useState } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Paragraph, RadioButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  setDate,
  setUnit,
  settingsSelector,
} from "../../store/slices/settings";

const Settings = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  //get the date format and unit of measurement from the state
  const dispatch = useDispatch();
  const { dateFormat, unitFormat } = useSelector(settingsSelector);

  const [dateFormatState, setDateFormatState] = useState(dateFormat);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState(unitFormat);

  const changeDateFormat = (value) => {
    console.log(value);
    setDateFormatState(value);
    dispatch(setDate(value));
  };

  const changeUnitOfMeasurement = (value) => {
    setUnitOfMeasurement(value);
    dispatch(setUnit(value));
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <Text style={styles.settingsTitle}>Unit and Date settings</Text>

      <Text style={styles.settingsSubtitle}>Date Format</Text>
      <Paragraph style={styles.settingsParagraph}>
        Choose the date format that you prefer. The date format will be used
        throughout the app.
      </Paragraph>
      <View style={styles.radioButtonGroupContainer}>
        <RadioButton.Group
          onValueChange={(newValue) => changeDateFormat(newValue)}
          value={dateFormatState}
        >
          <View style={styles.radioButtonContainer}>
            <RadioButton.Item
              value="mdy"
              label="mm/DD/yyyy"
              position="leading"
            />
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton.Item
              value="dmy"
              label="DD/mm/yyyy"
              position="leading"
            />
          </View>
        </RadioButton.Group>
      </View>
      <Text style={styles.settingsSubtitle}>Unit of Measurement</Text>
      <Paragraph style={styles.settingsParagraph}>
        Choose the unit of measurement that you prefer. The unit of measurement
        will be used throughout the app.
      </Paragraph>
      <View style={styles.radioButtonGroupContainer}>
        <RadioButton.Group
          onValueChange={(newValue) => changeUnitOfMeasurement(newValue)}
          value={unitOfMeasurement}
        >
          <View style={styles.radioButtonContainer}>
            <RadioButton.Item
              value="lb"
              label="Imperial(Lb)"
              position="leading"
            />
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton.Item
              value="kg"
              label="Metric(Kg)"
              position="leading"
            />
          </View>
        </RadioButton.Group>
      </View>
    </ScrollView>
  );
};

export default Settings;

const makeStyles = (theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: "column",
      margin: 30,
    },
    settingsTitle: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.colors.text,
      marginBottom: 20,
    },
    settingsParagraph: {
      marginTop: 10,
      fontSize: 15,
      color: theme.colors.text,
    },
    settingsSubtitle: {
      paddingTop: 10,
      fontWeight: "bold",
      fontSize: 19,
      color: theme.colors.text,
    },
    radioButtonContainer: {
      width: "50%",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    radioLabel: {
      fontSize: 16,
      marginLeft: 10,
      color: theme.colors.text,
    },
    radioButtonGroupContainer: {
      marginTop: 15,
      marginBottom: 30,
      marginLeft: 20,
    },
  });
