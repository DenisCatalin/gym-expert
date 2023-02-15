import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schedule: {
    scheduleMode: false,
    exercises: [],
    day: 0,
    month: "",
    name: "",
  },
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    removeItem: (state, action) => {
      const index = action.payload;
      state.schedule.exercises = state.schedule.exercises.filter((_:any, i) => i !== index);
      console.log("[REDUX-UPDATE] Schedule state: ", state.schedule.exercises);
    },
    setScheduleState(state, action) {
      console.log("[REDUX-UPDATE] Schedule state: ", action.payload);
      state.schedule = {
        ...action.payload,
      };
    },
  },
});

export const { setScheduleState, removeItem  } = scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;
