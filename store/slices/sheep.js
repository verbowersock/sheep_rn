import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  sheep: [],
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
      state.sheep = state.sheep.map((sheep) =>
        sheep.id === payload.id ? payload : sheep
      );
    },
  },
});

export const { setSheep, addSheep, deleteSheep } = sheepSlice.actions;
export const sheepDataSelector = (state) => state.sheep;
export default sheepSlice.reducer;
