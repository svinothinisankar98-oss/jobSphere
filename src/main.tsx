import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";


import { theme }from "./config/theme";
import { MySnackBar } from "./context/SnackbarProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <MySnackBar>
        <App />
      </MySnackBar>
    </BrowserRouter>
  </ThemeProvider>
);
