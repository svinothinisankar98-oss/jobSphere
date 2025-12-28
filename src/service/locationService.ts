import { apiService } from "./apiService";

export const locationService = {
  getLocations: () => {
    try {
      return apiService.get("/locations");
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
