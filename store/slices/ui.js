import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loading: false,
  isConfirmationDialogVisible: {
    visible: false,
    id: "",
    title: "",
    field: "",
    name: "",
    tag_id: "",
  },
  isSnackbarVisible: { visible: false, error: false, message: "" },
  isMainFormDialogVisible: false,
  isSecondaryFormDialogVisible: false,
  formData: {
    sheep_id: undefined,
    picture: null,
    name: null,
    tag_id: "",
    scrapie_id: null,
    sex: null,
    dob: "",
    dop: "",
    dod: "",
    dos: "",
    sire: null,
    dam: null,
    breed_id: null,
    color_id: null,
    marking_id: null,
    //weight_at_birth: null,
  },
  formTitle: "Add New Sheep",
  secondaryFormData: {},
  secondaryFormType: "",
  dbLocation: "",
  activeCardId: null,
  meds: [],
  vaccines: [],
  males: [],
  contextMenuOpen: { 0: false, 1: false, 2: false },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFormTitle: (state, { payload }) => {
      state.formTitle = payload;
    },
    setSecondaryFormData: (state, { payload }) => {
      const updatedData = { ...state.secondaryFormData, ...payload };
      return { ...state, secondaryFormData: updatedData };
    },
    setShowSecondaryFormDialog: (state, { payload }) => {
      state.isSecondaryFormDialogVisible = payload;
    },
    resetSecondaryFormData: (state) => {
      state.secondaryFormData = initialState.secondaryFormData;
    },
    setShowConfirmationDialog: (state, { payload }) => {
      state.isConfirmationDialogVisible = payload;
    },
    setShowSnackbar: (state, { payload }) => {
      state.isSnackbarVisible = payload;
    },
    resetShowConfirmationDialog: (state) => {
      state.isConfirmationDialogVisible =
        initialState.isConfirmationDialogVisible;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
    setShowFormDialog: (state, { payload }) => {
      state.isMainFormDialogVisible = payload;
    },
    setFormData: (state, { payload }) => {
      const updatedData = { ...state.formData, ...payload };
      return { ...state, formData: updatedData };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
    },
    setActiveCardId: (state, { payload }) => {
      state.activeCardId = payload;
    },
    setVaccines: (state, { payload }) => {
      state.vaccines = payload;
    },
    setMeds: (state, { payload }) => {
      state.meds = payload;
    },
    addNewMed: (state, { payload }) => {
      state.meds = [...state.meds, payload];
    },
    addNewVax: (state, { payload }) => {
      state.vaccines = [...state.vaccines, payload];
    },
    setMales: (state, { payload }) => {
      state.males = payload;
    },
    setContextMenuOpen: (state, { payload }) => {
      const newContextMenuOpen = Object.keys(state.contextMenuOpen).reduce(
        (acc, key) => {
          return {
            ...acc,
            [`${key}`]:
              key.toString() === payload.toString()
                ? !state.contextMenuOpen[key]
                : false,
          };
        },
        {}
      );
      state.contextMenuOpen = newContextMenuOpen;
    },
  },
});

export const {
  setShowConfirmationDialog,
  setShowSnackbar,
  resetShowConfirmationDialog,
  setShowFormDialog,
  setFormData,
  setFormTitle,
  resetFormData,
  setActiveCardId,
  setSecondaryFormData,
  resetSecondaryFormData,
  setShowSecondaryFormDialog,
  setVaccines,
  setMeds,
  setMales,
  setContextMenuOpen,
  setLoading,
  resetLoading,
  addNewMed,
  addNewVax,
} = uiSlice.actions;
export const uiSelector = (state) => state.ui;
export default uiSlice.reducer;
