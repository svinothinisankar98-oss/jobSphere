import Footer from "./layouts/Footer";
import Header from "./layouts/Header";

import "./style/global.css";
// import sideBar from "./layouts/Sidebar";
import Sidebar from "./layouts/Sidebar";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/register/EmployerRegister";
import Home from "./pages/home/Home";
import Joblist from "./pages/joblist/Joblist";
import JobSeekerRegister from "./pages/register/jobSeekerRegister";
import JobList from "./pages/joblist/Joblist";
import CommonToast from "./Components/ui/CommonToast";
import Login from "./pages/login/Login";
import Dashboard from "./pages/login/Dashboard/Dashboard";
import Sample from "./pages/register/Sample";
import EmployerRegisterWithMUI from "./pages/register/EmployerRegisterWithMUI";
import YupSample from "./pages/register/YupSample";




function App() {
  return (
    <div className="app-container">
     
      <Header />
      
      <CommonToast />
      {/* <EmployerRegisterWithMUI/> */}
    
      
      {/* <MainRegister/> 
      <Navbar/>  */}
      {/* <JobSeekerRegister/> */}
      

      <div className="page-content">
        {/* All page content goes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/employer-register" element={<Register />} />
          <Route path="/job-list" element={<Joblist />} />
          <Route path="/job-seeker-register" element={<JobSeekerRegister />} />
          <Route path="/dashboard" element={<Sample/>} />
          <Route path="/dashboard1" element={<YupSample/>} />
          
          
          
       
        </Routes>
      </div>

      <Sidebar />
      <Footer />
    </div>
  );
}

export default App;
