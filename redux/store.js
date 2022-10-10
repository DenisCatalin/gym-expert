import { configureStore } from "@reduxjs/toolkit";
import { subscriptionReducer } from "./subscription.slice";
import { userReducer } from "./user.slice";

const reducer = {
  user: userReducer,
  subscription: subscriptionReducer,
};

const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
  },
});

export default store;
