import { useEffect, useState } from "react";
import type { CompanyInformationType } from "../../types/companyInformation";
import { useCompanyInformation } from "./useCompanyInformation";
import { useUI } from "../../context/UIProvider";

export function useCompanyInfoListHandlers() {
  const [rows, setRows] = useState<CompanyInformationType[]>([]);
  const [search, setSearch] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  const { getAllCompanyInformation, deleteCompanyInformation } =
    useCompanyInformation();

  const { openConfirm, showSnackbar } = useUI();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setRows(await getAllCompanyInformation());
  };

  /* ===== DELETE FLOW WITH CONFIRM ===== */

  const handleDelete = (id: number) => {
    openConfirm({
      title: "Delete Company",
      message:
        "Are you sure you want to delete this company and all related data?",
      confirmText: "Delete",
      confirmColor: "error",
      onConfirm: async () => {
        try {
          await deleteCompanyInformation(id);
          await loadCompanies();
          showSnackbar("Company deleted successfully!", "success");
        } catch {
          showSnackbar("Failed to delete company", "error");
        }
      },
    });
  };

  return {
    rows,
    search,
    setSearch,
    expandAll,
    setExpandAll,
    handleDelete,
  };
}
