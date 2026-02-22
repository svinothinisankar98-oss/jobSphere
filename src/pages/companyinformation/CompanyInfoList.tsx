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

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useState } from "react";

import { downloadExcel } from "../../utils/downloadExcel";
import { previewToPdf } from "../../utils/previewToPdf";

import { useNavigate } from "react-router-dom";

import MyButton from "../../Components/newui/MyButton";
import MyTextField from "../../Components/newui/MyTextField";

import PreviewCompanyInfoList from "./PreviewCompanyInfoList";
import { CompanyInfoRowList } from "../../pages/companyinformation/CompanyInfoRowList";

import { useCompanyInfoListHandlers } from "../../hooks/companyinformation/useCompanyInfoListHandlers";
import { useUI } from "../../context/UIProvider";

export default function CompanyInfoList() {
  const navigate = useNavigate();
  const { openCustom } = useUI();

  //usecompanyinformation handlers//

  const {
    rows,
    search,
    setSearch,
    expandAll,
    setExpandAll,
    handleDelete,
    
  } = useCompanyInfoListHandlers();

  //Export Menu State//

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [exportRow, setExportRow] = useState<any | null>(null);

  //Excel Export Logic//

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  //Excel Export//
  const handleExcelExport = async () => {
    // export search query//
    const filtered = rows.filter(
      (r) =>
        r.companyName.toLowerCase().includes(search.toLowerCase()) ||
        r.companyEmail.toLowerCase().includes(search.toLowerCase()),
    );

    //Create Excel//

    await downloadExcel(
      [
        {
          sheetName: "Companies",
          columns: [
            { key: "companyName", label: "Company Name" },
            { key: "companyEmail", label: "Company Email" },
            {
              key: "createdAt",
              label: "Created At",
              resolver: (row: any) =>
                new Date(row.createdAt).toLocaleDateString("en-GB"),
            },
          ],
          data: filtered, // table rows//
        },
      ],
      "Company_List", //file name//
    );
  };

  //Pdf export //
  const handlePDFExport = async () => {
    await previewToPdf("company-info-report", {
      fileName: "Company_List",
      orientation: "l",
      scale: 2,
      hideColumns: [0, 4],
    });
  };

  const handleParticularExport = async (row: any) => {
    setExportRow(row);
//Wait for React render//
    
    // await new Promise((resolve) => setTimeout(resolve, 150));

    await previewToPdf("single-company-export", {
      fileName: `Company_${row.companyName}`,
      orientation: "l",
      scale: 2,
      singlePage: true, 
    });

    setExportRow(null);
  };

  return (
    <Box>
      <Typography variant="h6" mb={3} textAlign="center" color="blue">
        Company & Branches List
      </Typography>
      <Box
        id="single-company-export"
      
      >
        {exportRow && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f7fa" }}>
                  <TableCell align="center">Company Name</TableCell>
                  <TableCell align="center">Company Email</TableCell>
                  <TableCell align="center">Created At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell align="center">{exportRow.companyName}</TableCell>
                  <TableCell align="center">{exportRow.companyEmail}</TableCell>
                  <TableCell align="center">
                    {new Date(exportRow.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
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

        {/* Dropdown button*/}
        <Box width={{ xs: "100%", sm: "auto" }}>
          <MyButton
            label="Export"
            variant="contained"
            color="secondary"
            icon={<ArrowDropDownIcon />}
            onClick={handleMenuClick}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          />

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                handleClose();
                handleExcelExport();
              }}
            >
              <ListItemIcon>
                <FileDownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export Excel</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleClose();
                handlePDFExport();
              }}
            >
              <ListItemIcon>
                <PictureAsPdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export PDF</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* ===== ADDED ID FOR PDF ===== */}
      <TableContainer
        id="company-info-report"
        component={Paper}
        sx={{ maxWidth: 1000, mx: "auto" }}
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
                <CompanyInfoRowList
                  key={row.id}
                  row={row}
                  expandAll={expandAll}
                  onEdit={() => navigate(`/company-information/edit/${row.id}`)}
                  onPreview={() =>
                    openCustom(
                      <PreviewCompanyInfoList row={row} />,
                      "Company Information",
                    )
                  }
                  onDelete={() => handleDelete(row.id!)}
                  handleExport={() => handleParticularExport(row)}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
