import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testimonial: false,
};

export const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    setTestimonialState(state, action) {
      console.log("[REDUX-UPDATE] Testimonial State: ", action.payload);
      state.testimonial = action.payload;
    },
  },
});

export const { setTestimonialState } = testimonialSlice.actions;
export const testimonialReducer = testimonialSlice.reducer;
