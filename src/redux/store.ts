import { configureStore } from "@reduxjs/toolkit";
import savedJobsReducer from "../redux/slices/savedJobsSlice";

export const store=configureStore({
    reducer:{                       //store state//
savedJobs:savedJobsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;