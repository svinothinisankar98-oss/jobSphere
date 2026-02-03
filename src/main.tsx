import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";


import { theme }from "./config/theme";
import {  UIProvider } from "./context/UIProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <UIProvider>
        <App />
      </UIProvider>
    </BrowserRouter>
  </ThemeProvider>
);
