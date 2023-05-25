import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isConfirmationDialogVisible: {
    visible: false,
    id: "",
    title: "",
    field: "",
    name: "",
    tag_id: "",
  },
  isSnackbarVisible: { visible: false, error: false, message: "" },
  isFormDialogVisible: false,
  formData: {
    id: undefined,
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
    breed: null,
    color: null,
    marking: null,
    //weight_at_birth: null,
  },
  formTitle: "Add New Sheep",
  smallFormTitle: "",
  smallFormData: {},
  dbLocation: "",
  activeCardId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFormTitle: (state, { payload }) => {
      state.formTitle = payload;
    },
    setSmallFormTitle: (state, { payload }) => {
      state.smallFormTitle = payload;
    },
    setSmallFormData: (state, { payload }) => {
      const updatedData = { ...state.smallFormData, ...payload };
      return { ...state, smallFormData: updatedData };
    },
    resetSmallFormData: (state) => {
      state.smallFormData = initialState.smallFormData;
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
    setShowFormDialog: (state, { payload }) => {
      state.isFormDialogVisible = payload;
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
  setSmallFormData,
  setSmallFormTitle,
  resetSmallFormData,
} = uiSlice.actions;
export const uiSelector = (state) => state.ui;
export default uiSlice.reducer;
