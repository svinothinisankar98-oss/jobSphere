import {
  Box,
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
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";

import MyButton from "../../Components/newui/MyButton";
import MyTextField from "../../Components/newui/MyTextField";

import PreviewCompanyInfoList from "./PreviewCompanyInfoList";
import { CompanyInfoRowList } from "../../pages/companyinformation/CompanyInfoRowList";

import { useCompanyInfoListHandlers } from "../../hooks/companyinformation/useCompanyInfoListHandlers";
import {  useUI } from "../../context/UIProvider";





export default function CompanyInfoList() {
  const navigate = useNavigate();
  const {  openCustom  } = useUI();

  const {
    rows,
    search,
    setSearch,
    expandAll,
    setExpandAll,
    handleDelete,
  } = useCompanyInfoListHandlers();

  return (
    <Box>
      <Typography variant="h6" mb={3} textAlign="center" color="blue">
        Company & Branches List
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        maxWidth={1000}
        mx="auto"
        gap={1}
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <MyButton
          label="Add Company Info"
          icon={<AddIcon />}
          variant="contained"
          onClick={() => navigate("/company-information")}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        />

        <MyTextField
          size="small"
          placeholder="company name or email..."
          value={search}
          icon={<SearchIcon />}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 1000, mx: "auto" }}>
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
                  r.companyName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  r.companyEmail
                    .toLowerCase()
                    .includes(search.toLowerCase())
              )
              .map((row) => (
                <CompanyInfoRowList
                  key={row.id}
                  row={row}
                  expandAll={expandAll}
                  onEdit={() =>
                    navigate(`/company-information/edit/${row.id}`)
                  }
                  onPreview={() =>
                    openCustom(
                      <PreviewCompanyInfoList row={row} />,
                      "Company Information"
                    )
                  }
                  onDelete={() => handleDelete(row.id!)}

                    
                  
                />
                
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
