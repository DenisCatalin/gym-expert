import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schedule: {
    scheduleMode: false,
    exercises: [],
    day: 0,
    month: ""
  },
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setScheduleState(state, action) {
      console.log("[REDUX-UPDATE] Schedule state: ", action.payload);
      state.schedule = {
        ...action.payload,
      };
    },
  },
});

export const { setScheduleState } = scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;
