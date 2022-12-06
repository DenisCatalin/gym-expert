import { configureStore } from "@reduxjs/toolkit";
import { subscriptionReducer } from "./subscription.slice";
import { userReducer } from "./user.slice";
import { dialogReducer } from "./dialog.slice";
import { snackbarReducer } from "./snackbar.slice";
import { testimonialReducer } from "./testimonial.slice";
import { reviewReducer } from "./review.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
    dialog: dialogReducer,
    snackbar: snackbarReducer,
    testimonial: testimonialReducer,
    review: reviewReducer,
  },
});

export default store;
