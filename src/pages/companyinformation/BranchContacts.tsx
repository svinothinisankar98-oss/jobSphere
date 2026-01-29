import React from "react";
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

// ⚠️ EXACT logic moved — nothing changed

export default function BranchContacts({ nestIndex, control, watch }: any) {

  const name = `branches.${nestIndex}.branchContact`;

  const { fields, append, remove } = useFieldArray({ control, name });

  const watched = watch(name);

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [newRowId, setNewRowId] = React.useState<string | null>(
    fields[0]?.id || null,
  );

  React.useEffect(() => {
    if (fields.length && !editingId) {
      setEditingId(fields[fields.length - 1].id);
    }
  }, [fields]);

  const isRowFilled = (row: any) =>
    row?.name?.trim() && row?.phone?.trim() && row?.email?.trim();

  const isLastFilled = () => {
    if (!watched?.length) 
        return true;
    if (watched.length >= COMPANY_INFORMATION_LIMITS.MAX_BRANCH_CONTACTS) 
        
        return false;
    return isRowFilled(watched[watched.length - 1]);
  };

  const isEditingRow = (id: string, index: number) => {
    const row = watched?.[index];
    const isEmptyRow =
      !row?.name?.trim() || !row?.phone?.trim() || !row?.email?.trim();

    return editingId === id || isEmptyRow;
  };

  const handleAdd = () => {
    append({
      name: "",
      phone: "",
      email: "",
      designation: "",
    });

    const newIndex = fields.length;

    requestAnimationFrame(() => {
      setEditingId(fields[newIndex]?.id);
      setNewRowId(fields[newIndex]?.id);
    });
  };

  const handleSave = () => {
    setEditingId(null);
    setNewRowId(null);
  };

  const handleDelete = (index: number) => {
    remove(index);
    setEditingId(null);
    setNewRowId(null);
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
        isEditingRow(fields[i].id, i) ? (
          <MyTextField
            name={`${name}.${i}.name`}
            label="Name"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography sx={{ textAlign: "left" }}>
            {watched?.[i]?.name}
          </Typography>
        ),
    },
    {
      id: "phone",
      label: "Phone",
      render: (_: any, i: number) =>
        isEditingRow(fields[i].id, i) ? (
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
        isEditingRow(fields[i].id, i) ? (
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
        isEditingRow(fields[i].id, i) ? (
          <MyTextField
            name={`${name}.${i}.designation`}
            label="Designation"
            fullWidth
          />
        ) : (
          <Typography> {watched?.[i]?.designation?.trim() || "-"}</Typography>
        ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (_: any, i: number) => {
        const isNew = newRowId === fields[i].id;
        const isAnyEmpty =
          !watched?.[i]?.name?.trim() ||
          !watched?.[i]?.email?.trim() ||
          !watched?.[i]?.phone?.trim();

        const isEditing = editingId === fields[i].id || isAnyEmpty;

        return (
          <Box display="flex" justifyContent="center" gap={1}>
            {isEditing && (
              <IconButton
                size="small"
                color="success"
                disabled={!isRowFilled(watched?.[i])}
                onClick={handleSave}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            )}

            {!isEditing && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => setEditingId(fields[i].id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}

            {!isEditing || !isNew ? (
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(i)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ) : null}
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
          disabled={!isLastFilled()}
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
