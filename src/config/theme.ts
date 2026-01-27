import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          minHeight: 0,
          lineHeight: "1rem",
          
        },
      },
    },
    
   
    MuiTextField: {
      defaultProps: {
        FormHelperTextProps: {
          component: "div",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          alignItems: "center",
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "16px",
        },
        toolbar: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
        spacer: {
          display: "none",
        },
        selectLabel: {
          marginBottom: 0,
        },
        displayedRows: {
          marginBottom: 0,
        },
        actions: {
          marginLeft: "8px",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#f0ebebff",
          borderBottom: "1px solid #d0d7de",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        },
      },
    },
  },
  
});
