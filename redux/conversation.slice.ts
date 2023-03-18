import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversation: {
    conversationsForUser: [],
  },
};

export const conversationSlice = createSlice({
  name: "other",
  initialState,
  reducers: {
    setConversationState(state, action) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("[REDUX-UPDATE] Conversation state: ", action.payload);
      }
      state.conversation = {
        ...action.payload,
      };
    },
  },
});

export const { setConversationState } = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;
