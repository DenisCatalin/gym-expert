import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dialog: false,
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialog(state, action) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[REDUX-UPDATE] Dialog State: ", action.payload);
      }
      state.dialog = action.payload;
    },
  },
});

export const { setDialog } = dialogSlice.actions;
export const dialogReducer = dialogSlice.reducer;
