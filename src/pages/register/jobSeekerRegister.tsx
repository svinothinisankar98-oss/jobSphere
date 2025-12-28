import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";

import MyTextField from "../../Components/newui/MyTextField";
import MyDropDown from "../../Components/newui/MyDropDown";
import MyButton from "../../Components/newui/MyButton";
import MyHeading from "../../Components/newui/MyHeading";
import { locationService } from "../../service/locationService";
import { userService } from "../../service/userService";
import { toastService } from "../../utils/Toast";
import { fileToBase64 } from "../../utils/fileTOBse64Convert";

import type { JobSeeker, Option } from "../../types/jobSeeker";
import { yupResolver } from "@hookform/resolvers/yup";
import { jobSeekerSchema } from "../../schemas/jobSeekerSchema";
import MyFileUpload from "../../Components/newui/MyFileupLoad";

// ======================================================

const JobSeekerRegister = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const methods = useForm<JobSeeker>({
    resolver: yupResolver(jobSeekerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      Name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneno: "",
      location: "",
      experience: "",
      skills: "",
      resume: null, 
    },
  });

  const { setValue, handleSubmit, reset } = methods;

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

  // This runs when user clicks Register.//
  const onSubmit: SubmitHandler<JobSeeker> = async (data) => {
    console.log("calll right");
    try {
      if (!data.resume) {
        toastService.error("Resume is required");
        return;
      }

      const base64 = await fileToBase64(data.resume);
      data.resumeBase64 = base64;
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

  const handleReset = () => {
    reset();
  };
  // ================= UI =================
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-7 col-lg-8 col-md-10">
          <div className="card border-0 shadow rounded-4">
            <div className="card-body p-4 p-md-5">
              <MyHeading
                title="Create your profile"
                subtitle="Find your next career opportunity"
                center
              />

              <FormProvider {...methods}>
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <Stack spacing={2.5}>
                    <MyTextField name="Name" label="Full Name" required />
                    <MyTextField name="email" label="Email" required />

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

                    <MyFileUpload
                      name="resume"
                      // label="Upload Resume"
                      required
                      accept=""
                      color="secondary"
                      // onChange={(file) => console.log(file)}
                    />

                    <Stack direction="row" spacing={2} mt={3}>
                      <MyButton
                        label="Register"
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        className="w-100 py-2 fw-semibold"
                      />
                      <MyButton
                        label="Reset"
                        type="reset"
                        variant="contained"
                        color="info"
                        size="small"
                        className="w-100 py-2 fw-semibold"
                        onClick={handleReset}
                      />

                      <MyButton
                        label="Cancel"
                        type="button"
                        variant="contained"
                        color="error"
                        size="small"
                        className="w-100 py-2 fw-semibold"
                        onClick={() => navigate("/")}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerRegister;
