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

import Login from "./pages/login/Login";
// import {EmployerRegister} from "./pages/register/employerregisterdetails/EmployerRegister";
import EmployerRegister from "./pages/register/employerregisterdetails/EmployerRegister";
import EmployerList from "./pages/register/employerregisterdetails/EmployerList";

import CompanyInformation from "./pages/companyinformation/CompanyInformation";

import CompanyInformationList from "./pages/companyinformation/CompanyInfoList";
import JobAdd from "./pages/joblist/JobAdd";
import SavedJobs from "./pages/joblist/SavedJobs";

import { UIProvider } from "./context/UIProvider";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "../../jobSphere/src/ErrorFallback";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UIProvider>
        <div className="app-container">
          <Header />

          <div className="page-content">
            {/* All page content goes here */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/employer-register" element={<EmployerRegister />} />
              <Route
                path="/employer-register/edit/:id"
                element={<EmployerRegister />}
              />
              <Route path="/job-list" element={<Joblist />} />
              <Route
                path="/job-seeker-register"
                element={<JobSeekerRegister />}
              />
              <Route path="/employer-list" element={<EmployerList />} />
              <Route
                path="/company-information/"
                element={<CompanyInformation />}
              />
              <Route
                path="/company-information/edit/:id"
                element={<CompanyInformation />}
              />
              <Route
                path="/company-information-list"
                element={<CompanyInformationList />}
              />
              <Route path="/job-list-add" element={<JobAdd />} />

              <Route path="/saved-jobs" element={<SavedJobs />} />
            </Routes>
          </div>

          <Sidebar />
          <Footer />
        </div>
      </UIProvider>
    </ErrorBoundary>
  );
}

export default App;
