import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import CommonTextField from "../../Components/ui/CommonTextField";
import CommonButton from "../../Components/ui/CommonButton";
import CommonHeading from "../../Components/ui/CommonHeading";
import { toastService } from "../../utils/Toast";
import { validateField } from "../../utils/validationService";
import "./login.css";
import { useUserService } from "../../hooks/useUserService";
import { authStorage } from "../../utils/authStorage";

const { getUserByEmail, getEmployerByEmail } = useUserService();

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      toastService.error(Object.values(newErrors)[0]!);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = await getUserByEmail(form.email);
    const employer = await getEmployerByEmail(form.email);

    if (!user && !employer) {
      toastService.error("User not found");
      return;
    }

    if (user && user.password !== form.password) {
      toastService.error("Invalid credentials");
      return;
    }

    if (employer && employer.password !== form.password) {
      toastService.error("Invalid credentials");
      return;
    }

    const userType = user?.userType || employer?.userType || 0;

    if (userType === 1 || userType === 2) {
      authStorage.set({
        id: user?.id,
        email: user?.email,
      });
      toastService.success("Login successful");
      navigate("/");
    }

    if (userType === 3) {
      navigate("/employer-list");
    }
  };

  return (
    <Grid container minHeight="100vh">
      {/* LEFT SECTION */}
      {!isMobile && (
       <Grid  size={{ xs: 12, md: 6 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
          
        >
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Find Your Dream Job
            </Typography>

            <Typography mb={3}>
              Login to explore opportunities and hire talent faster.
            </Typography>

            <Box
              component="img"
              src="/image/jobSearch.png"
              alt="Job Search"
              sx={{ maxWidth: 260, width: "100%" }}
            />
          </Box>
        </Grid>
      )}

      {/* RIGHT SECTION */}
      

        <Grid  size={{ xs: 12, md: 6 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={2}
          
        >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
          }}
        >
          <CommonHeading
            title="Welcome Back 👋"
            subtitle="Login to your account"
          />

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <CommonTextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              placeholder="Enter email"
              error={errors.email}
              onChange={handleChange}
            />

            <Box position="relative">
              <CommonTextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Enter password"
                error={errors.password}
                onChange={handleChange}
              />

              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            <Typography
              variant="body2"
              textAlign="right"
              color="primary"
              sx={{ cursor: "pointer", mt: 1 }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>

            <CommonButton
              label="Login"
              type="submit"
              className="btn btn-primary w-100"
            />

            <Typography textAlign="center" mt={2}>
              Don’t have an account?{" "}
              <span
                style={{ color: "#1976d2", cursor: "pointer", fontWeight: 600 }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
