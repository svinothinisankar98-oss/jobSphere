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


import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../../../Components/newui/MySnackBar";
import { Box } from "@mui/system";
import { useEffect } from "react";


import { useUserService } from "../../../hooks/useUserService";

const { getEmployerById,getEmployerByEmail,createUser,updateUser } = useUserService();

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

  //Detect Edit Mode//

  const { id: employerId } = useParams<{ id: string }>();
  const editData = Boolean(employerId);

  //Form Setup//

  const form = useForm<employerRegisterType>({
    resolver: yupResolver(employerSchema),
    defaultValues: employerDefaultValues,
    mode: "onChange",
    shouldUnregister: false,     //keep tabs data//
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

 // Load Data in Edit Mode//

  useEffect(() => {
    console.log(employerId,'employerId')
    if (editData && employerId) {
      loadEmployer(employerId);
    } else {
      form.reset(employerDefaultValues);
      handleResetState();
    }
    
  }, [editData, employerId]);

  //Fetch Employer Data//

  // const loadEmployer = async (id: string) => {
  //   try {
  //     const employer = await userService.getEmployerById(id);

  //     if (employer) {
  //       form.reset({
  //         ...employerDefaultValues,
  //         ...employer,
         
  //       });
  //     }
  //   } catch (err) {
  //     showSnackbar("Failed to load employer details", "error");
  //   }

  // }

  const loadEmployer = async (id: string) => {
  try {
    const employer = await getEmployerById(id);

    if (employer) {
      form.reset({
        ...employerDefaultValues,
        ...employer,
      });
    }
  } catch (err) {
    showSnackbar("Failed to load employer details", "error");
  }
};

  

    //onsubmit//

    const onSubmit: SubmitHandler<employerRegisterType> = async (data) => {

      //create Mode//
      try {
        data.userType = 2;

        if (!editData) {
          const existingemployer = await getEmployerByEmail(
            data.recruiterEmail?.trim()?.toLowerCase()
          );

          if (existingemployer) {
            showSnackbar("recruiterEmail  already exists", "error");
            return;
          }
          data.createdAt = new Date();
          data.updatedAt = null;
          // data.deletedAt = null;
          const createuser = await createUser(data);
          // await userService.createUser(data);

          showSnackbar("Registration successful!", "success");

          reset();

           navigate("/login") ;
        }

        //edit flow//

        console.log(data, "data",employerId);
        if (editData) {
          data.updatedAt = new Date();
          // data.deletedAt = null;
          const id:any = employerId;
          const updateuser = updateUser(id,data);
          // await userService.updateUser(id, data);
          showSnackbar("Employee Details Updated.", "success");

          reset();

          navigate("/employer-list");
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