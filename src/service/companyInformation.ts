import { apiService } from "./apiService";
import type { CompanyInformationType } from "../types/companyInformation";

type CreateCompanyInformationPayload = CompanyInformationType;

export const companyInformationService = {
  createCompanyInformation: async (
    data: CreateCompanyInformationPayload
  ): Promise<CompanyInformationType> => {
    const response = await apiService.post<CompanyInformationType>(
      "company-information",
      data
    );
    return response;
  },

  getCompanyInformationList: async (): Promise<CompanyInformationType[]> => {
    const response = await apiService.get<CompanyInformationType[]>(
      "company-information"
    );
    return response;
  },

  getCompanyById: async (id: number): Promise<CompanyInformationType> => {
    const response = await apiService.get<CompanyInformationType>(
      `company-information/${id}`
    );
    return response;
  },

  updateCompanyInformation: async (
    id: number,
    data: CompanyInformationType
  ): Promise<CompanyInformationType> => {
    const response = await apiService.put<CompanyInformationType>(
      `company-information/${id}`,
      data
    );
    return response;
  },

  deleteCompanyInformation: async (id: number): Promise<void> => {
    await apiService.delete(`company-information/${id}`);
  },
};
