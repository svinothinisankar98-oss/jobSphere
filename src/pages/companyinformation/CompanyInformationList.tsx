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

export default function CompanyInformationList() {
  const [rows, setRows] = React.useState<CompanyInformationType[]>([]);
  const { getAllCompanyInformation, deleteCompanyInformation } =
    useCompanyInformation();

  const navigate = useNavigate();

  React.useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setRows(await getAllCompanyInformation());
  };

  const handleDeleteCompany = async (id: number) => {
    if (!window.confirm("Delete this company and all related data?")) return;
    await deleteCompanyInformation(id);
    await loadCompanies();
  };

  return (
    <Box>
      <Typography variant="h6" mb={3} textAlign="center" color="blue">
        Company & Branches List
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2} marginRight={34}>
        <MyButton
          label="Add Company Information"
          icon={<AddIcon />}
          size="small"
          variant="contained"
          onClick={() => navigate("/company-information")}
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
            {rows.map((row) => (
              <CompanyRow
                key={row.id}
                row={row}
                onDelete={handleDeleteCompany}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/* ================= COMPANY ROW ================= */

function CompanyRow({
  row,
  onDelete,
}: {
  row: CompanyInformationType;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell width={40}>
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
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(row.id!)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              p={2}
              sx={{ backgroundColor: "#fafafa", borderRadius: 1 }}
            >
              {/* CONTACTS */}
              <Typography fontWeight={600} mb={1}>
                Company Contacts
              </Typography>

              <MyTable
                rows={row.contact}
                disablePagination
                columns={[
                  { id: "name", label: "Name" },
                  { id: "phone", label: "Phone" },
                  { id: "email", label: "Email" },
                ]}
              />

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
        <TableCell width={40}>
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
            <Box
              p={2}
              sx={{ backgroundColor: "#fafafa", borderRadius: 1 }}
            >
              <Typography fontWeight={600} mb={1}>
                Branch Contacts
              </Typography>

              <MyTable
                rows={branch.branchContact}
                disablePagination
                columns={[
                  { id: "name", label: "Name" },
                  { id: "phone", label: "Phone" },
                  { id: "email", label: "Email" },
                  { id: "Designation", label: "Designation" },
                ]}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
