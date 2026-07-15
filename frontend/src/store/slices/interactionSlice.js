import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createInteraction, getInteractions } from '../../services/api';

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchAll',
  async () => {
    const response = await getInteractions();
    return response.data;
  }
);

export const submitInteraction = createAsyncThunk(
  'interactions/submit',
  async (formData) => {
    const response = await createInteraction(formData);
    return response.data;
  }
);

const interactionSlice = createSlice({
  name: 'interactions',
  initialState: {
    list: [],
    loading: false,
    error: null,
    draft: null,
  },
  reducers: {
    setDraftInteraction: (state, action) => {
      state.draft = action.payload;
    },
    clearDraftInteraction: (state) => {
      state.draft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitInteraction.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitInteraction.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(submitInteraction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setDraftInteraction, clearDraftInteraction } = interactionSlice.actions;
export default interactionSlice.reducer;