import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user.slice";

const reducer = {
  user: userReducer,
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
