import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SavedJobsState {
  ids: number[];
}

const initialState: SavedJobsState = {
  ids: [],
};

const savedJobsSlice= createSlice({

    name: "savedJobs",
    initialState,
    reducers: {
          setSavedJobs:(state,action:PayloadAction<number[]>)=>{
            state.ids = action.payload;
          },
          toggleSavedJob: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter(j => j !== id);
      } else {
        state.ids.push(id);
      }
    },
}
})
export const { setSavedJobs, toggleSavedJob } = savedJobsSlice.actions;            //action creators//
export default savedJobsSlice.reducer;                                             //this reducer function go to store//

