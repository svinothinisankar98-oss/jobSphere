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

import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../../../Components/newui/MySnackBar";
import { Box } from "@mui/system";
import { useEffect } from "react";

import { useLocation } from "react-router-dom";

//(Tabs Validation)//

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

//Form Setup//

const EmployerRegister = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  // const location = useLocation();
  // const editData = location.state?.editData;

  const { id: employerId } = useParams<{ id: string }>();
  const editData = Boolean(employerId);

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

  // useEffect(() => {
  //   if (editData) {
  //     // Edit Mode
  //     form.reset({
  //       ...employerDefaultValues,
  //       ...editData,
  //     });
  //   } else {
  //     // New Register Mode
  //     form.reset(employerDefaultValues);
  //     handleResetState(); // reset tabs & validation state
  //   }
  // }, [editData]);

  useEffect(() => {
    console.log(employerId,'employerId')
    if (editData && employerId) {
      loadEmployer(employerId);
    } else {
      form.reset(employerDefaultValues);
      handleResetState();
    }
    
  }, [editData, employerId]);

  const loadEmployer = async (id: string) => {
    try {
      const employer = await userService.getEmployerById(id);

      if (employer) {
        form.reset({
          ...employerDefaultValues,
          ...employer,
         
        });
      }
    } catch (err) {
      showSnackbar("Failed to load employer details", "error");
    }

  }

  

    //onsubmit//

    const onSubmit: SubmitHandler<employerRegisterType> = async (data) => {
      try {
        data.userType = 2;

        if (!editData) {
          const existingemployer = await userService.getEmployerByEmail(
            data.recruiterEmail?.trim()?.toLowerCase()
          );

          if (existingemployer) {
            showSnackbar("recruiterEmail  already exists", "error");
            return;
          }
          data.createdAt = new Date();
          data.updatedAt = null;
          // data.deletedAt = null;
          await userService.createUser(data);

          showSnackbar("Registration successful!", "success");

          reset();

          setTimeout(() => navigate("/login"), 1200);
        }

        //edit flow//

        console.log(data, "data",employerId);
        if (editData) {
          data.updatedAt = new Date();
          // data.deletedAt = null;
          const id:any = employerId;
          await userService.updateUser(id, data);
          showSnackbar("Employee Details Updated.", "success");

          reset();

          setTimeout(() => navigate("/employer-list"), 1200);
        }
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
                title={editData ? "Edit Company" : "Company Registration"}
                subtitle={
                  editData
                    ? "Update your company details"
                    : "Register your company to start hiring"
                }
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
                  {/* <MyTextField
                  placeholder="Search company / recruiter"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                /> */}

                  {/* <MyButton
                  label="Search"
                  variant="contained"
                  type="button"
                  sx={{ minWidth: 110, height: 40 }}
                  // onClick={() => {
                  //   console.log("Search value:", searchText);
                  // }}
                  onClick={handleSearch}
                /> */}
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
                      {
                        tabName: "Recruiter",
                        tabContent: <RecruiterDetails />,
                      },
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
                      label={!editData ? "Register" : "Update"}
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

        {/* <Grid size={{ xs: 14, md: 12, lg: 10 }}>
        {searchText.trim() && (<EmployerList loading={loading} data={searchResults} />        //// Search Result Render//
)}          
      </Grid> */}
      </Grid>
    );
  };


export default EmployerRegister;