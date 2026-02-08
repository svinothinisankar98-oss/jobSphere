import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Footer from "./Footer";

export default function MainLayout() {
 return (
    <div className="app-container">
      <Header />

      <div className="page-content">
        <Outlet />
      </div>

      <Sidebar />
      <Footer />
    </div>
  );
}
