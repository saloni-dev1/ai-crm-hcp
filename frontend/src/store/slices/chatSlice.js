import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendChatMessage } from '../../services/api';
import { setDraftInteraction } from './interactionSlice';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message, thunkAPI) => {
    const response = await sendChatMessage(message);

    if (response.data.extracted_data) {
      thunkAPI.dispatch(setDraftInteraction(response.data.extracted_data));
    }

    return response.data.response;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [
      {
        role: 'assistant',
        text: 'Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, shared brochure") or ask for help.',
      },
    ],
    loading: false,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', text: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'assistant', text: action.payload });
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
        state.messages.push({ role: 'assistant', text: 'Sorry, something went wrong. Please try again.' });
      });
  },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;