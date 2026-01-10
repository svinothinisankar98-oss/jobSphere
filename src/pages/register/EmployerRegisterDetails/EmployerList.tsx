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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MyTabs from "../../../Components/newui/MyTab";

const EmployerList = () => {
  // ================= STATE =================
  const [data, setData] = useState<employerRegisterType[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterPhone, setRecruiterPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false); //  store filter input values//
  const { showSnackbar } = useSnackbar();

  const { getRecruiterDetails, updateUser } = useUserService();

  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [rowToDelete, setRowToDelete] = useState<any>(null);


   const loadDefaultData = async () => {
    try {
      setLoading(true);
      const response = await getRecruiterDetails();

      const tabFiltered = response.filter((d) =>
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

  //Delete Logic//

//   const handleDelete = async (row: any) => {
//   const updatedRow = {
//     ...row,
//     isActive: false,
//     updatedAt: new Date(),
//   };

//   const id = row.id;
//   await updateUser(id, updatedRow);
//   await loadDefaultData();
//   showSnackbar("Employee deleted successfully", "success");
// };

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

  // const handleActivate = async (row: any) => {
  //   row.isActive = true;
  //   row.updatedAt = new Date();
  //   const id = row?.id;

  //   await userService.updateUser(id, row);
  //   showSnackbar("Employee activated successfully", "success");
  //   handleSearch();
  // };

  //Edit Logic//

  //   const handleEdit = (row: employerRegisterType) => {        //edit mode location.state//
  //   navigate("/employer-register", {
  //     state: { editData: row },
  //   });
  // };

  //Edit Logic//

  const handleEdit = (row: employerRegisterType) => {
    console.log("Edit clicked row:", row);
    console.log("Row ID:", row.id);

    navigate(`/employer-register/edit/${row.id}`);
  };

  // ================= SEARCH =================
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

      //Add Serial Number//

      // const withSerial = filtered.map((d: any, index: number) => ({
      //   ...d,
      //   serialNo: index + 1,
      // }));

      setData(tabFiltered);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  //default load for on page open//

  useEffect(() => {
    loadDefaultData();
  }, [activeTab]);
  //Table Columns//

  const columns: Column<employerRegisterType>[] = [
    // { id: "serialNo", label: "SerialNo", align: "center", sortable: false },
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
      // row.createdAt && !isNaN(new Date(row.createdAt).getTime())
      //   ? new Date(row.createdAt).toLocaleDateString()
      //   : "-",
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
                onClick={() => {
  setRowToDelete(row);
  setOpenDeleteConfirm(true);
}}
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
                onClick={() => {
                  console.log("Activate clicked", row);
                  handleActivateClick(row);
                }}
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
      <Paper sx={{ maxWidth: 1200, mx: "auto", p: 3, borderRadius: 5 }}>
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
              // sx={{
              //   minWidth: 160,
              //   height: 45,
              //   fontWeight: 600,
              // }}
            />
            <MyButton
              label="Reset"
              variant="contained"
              color="error"
              icon={<RestartAltIcon />}
              // sx={{
              //   minWidth: 160,
              //   height: 45,
              //   fontWeight: 600,
              // }}
              onClick={handleClear}
            />
          </Grid>
        </Grid>
      </Paper>

      <MyDialog
        open={openConfirm}
        title="Activate User"
        message="Are you sure you want to activate this employee?"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmActivate}
        confirmText="Yes, Activate"
        confirmColor="success"
      />
      <MyDialog
  open={openDeleteConfirm}
  title="Delete User"
  message="Are you sure you want to delete this employee?"
  onClose={() => setOpenDeleteConfirm(false)}
  onConfirm={handleConfirmDelete}
  confirmText="Yes, Delete"
  confirmColor="error"
/>



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

      {/* {!loading &&
        data.length > 0 && ( //Table Usage//
          <MyTable
            rows={data}
            columns={columns}
            tableSize="small"
            containerSx={{ width: 1200, mx: "auto", mt: 2 }}
          />
        )} */}
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
        <MyTabs
          activeTab={activeTab}
          onTabChange={(index) => setActiveTab(index)}
          completedTabs={[]}
          errorTabs={[]}
          tabs={[
            {
              tabName: "Active Employer",
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
                      tableSize="small"
                      containerSx={{ width: 1200, mx: "auto" }}
                    />
                  )}
                </>
              ),
            },
            {
              tabName: "Inactive Employer",
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
                      tableSize="small"
                      containerSx={{ width: 1200, mx: "auto" }}
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
