import { apiService } from "./apiService";
import type { CompanyInformationType } from "../types/companyInformation";

type CreateCompanyInformationPayload = CompanyInformationType;

export const companyInformationService = {
  createCompanyInformation: async (data: CreateCompanyInformationPayload): Promise<CompanyInformationType> => {

    console.log(data, "company information service");

    const response = await apiService.post<CompanyInformationType>(
      "company-information",
      data,
      
    );

    return response;
  },

  getCompanyInformationList: async (): Promise<CompanyInformationType[]> => {
    const response = await apiService.get<CompanyInformationType[]>("company-information");
    return response;
  },

  deleteCompanyInformation: async (id: number): Promise<void> => {
    await apiService.delete(`company-information/${id}`);
  },
};
