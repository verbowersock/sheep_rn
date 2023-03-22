import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import {
  addSheep,
  editSheep,
  fetchBreeds,
  fetchColors,
  fetchFemales,
  fetchMales,
  fetchMarkings,
  fetchSheep,
} from "../services/db";
import DateTextInput from "./DateTextInput";
import { useForm, Controller } from "react-hook-form";
import { ActivityIndicator, Button, Portal } from "react-native-paper";
import MyDropdown from "./MyDropdown";
import MyTextInput from "./MyTextInput";
import { useDispatch, useSelector } from "react-redux";
import { setSheep, sheepDataSelector } from "../store/slices/sheep";
import {
  attributesDataSelector,
  setBreeds,
  setColors,
  setMarkings,
} from "../store/slices/attributes";
import MyImagePicker from "./ImagePicker";
import { setShowSnackbar, uiSelector } from "../store/slices/ui";

const AddForm = ({ isModalVisible, toggleModal }) => {
  const dispatch = useDispatch();
  const { sheep } = useSelector(sheepDataSelector);
  const sex = [
    { id: "m", title: "Male" },
    { id: "f", title: "Female" },
    { id: "w", title: "Weather" },
  ];
  const { colors, markings, breeds } = useSelector(attributesDataSelector);
  //console.log(colors);

  const { formData, formTitle } = useSelector(uiSelector);
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDataToApp() {
      try {
        let colors = await fetchColors();
        // console.log(colors);
        colors = colors.map(({ color_name, id }) => ({
          title: color_name,
          id: id.toString(),
        }));
        dispatch(setColors(colors));
        let markings = await fetchMarkings();
        markings = markings.map(({ marking_name, id }) => ({
          title: marking_name,
          id: id.toString(),
        }));
        dispatch(setMarkings(markings));
        let breeds = await fetchBreeds();
        breeds = breeds.map(({ breed_name, id }) => ({
          title: breed_name,
          id: id.toString(),
        }));
        dispatch(setBreeds(breeds));
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

  const { control, handleSubmit, trigger, setValue, reset, formState } =
    useForm({
      //mode: "onChange",
      //mode: "onTouched",
      shouldUnregister: false,
      /*  defaultValues: {
        picture: null,
        name: "",
        tag_id: "",
        scrapieTagId: "",
        sex: {},
        dob: "",
        dop: "",
        dod: "",
        sire: {},
        dam: {},
        breed: {},
        color: {},
        marking: {},
      },
    });*/
      defaultValues: formData,
    });
  const { isDirty, isValid, errors, defaultValues } = formState;

  useEffect(() => {
    reset(formData);
  }, [reset, formData]);

  useEffect(() => {
    console.log("trigger validation");
    trigger();
  }, [trigger]);

  const onSubmit = (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      sex: data.sex,
      sire: data.sire,
      dam: data.dam,
      breed: data.breed,
      color: data.color,
      marking: data.marking,
    };
    // console.log("formattedData", formattedData);
    if (formData.id) {
      editSheep(formattedData, formData.id)
        .then(() => {
          console.log("Sheep data edited successfully");
        })
        .then(() => {
          return fetchSheep();
        })
        .then((res) => {
          dispatch(setSheep(res));
          setLoading(false);
          toggleModal();
          dispatch(
            setShowSnackbar({
              visible: true,
              error: false,
              message: `Sheep edited successfully`,
            })
          );
          reset();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      addSheep(formattedData)
        .then(() => {
          console.log("Sheep data added successfully");
          dispatch(
            setShowSnackbar({
              visible: true,
              error: false,
              message: `Sheep added successfully`,
            })
          );
        })
        .then(() => {
          return fetchSheep();
        })
        .then((res) => {
          dispatch(setSheep(res));
          setLoading(false);
          toggleModal();
          reset();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  if (!dataLoaded) {
    return <ActivityIndicator color="green" />;
  }

  return (
    <Modal
      isVisible={isModalVisible}
      onRequestClose={() => {
        toggleModal();
        reset(defaultValues);
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.formContainer}
      >
        <Text style={styles.formTitle}>{formTitle}</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyImagePicker
              value={value}
              onChange={(value) => {
                //  console.log(value);
                setValue(value && setValue("picture", value));
              }}
            />
          )}
          name="picture"
        />
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
            //check for duplicates
            validate: (value) => {
              if (!formData.id) {
                const duplicate = sheep.find(
                  (sheep) => sheep.name.toLowerCase() == value.toLowerCase()
                );
                if (duplicate) {
                  return "Name already exists";
                }
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyTextInput
              error={errors.name ? true : false}
              label={"Name"}
              placeholder={"Name"}
              onBlur={(target) => onBlur(target.value)}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          rules={{
            validate: (value) =>
              !!value.trim() || "Tag Id should not consist of whitespaces",
            required: {
              value: true,
              message: "Tag Id is required",
            },
            //check for duplicates
            validate: (value) => {
              if (!formData.id) {
                const duplicate = sheep.find(
                  (sheep) => sheep.tag_id.toLowerCase() == value.toLowerCase()
                );
                if (duplicate) {
                  return "Tag Id must be unique";
                }
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyTextInput
              error={errors.tag_id ? true : false}
              label={"Tag ID (required)"}
              placeholder={"Tag Id"}
              onChangeText={onChange}
              onBlur={(target) => onBlur(target.value)}
              value={value}
            />
          )}
          name="tag_id"
        />
        {errors.tag_id && (
          <Text style={styles.errorText}>{errors.tag_id.message}</Text>
        )}

        <Controller
          control={control}
          rules={{
            //if value is not empty, then validate that does not consist of whitespaces
            validate: (value) =>
              !value ||
              !!value.trim() ||
              "Scrapie Tag Id should not consist of whitespaces",
            //check for duplicates
            validate: (value) => {
              if (!formData.id) {
                const duplicate = sheep.find((sheep) => {
                  if (sheep.scrapie_id) {
                    sheep.scrapie_id.toLowerCase() === value.toLowerCase();
                  }
                });
                if (duplicate) {
                  return "Scrapie Tag Id must be unique";
                }
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyTextInput
              error={errors.scrapie_id ? true : false}
              label={"Scrapie Tag ID"}
              placeholder={"Scrapie Tag Id"}
              activeOutlineColor={"#68c25a"}
              onChangeText={onChange}
              onBlur={(target) => onBlur(target.value)}
              value={value}
            />
          )}
          name="scrapie_id"
        />
        {errors.scrapie_id && (
          <Text style={styles.errorText}>{errors.scrapie_id.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            validate: (value) => {
              if (JSON.stringify(value) === JSON.stringify({})) {
                return "Sex is required";
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              error={errors.sex ? true : false}
              data={sex}
              label="Sex (required)"
              field="sex"
              searchable={false}
              onChange={(value) => {
                setValue(
                  value && setValue("sex", value, { shouldValidate: true })
                );
              }}
              value={value}
            />
          )}
          name="sex"
        />
        {errors.sex && (
          <Text style={styles.errorText}>{errors.sex.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Date of Birth is required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateTextInput
              error={errors.dob ? true : false}
              label="Date of Birth (required)"
              field="dob"
              value={value}
              onChangeText={onChange}
            />
          )}
          name="dob"
        />
        {errors.dob && (
          <Text style={styles.errorText}>Date of birth is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DateTextInput
              error={errors.dop ? true : false}
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
              error={errors.dod ? true : false}
              label="Date of Death"
              field="dod"
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
              error={errors.sire ? true : false}
              data={males.filter((sheep) => sheep.id !== formData.id)}
              label="Father"
              field="sire"
              onChange={(id) => id && setValue("sire", id)}
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
              error={errors.dam ? true : false}
              data={females.filter((sheep) => sheep.id !== formData.id)}
              label={"Mother"}
              field="dam"
              onChange={(id) => id && setValue("dam", id)}
              value={value}
            />
          )}
          name="dam"
        />

        <Controller
          control={control}
          rules={{
            validate: (value) => {
              if (JSON.stringify(value) === JSON.stringify({})) {
                return "Breed is required";
              }
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              error={errors.breed ? true : false}
              data={breeds}
              label="Breed (required)"
              field="breed"
              onChange={(value) => {
                setValue(
                  value && setValue("breed", value, { shouldValidate: true })
                );
              }}
              value={value}
            />
          )}
          name="breed"
        />
        {errors.breed && (
          <Text style={styles.errorText}>{errors.breed.message}</Text>
        )}

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              error={errors.color ? true : false}
              data={colors}
              label={"Color"}
              field="color"
              onChange={(id) => id && setValue("color", id)}
              value={value}
            />
          )}
          name="color"
        />
        {errors.color && (
          <Text style={styles.errorText}>Color is required.</Text>
        )}
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MyDropdown
              error={errors.marking ? true : false}
              data={markings}
              label={"Marking"}
              field={"marking"}
              onChange={(id) => id && setValue("marking", id)}
              value={value}
            />
          )}
          name="marking"
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="text"
            color="#68c25a"
            style={{ width: "40%" }}
            onPress={() => {
              toggleModal();
              reset(defaultValues);
            }}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            color="#68c25a"
            dark
            style={{ width: "40%" }}
            mode="contained"
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
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
    paddingBottom: 10,
  },
  buttonContainer: {
    marginVertical: 40,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
  },
  errorText: {
    color: "#ba1a1a",
    marginLeft: 10,
  },
});

export default AddForm;
