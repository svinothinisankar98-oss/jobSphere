// import ErrorFallback from "../ErrorFallback";
import { useErrorBoundary } from "react-error-boundary";
import { locationService } from "../service/locationService";
import { handleError } from "../utils/handleError";

export const useLocationService = () => {
  const { showBoundary } = useErrorBoundary();

  const getAllLocations = async () => {
    try {
      const locations = await locationService.getLocations();
      return locations;
    } catch (error: any) {
      handleError(error, {
        showBoundary,
        setLocalError: error,
      });
      throw error;
    }
  };

  return { getAllLocations };
};
