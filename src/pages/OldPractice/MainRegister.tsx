import { useState } from "react";
// import JobSeekerRegister from "./JobSeekerRegister";
// import EmployerRegister from "./EmployerRegister";
import Register from "../register/employerregisterdetails/EmployerRegister";

const MainRegister = () => {
  const [role, setRole] = useState<"" | "JOBSEEKER" | "EMPLOYER">("");

  return (
    <div className="container py-5">

      {/* Role Selection */}
      <div className="text-center mb-4">
        <h3>Register As</h3>

        <button
          className="btn btn-outline-primary me-3"
          onClick={() => setRole("JOBSEEKER")}
        >
          Job Seeker
        </button>

        <button
          className="btn btn-outline-success"
          onClick={() => setRole("EMPLOYER")}
        >
          Employer
        </button>
      </div>

      {/* Conditional Forms */}
      {role === "JOBSEEKER" && <Register />}
      {role === "EMPLOYER" && <Register/>}

      {!role && (
        <p className="text-center text-muted">
          Please select a role to continue
        </p>
      )}
    </div>
  );
};

export default MainRegister;
