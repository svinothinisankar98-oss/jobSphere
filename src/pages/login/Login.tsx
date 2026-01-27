import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CommonTextField from "../../Components/ui/CommonTextField";
import { validateField } from "../../utils/validationService";
import { useUserService } from "../../hooks/useUserService";
import { authStorage } from "../../utils/authStorage";
import { useSnackbar } from "../../Components/newui/MySnackBar";
import MyButton from "../../Components/newui/MyButton";
import { alignItems, justifyContent } from "@mui/system";

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

  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    (Object.keys(form) as (keyof LoginForm)[]).forEach((key) => {
      const error = validateField(key, form[key], form);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
     
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = await getUserByEmail(form.email);
      const employer = await getEmployerByEmail(form.email);

      if (!user && !employer) {
        showSnackbar("User not found", "error");
        return;
      }

      if (user && user.password !== form.password) {
        showSnackbar("Invalid credentials", "error");
        return;
      }

      if (employer && employer.password !== form.password) {
        showSnackbar("Invalid credentials", "error");
        return;
      }

      const userType = user?.userType || employer?.userType || 0;

      if (userType === 1 || userType === 2) {
        authStorage.set({
          id: user?.id,
          email: user?.email,
        });

        showSnackbar("Login successful", "success");
        navigate("/");
      } else if (userType === 3) {
        navigate("/employer-list");
      }
    } catch {
      showSnackbar("Something went wrong. Try again.", "error");
    }
  };

  return (
    <Grid container minHeight="100vh" bgcolor="#fff">
      {/* LEFT IMAGE */}
      <Grid size={{xs:12,md:6}}
        
        display={{ xs: "auto", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        px={6}
      >
        <Box
          component="img"
          src="/image/jobSearch.png"
          sx={{ maxWidth: 420, width: "100%" }}
        />
      </Grid>

      {/* RIGHT FORM */}
      <Grid size={{xs:12,md:6}}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ xs: 2, sm: 4 }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={600}
            color="#3a2ee3"
            mb={3}
          >
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <CommonTextField
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              sx={{
                mb: 2,
                "& input": { padding: "14px" },
                
                borderRadius: 1.5,
              }}
            />

            <CommonTextField
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              sx={{
                mb: 2,
                "& input": { padding: "14px" },
               
                borderRadius: 1.5,
              }}
            />

            <Typography
              textAlign="right"
              color="#0e0bb3"
              fontSize={14}
              sx={{ cursor: "pointer", mb: 3 }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Typography>

           <Box
  display="flex"
  justifyContent="center"
   mt={{ xs: 2, sm: 3 }}
>
  <MyButton
    label="Login"
    type="submit"
    variant="contained"
    color="primary"
    sx={{
      minWidth: 160,
      height: 45,
      fontWeight: 600,
    }}
  />
</Box>

<Typography
  textAlign="center"
  mt={3}
  color="text.secondary"
>
  New to this portal?
</Typography>

<Typography
  textAlign="center"
  color="primary.main"
  fontWeight={600}
  sx={{
    cursor: "pointer",
    mt: 0.5,
    "&:hover": { textDecoration: "underline" },
  }}
  onClick={() => navigate("/register")}
>
  REGISTER HERE
</Typography>

          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
