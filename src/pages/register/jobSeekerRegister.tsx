import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Card, CardContent } from "@mui/material";

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
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      Name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneno: "",
      location: "",
      experience: "",
      skills: "",
      portfolio: "",
      resume: null,
    },
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

  const handleReset = () => reset();

  // ================= UI =================
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Box maxWidth={700} width="100%">
        <Card elevation={4} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <MyHeading
              title="Create your profile"
              subtitle="Find your next career opportunity"
              center
            />

            <FormProvider {...jobseeker}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Stack spacing={2.5}>
                  <MyTextField
                    name="Name"
                    label="Full Name"
                    placeholder="Enter your name"
                    required
                  />

                  <MyTextField
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    required
                  />

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <MyTextField
                      name="password"
                      label="Password"
                      type="password"
                      required
                    />
                    <MyTextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      required
                    />
                  </Stack>

                  <MyTextField
                    name="phoneno"
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    required
                  />

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <MyDropDown
                      name="location"
                      label="Current Location"
                      options={locations}
                      required
                    />

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
                  </Stack>

                  <MyTextField
                    name="skills"
                    label="Key Skills"
                    placeholder="React, Node, SQL..."
                    required
                  />
                  <MyTextField
                    name="portfolio"
                    label="Portfolio Website "
                    placeholder="https://yourportfolio.com"
                  />

                  <MyFileUpload
                    name="resume"
                    required
                    accept=".pdf,.doc"
                    color="secondary"
                  />

                  <Stack direction="row" spacing={2} >
                    <MyButton
                      label="Register"
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="w-100 py-2 fw-semibold"
                    />

                    <MyButton
                      label="Reset"
                      type="reset"
                      variant="contained"
                      color="info"
                      className="w-100 py-2 fw-semibold"
                      onClick={handleReset}
                    />

                    <MyButton
                      label="Cancel"
                      type="button"
                      variant="contained"
                      color="error"
                      className="w-100 py-2 fw-semibold"
                      onClick={() => navigate("/")}
                    />
                  </Stack>
                </Stack>
              </Box>
            </FormProvider>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default JobSeekerRegister;
