import { useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyHeading from "../../Components/newui/MyHeading";
import MyButton from "../../Components/newui/MyButton";
import MyTabs from "../../Components/newui/MyTab";

import CompanyDetails from "./EmployerRegisterDetails/CompanyDetails";
import AddressDetails from "./EmployerRegisterDetails/AddressDetails";
import RecruiterDetails from "./EmployerRegisterDetails/RecruiterDetails";

import { employerSchema } from "../../schemas/employerSchema";
import type { CompanyForm } from "../../schemas/employerSchema";

/* ================= DEFAULT VALUES ================= */

const defaultValues: CompanyForm = {
  companyName: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  companySize: "",
  foundedYear: null,

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
  const [activeTab, setActiveTab] = useState(0);

  const methods = useForm<CompanyForm>({
    resolver: yupResolver(employerSchema),
    defaultValues,
    mode: "onChange",
    shouldUnregister: false,
  });

  const { handleSubmit, trigger } = methods;

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data: CompanyForm) => {
    console.log("FORM DATA:", data);
  };

  /* ---------------- STEP VALIDATION ---------------- */
  const stepFields: (keyof CompanyForm)[][] = [
    ["companyName", "email", "phone", "website", "industry", "companySize"],
    ["address1", "city", "state", "country", "zip"],
    [
      "recruiterName",
      "recruiterEmail",
      "recruiterPhone",
      "designation",
      "password",
      "confirmPassword",
    ],
  ];

  /* ---------------- NEXT ---------------- */
  const handleNext = async () => {
    const isValid = await trigger(stepFields[activeTab]);
    if (isValid) setActiveTab((prev) => prev + 1);
  };

  /* ---------------- BACK ---------------- */
  const handleBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  /* ---------------- TAB CLICK ---------------- */
  const handleTabChange = async (nextTab: number) => {
    // Allow backward freely
    if (nextTab < activeTab) {
      setActiveTab(nextTab);
      return;
    }

    // Validate before moving forward
    const isValid = await trigger(stepFields[activeTab]);
    if (isValid) {
      setActiveTab(nextTab);
    }
  };

  return (
    <Box display="flex" justifyContent="center" py={5}>
      <Box width="100%" maxWidth={900}>
        <Card elevation={6}>
          <CardContent>
            <MyHeading
              title="Company Registration"
              subtitle="Register your company to start hiring"
              center
            />

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* TABS */}
                <MyTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  tabs={[
                    { tabName: "Company", tabContent: <CompanyDetails /> },
                    { tabName: "Address", tabContent: <AddressDetails /> },
                    { tabName: "Recruiter", tabContent: <RecruiterDetails /> },
                  ]}
                />

                {/* NAV BUTTONS */}
                <Stack direction="row" justifyContent="space-between" mt={2}>
                  {activeTab > 0 && (
                    <MyButton
                      label="Back"
                      type="button"
                      variant="outlined"
                      onClick={handleBack}
                    />
                  )}

                  {activeTab < 2 && (
                    <MyButton
                      label="Next"
                      type="button"
                      variant="contained"
                      onClick={handleNext}
                    />
                  )}
                </Stack>

                {/* FINAL BUTTONS */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  mt={4}
                >
                  <MyButton
                    label="Register"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 250 }}
                  />

                  <MyButton
                    label="Reset"
                    type="reset"
                    variant="contained"
                    color="info"
                    sx={{ minWidth: 250 }}
                    onClick={() => methods.reset(defaultValues)}
                  />

                  <MyButton
                    label="Cancel"
                    type="button"
                    variant="contained"
                    color="error"
                    sx={{ minWidth: 250 }}
                    onClick={() => window.history.back()}
                  />
                </Stack>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EmployerRegister;
