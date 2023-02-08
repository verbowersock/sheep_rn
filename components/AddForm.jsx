import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import {
  addSheep,
  fetchBreeds,
  fetchColors,
  fetchFemales,
  fetchMales,
  fetchMarkings,
} from "../services/db";
import DateTextInput from "./DateTextInput";
import { useForm, Controller } from "react-hook-form";
import { ActivityIndicator } from "react-native-paper";
import MyDropdown from "./MyDropdown";
import MyTextInput from "./MyTextInput";

const AddForm = ({ isModalVisible, toggleModal }) => {
  const sex = [
    { id: "1", title: "Male" },
    { id: "2", title: "Female" },
    { id: "3", title: "Weather" },
  ];
  const [colors, setColors] = useState([]);
  const [markings, setMarkings] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function loadDataToApp() {
      try {
        const colors = await fetchColors();

        setColors(
          colors.map(({ color_name, id }) => ({
            title: color_name,
            id: id.toString(),
          }))
        );
        const markings = await fetchMarkings();
        setMarkings(
          markings.map(({ marking_name, id }) => ({
            title: marking_name,
            id: id.toString(),
          }))
        );
        const breeds = await fetchBreeds();
        setBreeds(
          breeds.map(({ breed_name, id }) => ({
            title: breed_name,
            id: id.toString(),
          }))
        );
        const males = await fetchMales();
        setMales(
          males.map(({ sheep_id, name, tag_id }) => ({
            title: tag_id ? `${tag_id} - ${name}` : tag_id,
            id: sheep_id,
          }))
        );
        const females = await fetchFemales();
        setFemales(
          females.map(({ sheep_id, name, tag_id }) => ({
            title: tag_id ? `${tag_id} - ${name}` : tag_id,
            id: sheep_id,
          }))
        );
      } catch (error) {
        console.log("!error", error);
      }
    }
    loadDataToApp().then(() => setDataLoaded(true));
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    //mode: "onBlur",
    mode: "onTouched",

    defaultValues: {
      name: "",
      tag_id: "",
      scrapieTagId: "",
      sex: "",
      dob: "",
      dop: "",
      dod: "",
      sire: {},
      dam: {},
      breed: {},
      color: {},
      marking: {},
    },
  });
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      sire: data.sire.id,
      dam: data.dam.id,
      breed: data.breed.id,
      color: data.color.id,
      marking: data.marking.id,
    };
    addSheep(formattedData);
    //close modal
    closeModal();
  };

  const closeModal = () => {
    reset();
    toggleModal();
  };

  if (!dataLoaded) {
    return <ActivityIndicator />;
  }
  return (
    <Modal isVisible={isModalVisible}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.formContainer}
      >
        <Text style={styles.formTitle}>Add New Sheep</Text>
        <Controller
          control={control}
          rules={{
            validate: (value) =>
              !value ||
              !!value.trim() ||
              "Name should not consist of whitespaces",
            maxLength: {
              value: 20,
              message: "Name cannot be more than 20 characters long",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyTextInput
              label={"Name"}
              placeholder={"Name"}
              onBlur={(target) => onBlur(target.value)}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && <Text>{errors.name.message}</Text>}

        <Controller
          control={control}
          rules={{
            validate: (value) =>
              !!value.trim() || "Tag Id should not consist of whitespaces",
            required: {
              value: true,
              message: "Tag Id is required",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyTextInput
              label={"Tag ID (required)"}
              placeholder={"Tag Id"}
              onChangeText={onChange}
              onBlur={(target) => onBlur(target.value)}
              value={value}
            />
          )}
          name="tag_id"
        />
        {errors.tag_id && <Text>{errors.tag_id.message}</Text>}

        <Controller
          control={control}
          rules={{
            //if value is not empty, then validate that does not consist of whitespaces
            validate: (value) =>
              !value ||
              !!value.trim() ||
              "Scrapie Tag Id should not consist of whitespaces",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyTextInput
              label={"Scrapie Tag ID"}
              placeholder={"Scrapie Tag Id"}
              activeOutlineColor={"#68c25a"}
              onChangeText={onChange}
              onBlur={(target) => onBlur(target.value)}
              value={value}
            />
          )}
          name="scrapieTagId"
        />
        {errors.scrapieTagId && <Text>{errors.scrapieTagId.message}</Text>}
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Sex is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              data={sex}
              label="Sex (required)"
              field="sex"
              onSelect={(value) => {
                value && setValue("sex", value);
                console.log(value);
              }}
              value={value}
            />
          )}
          name="sex"
        />
        {errors.sex && <Text>{errors.sex.message}</Text>}
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Date of Birth is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateTextInput
              label="Date of Birth (required)"
              field="dob"
              value={value}
              onChangeText={onChange}
            />
          )}
          name="dob"
        />
        {errors.dob && <Text>Date of birth is required.</Text>}

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateTextInput
              label="Date of Purchase"
              field="dop"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="dop"
        />

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateTextInput
              label="Date of Death"
              field="dop"
              onChangeText={onChange}
              value={value}
            />
          )}
          name="dod"
        />

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              data={males}
              label="Father"
              field="sire"
              onSelect={(item) => item && setValue("sire", item.id)}
              value={value}
            />
          )}
          name="sire"
        />

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              data={females}
              label={"Mother"}
              field={"dam"}
              onSelect={(item) => item && setValue("dam", item.id)}
              value={value}
            />
          )}
          name="dam"
        />

        <Controller
          control={control}
          rules={{
            maxLength: 100,
            required: { value: true, message: "Breed is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              data={breeds}
              label="Breed (required)"
              field="breed"
              onSelect={(item) => item && setValue("breed", item.id)}
              value={value}
            />
          )}
          name="breed"
        />
        {errors.breed && <Text>Breed is required.</Text>}

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              data={colors}
              label={"Color"}
              field={"color"}
              onSelect={(item) => item && setValue("color", item.id)}
              value={value}
            />
          )}
          name="color"
        />
        {errors.color && <Text>Color is required.</Text>}
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              data={markings}
              label={"Marking"}
              field={"marking"}
              onSelect={(id) => id && setValue("marking", id)}
              value={value}
            />
          )}
          name="marking"
        />

        <View style={styles.buttonContainer}>
          <Button
            color="#68c25a"
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 40,
    marginHorizontal: 40,
  },
});

export default AddForm;
