import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView } from "react-native";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import {
  addMedication,
  addSheepWeight,
  addVaccination,
  editSheep,
  fetchAllMedications,
  fetchAllVaccines,
  fetchAllSheep,
  fetchSheepMeds,
  fetchSheepVax,
  fetchSheepWeight,
  updateDateLastBred,
  fetchSheep,
  fetchMales,
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

import {
  setMales,
  setMeds,
  setShowSnackbar,
  setVaccines,
  uiSelector,
} from "../../store/slices/ui";
import { forms } from "../../Constants";
import { onChange } from "react-native-reanimated";
import {
  setSheep,
  setSheepMeds,
  setSheepVax,
  setSheepWeights,
  updateSheep,
} from "../../store/slices/sheep";
import { dateSaveFormatter, validateDate } from "../utils/SharedFunctions";
import { settingsSelector } from "../../store/slices/settings";

const SecondaryForm = ({ isModalVisible, toggleModal }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useDispatch();
  const { meds, vaccines, males } = useSelector(uiSelector);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { MEDS, VAX, WEIGHT, BREEDING, DEATH, SALE, MISC } = forms;
  const { secondaryFormData } = useSelector(uiSelector);
  const { title, type, errorText } = secondaryFormData.type;
  const { defaultData } = secondaryFormData;
  const { dateFormat } = useSelector(settingsSelector);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDataToForm() {
      try {
        if (type === MEDS.type) {
          let meds = await fetchAllMedications();
          meds = meds.map(({ entry, id }) => ({
            title: entry,
            id: id.toString(),
          }));

          //sort the array by title alphabetically
          meds.sort((a, b) => (a.title > b.title ? 1 : -1));
          dispatch(setMeds(meds));
        } else if (type === VAX.type) {
          let vaccines = await fetchAllVaccines();
          vaccines = vaccines.map(({ entry, id }) => ({
            title: entry,
            id: id.toString(),
          }));
          vaccines.sort((a, b) => (a.title > b.title ? 1 : -1));
          dispatch(setVaccines(vaccines));
        } else if (type === BREEDING.type) {
          let males = await fetchMales();
          males = males.map(({ sheep_id, name, tag_id }) => ({
            title: tag_id ? `${tag_id} - ${name}` : tag_id,
            id: sheep_id,
          }));
          dispatch(setMales(males));
        }
      } catch (error) {
        console.log("!!!error", error);
      }
    }
    loadDataToForm().then(() => setDataLoaded(true));
  }, []);

  const { control, handleSubmit, trigger, setValue, reset, formState } =
    useForm({
      shouldUnregister: false,
      defaultValues: secondaryFormData,
      mode: "onChange",
      reValidateMode: "onChange",
    });
  const { isDirty, isValid, errors, defaultValues } = formState;

  useEffect(() => {
    reset(secondaryFormData);
  }, [reset, secondaryFormData]);

  useEffect(() => {
    trigger();
  }, [trigger, secondaryFormData]);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      value: data.medication || data.vaccination,
      date: dateSaveFormatter(data.date, dateFormat),
    };

    setLoading(true);
    switch (type) {
      case MEDS.type:
        addMedication(formattedData)
          .then(() => {
            return fetchSheepMeds(data.sheep_id);
          })
          .then((meds) => {
            return dispatch(setSheepMeds(meds));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case VAX.type:
        addVaccination(formattedData)
          .then(() => {
            return fetchSheepVax(formattedData.sheep_id);
          })
          .then((vax) => {
            return dispatch(setSheepVax(vax));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      //   promise = addVaccination(data);
      case WEIGHT.type:
        // promise = addSheepWeight(data);
        addSheepWeight(formattedData)
          .then(() => {
            return fetchSheepWeight(formattedData.sheep_id);
          })
          .then((weight) => {
            return dispatch(setSheepWeights(weight));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case BREEDING.type:
        editSheep(
          { date_last_bred: data.date, last_bred_to: data.last_bred_to },
          data.sheep_id
        )
          .then(() => {
            return fetchSheep(data.sheep_id);
          })
          .then((sheep) => {
            return dispatch(updateSheep(sheep));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case SALE.type:
        editSheep({ dos: formattedData.date }, formattedData.sheep_id)
          .then(() => {
            return fetchSheep(data.sheep_id);
          })
          .then((sheep) => {
            return dispatch(updateSheep(sheep));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      case DEATH.type:
        editSheep({ dod: formattedData.date }, formattedData.sheep_id)
          .then(() => {
            return fetchSheep(data.sheep_id);
          })
          .then((sheep) => {
            return dispatch(updateSheep(sheep));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
      case MISC.type:
        editSheep(
          {
            notes: formattedData.notes,
            last_location: formattedData.last_location,
          },
          data.sheep_id
        )
          .then(() => {
            return fetchSheep(data.sheep_id);
          })
          .then((sheep) => {
            return dispatch(updateSheep(sheep));
          })
          .then(() => {
            setLoading(false);
            toggleModal();
            dispatch(
              setShowSnackbar({
                visible: true,
                error: false,
                message: `Sheep records updated successfully`,
              })
            );
            reset();
          })
          .catch((error) => {
            console.error(error);
          });
        break;
    }
  };

  if (!dataLoaded) {
    return <ActivityIndicator color={theme.colors.secondary} />;
  }
  return (
    <Modal
      isVisible={isModalVisible}
      onRequestClose={() => {
        toggleModal();
        reset(defaultValues);
      }}
    >
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{title}</Text>
        {type !== MISC.type && (
          <Controller
            control={control}
            //validate that the date is in format MM/DD/YYYY, and that it is not empty
            rules={{
              validate: (value) => validateDate(value, dateFormat),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DateTextInput
                dateFormat={dateFormat}
                accessible={true}
                accessibilityLabel="Date"
                error={errors.date ? true : false}
                label="Date"
                field="date"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                }}
              />
            )}
            name="date"
          />
        )}
        {errors.date && (
          <Text style={styles.errorText}>{errors.date.message}</Text>
        )}
        {type === BREEDING.type && (
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <MyDropdown
                  accessible={true}
                  accessibilityLabel="Select a Ram dropdown"
                  data={males}
                  label="Select Ram"
                  field="last_bred_to"
                  onChange={(sheep_id) => {
                    sheep_id && setValue("last_bred_to", sheep_id);
                    trigger();
                  }}
                  value={value}
                />
              )}
              name="last_bred_to"
            />
          </View>
        )}

        {type === MEDS.type && (
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{
                required: "Medication name is required",
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MyDropdown
                  accessible={true}
                  accessibilityLabel="Medication Dropdown"
                  error={errors.value ? true : false}
                  data={meds}
                  label="Medication"
                  field="medication"
                  onChange={(id) => {
                    id && setValue("medication", id);
                    trigger();
                  }}
                  value={value}
                />
              )}
              name="medication"
            />

            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MyTextInput
                  error={errors.dosage}
                  accessible={true}
                  accessibilityLabel="Medication Dosage input field"
                  label="Dosage"
                  field="dosage"
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="dosage"
            />
            {errors.dosage && (
              <Text style={styles.errorText}>
                Please shorten the dosage text to 100 characters
              </Text>
            )}
          </View>
        )}
        {type === VAX.type && (
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{
                required: "Vaccination name is required",
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MyDropdown
                  accessible={true}
                  accessibilityLabel="Vaccine Dropdown"
                  error={errors.vaccine ? true : false}
                  data={vaccines}
                  label="Vaccine"
                  field="vaccination"
                  onChange={(id) => {
                    id && setValue("vaccination", id);
                    trigger();
                  }}
                  value={value}
                />
              )}
              name="vaccination"
            />
          </View>
        )}
        {type === WEIGHT.type && (
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{
                required: "Weight is required",
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MyTextInput
                  error={errors.weight_at_birth ? true : false}
                  accessible={true}
                  accessibilityLabel="Weight Input"
                  label="Weight"
                  field="value"
                  onChangeText={onChange}
                  value={value && value.toString()}
                  right={<TextInput.Affix text="lb" />}
                />
              )}
              name="value"
            />
          </View>
        )}

        {type === MISC.type && (
          <KeyboardAvoidingView style={{ width: "100%" }}>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                rules={{
                  maxLength: 15,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    error={errors.last_location}
                    accessible={true}
                    accessibilityLabel="Last Location input field"
                    label="Last Location"
                    field="last_location"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="last_location"
                defaultValue={defaultData.last_location}
              />
              {errors.last_location && (
                <Text style={styles.errorText}>
                  Please shorten the location name to 15 characters
                </Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                rules={{
                  maxLength: 1000,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MyTextInput
                    multiline
                    numberOfLines={4}
                    error={errors.notes}
                    accessible={true}
                    accessibilityLabel="Notes Input Field"
                    label="Notes"
                    field="notes"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="notes"
                defaultValue={defaultData.notes}
              />
              {errors.notes && (
                <Text style={styles.errorText}>
                  Please shorten the note text to 1000 characters
                </Text>
              )}
            </View>
          </KeyboardAvoidingView>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            style={{ width: "43%" }}
            onPress={() => {
              toggleModal();
              reset(defaultValues);
            }}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            buttonColor={theme.colors.primary}
            style={{ width: "43%" }}
            mode="contained"
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    formContainer: {
      alignItems: "center",
      backgroundColor: "white",
      marginVertical: 10,
      marginHorizontal: 20,
      width: "90%",
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
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
      width: "100%",
      justifyContent: "space-between",
    },
    errorText: {
      color: theme.colors.error,
      marginLeft: 10,
    },
    inputContainer: {
      width: "100%",
    },
  });

export default SecondaryForm;
