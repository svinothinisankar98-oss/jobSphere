import type { CompanyInformationType } from "../../types/companyInformation";
import { companyInformationService } from "../../service/companyInformation";

export const useCompanyInformation = () => {

  //create company information//

  const createCompanyInformation = async (data: CompanyInformationType) => {
    try {
      return await companyInformationService.createCompanyInformation(data);
    } catch (error) {
      console.error("Failed to create company information", error);
      throw error;
    }
  };

  //get all company informationlist//

  const getAllCompanyInformation = async (): Promise<CompanyInformationType[]> => {
    try {
      return await companyInformationService.getCompanyInformationList();
    } catch (error) {
      console.error("Failed to load company information", error);
      return [];
    }
  };

  //get company information by id//

  const getCompanyById = async (id: number): Promise<CompanyInformationType> => {
    try {
      return await companyInformationService.getCompanyById(id);
    } catch (error) {
      console.error("Failed to load company by id", error);
      throw error;
    }
  };

  //update the company information//

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


  // delete company information//
  
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
