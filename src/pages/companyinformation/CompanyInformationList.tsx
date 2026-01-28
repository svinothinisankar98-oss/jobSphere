import React from "react";
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
  TextField,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import MyTable from "../../Components/newui/MyTable";
import MyButton from "../../Components/newui/MyButton";
import type { CompanyInformationType } from "../../types/companyInformation";
import { useCompanyInformation } from "../../hooks/companyinformation/useCompanyInformation";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import MyDialog from "../../Components/newui/MyDialog";
import { useSnackbar } from "../../Components/newui/MySnackBar";
import MyTextField from "../../Components/newui/MyTextField";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function CompanyInformationList() {
  //usestate used//
  const [rows, setRows] = React.useState<CompanyInformationType[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  //navigate and usesnakbar//
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [search, setSearch] = React.useState("");

  const { getAllCompanyInformation, deleteCompanyInformation } =
    useCompanyInformation();

  // Loading companies//

  React.useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setRows(await getAllCompanyInformation());
  };

  //Delete flow//

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  //Confirm delete//

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCompanyInformation(deleteId);
      await loadCompanies();

      showSnackbar("Company deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to delete company", "error");
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };
  //Main company table layout//
  return (
    <Box>
      <Typography variant="h6" mb={3} textAlign="center" color="blue">
        Company & Branches List
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        maxWidth={1000}
        mx="auto"
      >
        <MyButton
          label=" Add Company "
          icon={<AddIcon />}
          size="small"
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
              <TableCell />
              <TableCell>Company Name</TableCell>
              <TableCell>Company Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .filter(
                (row) =>
                  row.companyName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  row.companyEmail.toLowerCase().includes(search.toLowerCase()),
              )
              .map((row) => (
                <CompanyRow
                  key={row.id}
                  row={row}
                  onDelete={handleDeleteClick}
                  onEdit={(id) =>
                    navigate(`/company-information/edit/${row.id}`)
                  }
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
    </Box>
  );
}

/* ================= COMPANY ROW ================= */

function CompanyRow({
  row,
  onDelete,
  onEdit,
}: {
  row: CompanyInformationType;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell
          width={40}
          sx={{
            borderRight: "2px solid #e0e0e0",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s ease",
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>

        <TableCell>{row.companyName}</TableCell>
        <TableCell>{row.companyEmail}</TableCell>
        <TableCell>{formatDate(row.createdAt)}</TableCell>

        <TableCell align="center">
          {/* Preview */}
          <IconButton color="info" onClick={() => setOpen(!open)}>
            <VisibilityIcon />
          </IconButton>

          {/* Edit */}
          <IconButton color="primary" onClick={() => onEdit(row.id!)}>
            <EditIcon />
          </IconButton>

          {/* Delete */}
          <IconButton color="error" onClick={() => onDelete(row.id!)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* <Box p={2} sx={{ backgroundColor: "#fafafa", borderRadius: 1 }}> */}
            <Box
              p={2}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: 1,
                pl: 7,
                ml: 1,
              }}
            >
              {/* CONTACTS */}
              <Typography fontWeight={600} mb={1}>
                Company Contacts
              </Typography>

              {row.contact.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 1 }}
                >
                  No contacts found
                </Typography>
              ) : (
                <MyTable
                  rows={row.contact}
                  disablePagination
                  columns={[
                    { id: "name", label: "Name" },
                    { id: "phone", label: "Phone" },
                    { id: "email", label: "Email" },
                  ]}
                />
              )}

              {/* BRANCHES */}
              <Typography fontWeight={600} mt={3} mb={1}>
                Company Branches
              </Typography>

              <Table size="small" sx={{ backgroundColor: "#fff" }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f2f5" }}>
                    <TableCell />
                    <TableCell>Branch Name</TableCell>
                    <TableCell>Branch Email</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.branches.map((branch, i) => (
                    <BranchRow key={i} branch={branch} />
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
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell
          width={40}
          sx={{
            borderRight: "2px solid #e0e0e0",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s ease",
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>

        <TableCell>{branch.branchName}</TableCell>
        <TableCell>{branch.branchEmail}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* <Box p={2} sx={{ backgroundColor: "#fafafa", borderRadius: 1 }}> */}

            <Box
              p={2}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: 1,
                pl: 5,
                ml: 1,
              }}
            >
              <Typography fontWeight={600} mb={1}>
                Branch Contacts
              </Typography>

              {branch.branchContact.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 1 }}
                >
                  No branch contacts found
                </Typography>
              ) : (
                <MyTable
                  rows={branch.branchContact?.map((d: any) => ({
                    name: d?.name || "-",
                    phone: d?.phone || "-",
                    email: d?.email || "-",
                    designation: d?.designation || "-",
                  }))}
                  disablePagination
                  columns={[
                    { id: "name", label: "Name" },
                    { id: "phone", label: "Phone" },
                    { id: "email", label: "Email" },
                    { id: "designation", label: "Designation" },
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
