import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  other: {
    popup: false,
    loadingUpload: false,
    userFetched: false,
  },
};

export const otherSlice = createSlice({
  name: "other",
  initialState,
  reducers: {
    setOtherState(state, action) {
      console.log("[REDUX-UPDATE] Other state: ", action.payload);
      state.other = {
        ...action.payload,
      };
    },
  },
});

export const { setOtherState } = otherSlice.actions;
export const otherReducer = otherSlice.reducer;
