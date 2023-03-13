import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  colors: [],
  breeds: [],
  markings: [],
};

const attributeSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    setColors: (state, { payload }) => {
      state.colors = [...payload];
    },
    setMarkings: (state, { payload }) => {
      state.markings = [...payload];
    },
    setBreeds: (state, { payload }) => {
      state.breeds = [...payload];
    },
    addColor: (state, { payload }) => {
      state.colors = [...state.colors, payload];
    },
    addMarking: (state, { payload }) => {
      state.markings = [...state.markings, payload];
    },
    addBreed: (state, { payload }) => {
      state.breeds = [...state.breeds, payload];
    },
    deleteColor: (state, { payload }) => {
      state.colors = state.colors.filter((color) => color.id !== payload);
    },
    deleteMarking: (state, { payload }) => {
      state.markings = state.markings.filter(
        (marking) => marking.id !== payload
      );
    },
    deleteBreed: (state, { payload }) => {
      state.breeds = state.breeds.filter((breed) => breed.id !== payload);
    },
  },
});

export const {
  setColors,
  setBreeds,
  setMarkings,
  addColor,
  addBreed,
  addMarking,
  deleteBreed,
  deleteColor,
  deleteMarking,
} = attributeSlice.actions;
export const attributesDataSelector = (state) => state.attributes;
export default attributeSlice.reducer;
