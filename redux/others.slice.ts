import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  other: {
    popup: false,
    loadingUpload: false,
    userFetched: false,
    loading: false,
  },
};

export const otherSlice = createSlice({
  name: "other",
  initialState,
  reducers: {
    setOtherState(state, action) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[REDUX-UPDATE] Other state: ", action.payload);
      }  
      state.other = {
        ...action.payload,
      };
    },
  },
});

export const { setOtherState } = otherSlice.actions;
export const otherReducer = otherSlice.reducer;
