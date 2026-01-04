import { Grid, Card, CardContent } from "@mui/material";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyHeading from "../../../Components/newui/MyHeading";
import MyButton from "../../../Components/newui/MyButton";
import MyTabs from "../../../Components/newui/MyTab";

import CompanyDetails from "./CompanyDetails";
import AddressDetails from "./AddressDetails";
import RecruiterDetails from "./RecruiterDetails";

import { employerSchema } from "../../../schemas/employerSchema";
import employerDefaultValues from "../employerregisterdetails/defaultvalues/EmployerRegister";
import type { employerRegisterType } from "../../../types/employerRegister";

import { useEmployerFormHandlers } from "./useEmployerFormHandlers";
import { userService } from "../../../service/userService";
import { toastService } from "../../../utils/Toast";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../../Components/newui/MySnackBar";

const stepFields: (keyof employerRegisterType)[][] = [
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
const EmployerRegister = () => {
  const navigate = useNavigate();
   const { showSnackbar } = useSnackbar(); 
  const form = useForm<employerRegisterType>({
    resolver: yupResolver(employerSchema),
    defaultValues: employerDefaultValues,
    mode: "onChange",
    shouldUnregister: false,
  });

  const {
    activeTab,
    completedTabs,
    errorTabs,
    handleNext,
    handleBack,
    handleTabChange,
    handleResetState,
  } = useEmployerFormHandlers(form, stepFields);

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = form;

  // const onSubmit = (data: employerRegisterType) => {
  //   console.log("FORM DATA:", data);

  // };

  const onSubmit: SubmitHandler<employerRegisterType> = async (data) => {
  try {
    data.userType = 2;

    const existingemployer = await userService.getEmployerByEmail(
      data.recruiterEmail?.trim()?.toLowerCase()
    );

    if (existingemployer) {
      showSnackbar("recruiterEmail  already exists", "error");
      return;
    }

    await userService.createUser(data);

    showSnackbar("Registration successful!", "success");

    reset();

    setTimeout(() => navigate("/login"), 1200);
  } catch (error) {
    console.error(error);
    showSnackbar("Something went wrong. Please try again.", "error");
  }
};


  return (
    <Grid container justifyContent="center" py={5}>
      <Grid size={{ xs: 12, md: 10, lg: 8 }}>
        <Card sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
          <CardContent>
            <MyHeading
              title="Company Registration"
              subtitle="Register your company to start hiring"
              center
            />

            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* ---------- TABS ---------- */}
                <MyTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  completedTabs={completedTabs}
                  errorTabs={errorTabs}
                  tabs={[
                    { tabName: "Company", tabContent: <CompanyDetails /> },
                    { tabName: "Address", tabContent: <AddressDetails /> },
                    { tabName: "Recruiter", tabContent: <RecruiterDetails /> },
                  ]}
                />

                {/* ---------- NAV ---------- */}
                <Grid container justifyContent="space-between" mt={2}>
                  <MyButton
                    label="Back"
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeTab === 0}
                  />

                  <MyButton
                    label="Next"
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeTab === stepFields.length - 1}
                  />
                </Grid>

                {/* ---------- ACTIONS ---------- */}
                <Grid container justifyContent="center" spacing={2} mt={3}>
                  <MyButton
                    label="Reset"
                    color="info"
                    type="button"
                    variant="contained"
                    sx={{
                      minWidth: 160,
                      height: 45,
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      form.reset(employerDefaultValues);
                      form.clearErrors();
                      handleResetState();
                    }}
                  />

                  <MyButton
                    label="Register"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      minWidth: 160,
                      height: 45,
                      fontWeight: 600,
                    }}
                    disabled={!isValid}
                  />

                  <MyButton
                    label="Cancel"
                    color="error"
                    type="button"
                    variant="contained"
                    sx={{
                      minWidth: 160,
                      height: 45,
                      fontWeight: 600,
                    }}
                    onClick={() => window.history.back()}
                  />
                </Grid>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EmployerRegister;
