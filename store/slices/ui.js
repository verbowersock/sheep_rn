import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isConfirmationDialogVisible: {
    visible: false,
    id: "",
    title: "",
    field: "",
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
  },
  formTitle: "Add New Sheep",
  dbLocation: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFormTitle: (state, { payload }) => {
      state.formTitle = payload;
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
      console.log("!!!updatedData", updatedData);
      return { ...state, formData: updatedData };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
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
} = uiSlice.actions;
export const uiSelector = (state) => state.ui;
export default uiSlice.reducer;
