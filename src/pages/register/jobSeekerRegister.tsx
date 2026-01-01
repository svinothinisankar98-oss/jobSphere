import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Card, CardContent, Grid } from "@mui/material";

import MyTextField from "../../Components/newui/MyTextField";
import MyDropDown from "../../Components/newui/MyDropDown";
import MyButton from "../../Components/newui/MyButton";
import MyHeading from "../../Components/newui/MyHeading";
import MyFileUpload from "../../Components/newui/MyFileupLoad";

import { locationService } from "../../service/locationService";
import { userService } from "../../service/userService";
import { toastService } from "../../utils/Toast";
import { fileToBase64 } from "../../utils/fileTOBse64Convert";

import type { JobSeeker, Option } from "../../types/jobSeeker";
import { yupResolver } from "@hookform/resolvers/yup";
import { jobSeekerSchema } from "../../schemas/jobSeekerSchema";
import jobseekerDefaultValues from "../../config/JobSeeker";

// const defaultValues: JobSeeker = {
//   Name: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
//   phoneno: "",
//   location: "",
//   experience: "",
//   skills: "",
//   portfolio: "",
//   resume: null,
// };

const JobSeekerRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const jobseeker = useForm({
    resolver: yupResolver(jobSeekerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: jobseekerDefaultValues,
  });

  const { handleSubmit, reset } = jobseeker;

  const [locations, setLocations] = useState<Option[]>([]);

  // ================= FETCH LOCATIONS =================
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationService.getLocations();
        setLocations(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocations();
  }, []);

  // ================= SUBMIT =================
  const onSubmit: SubmitHandler<JobSeeker> = async (data) => {
    try {
      if (data.resume) {
        const base64 = await fileToBase64(data.resume);
        data.resumeBase64 = base64;
        // toastService.error("Resume is required");
        // return;
      }

      data.userType = 1;

      const existingUser = await userService.getUserByEmail(data.email);
      if (existingUser) {
        toastService.error("Email already exists");
        return;
      }

      await userService.createUser(data);

      toastService.success("Registration successful!");

      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleReset = () => reset();

  // ================= UI =================
  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" px={2}>
      <Box maxWidth={700} width="100%">
        <Card elevation={4} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <MyHeading
              title="Create your profile"
              subtitle="Find your next career opportunity"
              center
            />

            <FormProvider {...jobseeker}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2.5}>
                  <Grid size={12}>
                    <MyTextField name="Name" label="Full Name" required />
                  </Grid>

                  <Grid size={12}>
                    <MyTextField name="email" label="Email" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MyTextField
                      name="password"
                      label="Password"
                      type="password"
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MyTextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      required
                    />
                  </Grid>

                  <Grid size={12}>
                    <MyTextField
                      name="phoneno"
                      label="Mobile Number"
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MyDropDown
                      name="location"
                      label="Current Location"
                      options={locations}
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <MyDropDown
                      name="experience"
                      label="Work Experience"
                      required
                      options={[
                        { id: 1, item: "Fresher" },
                        { id: 2, item: "0–1 Years" },
                        { id: 3, item: "1–3 Years" },
                        { id: 4, item: "3–5 Years" },
                        { id: 5, item: "5+ Years" },
                      ]}
                    />
                  </Grid>

                  <Grid size={12}>
                    <MyTextField name="skills" label="Key Skills" required />
                  </Grid>

                  <Grid size={12}>
                    <MyTextField name="portfolio" label="Portfolio Website" />
                  </Grid>

                  <Grid size={12}>
                    <MyFileUpload name="resume" required accept=".pdf,.doc" />
                  </Grid>

                  {/* ACTION BUTTONS */}
                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                    sx={{
                      margin: "0 auto", // centers container
                    }}
                  >
                   

                    <Grid>
                      <MyButton
                        label="Reset"
                        type="button"
                        variant="contained"
                        color="info"
                        sx={{ minWidth: 160, height: 45,fontWeight: 600 }}
                        onClick={() => reset()}
                      />
                    </Grid>
                     <Grid>
                      <MyButton
                        label="Register"
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ minWidth: 160, height: 45 , fontWeight: 600}}
                      />
                    </Grid>

                    <Grid>
                      <MyButton
                        label="Cancel"
                        type="button"
                        variant="contained"
                        color="error"
                        sx={{ minWidth: 160, height: 45 ,fontWeight: 600}}
                        onClick={() => navigate("/")}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </FormProvider>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default JobSeekerRegister;
