import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTextField from "../../Components/ui/CommonTextField";
import CommonButton from "../../Components/ui/CommonButton";
import CommonHeading from "../../Components/ui/CommonHeading";
import { toastService } from "../../utils/Toast";
import { validateField } from "../../utils/validationService";
import "./login.css"
import { useUserService } from "../../hooks/useuserService";
import { authStorage } from "../../utils/authStorage";     //stores login user in localstorage
// import { userService } from "../../service/userService";
const { getUserByEmail } = useUserService();

type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  //state setting for error and passowrd//

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  //handle change event for email password and onchange validation//

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    (Object.keys(form) as (keyof LoginForm)[]).forEach((key) => {
      const error = validateField(key, form[key], form);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toastService.error(Object.values(newErrors)[0]!); // force it to be string
      return false;
    }

    return true;
  };

  //handle submit for login page//

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    //api for get user email//

    //   const users = await userService.getUserByEmail(form.email);

    //   //user and password validation//

    //   if (!users || users.length === 0) {
    //     toastService.error("User not found");
    //     return;
    //   }

    //   const user = users[0];
    //   console.log("what", user);

    //   if (user.password !== form.password) {
    //     toastService.error("Invalid credentials");
    //     return;
    //   }

    //   toastService.success("Login successful");
    //   navigate("/dashboard");
    // };

    //call api service//

    const user = await getUserByEmail(form.email);

    // USER NOT FOUND
    if (!user) {
      toastService.error("User not found");
      return;
    }

    // PASSWORD CHECK
    if (user.password !== form.password) {
      toastService.error("Invalid credentials");
      return;
    }

    //usertype check//

    const userType: number = user?.userType;

    if (userType == 1) {
      authStorage.set({                 //save into login state auth change and update ui instandly// 
        id: user?.id,
        email: user?.email
      });
      toastService.success("Login successful");
      navigate("/");
    }
  };

  return (
    <div className="container-fluid min-vh-50 p-0">
      <div className="row g-0 min-vh-50">
        {/* LEFT SECTION */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center px-4">
          <div className="left-info-card text-white">
            <h1 className="fw-bold mb-3">Find Your Dream Job</h1>

            <p className="fs-6 mb-4">
              Login to explore opportunities and hire talent faster.
            </p>

            <img
              src="/image/jobSearch.png"
              alt="Job Search"
              className="img-fluid"
              style={{ maxWidth: "260px" }}
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center px-4">
          <div
            className="card shadow-sm border-0 rounded-4 w-100"
            style={{ maxWidth: "420px" }}
          >
            <div className="card-body p-4">
              <CommonHeading
                title="Welcome Back 👋"
                subtitle="Login to your account"
              />

              <form onSubmit={handleSubmit}>
                <CommonTextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="Enter email"
                  error={errors.email}
                  onChange={handleChange}
                />

                <div className="position-relative">
                  <CommonTextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    placeholder="Enter password"
                    error={errors.password}
                    onChange={handleChange}
                  />

                  <span
                    className="password-eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    />
                  </span>
                </div>

                <div className="text-end mb-3">
                  <small
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </small>
                </div>

                <CommonButton
                  label="Login"
                  type="submit"
                  className="btn btn-primary w-100"
                />
              </form>

              <div className="text-center mt-3">
                <small>
                  Don’t have an account?{" "}
                  <span
                    className="text-primary fw-semibold"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
