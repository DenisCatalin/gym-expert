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
        secretKeyworkd: null,
        logged: false,
        profileAvatar: "",
        cropped: false,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setDisplayNameRedux(state, action) {
            state.displayName = action.payload;
        }
    }
});

export const { setDisplayNameRedux } = userSlice.actions;
export const userReducer = userSlice.reducer;
