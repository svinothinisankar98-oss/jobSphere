import React, { useMemo, useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  Box,
  Checkbox,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

type Order = "asc" | "desc";
type RowId = string | number;

// Column type
export type Column<T> = {
  id: keyof T | string;
  width?: number;
  label: string;
  headerAlign?: "left" | "center" | "right";
  align?: "left" | "center" | "right";
  cellAlign?: (row: T) => "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
};

type CommonTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  tableSize?: "small" | "medium";
  containerSx?: object;

  enableSelection?: boolean;
  getRowId?: (row: T) => RowId;
  onSelectionChange?: (selected: RowId[]) => void;
  onDeleteSelected?: (ids: RowId[]) => void;
};

type PaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};

function CustomPaginationActions(props: PaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const totalPages = Math.ceil(count / rowsPerPage);

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= totalPages - 1}
      >
        <KeyboardArrowRight />
      </IconButton>

      <IconButton
        onClick={(e) => onPageChange(e, totalPages - 1)}
        disabled={page >= totalPages - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

function MyTable<T>({
  rows,
  columns,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  tableSize = "small",
  containerSx,
  enableSelection = false,
  getRowId,
  onSelectionChange,
  onDeleteSelected,
}: CommonTableProps<T>) {
  const [orderBy, setOrderBy] = useState<string>("");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState<RowId[]>([]);

  useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);

  const handleSort = (id: string) => {
    if (orderBy === id) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(id);
      setOrder("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    return [...rows].sort((a: any, b: any) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, orderBy, order]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const isSelected = (id: RowId) => selected.includes(id);

  const handleRowToggle = (id: RowId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (!getRowId) return;

    const allIds = rows
      .map((r) => getRowId(r))
      .filter((id): id is RowId => id !== undefined);

    setSelected(checked ? allIds : []);
  };

  const handleDeleteSelected = () => {
    if (!onDeleteSelected) return;
    onDeleteSelected(selected);
  };

  const allSelected =
    enableSelection &&
    rows.length > 0 &&
    rows.every((r) => {
      const id = getRowId?.(r);
      return id !== undefined && selected.includes(id);
    });

  const someSelected =
    enableSelection && selected.length > 0 && !allSelected;

  return (
    <Paper sx={{ p: 2, width: "100%", overflow: "hidden", ...containerSx }}>
      {enableSelection && selected.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            mb: 1,
            bgcolor: "#e3e8ed",
            color: "black",
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          <span>{selected.length} selected</span>

          <IconButton color="error" onClick={handleDeleteSelected}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ overflowX: "auto", maxHeight: 400 }}>
        <Table stickyHeader size={tableSize} sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}

              {columns.map((c) => (
                <TableCell
                  key={String(c.id)}
                  align={c.headerAlign || "center"}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f0ebebff",
                    width: c.width,
                  }}
                >
                  <Box display="flex" justifyContent="center">
                    {c.sortable === false ? (
                      c.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === c.id}
                        direction={orderBy === c.id ? order : "asc"}
                        onClick={() => handleSort(String(c.id))}
                      >
                        {c.label}
                      </TableSortLabel>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row, rowIndex) => {
              const rowId = getRowId?.(row);
              const checked =
                rowId !== undefined ? isSelected(rowId) : false;

              return (
                <TableRow key={rowIndex} hover selected={checked}>
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={checked}
                        onChange={() =>
                          rowId !== undefined &&
                          handleRowToggle(rowId)
                        }
                      />
                    </TableCell>
                  )}

                  {columns.map((c) => {
                    const align = c.cellAlign
                      ? c.cellAlign(row)
                      : c.align || "center";

                    return (
                      <TableCell key={String(c.id)} align={align}>
                        {c.render
                          ? c.render(row, rowIndex)
                          : (row as any)[c.id]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
          rowsPerPageOptions={rowsPerPageOptions}
          ActionsComponent={CustomPaginationActions}
        />
      </Box>
    </Paper>
  );
}

export default MyTable;
