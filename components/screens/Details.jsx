import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Tag,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconButton, SegmentedButtons, useTheme } from "react-native-paper";
import { age } from "../utils/Age";
import {
  fetchSheepMeds,
  fetchSheepVax,
  fetchSheepWeight,
  findChildren,
} from "../../services/db";
import { add, format, max, parse, set } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFormData,
  setContextMenuOpen,
  setFormData,
  setFormTitle,
  setShowFormDialog,
  uiSelector,
} from "../../store/slices/ui";
import { toggleSecondaryFormModal } from "../utils/SharedFunctions";
import { forms } from "../../Constants";
import ListItem from "../ListItem";
import DataList from "../DataList";
import {
  setSheepChildren,
  setSheepMeds,
  setSheepVax,
  setSheepWeights,
  sheepDataSelector,
} from "../../store/slices/sheep";
import AddSheepBtn from "../AddSheepBtn";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { htmlContent } from "./HTMLforPDF";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dimensions } from "react-native";

const Details = ({ route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();
  const { sheep_id } = route.params;

  const { sheep, sheepMeds, sheepVax, sheepWeights, sheepChildren } =
    useSelector(sheepDataSelector);

  //find sheep by sheep_id
  const this_sheep = sheep.find((sheep) => sheep.sheep_id === sheep_id);
  const {
    breed_id,
    breed_name,
    color_id,
    sire,
    dam,
    color_name,
    dob,
    dod,
    dop,
    dos,
    father_name,
    father_tag_id,
    marking_id,
    marking_name,
    mother_name,
    mother_tag_id,
    name,
    picture,
    scrapie_id,
    sex,
    tag_id,
    weight_at_birth,
    date_last_bred,
    last_bred_to_name_or_tag,
    notes,
    last_location,
  } = this_sheep;

  const [lastMedication, setLastMedication] = useState({});
  const [lastVaccination, setLastVaccination] = useState({});
  const [lastWeight, setLastWeight] = useState({});
  const [dataUpdates, setDataUpdates] = useState([]);
  const [listData, setListData] = useState([]);
  const [listHeader, setListHeader] = useState("");
  const [listModalvisible, setListModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // Get the window dimensions
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  // Calculate font size based on window size
  const fontSize =
    windowWidth > windowHeight ? windowHeight * 0.03 : windowWidth * 0.03;

  const { contextMenuOpen } = useSelector(uiSelector);
  const dispatch = useDispatch();

  const sortData = (data) => {
    data.sort(
      (a, b) =>
        parse(a.date, "MM/dd/yyyy", new Date()) -
        parse(b.date, "MM/dd/yyyy", new Date())
    );
    return data;
  };

  useEffect(() => {
    async function getChildren() {
      setLoading(true);
      const children = await findChildren(sheep_id);
      dispatch(setSheepChildren(children));
      setLoading(false);
    }
    async function getMedications() {
      setLoading(true);
      const medications = await fetchSheepMeds(sheep_id);

      const sortedData = sortData(medications);
      dispatch(setSheepMeds(sortedData));
      setLoading(false);
    }
    async function getVaccinations() {
      setLoading(true);
      const vaccinations = await fetchSheepVax(sheep_id);
      const sortedData = sortData(vaccinations);
      dispatch(setSheepVax(sortedData));
      setLoading(false);
    }
    async function getWeights() {
      setLoading(true);
      const weights = await fetchSheepWeight(sheep_id);
      const sortedData = sortData(weights);
      dispatch(setSheepWeights(sortedData));
      setLoading(false);
    }
    getWeights();
    getVaccinations();
    getMedications();
    getChildren();
  }, [sheep_id]);

  useEffect(() => {
    if (sheepMeds.length > 0) {
      const lastMed = getMostRecentEntry(sheepMeds);
      setLastMedication(lastMed);
    }
    if (sheepVax.length > 0) {
      const lastVax = getMostRecentEntry(sheepVax);
      setLastVaccination(lastVax);
    }
    if (sheepWeights.length > 0) {
      const lastWeight = getMostRecentEntry(sheepWeights);
      setLastWeight(lastWeight);
    }
  }, [sheepWeights, sheepMeds, sheepVax]);

  const showChildren = () => {
    if (sheepChildren.length > 0) {
      return (
        <View style={{ width: "100%", paddingRight: 20 }}>
          <ScrollView>
            {sheepChildren.map((child, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.navigate("Details", child);
                    setSelectedValue("basic");
                  }}
                >
                  <Text
                    style={{ fontSize: 17, textDecorationLine: "underline" }}
                  >
                    {child.name ? child.name : child.tag_id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    } else {
      return "NA";
    }
  };

  const getAverageChilrenQty = () => {
    //round number to the nearest decimal

    return (
      Math.round(
        (sheepChildren.length /
          new Set(sheepChildren.map((child) => child.dob)).size) *
          10
      ) / 10
    );
  };

  const getMostRecentNumberOfChildren = () => {
    const mostRecentBirthdate = max(
      sheepChildren.map((child) => parse(child.dob, "MM/dd/yyyy", new Date()))
    );
    const mostRecentBirthdateString = format(mostRecentBirthdate, "MM/dd/yyyy");
    // Get the puppies in the most recent litter
    const mostRecentLambs = sheepChildren.filter(
      (child) => child.dob === mostRecentBirthdateString
    );

    // Get the number of lambs in the most recent litter
    return `${mostRecentLambs.length} on ${mostRecentBirthdateString}`;
  };

  const getAverageChildWeight = () => {
    // Get the children with non-null weight_at_birth values
    const childrenWithWeight = sheepChildren.filter(
      (child) => child.weight_at_birth !== null
    );

    // Calculate the average child weight at birth
    if (childrenWithWeight.length === 0) return "NA";

    const averageWeight =
      childrenWithWeight.reduce(
        (acc, child) => acc + child.weight_at_birth,
        0
      ) / childrenWithWeight.length;

    // Round the result to the nearest decimal
    return `${Math.round(averageWeight * 10) / 10} lb`;
  };

  const timeToLambing = () => {
    if (!date_last_bred) return "NA";
    const dateLastBred = parse(date_last_bred, "MM/dd/yyyy", new Date());

    // Add 165 days to the last breeding date
    const lambingDate = add(dateLastBred, { days: 165 });

    // Format the lambingDate back into a string
    const lambingDateString = format(lambingDate, "MM/dd/yyyy");

    return lambingDateString;
  };

  const getMostRecentEntry = (data) => {
    const mostRecentDate = max(
      data.map((item) => parse(item.date, "MM/dd/yyyy", new Date()))
    );
    const mostRecentDateString = format(mostRecentDate, "MM/dd/yyyy");
    const mostRecentEntry = data.filter(
      (item) => item.date === mostRecentDateString
    );
    setDataUpdates([...dataUpdates, "lastMedication"]);
    if (mostRecentEntry.length > 1) {
      const mostRecentEntryWithHighestId = mostRecentEntry.reduce(
        (prev, current) => {
          return prev.id > current.id ? prev : current;
        }
      );
      return {
        entry: mostRecentEntryWithHighestId.entry,
        date: mostRecentDateString,
        dosage:
          mostRecentEntryWithHighestId.dosage &&
          mostRecentEntryWithHighestId.dosage,
      };
    } else if (mostRecentEntry.length === 1) {
      return {
        entry: mostRecentEntry[0].entry,
        date: mostRecentDateString,
        dosage: mostRecentEntry[0].dosage,
      };
    } else {
      return "";
    }
  };

  const onEditSheep = (item) => {
    dispatch(setFormTitle("Edit Sheep"));

    const formattedData = {
      breed_id,
      color_id,
      marking_id,
      sire,
      dam,
      name,
      dob,
      dop,
      dod,
      dos,
      tag_id,
      scrapie_id,
      sheep_id,
      sex,
      weight_at_birth,
      picture,
    };
    dispatch(setFormData(formattedData));
    dispatch(setShowFormDialog(true));
    setDataUpdates([...dataUpdates, "sheep"]);
  };

  const onEditMisc = () => {
    toggleSecondaryFormModal(
      forms.MISC,
      sheep_id,
      false,
      dispatch,
      async () => {
        updateState(forms.MISC);
      },
      {
        notes,
        last_location,
      }
    );
    setDataUpdates([...dataUpdates, "misc"]);
  };

  const basic = [
    name && { title: "Name:", description: name },
    { title: "Tag Id:", description: tag_id },
    scrapie_id && { title: "Scrapie Id:", description: scrapie_id },
    { title: "Breed:", description: breed_name },
    color_name !== "NA" && {
      title: "Color:",
      description: color_name,
    },
    marking_name !== "NA" && {
      title: "Marking:",
      description: marking_name,
    },
    { title: "Date of Birth:", description: dob },
    { title: "Sex", description: sex },
    !dod && { title: "Age", description: age(this_sheep) },
    dod && { title: "Date of Death:", description: dod },
    dop && { title: "Date of Purchase:", description: dop },
    dos && { title: "Date of Sale:", description: dos },
  ].filter(Boolean);

  const breeding = [
    {
      title: "Sire Name/Tag Id:",
      description: father_name
        ? father_name
        : father_tag_id
        ? father_tag_id
        : "NA",
    },

    {
      title: "Dam Name/Tag Id:",
      description: mother_name
        ? mother_name
        : mother_tag_id
        ? mother_tag_id
        : "NA",
    },
    sex === "f" && {
      title: "Date last bred:",
      description: date_last_bred ? date_last_bred : "NA",
    },
    sex === "f" && {
      title: "Ram bred to:",
      description: last_bred_to_name_or_tag ? last_bred_to_name_or_tag : "NA",
    },
    sex === "f" && {
      title: "Expected lambing date:",
      description: timeToLambing(),
    },

    sex === "f" &&
      sheepChildren.length > 0 && {
        title: "Average lamb qty:",
        description: getAverageChilrenQty(),
      },
    sex === "f" && sheepChildren.length > 0
      ? {
          title: "Average lamb weight",
          description: getAverageChildWeight(),
        }
      : {
          title: "Average lamb weight",
          description: "NA",
        },
    sex === "f" && sheepChildren.length > 0
      ? {
          title: "Last lamb qty:",
          description: getMostRecentNumberOfChildren(),
        }
      : { title: "Last lamb qty:", description: "NA" },
    sheepChildren.length > 0
      ? {
          title: "Children:",
          description: showChildren(),
        }
      : { title: "Children:", description: "NA" },
  ].filter(Boolean);

  const health = [
    {
      type: forms.MEDS,
      title: "Last Medication:",
      description:
        sheepMeds.length > 0
          ? `${lastMedication.entry} - ${lastMedication.dosage} on ${lastMedication.date}`
          : "No medications found",
    },
    {
      type: forms.VAX,
      title: "Last Vaccination:",
      description:
        sheepVax.length > 0
          ? `${lastVaccination.entry} on ${lastVaccination.date}`
          : "No vaccinations found",
    },
    {
      type: forms.WEIGHT,
      title: "Last Weight:",
      description:
        sheepWeights.length > 0
          ? `${lastWeight.entry}lbs on ${lastWeight.date}`
          : "No weight entries found",
    },
    dod && { title: "Date of Death:", description: dod, type: forms.DEATH },
  ].filter(Boolean);

  const misc = [
    {
      title: "Last Location:",
      description: last_location ? last_location : "NA",
    },
    {
      title: "Notes",
      description: notes ? notes : "NA",
    },
  ].filter(Boolean);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Details for ${
        route.params.name ? route.params.name : route.params.tag_id
      }`,
    });
  }, [navigation, route]);
  const placeholder = require("../../assets/images/placeholder.jpg");

  const buttons = [
    { value: "basic", label: "Overview", color: theme.colors.primary },
    { value: "breeding", label: "Breeding", color: theme.colors.secondary },
    { value: "health", label: "Health", color: theme.colors.accent },
    { value: "misc", label: "Misc", color: theme.colors.accent2 },
  ];

  const [selectedValue, setSelectedValue] = useState("basic");
  const [data, setData] = useState(basic);

  const openContextMenu = (index) => {
    dispatch(setContextMenuOpen(index));
  };

  const updateState = async (type) => {
    let updatedItems;
    switch (type) {
      case forms.MEDS:
        updatedItems = await fetchSheepMeds(sheep_id);
        setSheepMeds(updatedItems);
        break;
      case forms.VAX:
        updatedItems = await fetchSheepVax(sheep_id);
        const sortedData = sortData(updatedItems);
        setSheepVax(updatedItems);
        break;
      case forms.WEIGHT:
        updatedItems = await fetchSheepWeight(sheep_id);
        setSheepWeights(updatedItems);
        break;
      default:
        break;
    }
  };

  const handlePlusPress = async (type) => {
    toggleSecondaryFormModal(type, sheep_id, false, dispatch, async () => {
      updateState(type);
    });
  };

  const handleListPress = (type) => {
    setListHeader(type.listHeader);
    setListModalVisible(true);
  };

  const handleModalClose = () => {
    setListData([]);
    setListHeader("");
    setListModalVisible(false);
  };

  useEffect(() => {
    switch (selectedValue) {
      case "basic":
        setData(basic);
        break;
      case "breeding":
        setData(breeding);
        break;
      case "health":
        setData(health);
        break;
      case "misc":
        setData(misc);
        break;
      default:
        setData(basic);
    }
    // Check if dataUpdates array is not empty
    if (dataUpdates.length > 0) {
      // Clear the dataUpdates array
      setDataUpdates([]);
    }
  }, [selectedValue, dataUpdates, sheep_id, sheepChildren, this_sheep]);

  const pdfName = name ? name : tag_id;

  async function checkPermissions() {
    if (Platform.constants["Release"] >= 13) {
      return true;
    } else {
      let granted;
      try {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "myFlock App Permission",
            message: "This app needs permission to acess storage.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
      } catch (err) {
        console.warn(err);
        alert("No permission to access storage");
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  const createPDF = async () => {
    let options = {
      html: htmlContent({
        ...this_sheep,
        lastWeight,
        sheepMeds,
        sheepVax,
      }),
      fileName: pdfName,
      directory: "Download",
    };

    let file = await RNHTMLtoPDF.convert(options);
    if (await checkPermissions()) {
      try {
        const destPath = `${RNFS.DownloadDirectoryPath}/${options.fileName}.pdf`;

        RNFS.moveFile(file.filePath, destPath)
          .then(() => {
            Alert.alert(
              "File Saved",
              "Your document is located in your downloads folder"
            ),
              // Open the file
              FileViewer.open(destPath)
                .then(() => {
                  // success
                })
                .catch((error) => {
                  // error
                });
          })
          .catch((err) => {
            alert("Something went wrong! Please try again");
            console.log("Error moving file: ", err);
          });
      } catch (err) {
        alert("Something went wrong! Please try again");
        console.log("Error moving file: ", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.secondary,
          padding: 7,
          borderRadius: 10,
          maxWidth: 120,
          marginRight: 10,
          marginBottom: 10,
          alignSelf: "flex-end",
        }}
        onPress={() => createPDF()}
      >
        <Text style={{ color: "white" }}>
          <Icon name="file-pdf-o" size={20} />
          {"  "}
          Export data
        </Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image
          source={
            picture && /^data:image\/[a-zA-Z]*;base64,/.test(picture)
              ? { uri: picture }
              : placeholder
          }
          style={{
            height: 200,
            width: 200,
          }}
        />
      </View>
      <SegmentedButtons
        value={selectedValue}
        onValueChange={setSelectedValue}
        buttons={buttons.map((button, index) => ({
          value: button.value,
          label: (
            <Text style={{ fontSize, lineHeight: fontSize * 1.3 }}>
              {button.label}
            </Text>
          ),
          checkedColor: button.color,
          uncheckedColor: theme.colors.background,
          showSelectedCheck: true,
          style: {
            paddingRight: -100,
            backgroundColor:
              selectedValue === button.value ? "white" : `${button.color}98`,
            borderColor: `${button.color}80`,
            borderWidth: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomWidth: selectedValue !== button.value ? 1 : 0,
          },
        }))}
      />
      <View
        style={{
          paddingTop: 10,
          justifyContent: "space-between",
          maxHeight: 300,
        }}
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView persistentScrollbar={true}>
            <View
              style={
                selectedValue !== "misc" && selectedValue !== "health"
                  ? {
                      flexDirection: "row",
                      flexWrap: "wrap",
                      position: "relative",
                    }
                  : { flexDirection: "column" }
              }
            >
              {data.map((item, index) => (
                <ListItem
                  key={index}
                  index={index}
                  item={item}
                  selectedValue={selectedValue}
                  showContextMenu={selectedValue === "health"}
                  onItemPress={() => openContextMenu(index)}
                  isContextMenuOpen={contextMenuOpen}
                  onPlusPress={() => handlePlusPress(item.type)}
                  onListPress={() => handleListPress(item.type)}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      {selectedValue === "basic" || selectedValue === "misc" ? (
        <AddSheepBtn
          icon="pencil"
          toggleModal={selectedValue === "basic" ? onEditSheep : onEditMisc}
          style={{ bottom: 5 }}
        />
      ) : null}

      <Modal visible={listModalvisible} transparent>
        <Pressable onPress={handleModalClose} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DataList header={listHeader} onDismiss={handleModalClose} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.colors.background,
      position: "relative",
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      marginTop: 5,
      height: "30%",
      position: "relative",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 20,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  });

export default Details;
