import { useEffect, useState } from "react";
import type { CompanyInformationType } from "../../types/companyInformation";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { formatDate } from "../../utils/dateFormatter";
import MyTable from "../../Components/newui/MyTable";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

export function CompanyInfoRowList({
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
