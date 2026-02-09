import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { UIProvider } from "./context/UIProvider";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./layouts/MainLayout";
import BlankLayout from "./layouts/BlankLayout";

import Home from "./pages/home/Home";
import Joblist from "./pages/joblist/Joblist";
import JobList from "./pages/joblist/Joblist";
import JobSeekerRegister from "./pages/register/jobseeker/jobSeekerRegister";
import EmployerRegister from "./pages/register/employerregisterdetails/EmployerRegister";
import EmployerList from "./pages/register/employerregisterdetails/EmployerList";
import CompanyInformation from "./pages/companyinformation/CompanyInformation";
import CompanyInformationList from "./pages/companyinformation/CompanyInfoList";
import JobAdd from "./pages/joblist/JobAdd";
import SavedJobs from "./pages/joblist/SavedJobs";
import Login from "./pages/login/Login";

import ErrorPage from "./pages/error/ErrorPage";
import PageNotFound from "./pages/error/PageNotFound";

import "./style/global.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <ThemeProvider>
        <UIProvider>
          <Routes>
            {/* WITH header / sidebar / footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/job-list" element={<Joblist />} />
              <Route path="/job-list-add" element={<JobAdd />} />
              <Route path="/saved-jobs" element={<SavedJobs />} />

              <Route path="/job-seeker-register" element={<JobSeekerRegister />} />
              <Route path="/employer-register" element={<EmployerRegister />} />
              <Route path="/employer-register/edit/:id" element={<EmployerRegister />} />
              <Route path="/employer-list" element={<EmployerList />} />

              <Route path="/company-information" element={<CompanyInformation />} />
              <Route path="/company-information/edit/:id" element={<CompanyInformation />} />
              <Route path="/company-information-list" element={<CompanyInformationList />} />
              {/* <Route path="/login" element={<Login />} /> */}
            </Route>

            {/* WITHOUT header / sidebar / footer */}
            <Route element={<BlankLayout />}>
              
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </UIProvider>
      </ThemeProvider>
    </ErrorBoundary>
    </Provider>
  );
}

export default App;
