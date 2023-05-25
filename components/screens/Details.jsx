import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  IconButton,
  SegmentedButtons,
  useTheme,
} from "react-native-paper";
import { age } from "../utils/Age";
import { findChildren } from "../../services/db";
import { format, max, parse } from "date-fns";

const ListItem = ({ item, selectedValue }) => {
  console.log(item);
  return (
    <View
      style={{
        width: selectedValue!=='misc'?"50%":'100%',
        paddingBottom: 14,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <Text style={{ fontSize: 17, fontWeight: "bold" }}>{item.title} </Text>
      <ScrollView style={{ maxHeight: "90%" }}>
        <Text style={{ fontSize: 17 }}>{item.description}</Text>
      </ScrollView>
    </View>
  );
};

const Details = ({ route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation();
  const {
    sheep_id,
    breed_name,
    color_name,
    dob,
    dod,
    dop,
    dos,
    father_name,
    father_tag_id,
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
  } = route.params;



  const [children, setChildren] = useState([]);

  useEffect ( ()=>{
//fetch children
async function getChildren() {
    const children = await findChildren(sheep_id);
    setChildren(children);
}
getChildren();
console.log("!!!", children)
  },[])

const showChildren = () => {

  if (children.length > 0) {
    return (
      <View style={{ width: "100%", paddingBottom: 14, paddingRight: 20 }}>
        <ScrollView style={{ maxHeight: "90%" }}>
          {children.map((child) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Details", child);
                }}
              >
                <Text style={{ fontSize: 17, textDecorationLine: 'underline' }}>{child.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const getAverageChilrenQty = () => {
  //round number to the nearest decimal

 return Math.round((children.length / new Set(children.map(child => child.dob)).size) * 10) / 10;
}

const getMostRecentNumberOfChildren = () => {
  const mostRecentBirthdate = max(children.map(child => parse(child.dob, 'MM/dd/yyyy', new Date())));
  console.log(children)
  const mostRecentBirthdateString = format(mostRecentBirthdate, 'MM/dd/yyyy');
  console.log("!!!", mostRecentBirthdateString);
// Get the puppies in the most recent litter
const mostRecentLambs = children.filter(child => child.dob === mostRecentBirthdateString);

// Get the number of puppies in the most recent litter
return `${mostRecentLambs.length} on ${mostRecentBirthdateString}`;
}

const getAverageChildWeight = () => {
  //round number to the nearest decimal
  //get the average child weight at birth excluding the null values
  return Math.round(children.reduce((acc, child) => acc + child.weight_at_birth, 0) / children.filter(child => child.weight_at_birth).length * 10) / 10;   
}

const timeToLambing = () => {
  //add 165 days to the last breeding date
  const lambingDate = new Date(date_last_bred(date_last_bred.getDate() + 165));
  console.log("!!!", lambingDate);
}



  const basic = [
    name && { title: "Name:", description: name },
    { title: "Tag Id:", description: tag_id },
    scrapie_id && { title: "Scrapie Id:", description: scrapie_id },
    { title: "Breed:", description: breed_name },
    color_name !== "NA" && { title: "Color:", description: color_name },
    marking_name !== "NA" && { title: "Marking:", description: marking_name },
    { title: "Date of Birth:", description: dob },
    {title: "Sex", description: sex},
    !dod &&{title: "Age", description: age(route.params)},
    dod && { title: "Date of Death:", description: dod },
    dop && { title: "Date of Purchase:", description: dop },
    dos && { title: "Date of Sale:", description: dos },
  ].filter(Boolean);

  const breeding = [
    father_name && { title: "Father:", description: father_name },
    father_tag_id && { title: "Father Tag Id:", description: father_tag_id },
    mother_name && { title: "Mother:", description: mother_name },
    mother_tag_id && { title: "Mother Tag Id:", description: mother_tag_id },

    sex==='f'&&{ title: "Date last bred:", description: date_last_bred },
    sex==='f'&&{ title: "Time until lambing:", description: "2 months 5 days" },
    sex==='f'&&children.length>0 && { title: "Average lamb qty:", description: getAverageChilrenQty() },
    sex==='f'&&children.length>0 && { title: "Average lamb weight", description: getAverageChildWeight() },
    sex==='f'&&children.length>0 && { title: "Last lamb qty:", description: getMostRecentNumberOfChildren() },
    children.length>0 && { title: "Children:", description: showChildren() },
  ].filter(Boolean);

  const health = [
    { title: "Last Deworming:", description: "Ivermectin 25g on 04/05/2022" },
    { title: "Last Vaccination:", description: "UltraBac on 04/05/2022" },
    dod && { title: "Date of Death:", description: dod },
    dod && { title: "Cause of Death:", description: "Poleo" },
    weight_at_birth&&{ title: "Weight at Birth:", description: weight_at_birth },
    {
      title: "Last Weight:",
      description: "100kg on 04/05/2022 at 2 years 5 months",
    },
  ].filter(Boolean);

  const misc = [
    { title: "Last Location:", description: "Paddock3" },
    {
      title: "Notes",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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

  const onItemPress = () => {
    console.log("item pressed");
  };
  const buttons = [
    { value: "basic", label: "Overview", color: theme.colors.primary },
    { value: "breeding", label: "Breeding", color: theme.colors.secondary },
    { value: "health", label: "Health", color: theme.colors.accent },
    { value: "misc", label: "Misc", color: theme.colors.accent2 },
  ];

  const [selectedValue, setSelectedValue] = useState("basic");
  const [data, setData] = useState(basic);

  useEffect(() => {
    switch (selectedValue) {
      case "basic":
        console.log("basic");
        setData(basic);
        break;
      case "breeding":
        console.log("breeding");
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
  }, [selectedValue]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={picture ? { uri: picture } : placeholder}
          resizeMode="cover"
          style={{
            height: 250,
            width: 250,
          }}
        />
      </View>
      <SegmentedButtons
        value={selectedValue}
        onValueChange={setSelectedValue}
        buttons={buttons.map((button, index) => ({
          value: button.value,
          label: button.label,
          showSelectedCheck: true,
          checkedColor: button.color,
          uncheckedColor: theme.colors.background,
          style: {
            backgroundColor:
              selectedValue === button.value ? "white" : `${button.color}98`,
            borderColor: `${button.color}80`,
            borderWidth: 1,
            //    elevation: 1,
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
          flex: 0.6,
          paddingVertical: 20,

          justifyContent: "space-between",
        }}
      >
        <View style={selectedValue!=='misc'? {flexDirection: "row", flexWrap: "wrap"}:{flexDirection: 'column'}} >
          {data.map((item, index) => (
            <ListItem key={index} item={item} selectedValue={selectedValue}/>
          ))}
        </View>
        <View style={{ position: "absolute", bottom: 20, left: 20 }}>
          <IconButton
            icon="pencil"
            iconColor={theme.colors.background}
            size={30}
            containerColor={theme.colors.secondary}
            onPress={() => console.log("Pressed")}
          />
        </View>
      </View>
    </View>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      marginTop: 20,
      flex: 0.4,
    },
    itemStyle: {
      paddingVertical: 20,
      paddingHorizontal: 26,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      textAlign: "center",
    },
  });

export default Details;
