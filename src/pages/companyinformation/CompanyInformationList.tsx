
import { useState,useEffect } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

import MyTable from "../../Components/newui/MyTable";
import MyButton from "../../Components/newui/MyButton";
import MyDialog from "../../Components/newui/MyDialog";
import MyTextField from "../../Components/newui/MyTextField";
import { useSnackbar } from "../../Components/newui/MySnackBar";

import type { CompanyInformationType } from "../../types/companyInformation";
import { useCompanyInformation } from "../../hooks/companyinformation/useCompanyInformation";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";


import PreviewCompanyInfoList from "../companyinformation/PreviewCompanyInfoList";
export default function CompanyInformationList() {

  //use state set//

  const [rows, setRows] = useState<CompanyInformationType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [previewRow, setPreviewRow] =
    useState<CompanyInformationType | null>(null);

  const [expandAll, setExpandAll] = useState(false);

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { getAllCompanyInformation, deleteCompanyInformation } =
    useCompanyInformation();

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

  return (
    <Box>
      <Typography variant="h6" mb={3} textAlign="center" color="blue">
        Company & Branches List
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        maxWidth={1000}
        mx="auto"
      >
        <MyButton
          label="Add Company Info"
          icon={<AddIcon />}
          variant="contained"
          onClick={() => navigate("/company-information")}
        />

        <MyTextField
          size="small"
          placeholder="company name or email..."
          value={search}
          icon={<SearchIcon />}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
              <TableCell width={40}>
                <IconButton
                  size="small"
                  onClick={() => setExpandAll((p) => !p)}
                  sx={{
                    transform: expandAll ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.2s ease",
                  }}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </TableCell>

              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Company Email</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .filter(
                (r) =>
                  r.companyName.toLowerCase().includes(search.toLowerCase()) ||
                  r.companyEmail.toLowerCase().includes(search.toLowerCase()),
              )
              .map((row) => (
                <CompanyRow
                  key={row.id}
                  row={row}
                  expandAll={expandAll}
                  onDelete={handleDeleteClick}
                  onEdit={() => navigate(`/company-information/edit/${row.id}`)}
                  onPreview={() => setPreviewRow(row)}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <MyDialog
        open={openDialog}
        title="Delete Company"
        message="Are you sure you want to delete this company and all related data?"
        confirmText="Delete"
        confirmColor="error"
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
      />

      <MyDialog
        open={!!previewRow}
        title="Company Information"
        fullWidth
        onClose={() => setPreviewRow(null)}
      >
        {previewRow && <PreviewCompanyInfoList row={previewRow} />}
      </MyDialog>
    </Box>
  );
}

/* ================= COMPANY ROW ================= */

function CompanyRow({
  row,
  expandAll,
  onDelete,
  onEdit,
  onPreview,
}: {
  row: CompanyInformationType;
  expandAll: boolean;
  onDelete: (id: number) => void;
  onEdit: () => void;
  onPreview: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  return (
    <>
      <TableRow hover>
        <TableCell width={40} sx={{ borderRight: "2px solid #e0e0e0" }}>
          <IconButton
            size="small"
            onClick={() => setOpen((o) => !o)}
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s ease",
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>

        <TableCell>{row.companyName}</TableCell>
        <TableCell align="left">{row.companyEmail}</TableCell>
        <TableCell align="center">{formatDate(row.createdAt)}</TableCell>

        <TableCell align="center">
          <IconButton color="info" onClick={onPreview}>
            <VisibilityIcon />
          </IconButton>

          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(row.id!)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box p={2} sx={{ backgroundColor: "#fafafa", pl: 7, ml: 1 }}>
              <Typography fontWeight={600} mb={1}>
                Company Contacts
              </Typography>

              {row.contact.length === 0 ? (
                <Typography color="text.secondary">
                  No contacts found
                </Typography>
              ) : (
                <MyTable
                  rows={row.contact}
                  disablePagination
                  columns={[
                    { id: "name", label: "Name", align: "left" },
                    { id: "phone", label: "Phone", align: "center" },
                    { id: "email", label: "Email", align: "left" },
                  ]}
                />
              )}

              <Typography fontWeight={600} mt={3} mb={1}>
                Company Branches
              </Typography>

              <Table size="small">
                <TableBody>
                  {row.branches.map((b, i) => (
                    <BranchRow key={i} branch={b} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* ================= BRANCH ROW ================= */

function BranchRow({ branch }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell width={40}>
          <IconButton size="small" onClick={() => setOpen((o) => !o)}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>

        <TableCell>{branch.branchName}</TableCell>
        <TableCell>{branch.branchEmail}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0 }}>
          <Collapse in={open} unmountOnExit>
            <Box p={2} sx={{ backgroundColor: "#fafafa", pl: 5 }}>
              <Typography fontWeight={600} mb={1}>
                Branch Contacts
              </Typography>

              {branch.branchContact.length === 0 ? (
                <Typography color="text.secondary">
                  No branch contacts found
                </Typography>
              ) : (
                <MyTable
                  rows={branch.branchContact.map((d: any) => ({
                    name: d?.name || "-",
                    phone: d?.phone || "-",
                    email: d?.email || "-",
                    designation: d?.designation || "-",
                  }))}
                  disablePagination
                  columns={[
                    { id: "name", label: "Name", align: "left" },
                    { id: "phone", label: "Phone", align: "center" },
                    { id: "email", label: "Email", align: "left" },
                    {
                      id: "designation",
                      label: "Designation",
                      align: "center",
                    },
                  ]}
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
