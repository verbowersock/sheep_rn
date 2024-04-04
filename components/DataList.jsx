import React, { useEffect, useState } from "react";
import { FAB, IconButton, Text, useTheme } from "react-native-paper";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { forms } from "../Constants";
import {
  removeSheepMed,
  removeSheepVax,
  removeSheepWeight,
} from "../services/db";
import {
  resetShowConfirmationDialog,
  setShowConfirmationDialog,
  setShowSnackbar,
} from "../store/slices/ui";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationDialog from "./ConfirmationDialog";
import sheep, {
  sheepDataSelector,
  updateSheepMeds,
  updateSheepVax,
  updateSheepWeight,
} from "../store/slices/sheep";

const DataList = ({ header, onDismiss }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const { sheepMeds, sheepVax, sheepWeights } = useSelector(sheepDataSelector);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    if (header === forms.MEDS.listHeader) {
      setType(forms.MEDS.type);
      setListData(sheepMeds);
    } else if (header === forms.VAX.listHeader) {
      setType(forms.VAX.type);
      setListData(sheepVax);
    } else if (header === forms.WEIGHT.listHeader) {
      setType(forms.WEIGHT.type);
      setListData(sheepWeights);
    }
  }, [header, sheepMeds, sheepVax, sheepWeights]);

  const handleDeleteItem = (item) => {
    dispatch(
      setShowConfirmationDialog({
        visible: true,
        id: item.id,
        title: `${item.entry} on ${item.date}`,
        field: "entry",
      })
    );
  };

  const deleteValue = async (id) => {
    if (type === forms.MEDS.type) {
      removeSheepMed(id)
        .then(() => {
          dispatch(updateSheepMeds(id));
          dispatch(resetShowConfirmationDialog());
          dispatch(
            setShowSnackbar({ visible: true, message: "Medication deleted" })
          );
        })
        .catch((err) => {
          dispatch(
            setShowSnackbar({
              visible: true,
              error: true,
              message: `Something went wrong. Please try again`,
            })
          );
        });
    } else if (type === forms.VAX.type) {
      removeSheepVax(id)
        .then(() => {
          dispatch(updateSheepVax(id));
          dispatch(resetShowConfirmationDialog());
          dispatch(
            setShowSnackbar({ visible: true, message: "Vaccination deleted" })
          );
        })
        .catch((err) => {
          dispatch(
            setShowSnackbar({
              visible: true,
              error: true,
              message: `Something went wrong. Please try again`,
            })
          );
        });
    } else if (type === forms.WEIGHT.type) {
      removeSheepWeight(id)
        .then(() => {
          dispatch(updateSheepWeight(id));
          dispatch(resetShowConfirmationDialog());
          dispatch(
            setShowSnackbar({ visible: true, message: "Weight deleted" })
          );
        })
        .catch((err) => {
          dispatch(
            setShowSnackbar({
              visible: true,
              error: true,
              message: `Something went wrong. Please try again`,
            })
          );
        });
    }
  };

  //const styles = makeStyles(theme);
  return (
    <ScrollView style={{ width: "100%", paddingBottom: 20 }}>
      <View style={{ position: "absolute", top: -10, right: 0 }}>
        <IconButton icon="close" onPress={onDismiss} />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          alignSelf: "center",
          marginBottom: 20,
        }}
      >
        {header}
      </Text>
      {listData.length === 0 ? (
        <Text style={{ fontSize: 16, alignSelf: "center" }}>No data found</Text>
      ) : (
        listData.map((item, index) => (
          <TouchableOpacity
            onLongPress={() => handleDeleteItem(item)}
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? "#D3D3D3" : "white",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 15,
            }}
          >
            <View
              style={{
                width: "100%",

                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 15, paddingLeft: 5, width: "45%" }}>
                {type === forms.WEIGHT.type ? `${item.entry}lb` : item.entry}
              </Text>
              {item.dosage && (
                <Text
                  style={{
                    fontSize: 15,
                    paddingRight: 5,
                    width: "20%",
                  }}
                >
                  {item.dosage}
                </Text>
              )}

              <Text
                style={{
                  fontSize: 17,
                  paddingRight: 5,
                }}
              >
                {item.date}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
      <ConfirmationDialog onConfirm={(id) => deleteValue(id)} />
    </ScrollView>
  );
};

export default DataList;
