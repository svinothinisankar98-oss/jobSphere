import { configureStore } from "@reduxjs/toolkit";
import savedJobsReducer from "../redux/slices/savedJobsSlice";

export const store = configureStore({
  reducer: {
    savedJobs: savedJobsReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;
