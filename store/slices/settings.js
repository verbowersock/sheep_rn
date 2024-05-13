import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  unitFormat: "lb",
  dateFormat: "mdy",
  monthFormat: "number",
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setUnit: (state, { payload }) => {
      state.unitFormat = payload;
    },
    setDate: (state, { payload }) => {
      state.dateFormat = payload;
    },
    setMonth: (state, { payload }) => {
      state.monthFormat = payload;
    },
  },
});

export const { setUnit, setDate, setMonth } = settingSlice.actions;
export const settingsSelector = (state) => state.settings;
export default settingSlice.reducer;
