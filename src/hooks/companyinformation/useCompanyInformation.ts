import type { CompanyInformationType } from "../../types/companyInformation";
import { companyInformationService } from "../../service/companyInformation";

export const useCompanyInformation = () => {

  const createCompanyInformation = async (data: CompanyInformationType) => {
    try {
      return await companyInformationService.createCompanyInformation(data);
    } catch (error) {
      console.error("Failed to create company information", error);
      throw error;
    }
  };

  const getAllCompanyInformation = async (): Promise<CompanyInformationType[]> => {
    try {
      return await companyInformationService.getCompanyInformationList();
    } catch (error) {
      console.error("Failed to load company information", error);
      return [];
    }
  };

  const getCompanyById = async (id: number): Promise<CompanyInformationType> => {
    try {
      return await companyInformationService.getCompanyById(id);
    } catch (error) {
      console.error("Failed to load company by id", error);
      throw error;
    }
  };

  const updateCompanyInformation = async (
    id: number,
    data: CompanyInformationType
  ) => {
    try {
      return await companyInformationService.updateCompanyInformation(id, data);
    } catch (error) {
      console.error("Failed to update company information", error);
      throw error;
    }
  };

  const deleteCompanyInformation = async (id: number) => {
    try {
      await companyInformationService.deleteCompanyInformation(id);
    } catch (error) {
      console.error("Delete failed", error);
      throw error;
    }
  };

  return {
    createCompanyInformation,
    getAllCompanyInformation,
    getCompanyById,
    updateCompanyInformation,
    deleteCompanyInformation,
  };
};
