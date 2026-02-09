import type { CompanyInformationType } from "../../types/companyInformation";
import { companyInformationService } from "../../service/companyInformation";
import { handleError } from "../../utils/handleError";
import { useErrorBoundary } from "react-error-boundary";

export const useCompanyInformation = () => {

  
const { showBoundary } = useErrorBoundary();
  //create company information//

  const createCompanyInformation = async (data: CompanyInformationType) => {
    try {
      return await companyInformationService.createCompanyInformation(data);
    } catch (error: any) {
    handleError(error, {
      showBoundary,
    });
    throw error; 
  }
  };

  //get all company informationlist//

  
const getAllCompanyInformation = async (): Promise<CompanyInformationType[]> => {
  try {
    return await companyInformationService.getCompanyInformationList();
  } catch (error: any) {
    handleError(error, {
      showBoundary,
    });
    throw error; 
  }
};

  //get company information by id//

  const getCompanyById = async (
  id: number
): Promise<CompanyInformationType | null> => {
  try {
    return await companyInformationService.getCompanyById(id);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      " Failed to load company details";

    // return controlled failure
    return Promise.reject(new Error(message));
  }
};


  //update the company information//

  const updateCompanyInformation = async (
    id: number,
    data: CompanyInformationType
  ) => {
    try {
      return await companyInformationService.updateCompanyInformation(id, data);
    } catch (error: any) {
    handleError(error, {
      showBoundary,
    });
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
