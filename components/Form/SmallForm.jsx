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
} from "../../services/db";
import DateTextInput from "./DateTextInput";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Button,
  TextInput,
  useTheme,
} from "react-native-paper";
import MyDropdown from "./MyDropdown";
import MyTextInput from "./MyTextInput";
import { useDispatch, useSelector } from "react-redux";
import { setSheep, sheepDataSelector } from "../../store/slices/sheep";
import {
  attributesDataSelector,
  setBreeds,
  setColors,
  setMarkings,
} from "../../store/slices/attributes";
import MyImagePicker from "./ImagePicker";
import { setShowSnackbar, uiSelector } from "../../store/slices/ui";

const SmallForm = ({ isModalVisible, toggleModal }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();

  const { smallFormData, smallFormTitle } = useSelector(uiSelector);

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, trigger, setValue, reset, formState } =
    useForm({
      shouldUnregister: false,
      defaultValues: smallFormData,
    });
  const { isDirty, isValid, errors, defaultValues } = formState;

  useEffect(() => {
    reset(smallFormData);
  }, [reset, smallFormData]);

  useEffect(() => {
    trigger();
  }, [trigger, smallFormData]);

  const onSubmit = (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
    };
    console.log("formattedData", formattedData);
    editSheep(formattedData, formData.id)
      .then(() => {})
      .then(() => {
        return fetchSheep();
      })
      .then((res) => {
        console.log("!!!res", res);
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
  };

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
        <Text style={styles.formTitle}>{smallFormTitle}</Text>

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
              if (!formData.id && value !== "" && value !== null) {
                const duplicate = sheep.find(
                  (s) => s.name && s.name.toLowerCase() == value.toLowerCase()
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
            <MyTextInput
              error={errors.weight_at_birth ? true : false}
              label="Weight At Birth"
              field="weight_at_birth"
              onChangeText={onChange}
              value={value && value.toString()}
              right={<TextInput.Affix text="lb" />}
            />
          )}
          name="weight_at_birth"
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="text"
            color={theme.colors.primary}
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
            color={theme.colors.primary}
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

const makeStyles = (theme) =>
  StyleSheet.create({
    formContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 20,
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
      color: theme.colors.error,
      marginLeft: 10,
    },
  });

export default SmallForm;
