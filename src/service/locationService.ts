import { apiService } from "./apiService";

export type Option = {
  id: number;
  item: string;
};

export const locationService = {
  getLocations: () => apiService.get<Option[]>("/locations"),
};
