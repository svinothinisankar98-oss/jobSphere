import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <Box className="app-container">
      <Header />

      <Box className="page-content">
        <Outlet />
      </Box>

      <Sidebar />
      <Footer />
    </Box>
  );
}
