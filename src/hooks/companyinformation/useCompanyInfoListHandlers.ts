import { useEffect, useState } from "react";
import type { CompanyInformationType } from "../../types/companyInformation";
import { useCompanyInformation } from "./useCompanyInformation";
import { useSnackbar } from "../../Components/newui/MySnackBar";

export function useCompanyInfoListHandlers() {
  const [rows, setRows] = useState<CompanyInformationType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [previewRow, setPreviewRow] =
    useState<CompanyInformationType | null>(null);
  const [expandAll, setExpandAll] = useState(false);

  const { getAllCompanyInformation, deleteCompanyInformation } =
    useCompanyInformation();

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setRows(await getAllCompanyInformation());
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCompanyInformation(deleteId);
      await loadCompanies();
      showSnackbar("Company deleted successfully!", "success");
    } catch {
      showSnackbar("Failed to delete company", "error");
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  return {
    rows,
    search,
    setSearch,
    previewRow,
    setPreviewRow,
    openDialog,
    setOpenDialog,
    expandAll,
    setExpandAll,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
