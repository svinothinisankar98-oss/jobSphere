// import ErrorFallback from "../ErrorFallback";
import { locationService } from "../service/locationService";

export const getAllLocations = async () => {
  try {
    const getLocations = await locationService.getLocations();
    return getLocations;
  } catch (error: any) {
    
    throw (error);
  }
};
