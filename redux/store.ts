import { configureStore } from "@reduxjs/toolkit";
import { subscriptionReducer } from "./subscription.slice";
import { userReducer } from "./user.slice";
import { dialogReducer } from "./dialog.slice";
import { snackbarReducer } from "./snackbar.slice";
import { testimonialReducer } from "./testimonial.slice";
import { reviewReducer } from "./review.slice";
import { exercisesReducer } from "./exercises.slice";
import { otherReducer } from "./others.slice";
import { scheduleReducer } from "./schedule.slice";
import { nutritionReducer } from "./nutrition.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
    dialog: dialogReducer,
    snackbar: snackbarReducer,
    testimonial: testimonialReducer,
    review: reviewReducer,
    exercises: exercisesReducer,
    other: otherReducer,
    schedule: scheduleReducer,
    nutrition: nutritionReducer
  },
});

export default store;
