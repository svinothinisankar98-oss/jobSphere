const PopularJobs = () => {
  return (
    <div className="container my-4 mt-0 mt-md-4">
      <section className="py-3 mt-3">
        <h5 className="fw-bold mb-3 text-center">Popular Jobs</h5>

        <div className="row g-3 justify-content-center">
          {/* Row 1 */}
          <div className="col-4">
            <div className="border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 category-pill">
              <i className="bi bi-bank text-primary"></i>
              <span className="small fw-medium">Banking</span>
            </div>
          </div>

          <div className="col-4">
            <div className="border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 category-pill">
              <i className="bi bi-house text-primary"></i>
              <span className="small fw-medium">Work From Home</span>
            </div>
          </div>

          <div className="col-4">
            <div className="border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 category-pill">
              <i className="bi bi-people text-primary"></i>
              <span className="small fw-medium">Software Dev</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="col-4">
            <div className="border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 category-pill">
              <i className="bi bi-briefcase text-primary"></i>
              <span className="small fw-medium">Design</span>
            </div>
          </div>

          <div className="col-4">
            <div className="border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 category-pill">
              <i className="bi bi-cash-stack text-primary"></i>
              <span className="small fw-medium">Accounting</span>
            </div>
          </div>

          <div className="col-4">
            <div className="border rounded-pill py-2 px-3 d-flex align-items-center justify-content-center gap-2 category-pill">
              <i className="bi bi-headset text-primary"></i>
              <span className="small fw-medium">Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PopularJobs;
