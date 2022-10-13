import { configureStore } from "@reduxjs/toolkit";
import { subscriptionReducer } from "./subscription.slice";
import { userReducer } from "./user.slice";
import { dialogReducer } from "./dialog.slice";

const reducer = {
  user: userReducer,
  subscription: subscriptionReducer,
  dialog: dialogReducer,
};

const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
    dialog: dialogReducer,
  },
});

export default store;
