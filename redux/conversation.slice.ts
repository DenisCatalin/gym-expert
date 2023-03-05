import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversation: {
    conversationID: 0,
    conversationMessages: [],
    conversations: [],
  },
};

export const conversationSlice = createSlice({
  name: "other",
  initialState,
  reducers: {
    setConversationState(state, action) {
      console.log("[REDUX-UPDATE] Conversation state: ", action.payload);
      state.conversation = {
        ...action.payload,
      };
    },
  },
});

export const { setConversationState } = conversationSlice.actions;
export const conversationReducer = conversationSlice.reducer;
