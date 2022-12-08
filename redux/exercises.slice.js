import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  update: false,
};

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    setExercisesState(state, action) {
      console.log("[REDUX-UPDATE] Exercises State: ", action.payload);
      state.exercises = action.payload;
    },
  },
});

export const { setExercisesState } = exercisesSlice.actions;
export const exercisesReducer = exercisesSlice.reducer;
