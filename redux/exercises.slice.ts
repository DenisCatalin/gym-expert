import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exercises: {
    update: false,
    exercises: false,
    filter: "all"
  }
};

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    setExercisesState(state, action) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[REDUX-UPDATE] Exercises State: ", action.payload);
      }  
      state.exercises = {
        ...action.payload
      };
    },
  },
});

export const { setExercisesState } = exercisesSlice.actions;
export const exercisesReducer = exercisesSlice.reducer;
