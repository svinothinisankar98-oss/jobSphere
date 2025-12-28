import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/global.css";

 function Footer() {
  return (
    <footer className="bg-light border-top py-3 mt-5">
  <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">

  
    <div className="navbar-brand fw-bold text-primary ms-2 brand-logo">JobSphere</div>

    {/* Copyright */}
    <div className="text-muted small">
      © {new Date().getFullYear()}  Copyright JobSphere
    </div>

    {/* Social Icons */}
    <div className="d-flex gap-3 fs-5">
      <a href="#" className="text-secondary"><i className="bi bi-facebook"></i></a>
      <a href="#" className="text-secondary"><i className="bi bi-instagram"></i></a>
      <a href="#" className="text-secondary"><i className="bi bi-twitter"></i></a>
      <a href="#" className="text-secondary"><i className="bi bi-linkedin"></i></a>
      <a href="#" className="text-secondary"><i className="bi bi-youtube"></i></a>
    </div>

  </div>
</footer>
  );
}
export default Footer
    