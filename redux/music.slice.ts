import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  music: {
    show: false,
    playerlist: [],
    playing: false,
  },
};

export const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setMusic(state, action) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[REDUX-UPDATE] Music State: ", action.payload);
      }  
      state.music = {
        ...action.payload,
      };
    },
  },
});

export const { setMusic } = musicSlice.actions;
export const musicReducer = musicSlice.reducer;