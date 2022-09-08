import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayName: "",
  profilePic: "",
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
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDisplayNameRedux(state, action) {
      state.displayName = action.payload;
    },
    setProfilePicRedux(state, action) {
      state.profilePic = action.payload;
    },
    setCropAreaRedux(state, action) {
      state.cropArea = action.payload;
    },
    setAdminRedux(state, action) {
      state.admin = action.payload;
    },
    setTestimonialRedux(state, action) {
      state.testimonial = action.payload;
    },
    setEmailRedux(state, action) {
      state.email = action.payload;
    },
    setPaidPlanRedux(state, action) {
      state.paidPlan = action.payload;
    },
    setPlanExpireDateRedux(state, action) {
      state.planExpireDate = action.payload;
    },
    setMagicTokenRedux(state, action) {
      state.magicToken = action.payload;
    },
    setIssuerRedux(state, action) {
      state.issuer = action.payload;
    },
    setMemberSinceRedux(state, action) {
      state.memberSince = action.payload;
    },
    setSubscribedSinceRedux(state, action) {
      state.subscribedSince = action.payload;
    },
    setSecretKeywordRedux(state, action) {
      state.secretKeyword = action.payload;
    },
    setLoggedRedux(state, action) {
      state.logged = action.payload;
    },
    setProfileAvatarRedux(state, action) {
      state.profileAvatar = action.payload;
    },
    setFavouritesRedux(state, action) {
      state.favourites = action.payload;
    },
  },
});

export const {
  setDisplayNameRedux,
  setProfilePicRedux,
  setCropAreaRedux,
  setAdminRedux,
  setTestimonialRedux,
  setEmailRedux,
  setPaidPlanRedux,
  setPlanExpireDateRedux,
  setMagicTokenRedux,
  setIssuerRedux,
  setMemberSinceRedux,
  setSubscribedSinceRedux,
  setSecretKeywordRedux,
  setLoggedRedux,
  setProfileAvatarRedux,
  setFavouritesRedux,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
