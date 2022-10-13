import { configureStore } from "@reduxjs/toolkit";
import { subscriptionReducer } from "./subscription.slice";
import { userReducer } from "./user.slice";
import { dialogReducer } from "./dialog.slice";
import { snackbarReducer } from "./snackbar.slice";

const reducer = {
  user: userReducer,
  subscription: subscriptionReducer,
  dialog: dialogReducer,
  snackbar: snackbarReducer,
};

const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
    dialog: dialogReducer,
    snackbar: snackbarReducer,
  },
});

export default store;
