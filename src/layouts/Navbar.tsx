import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
        <div className="container-fluid">
          {/* Brand */}
          <Link className="navbar-brand fw-bold" to="/">
            JobSphere
          </Link>

          {/* Hamburger (mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Menu */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/jobs">
                  Jobs
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/company">
                  Company
                </Link>
              </li>
            </ul>

            {/* Auth Buttons */}
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-primary rounded-pill px-4">
                <i className="bi bi-person-circle me-1"></i> Login
              </Link>
              <Link
                to="/register"
                className="btn btn-outline-primary rounded-pill px-4"
              >
                <i className="bi bi-person-plus me-1"></i> Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR (OFFCANVAS) */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="mobileSidebar"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold">JobSphere</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          <ul className="nav flex-column gap-3">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to="/"
                data-bs-dismiss="offcanvas"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to="/jobs"
                data-bs-dismiss="offcanvas"
              >
                Jobs
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to="/company"
                data-bs-dismiss="offcanvas"
              >
                Company
              </Link>
            </li>
          </ul>

          <hr />

          <div className="d-grid gap-2">
            <Link
              to="/login"
              className="btn btn-primary"
              data-bs-dismiss="offcanvas"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-primary"
              data-bs-dismiss="offcanvas"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
