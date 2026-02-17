import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "@mui/material/styles";

import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";


// import { theme }from "./config/theme";
import {  UIProvider } from "./context/UIProvider";
import React from "react";

createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
  <ThemeProvider>
    <BrowserRouter>
      <UIProvider>
        <App />
      </UIProvider>
    </BrowserRouter>
   </ThemeProvider>
   </React.StrictMode>
);
