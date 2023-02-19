import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nutrition: {
    day: 1,
    month: "January"
  },
};

export const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {
    setNutrition(state, action) {
      console.log("[REDUX-UPDATE] Nutrition State: ", action.payload);
      state.nutrition = {
        ...action.payload,
      };
    },
  },
});

export const { setNutrition } = nutritionSlice.actions;
export const nutritionReducer = nutritionSlice.reducer;
