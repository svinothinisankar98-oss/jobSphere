import { Link } from "react-router-dom";
import { useState } from "react";
import "../style/sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* TOP BAR */}
      <div className="sidebar-header d-flex justify-content-between align-items-center p2">
        
        {!collapsed && <h6 className="mb-0">Menu</h6>}

        {/* TOGGLE / CLOSE BUTTON */}
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
        >
          <i className={`bi ${collapsed ? "bi-list" : "bi-x-lg"}`}></i>
        </button>

      </div>

      <ul className="nav flex-column mt-3">

        {/* Home */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="bi bi-house"></i>
            <span className="link-text">Home</span>
          </Link>
        </li>

        {/* Jobs */}
        <li className="nav-item">
          <Link className="nav-link" to="/jobs">
            <i className="bi bi-briefcase"></i>
            <span className="link-text">Jobs</span>
          </Link>
        </li>

        {/* Company */}
        <li className="nav-item">
          <Link className="nav-link" to="/companies">
            <i className="bi bi-bank"></i>
            <span className="link-text">Company</span>
          </Link>
        </li>

        {/* Register Dropdown */}
        <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle d-flex align-items-center gap-2 w-100"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-workspace"></i>
            <span className="link-text">Register</span>
          </button>

          <ul className="dropdown-menu">
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
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
