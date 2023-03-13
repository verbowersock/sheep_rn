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
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
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
      // Return a new state object with the updated user object
      return { ...state, formData: updatedData };
    },
  },
});

export const {
  setShowConfirmationDialog,
  setShowSnackbar,
  resetShowConfirmationDialog,
  setShowFormDialog,
  setFormData,
} = uiSlice.actions;
export const uiSelector = (state) => state.ui;
export default uiSlice.reducer;
