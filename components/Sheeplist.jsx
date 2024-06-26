import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FlatList } from "react-native";
import Sheep from "./Sheep";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { settingsSelector } from "../store/slices/settings";

const renderSheep =
  (dateFormat) =>
  ({ item, index }) => {
    return <Sheep item={item} index={index} dateFormat={dateFormat} />;
  };

const SheepList = React.memo(function SheepList({ sheep }) {
  const { dateFormat } = useSelector(settingsSelector);
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <ScrollView
      style={styles.SheepListWrapper}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {sheep.length !== 0 ? (
        <FlatList
          data={sheep}
          renderItem={renderSheep(dateFormat)}
          style={{
            width: "95%",
            maxWidth: 420,
            paddingBottom: 100,
          }}
        />
      ) : (
        <View style={styles.NothingFound}>
          <Text style={styles.NothingFoundText}>
            Sorry, no sheep found! Add some by clicking the plus icon below
          </Text>
        </View>
      )}
    </ScrollView>
  );
});
export default SheepList;

const makeStyles = (theme) =>
  StyleSheet.create({
    SheepListWrapper: {
      flex: 1,
    },
    NothingFound: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
      width: "70%",
      alignSelf: "center",
    },
    NothingFoundText: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });
