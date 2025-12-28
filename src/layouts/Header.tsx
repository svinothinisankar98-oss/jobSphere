import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

import CommonButton from "../Components/ui/CommonButton";
import { authStorage } from "../utils/authStorage";

/* ================= TYPES ================= */

type AuthUser = {
  id: number;
  name: string;
};

/* COMPONENT  */

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  /*  AUTH LISTENER  */

  useEffect(() => {
    // Initial load (page refresh)
    setUser(authStorage.get());

    // Listen for login / logout updates
    const handleAuthChange = () => {
      setUser(authStorage.get());
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  /*  HANDLERS  */

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    authStorage.remove(); //  clears storage + dispatch event
    setUser(null);
    navigate("/login");
  };

  /* ================= UI ================= */

  return (
    <nav className="navbar fixed-top bg-white border-bottom py-2">
      <div className="container-fluid d-flex align-items-center">

        {/* SIDEBAR TOGGLE (UNCHANGED) */}
        <button
          className="btn"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* LOGO (UNCHANGED) */}
        <Link
          to="/"
          className="navbar-brand fw-bold text-primary ms-2 brand-logo"
        >
          JobSphere
        </Link>

        {/* MIDDLE MENU (UNCHANGED) */}
        <ul className="navbar-nav flex-row gap-4 ms-4 d-none d-md-flex">
          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/Jobs">
              Jobs
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/Company">
              Company
            </Link>
          </li>
        </ul>

        {/* RIGHT ACTIONS (ONLY THIS PART IS CONDITIONAL) */}
        <div className="d-flex align-items-center gap-3 ms-auto">

          {!user ? (
            <>
              {/* LOGIN BUTTON */}
              <CommonButton
                label="Login"
                type="button"
                variant="primary"
                onClick={handleLogin}
                icon="bi bi-person-circle"
                size="sm"
                className="w-100"
              />

              {/* REGISTER DROPDOWN */}
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-plus"></i> Register
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/employer-register">
                      Employer
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/job-seeker-register">
                      Job Seeker
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* PROFILE DROPDOWN */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>
                  {user.name}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
