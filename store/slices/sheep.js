import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  sheep: [],
  sheepChildren: [],
  sheepMeds: [],
  sheepVax: [],
  sheepWeights: [],
};

const sheepSlice = createSlice({
  name: "sheep",
  initialState,
  reducers: {
    setSheep: (state, { payload }) => {
      state.sheep = [...payload];
    },
    addSheep: (state, { payload }) => {
      state.sheep = [...state.sheep, payload];
    },
    deleteSheep: (state, { payload }) => {
      const newList = state.sheep.filter((sheep) => sheep.sheep_id !== payload);
      return {
        ...state,
        sheep: newList,
      };
    },
    updateSheep: (state, { payload }) => {
      //    console.log("payload", payload);
      state.sheep = state.sheep.map((sheep) =>
        sheep.sheep_id === payload.sheep_id ? { ...sheep, ...payload } : sheep
      );
    },
    setSheepChildren: (state, { payload }) => {
      //add children from payload
      state.sheepChildren = [...payload];
    },
    setSheepMeds: (state, { payload }) => {
      //add meds from payload
      state.sheepMeds = [...payload];
    },
    setSheepVax: (state, { payload }) => {
      //add vax from payload
      state.sheepVax = [...payload];
    },
    setSheepWeights: (state, { payload }) => {
      //add weights from payload
      state.sheepWeights = [...payload];
    },
    updateSheepMeds: (state, { payload }) => {
      //add a medicine if it doesn't exist in the list otherwise remove it
      state.sheepMeds = state.sheepMeds.filter((med) => med.id !== payload);
    },
    updateSheepVax: (state, { payload }) => {
      //add a vax if it doesn't exist in the list otherwise remove it
      state.sheepVax = state.sheepVax.filter((vax) => vax.id !== payload);
    },
    updateSheepWeight: (state, { payload }) => {
      //remove a weight from the list
      state.sheepWeights = state.sheepWeights.filter(
        (weight) => weight.id !== payload
      );
    },
  },
});

export const {
  setSheep,
  addSheep,
  deleteSheep,
  setSheepChildren,
  setSheepMeds,
  setSheepVax,
  setSheepWeights,
  updateSheep,
  updateSheepMeds,
  updateSheepVax,
  updateSheepWeight,
} = sheepSlice.actions;
export const sheepDataSelector = (state) => state.sheep;
export default sheepSlice.reducer;
