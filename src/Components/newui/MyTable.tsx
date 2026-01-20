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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type Order = "asc" | "desc";
type RowId = string | number;

//column//

export type Column<T> = {
  id: keyof T | string;
  label: string;
  headerAlign?: "left" | "center" | "right";
  align?: "left" | "center" | "right";
  cellAlign?: (row: T) => "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode; //Custom UI//
  sortable?: boolean;
  group?: string; //Used for column grouping//
};

//table//

type CommonTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  tableSize?: "small" | "medium";
  containerSx?: object;
  groupBy?: keyof T | null; //row grouping//

  enableSelection?: boolean; //add checkbox to select rows//
  getRowId?: (row: T) => RowId; //used for selction logic//
  mode?: "active" | "inactive";
  onSelectionChange?: (selected: RowId[]) => void;
  onDeleteSelected?: (ids: RowId[]) => void;
  onActivateSelected?: (ids: RowId[]) => void;
  enableColumnGrouping?: boolean; //when enable cloumnu grouping//
};

//PaginationActionsProps//

type PaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
};

//CustomPaginationActions//

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

//main component//

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
  onActivateSelected,
  mode = "active",
  groupBy = null,
  enableColumnGrouping = false,
}: CommonTableProps<T>) {
  //States//

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(true);

  const [orderBy, setOrderBy] = useState<string>("");
  const [order, setOrder] = useState<Order>("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState<RowId[]>([]);

  useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);

  //Sorting Handler//

  const handleSort = (id: string) => {
    if (orderBy === id) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(id);
      setOrder("asc");
    }
  };

  //Group Toggle Logic//

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  //Sorted Rows//

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    return [...rows].sort((a: any, b: any) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, orderBy, order]);

  //Pagination Logic//

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  //Grouped Data//

  const groupedData = useMemo(() => {
    if (!groupBy) return null;
    return paginatedRows.reduce((acc: any, row: any) => {
      const key = row[groupBy] || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});
  }, [paginatedRows, groupBy]);

  //Collapse All Groups//

  const collapseAllGroups = () => {
    if (!groupedData) return;
    const updated: Record<string, boolean> = {};
    Object.keys(groupedData).forEach((key) => {
      updated[key] = false;
    });
    setOpenGroups(updated);
    setAllExpanded(false);
  };

  //Expand All Groups//

  const expandAllGroups = () => {
    if (!groupedData) return;
    const updated: Record<string, boolean> = {};
    Object.keys(groupedData).forEach((key) => {
      updated[key] = true;
    });
    setOpenGroups(updated);
    setAllExpanded(true);
  };

  //Selection Check//

  const isSelected = (id: RowId) => selected.includes(id);

  //Toggle Row Selection//

  const handleRowToggle = (id: RowId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  //Page Row IDs//

  const pageRowIds = paginatedRows
    .map((r) => getRowId?.(r))
    .filter((id): id is RowId => id !== undefined);

  //Select All Logic//

  const allSelected =
    enableSelection &&
    pageRowIds.length > 0 &&
    pageRowIds.every((id) => selected.includes(id));

  const someSelected =
    enableSelection &&
    pageRowIds.some((id) => selected.includes(id)) &&
    !allSelected;

  //Select All Page//

  const handleSelectAllPage = (checked: boolean) => {
    if (!checked) {
      setSelected((prev) => prev.filter((id) => !pageRowIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageRowIds])]);
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "auto",
        border: "1px solid #d0d7de",
        ...containerSx,
      }}
    >
      {enableSelection && selected.length > 0 && (
        //Bulk Action Toolbar//
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            bgcolor: "#e3e8ed",
            color: "black",
            borderRadius: 1,
            fontWeight: 500,
            px: 2,
            py: 1,
          }}
        >
          <span>{selected.length} selected</span>

          {mode === "inactive" ? (
            <IconButton
              color="success"
              onClick={() => {
                onActivateSelected?.(selected);
                setSelected([]); // clear after action
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={() => {
                onDeleteSelected?.(selected);
                setSelected([]);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )}

      <Box
        sx={{
          //scroll container//
          maxHeight: 700,
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          size={tableSize}
          sx={{
            "& .MuiTableCell-root": {
              borderRight: "2px solid #d0d7de",
            },
            "& .MuiTableRow-root:last-child .MuiTableCell-root": {
              borderBottom: "1px solid #d0d7de",
            },
          }}
          //table//
        >
          <TableHead>
            {enableColumnGrouping && (
              <TableRow>
                {groupBy && (
                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      backgroundColor: "#e5e5e5",
                      borderRight: "1px solid #d0d7de",
                      width: 40,
                      p: 0,
                    }}
                  >
                    <IconButton size="small" onClick={collapseAllGroups}>
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton size="small" onClick={expandAllGroups}>
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </TableCell>
                )}

                {
                  enableSelection && <TableCell />

                  //Checkbox Placeholder//
                }

                {columns
                  .reduce((acc: any[], col) => {
                    const last = acc[acc.length - 1];
                    if (!last || last.group !== col.group) {
                      acc.push({ group: col.group, count: 1 });
                    } else {
                      last.count += 1;
                    }
                    return acc;
                  }, [])
                  .map(({ group, count }) => (
                    <TableCell
                      key={group}
                      align="center"
                      colSpan={count}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#e5e5e5",
                        borderBottom: "1px solid #d0d7de",

                        ...(group === "Recruiter Details" && {
                          position: "sticky",
                          right: 0,
                          zIndex: 4,
                          background: "#e5e5e5",
                        }),

                        ...(group === "Company Details" && {
                          position: "sticky",
                          right: 0,
                          zIndex: 4,
                          background: "#e5e5e5",
                        }),
                      }}
                    >
                      {group}
                    </TableCell>
                  ))}
              </TableRow>
            )}

            <TableRow>
              {groupBy && (
                <TableCell
                  sx={{
                    borderRight: "1px solid #d0d7de",
                    width: 40,
                  }}
                />
              )}

              {enableSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => handleSelectAllPage(e.target.checked)}
                  />
                </TableCell>
              )}

              {columns.map((c) => (
                <TableCell key={String(c.id)} align={c.headerAlign || "center"}>
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
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {groupBy && groupedData
              ? Object.entries(groupedData).map(([group, items]: any) => {
                  const isOpen = openGroups[group] ?? true;

                  return (
                    <React.Fragment key={group}>
                      <TableRow sx={{ background: "#e2ebf5" }}>
                        <TableCell
                          align="center"
                          sx={{
                            borderRight: "1px solid #d0d7de",
                            width: 40,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleGroup(group)}
                          >
                            {isOpen ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>

                        <TableCell
                          colSpan={columns.length + (enableSelection ? 1 : 0)}
                          sx={{ fontWeight: "bold" }}
                        >
                          {group} ({items.length})
                        </TableCell>
                      </TableRow>

                      {isOpen &&
                        items.map((row: any, rowIndex: number) => {
                          const rowId = getRowId?.(row);
                          const checked =
                            rowId !== undefined ? isSelected(rowId) : false;

                          return (
                            <TableRow key={rowIndex} hover selected={checked}>
                              <TableCell
                                sx={{
                                  borderRight: "1px solid #d0d7de",
                                  width: 40,
                                }}
                              />

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
                    </React.Fragment>
                  );
                })
              : paginatedRows.map((row, rowIndex) => {
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
                              rowId !== undefined && handleRowToggle(rowId)
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
