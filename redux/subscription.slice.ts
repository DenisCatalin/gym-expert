import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subscription: {
    price: 0,
    plan: "",
  },
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionState(state, action) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[REDUX-UPDATE] Subscription State: ", action.payload);
      }
      state.subscription = {
        ...action.payload,
      };
    },
  },
});

export const { setSubscriptionState } = subscriptionSlice.actions;
export const subscriptionReducer = subscriptionSlice.reducer;
