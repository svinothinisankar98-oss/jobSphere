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
import { useSnackbar } from "../../../Components/newui/MySnackBar";
import { useUserService } from "../../../hooks/useUserService";
import MyDialog from "../../../Components/newui/MyDialog";
import MyTabs from "../../../Components/newui/MyTab";

// ✅ NEW IMPORT
import { useEmployerActions } from "../../register/useEmployerListHandlers";

const EmployerList = () => {
  //state variables//

  const [data, setData] = useState<employerRegisterType[]>([]);

  //search filters//
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const { getRecruiterDetails, updateUser } = useUserService();

  //tabs//
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  //dialog//
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  //selected rows//
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [rowToDelete, setRowToDelete] = useState<any>(null);

  // ✅ HANDLER HOOK (ADDED — NO LOGIC REMOVED)
  const {
    showConfirm,
    pendingAction,
    handleDeleteClick: handleDeleteFromHook,
    handleActivateClick: handleActivateFromHook,
    handleConfirmYes,
    handleConfirmNo,
    pendingRows,
  } = useEmployerActions(updateUser, showSnackbar);

  const [activeCount, setActiveCount] = useState(0);
const [inactiveCount, setInactiveCount] = useState(0);

  //data loading tab change//

  const loadDefaultData = async () => {
  try {
    setLoading(true);
    const response = await getRecruiterDetails();

    const active = response.filter((d) => d.isActive === true);
    const inactive = response.filter((d) => d.isActive === false);

    setActiveCount(active.length);
    setInactiveCount(inactive.length);

    const tabFiltered = activeTab === 0 ? active : inactive;
    setData(tabFiltered);
  } catch (err) {
    console.error(err);
    setData([]);
  } finally {
    setLoading(false);
  }
};


  // clear//
  const handleClear = () => {
    setCompanyName("");
    setRecruiterName("");
    setRecruiterEmail("");
    setRecruiterPhone("");
    setIndustry("");
    setCompanySize("");
    loadDefaultData();
  };

  //confirm delete//

  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;

    try {
      const updatedRow = {
        ...rowToDelete,
        isActive: false,
        updatedAt: new Date(),
      };

      const id = rowToDelete.id;
      await updateUser(id, updatedRow);
      await loadDefaultData();

      showSnackbar("Employee deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to delete employee", "error");
    } finally {
      setOpenDeleteConfirm(false);
      setRowToDelete(null);
    }
  };

  //Activate logic//

  const handleActivateClick = (row: any) => {
    console.log("Opening dialog", row);
    setSelectedRow(row);
    setOpenConfirm(true);
  };

  const handleConfirmActivate = async () => {
    if (!selectedRow) return;

    try {
      const updatedRow = {
        ...selectedRow,
        isActive: true,
        updatedAt: new Date(),
      };

      const id = selectedRow.id;

      await updateUser(id, updatedRow);

      showSnackbar("Employee activated successfully", "success");
      handleSearch(); // reload table
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to activate employee", "error");
    } finally {
      setOpenConfirm(false);
    }
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

      const tabFiltered = filtered.filter((d: employerRegisterType) =>
        activeTab === 0 ? d.isActive === true : d.isActive === false
      );

      setData(tabFiltered);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultData();
  }, [activeTab]);

  //Table Columns//

  const columns: Column<employerRegisterType>[] = [
    { id: "companyName", label: "Company Name", align: "left" },
    { id: "companySize", label: "Company Size", align: "center" },
    { id: "industry", label: "Industry", align: "left" },
    { id: "recruiterName", label: "Recruiter Name", align: "left" },
    { id: "recruiterEmail", label: "Recruiter Email", align: "left" },
    {
      id: "recruiterPhone",
      label: "Recruiter Phone",
      align: "center",
      sortable: false,
    },
    {
      id: "createdAt",
      label: "Created At",
      align: "center",
      sortable: false,
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: false,

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
      sortable: false,

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
                onClick={() => handleDeleteFromHook([row])} // ✅ wired
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
                onClick={() => handleActivateFromHook(row)} 
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];
  // JSX //
  return (
    <Box mt={4}>
      <Paper sx={{ maxWidth: 1300, mx: "auto", p: 3, borderRadius: 5 }}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
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

      {/* ✅ Dialogs wired to handler */}

      <MyDialog
        open={showConfirm && pendingAction === "activate"}
        title="Activate User"
        // message="Are you sure you want to activate this employee?"
        message={
    pendingRows.length === 1
      ? "Are you sure you want to activate this employee?"
      : `Are you sure you want to activate ${pendingRows.length} employees?`
  }
        onClose={handleConfirmNo}
        onConfirm={() => handleConfirmYes(loadDefaultData)}
        confirmText="Yes, Activate"
        confirmColor="success"
      />

      <MyDialog
        open={showConfirm && pendingAction === "delete"}
        title="Delete User"
        // message="Are you sure you want to delete this employee?"
        message={
    pendingRows.length === 1
      ? "Are you sure you want to delete this employee?"
      : `Are you sure you want to delete ${pendingRows.length} employees?`
  }
        onClose={handleConfirmNo}
        onConfirm={() => handleConfirmYes(loadDefaultData)}
        confirmText="Yes, Delete"
        confirmColor="error"
      />

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress size={28} />
        </Box>
      )}

      <Box sx={{ maxWidth: 1300, mx: "auto", mt: 4 }}>
        <MyTabs
          activeTab={activeTab}
          onTabChange={(index) => setActiveTab(index)}
          tabs={[
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
                      containerSx={{ width: 1300, mx: "auto" }}
                      rows={data}
                      columns={columns}
                      enableSelection
                      getRowId={(row) => row.id!}
                      
                      onDeleteSelected={(ids) => {
                        const rowsToDelete = data.filter(
                          (r) => r.id && ids.includes(r.id)
                        );
                        handleDeleteFromHook(rowsToDelete); 
                        
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
                    // <MyTable
                    //   rows={data}
                    //   columns={columns}
                    //   tableSize="small"
                    //   containerSx={{ width: 1200, mx: "auto" }}
                    // />

                    <MyTable
                      rows={data}
                      columns={columns}
                      enableSelection 
                      getRowId={(row) => row.id!}
                      tableSize="small"
                      containerSx={{ width: 1300, mx: "auto" }}
                      onDeleteSelected={(ids) => {
                        const rowsToRestore = data.filter(
                          (r) => r.id && ids.includes(r.id)
                        );
                        handleActivateFromHook(rowsToRestore); // ✅ bulk restore
                      }}
                    />
                  )}
                </>
              ),
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default EmployerList;
