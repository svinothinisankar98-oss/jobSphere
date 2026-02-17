import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useFieldArray } from "react-hook-form";

import MyTextField from "../../Components/newui/MyTextField";
import MyButton from "../../Components/newui/MyButton";
import MyTable from "../../Components/newui/MyTable";

import { COMPANY_INFORMATION_LIMITS } from "../../constants/CompanyInformationConstant";

export default function BranchContacts({ nestIndex, control, watch }: any) {
  const name = `branches.${nestIndex}.branchContact`;

  const { fields, append, remove } = useFieldArray({ control, name });

  const watched = watch(name);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // open first row automatically
  useEffect(() => {
    if (fields.length && editingIndex === null) {
      setEditingIndex(fields.length - 1);
    }
  }, [fields]);

  const isRowFilled = (row: any) =>
    row?.name?.trim() &&
    row?.phone?.trim() &&
    row?.email?.trim();

  // block add until last row saved
  const canAddNew = () => {
    if (!watched?.length) return true;

    if (watched.length >= COMPANY_INFORMATION_LIMITS.MAX_BRANCH_CONTACTS)
      return false;

    const last = watched[watched.length - 1];
    return isRowFilled(last) && editingIndex === null;
  };

  // ADD ROW
  const handleAdd = () => {
    append({
      name: "",
      phone: "",
      email: "",
      designation: "",
    });

    setEditingIndex(fields.length);
  };

  // SAVE ROW
  const handleSave = () => {
    setEditingIndex(null);
  };

  // DELETE ROW
  const handleDelete = (index: number) => {
    if (fields.length === 1) return;
    remove(index);
    setEditingIndex(null);
  };

  const columns = [
    {
      id: "slno",
      label: "Person",
      render: (_: any, i: number) => i + 1,
    },
    {
      id: "name",
      label: "Contact Name",
      render: (_: any, i: number) =>
        editingIndex === i ? (
          <MyTextField
            name={`${name}.${i}.name`}
            label="Name"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography>{watched?.[i]?.name}</Typography>
        ),
    },
    {
      id: "phone",
      label: "Phone",
      render: (_: any, i: number) =>
        editingIndex === i ? (
          <MyTextField
            name={`${name}.${i}.phone`}
            label="Phone"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography>{watched?.[i]?.phone}</Typography>
        ),
    },
    {
      id: "email",
      label: "Email",
      render: (_: any, i: number) =>
        editingIndex === i ? (
          <MyTextField
            name={`${name}.${i}.email`}
            label="Email"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography>{watched?.[i]?.email}</Typography>
        ),
    },
    {
      id: "designation",
      label: "Designation",
      render: (_: any, i: number) =>
        editingIndex === i ? (
          <MyTextField
            name={`${name}.${i}.designation`}
            label="Designation"
            fullWidth
          />
        ) : (
          <Typography>{watched?.[i]?.designation || "-"}</Typography>
        ),
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, i: number) => {
        const row = watched?.[i];
        const filled = isRowFilled(row);
        const isEditing = editingIndex === i;

        return (
          <Box display="flex" justifyContent="center" gap={1}>
            {isEditing && (
              <IconButton
                size="small"
                color="success"
                disabled={!filled}
                onClick={handleSave}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            )}

            {!isEditing && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => setEditingIndex(i)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton
              size="small"
              color="error"
              disabled={fields.length === 1}
              onClick={() => handleDelete(i)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="end" mb={1}>
        <MyButton
          size="small"
          label="Add Branch Contact"
          icon={<PersonAddAlt1Icon />}
          variant="contained"
          color="primary"
          disabled={!canAddNew()}
          onClick={handleAdd}
        />
      </Box>

      <MyTable
        rows={fields}
        columns={columns}
        tableSize="medium"
        disablePagination
      />
    </Box>
  );
}
