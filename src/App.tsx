import Footer from "./layouts/Footer";
import Header from "./layouts/Header";

import "./style/global.css";
// import sideBar from "./layouts/Sidebar";
import Sidebar from "./layouts/Sidebar";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Joblist from "./pages/joblist/Joblist";
import JobSeekerRegister from "./pages/register/jobseeker/jobSeekerRegister";
import JobList from "./pages/joblist/Joblist";
import CommonToast from "./Components/ui/CommonToast";
import Login from "./pages/login/Login";
// import {EmployerRegister} from "./pages/register/employerregisterdetails/EmployerRegister";
import EmployerRegister from "./pages/register/employerregisterdetails/EmployerRegister";
import EmployerList from "./pages/register/employerregisterdetails/EmployerList";
import KycForm from "./pages/companyinformation/CompanyInformation";
import CompanyInformation from "./pages/companyinformation/CompanyInformation";
import { MySnackBar } from "./Components/newui/MySnackBar";
import CompanyInformationList from "./pages/companyinformation/CompanyInformationList";






function App() {
  return (
    <div className="app-container">
     
     
      <Header />
       <MySnackBar children={undefined} />
       <div className="page-content">
        {/* All page content goes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/employer-register" element={<EmployerRegister/>} />
          <Route path="/employer-register/edit/:id" element={<EmployerRegister />} />
          <Route path="/job-list" element={<Joblist />} />
          <Route path="/job-seeker-register" element={<JobSeekerRegister />} />
         <Route path="/employer-list" element={<EmployerList />} />
         <Route path="/company-Information" element={<CompanyInformation />} />
         <Route path="/company-Information-list" element={<CompanyInformationList />} />

          
          
          
       
        </Routes>
      </div>
      
     
      

     

      <Sidebar />
      <Footer />
    </div>
  );
}

export default App;
