import React, { useMemo, useState } from "react";
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
} from "@mui/material";

//sorting order type//

type Order = "asc" | "desc";

//column definition//

export type Column<T> = {
  id: keyof T | string;
  width?: number; 
  label: string;
  headerAlign?: "left" | "center" | "right";   //header alignment//
  align?: "left" | "center" | "right";          //cell alignment//
  cellAlign?: (row: T) => "left" | "center" | "right"; //dynamic alignment //
  render?: (row: T, index: number) => React.ReactNode;  //custom cell render - buttons icons//
  sortable?: boolean;
};

//component props//

type CommonTableProps<T> = {
  rows: T[];
   width?: number; 
  columns: Column<T>[];    //columnconfiguration//
  rowsPerPageOptions?: number[];  //pagination//   
  defaultRowsPerPage?: number;    //initial page size like 5//

   tableSize?: "small" | "medium";
  containerSx?: object;             //custom style for container//   
}

function MyTable<T>({               //default set for for pageoptions rows perpage and size//
  rows,
  columns,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 5,
  tableSize = "small",
  containerSx,

}: CommonTableProps<T>) {
  const [orderBy, setOrderBy] = useState<string>("");    //current sorted column//
  const [order, setOrder] = useState<Order>("asc");        //sorting direction//
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

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

  return (
   <Paper sx={{ p: 2, width: "100%", overflow: "hidden", ...containerSx }}>
      <Box sx={{ overflowX: "auto", maxHeight: 400 }}>
        <Table stickyHeader size={tableSize} sx={{ minWidth: 900 }}>
          <TableHead>
  <TableRow>
    {columns.map((c) => (
      <TableCell
        key={String(c.id)}
        align={c.headerAlign || "center"}
        sx={{
          fontWeight: "bold",
          // whiteSpace: "nowrap",
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
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} hover>
                {columns.map((c) => {
                  const align = c.cellAlign
                    ? c.cellAlign(row)
                    : c.align || "center";

                  return (
                    <TableCell
                      key={String(c.id)}
                      align={align}
                      sx={{
                        // border: "1px solid #ddd",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.render
                        ? c.render(row, rowIndex)
                        : (row as any)[c.id]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
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
        />
      </Box>
    </Paper>
  );
}

export default MyTable;
