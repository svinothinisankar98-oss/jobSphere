import { useState } from "react";
import CommonButton from "../../Components/ui/CommonButton";
import CommonTextField from "../../Components/ui/CommonTextField";
import CommonDropdown from "../../Components/ui/CommonDropdown";
import CommonHeading from "../../Components/ui/CommonHeading";
import { useForm } from "react-hook-form";

/* ================= TYPES ================= */

type CompanyForm = {
  companyName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  foundedYear: string;

  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  designation: string;

  password: string;
  confirmPassword: string;
  userType?: number;
};

/* ================= CONSTANTS ================= */

const INDUSTRY_OPTIONS = [
  { id: 1, item: "IT" },
  { id: 2, item: "Finance" },
  { id: 3, item: "Healthcare" },
  { id: 4, item: "Education" },
];

const COMPANY_SIZE_OPTIONS = [
  { id: 1, item: "1–10" },
  { id: 2, item: "11–50" },
  { id: 3, item: "51–200" },
  { id: 4, item: "200+" },
];

/* ================= INITIAL STATE ================= */

const initialForm: CompanyForm = {
  companyName: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  companySize: "",
  foundedYear: "",

  address1: "",
  address2: "",
  city: "",
  state: "",
  country: "",
  zip: "",

  recruiterName: "",
  recruiterEmail: "",
  recruiterPhone: "",
  designation: "",

  password: "",
  confirmPassword: "",
  userType: 2,
};

/* ================= COMPONENT ================= */

const EmployerRegister = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState<CompanyForm>(initialForm);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextTab = () => setActiveTab((prev) => prev + 1);
  const prevTab = () => setActiveTab((prev) => prev - 1);

  const handleReset = () => {
    setForm(initialForm);
    setActiveTab(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Company Register Data:", form);
  };

  /* ================= UI ================= */

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <CommonHeading
                title="Company Registration"
                subtitle="Register your company to start hiring"
                center
              />

              {/* ================= TABS HEADER ================= */}
              <ul className="nav nav-tabs mb-4">
                {["Company", "Address", "Recruiter"].map((tab, index) => (
                  <li className="nav-item" key={tab}>
                    <button
                      type="button"
                      className={`nav-link ${
                        activeTab === index + 1 ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(index + 1)}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit}>
                {/* ================= TAB 1 – COMPANY ================= */}
                {activeTab === 1 && (
                  <>
                    <CommonHeading title="Company Details" level={5} />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <CommonTextField
                          label="Company Name"
                          name="companyName"
                          value={form.companyName}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Company Email"
                          name="email"
                          type="email"
                          value={form.email}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Company Phone"
                          name="phone"
                          value={form.phone}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Company Website"
                          name="website"
                          value={form.website}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <CommonDropdown
                          label="Industry"
                          name="industry"
                          value={form.industry}
                          options={INDUSTRY_OPTIONS}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <CommonDropdown
                          label="Company Size"
                          name="companySize"
                          value={form.companySize}
                          options={COMPANY_SIZE_OPTIONS}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <CommonTextField
                          label="Founded Year"
                          name="foundedYear"
                          value={form.foundedYear}
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ================= TAB 2 – ADDRESS ================= */}
                {activeTab === 2 && (
                  <>
                    <CommonHeading title="Address Details" level={5} />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <CommonTextField
                          label="Address 1"
                          name="address1"
                          value={form.address1}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Address2"
                          name="address2"
                          value={form.address2}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <CommonTextField
                          label="City"
                          name="city"
                          value={form.city}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <CommonTextField
                          label="State"
                          name="state"
                          value={form.state}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <CommonTextField
                          label="ZIP Code"
                          name="zip"
                          value={form.zip}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Country"
                          name="country"
                          value={form.country}
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ================= TAB 3 – RECRUITER + PASSWORD ================= */}
                {activeTab === 3 && (
                  <>
                    <CommonHeading
                      title="Recruiter & Login Details"
                      level={5}
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <CommonTextField
                          label="Recruiter Name"
                          name="recruiterName"
                          value={form.recruiterName}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Recruiter Email"
                          name="recruiterEmail"
                          type="email"
                          value={form.recruiterEmail}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Recruiter Phone"
                          name="recruiterPhone"
                          value={form.recruiterPhone}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Designation"
                          name="designation"
                          value={form.designation}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Password"
                          name="password"
                          type="password"
                          value={form.password}
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <CommonTextField
                          label="Confirm Password"
                          name="confirmPassword"
                          type="password"
                          value={form.confirmPassword}
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ================= TAB NAVIGATION ================= */}
                <div className="d-flex justify-content-between mt-4">
                  {activeTab > 1 && (
                    <CommonButton
                      label="Back"
                      type="button"
                      variant="secondary"
                      onClick={prevTab}
                    />
                  )}

                  {activeTab < 3 && (
                    <CommonButton
                      label="Next"
                      type="button"
                      variant="primary"
                      onClick={nextTab}
                    />
                  )}
                </div>

                {/* ================= FINAL ACTIONS ================= */}
                <hr className="my-4" />

                <div className="d-flex justify-content-center gap-2">
                  
                  <CommonButton
                    label="Register"
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-20 py-2 fw-semibold"

                    onClick={handleSubmit}
                  />

                  <CommonButton
                    label="Reset"
                    type="button"
                    variant="secondary"
                    className="w-20 py-2 fw-semibold"
                    size="md"
                    onClick={handleReset}
                  />

                  <CommonButton
                    label="Cancel"
                    type="button"
                    variant="info"
                    size="md"
                    className="w-20 py-2 fw-semibold"
                    onClick={() => window.history.back()}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;
