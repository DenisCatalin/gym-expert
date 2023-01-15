import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  review: false,
};

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviewState(state, action) {
      console.log("[REDUX-UPDATE] Review State: ", action.payload);
      state.review = action.payload;
    },
  },
});

export const { setReviewState } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
