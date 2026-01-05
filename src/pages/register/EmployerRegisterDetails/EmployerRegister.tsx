import { Grid, Card, CardContent, TextField } from "@mui/material";
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
import { Box } from "@mui/system";
import { useState } from "react";
import MyTextField from "../../../Components/newui/MyTextField";
import EmployerList from "./EmployerList";

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
    "remoteopportunity",
    "employmentType",
  ],
];
const EmployerRegister = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<employerRegisterType[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const form = useForm<employerRegisterType>({
    resolver: yupResolver(employerSchema),
    defaultValues: employerDefaultValues,
    mode: "onChange",
    shouldUnregister: false,
  });

  //used for useformhandlers for employers//

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

  const handleSearch = async () => {
    if (!searchText.trim()) {
      showSnackbar("Enter company or recruiter name", "warning");
      return;
    }

    try {
      setLoading(true);

      const data = await userService.getRecruiterDetails(searchText.trim());
      const searhKeyWord = searchText?.trim()?.toLowerCase();
      const filterrecruiter = data?.filter((d: any) => {
        const companyName: string = d?.companyName?.trim()?.toLowerCase();
        const recruiterName: string = d?.recruiterName?.trim()?.toLowerCase();
        const recruiterEmail:string = d?.recruiterEmail.trim()?.toLowerCase();
        return (
          companyName?.includes(searhKeyWord) ||
          recruiterName?.includes(searhKeyWord)||
          recruiterEmail?.includes(searhKeyWord)
        );
      });

      filterrecruiter?.map((d: any, index: number) => {
        d.serialNo = index + 1;
      });
      console.log(filterrecruiter?.length, "from leangth", searchText);
      setSearchResults(filterrecruiter);
    } catch (error) {
      console.error(error);
      showSnackbar("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

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
      setSearchResults([]);
      setSearchText("");

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.error(error);
      showSnackbar("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Grid container justifyContent="center" py={5}>
      <Grid size={{ xs: 12, md: 10, lg: 8 }}>
        <Card sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
        <CardContent>
          <MyHeading
            title="Company Registration"
            subtitle="Register your company to start hiring"
            center
          />
          <Box width="100%" display="flex" justifyContent="flex-end" mb={3}>
            <Box display="flex" gap={2} width={{ xs: "100%", sm: 420 }}>
              {/* <TextField
                  size="small"
                  
                  placeholder="Search company / recruiter"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                /> */}
              <MyTextField
                placeholder="Search company / recruiter"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <MyButton
                label="Search"
                variant="contained"
                type="button"
                sx={{ minWidth: 110, height: 40 }}
                // onClick={() => {
                //   console.log("Search value:", searchText);
                // }}
                onClick={handleSearch}
              />
            </Box>
          </Box>

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
      <Grid size={{ xs: 14, md: 12, lg: 10 }}>
        {searchText && <EmployerList loading={loading} data={searchResults} />}
      </Grid>
    </Grid>
  );
};

export default EmployerRegister;
