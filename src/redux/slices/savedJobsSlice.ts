import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSavedJobs,
  toggleSavedJobThunk,
} from "../thunks/savedJobsThunk";

/* ---------- STATE TYPE ---------- */

interface SavedJobsState {
  ids: number[];
  loading: boolean;
  error: string | null;
}

/* ---------- INITIAL STATE ---------- */

const initialState: SavedJobsState = {
  ids: [],
  loading: false,
  error: null,
};

/* ---------- SLICE ---------- */

const savedJobsSlice = createSlice({
  name: "savedJobs",
  initialState,
  reducers: {
    // optional local setter
    setSavedJobs: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* ---- FETCH SAVED JOBS ---- */
    builder
      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch saved jobs";
      });

    /* ---- TOGGLE SAVED JOB ---- */
    builder.addCase(toggleSavedJobThunk.fulfilled, (state, action) => {
      const jobId = action.payload;

      if (state.ids.includes(jobId)) {
        state.ids = state.ids.filter((id) => id !== jobId);
      } else {
        state.ids.push(jobId);
      }
    });
  },
});

/* ---------- EXPORTS ---------- */

export const { setSavedJobs } = savedJobsSlice.actions;
export default savedJobsSlice.reducer;

