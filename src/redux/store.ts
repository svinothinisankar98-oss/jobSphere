import { configureStore } from "@reduxjs/toolkit";
import savedJobsReducer from "../redux/slices/savedJobsSlice";

export const store = configureStore({
  reducer: {
    savedJobs: savedJobsReducer,
  },
});

/* ✅ RootState */
export type RootState = ReturnType<typeof store.getState>;

/* ✅ ADD THIS */
export type AppDispatch = typeof store.dispatch;
