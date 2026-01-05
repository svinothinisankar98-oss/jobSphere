import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import type { employerRegisterType } from "../../../types/employerRegister";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { userService } from "../../../service/userService";

type Props = {
  data: employerRegisterType[];
  loading: boolean;
};

const EmployerList = ({ data, loading }: Props) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Typography align="center" mt={2}>
        No records found
      </Typography>
    );
  }

  const deleteEmployee = async (employeeIndex: number) => {
    const getData = data.find((j: any, index: number) => {
      return index == employeeIndex;
    });
    console.log(getData);
    const id: string = getData?.id || "";
    const deletelist = await userService.deleteUser( id,getData);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Serial No</b>
            </TableCell>
            <TableCell>
              <b>Company Name</b>
            </TableCell>
            <TableCell>
              <b>Company Size</b>
            </TableCell>
            <TableCell>
              <b>Industry</b>
            </TableCell>
            <TableCell>
              <b>Recruiter Name</b>
            </TableCell>
            <TableCell>
              <b>Recruiter Email</b>
            </TableCell>
            <TableCell>
              <b>Recruiter Phone</b>
            </TableCell>

            <TableCell>
              <b>Action</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.serialNo}</TableCell>
              <TableCell>{row.companyName}</TableCell>
              <TableCell>{row.companySize}</TableCell>
              <TableCell>{row.industry}</TableCell>
              <TableCell>{row.recruiterName}</TableCell>
              <TableCell>{row.recruiterEmail}</TableCell>
              <TableCell>{row.recruiterPhone}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  // onClick={() => handleEdit(row)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => deleteEmployee(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployerList;
