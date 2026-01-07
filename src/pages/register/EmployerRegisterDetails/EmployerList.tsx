import { useEffect, useState } from "react";
import {
  Paper,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { employerRegisterType } from "../../../types/employerRegister";
import { userService } from "../../../service/userService";

import MyButton from "../../../Components/newui/MyButton";
import CommonTextField from "../../../Components/ui/CommonTextField";
import CommonDropdown from "../../../Components/ui/CommonDropdown";
import MyTable, { type Column } from "../../../Components/newui/MyTable";

import {
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
} from "../../../constants/DropDownOptions";

import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";
import { MySnackBar, useSnackbar } from "../../../Components/newui/MySnackBar";

const EmployerList = () => {
  // ================= STATE =================
  const [data, setData] = useState<employerRegisterType[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const navigate = useNavigate();

  // ================= CLEAR =================
  const handleClear = () => {
    setCompanyName("");
    setRecruiterName("");
    setRecruiterEmail("");
    setRecruiterPhone("");
    setIndustry("");
    setCompanySize("");
    setData([]);
  };
  const handleDelete = async (row: any) => {
    row.isActive = false;
    row.deletedAt = new Date();
    const id = row?.id;
   await userService.updateUser(id,row);
     showSnackbar("Employee deleted sucessfully", "success");
  };

  const handleEdit = (row: employerRegisterType) => {
  navigate("/employer-register", {
    state: { editData: row },
  });
};

  // ================= SEARCH =================
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await userService.getRecruiterDetails();

      const filtered = response.filter((d: employerRegisterType) => {
        return (
          (!companyName ||
            d.companyName?.toLowerCase().includes(companyName.toLowerCase())) &&
          (!recruiterName ||
            d.recruiterName
              ?.toLowerCase()
              .includes(recruiterName.toLowerCase())) &&
          (!recruiterEmail ||
            d.recruiterEmail
              ?.toLowerCase()
              .includes(recruiterEmail.toLowerCase())) &&
          (!recruiterPhone ||
            d.recruiterPhone
              ?.toLowerCase()
              .includes(recruiterPhone.toLowerCase())) &&
          (!industry || d.industry === industry) &&
          (!companySize || d.companySize === companySize)
        );
      });

      const withSerial = filtered.map((d: any, index: number) => ({
        ...d,
        serialNo: index + 1,
      }));

      setData(withSerial);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  // ================= TABLE COLUMNS (FIXED LOCATION) =================
  const columns: Column<employerRegisterType>[] = [
    { id: "serialNo", label: "SerialNo", align: "center" },
    { id: "companyName", label: "Company Name", align: "left" },
    { id: "companySize", label: "Company Size", align: "center" },
    { id: "industry", label: "Industry", align: "left" },
    { id: "recruiterName", label: "Recruiter Name", align: "left" },
    { id: "recruiterEmail", label: "Recruiter Email", align: "left" },
    { id: "recruiterPhone", label: "Recruiter Phone", align: "left" },
    {
      id: "createdAt",
      label: "Created At",
      align: "center",
      render: (row) => formatDate(row.createdAt),
      // row.createdAt && !isNaN(new Date(row.createdAt).getTime())
      //   ? new Date(row.createdAt).toLocaleDateString()
      //   : "-",
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      render: (row: employerRegisterType) => (
        <Chip
          label={row.isActive ? "Active" : "Inactive"}
          color={row.isActive ? "success" : "error"}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",

      render: (row) => (
        <>
          <IconButton
            size="small"
            color="primary"
             onClick={() => handleEdit(row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          {
            row?.isActive&&(
              <IconButton size="small" color="error">
            <DeleteIcon fontSize="small" onClick={() => handleDelete(row)} />
          </IconButton>

            )
          }
          
        </>
      ),
    },
  ];

  // ================= JSX =================
  return (
    <Box mt={4}>
      <Paper sx={{ maxWidth: 1200, mx: "auto", p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <MyButton
            label="Add Employee"
            variant="contained"
            onClick={() => navigate("/employer-register")}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              name={""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Recruiter Name"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              name={""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Recruiter Email"
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              name={""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonDropdown
              value={industry}
              options={INDUSTRY_OPTIONS}
              placeholder="Industry"
              onChange={(e) => setIndustry(e.target.value)}
              name={""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonDropdown
              value={companySize}
              options={COMPANY_SIZE_OPTIONS}
              placeholder="Company Size"
              onChange={(e) => setCompanySize(e.target.value)}
              name={""}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Recruiter Phone"
              value={recruiterPhone}
              onChange={(e) => setRecruiterPhone(e.target.value)}
              name={""}
            />
          </Grid>

          <Grid
            size={{ xs: 12 }}
            display="flex"
            gap={2}
            justifyContent="center"
          >
            <MyButton
              label="Search"
              variant="contained"
              icon={<SearchIcon />}
              onClick={handleSearch}
              sx={{
                minWidth: 160,
                height: 45,
                fontWeight: 600,
              }}
            />
            <MyButton
              label="Reset"
              variant="contained"
              color="error"
              sx={{
                minWidth: 160,
                height: 45,
                fontWeight: 600,
              }}
              onClick={handleClear}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && data.length === 0 && (
        <Typography align="center" mt={3}>
          No records found
        </Typography>
      )}

      {!loading && data.length > 0 && (
        <MyTable
          rows={data}
          columns={columns}
          tableSize="small"
          containerSx={{ maxWidth: 1300, mx: "auto", mt: 2 }}
        />
      )}
    </Box>
  );
};

export default EmployerList;
