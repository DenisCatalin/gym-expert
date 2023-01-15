import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snackbar: {
    open: false,
    content: "",
  },
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackbar(state, action) {
      console.log("[REDUX-UPDATE] Snackbar State: ", action.payload);
      state.snackbar = {
        ...action.payload,
      };
    },
  },
});

export const { setSnackbar } = snackbarSlice.actions;
export const snackbarReducer = snackbarSlice.reducer;
