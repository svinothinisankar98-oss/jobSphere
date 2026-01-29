import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Typography,
} from "@mui/material";



import {
  useForm,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useUserService } from "../../hooks/useUserService";
import { authStorage } from "../../utils/authStorage";
import { useSnackbar } from "../../Components/newui/MySnackBar";
import MyButton from "../../Components/newui/MyButton";

import { loginSchema } from "../../schemas/LoginSchemas";
import MyTextField from "../../Components/newui/MyTextField";

const { getUserByEmail, getEmployerByEmail } = useUserService();



type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const methods = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (form: LoginForm) => {
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
    <Grid
      container
      minHeight="80vh"
      alignItems="center"
      justifyContent="center"
      
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          mb={3}
          sx={{ color: "#3a2ee3" }}
        >
          Welcome Back
        </Typography>

        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <MyTextField
              name="email"
                label="Email address"
                fullWidth
             size="medium"
              required
              sx={{
                mb: 2,
               
                
              }}
            />

            <MyTextField
              name="password"
               type="password"
                label="Password"
                size="medium"
              fullWidth
              required
              
              sx={{
                mb: 2,
                
               
              }}
            />

            <Typography
              textAlign="right"
              color="#3a2ee3"
              fontSize={14}
              sx={{ cursor: "pointer", mb: 3 }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Typography>

            <Box display="flex" justifyContent="center">
              <MyButton
                label="Login"
                type="submit"
                
                sx={{
                  minWidth: 180,
                  height: 46,
                  fontWeight: 600,
                  borderRadius: 12,
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(58,46,227,.35)",
                  },
                }}
              />
            </Box>

            <Typography textAlign="center" mt={3} color="text.secondary">
              New to this portal?
            </Typography>

            <Typography
              textAlign="center"
              color="#3a2ee3"
              fontWeight={600}
              sx={{
                cursor: "pointer",
                mt: 0.5,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/job-seeker-register")}
            >
              REGISTER HERE
            </Typography>
          </Box>
        </FormProvider>
      </Paper>
    </Grid>
  );
};

export default Login;
