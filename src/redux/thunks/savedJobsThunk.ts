import { createAsyncThunk } from "@reduxjs/toolkit";
import { savedJobService } from "../../service/savedJobService";

export const fetchSavedJobs = createAsyncThunk(                  //fetch login user id//
  "savedJobs/fetch",
  async (userId: string) => {
    return await savedJobService.getSavedJobs(userId);
  }
);

export const toggleSavedJobThunk = createAsyncThunk(           //login userid and savedjobs id//
  "savedJobs/toggle",
  async (
    { userId, jobId }: { userId: string; jobId: number }
  ) => {
    await savedJobService.toggleSavedJob(userId, jobId);
    return jobId;
  }
);
