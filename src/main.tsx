import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { MySnackBar } from "./Components/newui/MySnackBar";
import { theme }from "./config/theme";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <MySnackBar>
        <App />
      </MySnackBar>
    </BrowserRouter>
  </ThemeProvider>
);
