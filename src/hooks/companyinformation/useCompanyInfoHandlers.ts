import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { SubmitHandler } from "react-hook-form";

import type { CompanyInformationType } from "../../types/companyInformation";

import { useCompanyInformation } from "./useCompanyInformation";

import { useUI } from "../../context/UIProvider";


export function useCompanyInfoHandlers(reset: any) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const {
    createCompanyInformation,
    getCompanyById,
    updateCompanyInformation,
  } = useCompanyInformation();

  const { showSnackbar } = useUI();;

  //  Fetch company when editing
  React.useEffect(() => {
  if (!id) return;

  const loadCompany = async () => {
    try {
      const data = await getCompanyById(Number(id));
      if (data) {
        reset(data);
      }
    } catch (error: any) {
      showSnackbar(error.message,"error"); 
    }
  };

  loadCompany();
}, [id]);


  //  Submit logic
  const onSubmit: SubmitHandler<CompanyInformationType> = async (data) => {
    try {
      if (isEdit) {
        await updateCompanyInformation(Number(id), data);
        showSnackbar("Company updated successfully!", "success");
      } else {
        data.createdAt = new Date();
        await createCompanyInformation(data);
  
        showSnackbar("Company information saved successfully!", "success");
      }

      reset();
      navigate("/company-information-list");
    } catch (error) {
      console.error("Save failed", error);
      showSnackbar("Something went wrong", "error");
    }
  };

  return {
    isEdit,
    onSubmit,
  };
}
