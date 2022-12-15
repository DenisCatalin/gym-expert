import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    displayName: null,
    profilePic: null,
    cropArea: null,
    admin: 0,
    testimonial: 0,
    email: "",
    magicToken: "",
    paidPlan: null,
    planExpireDate: 0,
    issuer: "",
    memberSince: "",
    subscribedSince: 0,
    secretKeyword: null,
    logged: false,
    profileAvatar: "",
    cropped: false,
    favourites: [],
    needsUpdate: true,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState(state, action) {
      console.log("[REDUX-UPDATE] User state: ", action.payload);
      state.user = {
        ...action.payload,
      };
    },
  },
});

export const { setUserState } = userSlice.actions;
export const userReducer = userSlice.reducer;
