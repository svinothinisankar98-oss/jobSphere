import axios from "axios";
import { apiService } from "./apiService";

const ApiURl = `http://localhost:4000`;

export const locationService = {
  getLocations: async (): Promise<any> => {
    return axios.get(`${ApiURl}/locations`);
  },
};

export const jobSeekersService = {
  getJobSeekers: async (id: any): Promise<any> => {
    try {
      return apiService.get(`jobSeekers`, id);
    } catch (error: any) {
      throw new Error(error);
    }
  },

  // createjobseeker//
  
  createJobSeeker: async (data: any): Promise<any> => {
    try {
      return apiService.post("jobSeekers", data);
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
