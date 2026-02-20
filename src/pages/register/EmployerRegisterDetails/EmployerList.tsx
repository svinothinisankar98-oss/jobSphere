import { useEffect, useState } from "react";
import {
  Paper,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Tooltip,
  
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import type { employerRegisterType } from "../../../types/employerRegister";

import MyButton from "../../../Components/newui/MyButton";
import CommonTextField from "../../../Components/ui/CommonTextField";
import CommonDropdown from "../../../Components/ui/CommonDropdown";
import MyTable, { type Column } from "../../../Components/newui/MyTable";

import {
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
} from "../../../constants/EmployerRegister";

import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";

import { useUserService } from "../../../hooks/useuserService";
// import MyDialog from "../../../Components/newui/MyDialog";
import MyTabs from "../../../Components/newui/MyTab";

import { useEmployerListHandlers } from "../../../hooks/employer/useEmployerListHandlers";

import { Switch, FormControlLabel } from "@mui/material";

import { useUI } from "../../../context/UIProvider";
import { useErrorBoundary } from "react-error-boundary";
import { buildSummarySheet, downloadExcel, mapToExcelColumns } from "../../../utils/downloadExcel";

import FileDownloadIcon from "@mui/icons-material/FileDownload";


const EmployerList = () => {
  //state variables//

  const [data, setData] = useState<employerRegisterType[]>([]);

  const { showBoundary } = useErrorBoundary();

  //search filters//
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false); //api loading//
  const { showSnackbar } = useUI();

  const { getRecruiterDetails, updateUser } = useUserService(showBoundary);

  //tabs//
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  //count for active and inactive//

  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const [dense, setDense] = useState(false);

  //actions hooks useemployerlisthandler//
  const {
    handleDeleteClick: handleBulkDelete,
    handleActivateClick: handleBulkActivate,
  } = useEmployerListHandlers(updateUser, showSnackbar);

  // clear//
  const handleClear = async () => {
    setCompanyName("");
    setRecruiterName("");
    setRecruiterEmail("");
    setRecruiterPhone("");
    setIndustry("");
    setCompanySize("");
    handleSearch();
    // loadDefaultData();
  };

  //Edit Logic//

  const handleEdit = (row: employerRegisterType) => {
    navigate(`/employer-register/edit/${row.id}`);
  };

  //  Search logic//

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await getRecruiterDetails();

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

      let tabFiltered = [] as any;

      const active = filtered.filter((d) => d.isActive === true);
      const inActive = filtered.filter((d) => d.isActive === false);
      setActiveCount(active.length);
      setInactiveCount(inActive.length);

      if (activeTab === 0) {
        tabFiltered = filtered; // ALL
      } else if (activeTab === 1) {
        tabFiltered = filtered.filter((d) => d.isActive === true);
      } else if (activeTab === 2) {
        tabFiltered = filtered.filter((d) => d.isActive === false);
      } else if (activeTab === 3) {
        tabFiltered = filtered;
      }

      setData(tabFiltered);
    } catch (err) {
      console.error(err);
      setData([]);
      //  showSnackbar("Failed to load employer list", "error");
    } finally {
      setLoading(false);
    }
  };

  //tab changes data reloads//

  useEffect(() => {
    try {
      handleSearch();
    } catch (error) {
      console.log("errpr");
    }
    console.log("enrt useEffect");
  }, [
    companyName,
    recruiterName,
    recruiterEmail,
    recruiterPhone,
    industry,
    companySize,
    activeTab,
  ]);

  //Table Columns//

  const columns: Column<employerRegisterType>[] = [
    {
      id: "companyName",
      label: "Company Name",
      align: "left",
      group: "Company Details",
    },
    {
      id: "companySize",
      label: "Company Size",
      align: "center",
      group: "Company Details",
    },
    {
      id: "industry",
      label: "Industry",
      align: "left",
      group: "Company Details",
    },
    {
      id: "recruiterName",
      label: "Recruiter Name",
      align: "left",
      group: "Recruiter Details",
    },
    {
      id: "recruiterEmail",
      label: "Recruiter Email",
      align: "left",
      group: "Recruiter Details",
    },
    {
      id: "recruiterPhone",
      label: "Recruiter Phone",
      align: "center",
      sortable: false,
      group: "Recruiter Details",
    },
    {
      id: "createdAt",
      label: "Created At",
      align: "center",
      sortable: false,
      group: "Status",

      render: (row: employerRegisterType) => formatDate(row.createdAt),

      //  Excel export formatter
      excelValue: (row: employerRegisterType) => {
        const value = row.createdAt;

        if (!value) return "-";

        return new Date(value).toLocaleDateString("en-GB");
      },
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: false,
      group: "Status",

      render: (row: employerRegisterType) => (
        <Chip
          label={row.isActive ? "Active" : "Inactive"}
          color={row.isActive ? "success" : "error"}
          size="small"
          variant="filled"
        />
      ),
       //Excel//
      excelValue: (row: employerRegisterType) =>
        row.isActive ? "Active" : "Inactive",
    },
   
    {
      id: "actions",
      label: "Actions",
      align: "center",
      sortable: false,
      group: "Status",

      render: (row: employerRegisterType) => (
        <Box display="flex" justifyContent="center" gap={1}>
          {/* ACTIVE → Edit + Delete */}
          {row.isActive && (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEdit(row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => handleBulkDelete([row], handleSearch)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}

          {/* INACTIVE → Activate */}
          {!row.isActive && (
            <Tooltip title="Activate">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleBulkActivate([row], handleSearch)}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];


  const summarySheet = buildSummarySheet(
  "Summary",
  data,
  [
    { label: "Total Employers" }, // no filter = total
    { label: "Active Employers", filter: r => r.isActive === true },
    { label: "Inactive Employers", filter: r => r.isActive === false },
  ]
);
  //handle export//

  const handleExport = async () => {
    const excelColumns = mapToExcelColumns(columns);

    const sheets = [

      summarySheet,
      {
        sheetName: "All Employers",
        columns: excelColumns,
        data: data,
      },
      {
        sheetName: "Active Employers",
        columns: excelColumns,
        data: data.filter((x) => x.isActive === true),
          excludeColumns: ["status"]
      },
      {
        sheetName: "Inactive Employers",
        columns: excelColumns,
        data: data.filter((x) => x?.isActive === false),
         excludeColumns: ["status"]
      },
    ];
    
    await downloadExcel(sheets, "Employer_Report");
   
  };

  // JSX //
  return (
    <Box mt={2}>
      <Paper sx={{ maxWidth: 1300, mx: "auto", p: 3, overflowX: "auto" }}>
        <Box display="flex" justifyContent="flex-end" mb={3} borderRadius={5}>
          <MyButton
            label="Add Employee"
            variant="contained"
            icon={<PersonAddIcon />}
            onClick={() => navigate("/employer-register")}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              name="Company Name"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Recruiter Name"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              name="Recruiter Name"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Recruiter Email"
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              name="Recruiter Email"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonDropdown
              value={industry}
              options={INDUSTRY_OPTIONS}
              placeholder="Industry"
              onChange={(e) => setIndustry(e.target.value)}
              name="Industry"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonDropdown
              value={companySize}
              options={COMPANY_SIZE_OPTIONS}
              placeholder="Company Size"
              onChange={(e) => setCompanySize(e.target.value)}
              name="Company Size"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CommonTextField
              placeholder="Recruiter Phone"
              value={recruiterPhone}
              onChange={(e) => setRecruiterPhone(e.target.value)}
              name="Recruiter Phone"
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
            />
            <MyButton
              label="Reset"
              variant="contained"
              color="error"
              icon={<RestartAltIcon />}
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

     

      <Box sx={{ maxWidth: 1300, mx: "auto", mt: 4 }}>
        <Box display="flex" justifyContent="flex-end" mb={0.5}>         
          <MyButton
            variant="contained"
            color="success"
            label="Export Excel"
            icon={<FileDownloadIcon />}
            onClick={handleExport}
          />
        </Box>

        <MyTabs
          activeTab={activeTab}
          onTabChange={(index) => setActiveTab(index)}
          tabs={[
            {
              tabName: `All Employers (${activeCount + inactiveCount})`,
              tabContent: (
                <>
                  {!loading && data.length === 0 && (
                    <Typography align="center" mt={3}>
                      No records found
                    </Typography>
                  )}

                  {!loading && data.length > 0 && (
                    <MyTable
                      containerSx={{ maxWidth: 1300, mx: "auto" }}
                      rows={data}
                      columns={columns}
                      enableSelection={false}
                      getRowId={(row) => row.id!}
                      // enableColumnGrouping={true}
                      enableColumnGrouping={activeTab === 0}
                      groupBy="companySize"
                      tableSize={dense ? "small" : "medium"}
                    />
                  )}
                </>
              ),
            },

            {
              tabName: `Active Employer (${activeCount})`,
              tabContent: (
                <>
                  {!loading && data.length === 0 && (
                    <Typography align="center" mt={3}>
                      No records found
                    </Typography>
                  )}

                  {!loading && data.length > 0 && (
                    <MyTable
                      containerSx={{ maxWidth: 1300, mx: "auto" }}
                      rows={data}
                      columns={columns}
                      enableSelection
                      getRowId={(row) => row.id!}
                      mode="active"
                      tableSize={dense ? "small" : "medium"}
                      onDeleteSelected={(ids) => {
                        const rowsToDelete = data.filter(
                          (r) => r.id && ids.includes(r.id),
                        );
                        handleBulkDelete(rowsToDelete, handleSearch);
                      }}
                    />
                  )}
                </>
              ),
            },
            {
              tabName: `Inactive Employer (${inactiveCount})`,
              tabContent: (
                <>
                  {!loading && data.length === 0 && (
                    <Typography align="center" mt={3}>
                      No records found
                    </Typography>
                  )}

                  {!loading && data.length > 0 && (
                    <MyTable
                      rows={data}
                      columns={columns}
                      enableSelection
                      getRowId={(row) => row.id!}
                      mode="inactive"
                      tableSize={dense ? "small" : "medium"}
                      containerSx={{ maxWidth: 1300, mx: "auto" }}
                      onActivateSelected={(ids) => {
                        const selectedRows = data.filter(
                          (r) => r.id && ids.includes(r.id),
                        );
                        handleBulkActivate(selectedRows, handleSearch);
                      }}
                    />
                  )}
                </>
              ),
            },
            {
              tabName: `Group by category `,
              tabContent: (
                <>
                  {!loading && data.length === 0 && (
                    <Typography align="center" mt={3}>
                      No records found
                    </Typography>
                  )}

                  {!loading && data.length > 0 && (
                    <MyTable
                      rows={data}
                      columns={columns}
                      enableSelection={false}
                      getRowId={(row) => row.id!}
                      groupBy="industry"
                      tableSize={dense ? "small" : "medium"}
                      containerSx={{ maxWidth: 1300, mx: "auto" }}
                    />
                  )}
                </>
              ),
            },
          ]}
        />

        <Box sx={{ maxWidth: 1300, mx: "auto" }}>
          {/* Dense Padding Toggle */}
          <Box display="flex" justifyContent="left">
            <FormControlLabel
              control={
                <Switch
                  checked={dense}
                  onChange={(e) => setDense(e.target.checked)}
                />
              }
              label="Dense padding"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerList;
