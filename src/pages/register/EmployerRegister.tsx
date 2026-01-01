import { useState } from "react";
import { Box, Card, CardContent, Grid } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MyHeading from "../../Components/newui/MyHeading";
import MyButton from "../../Components/newui/MyButton";
import MyTabs from "../../Components/newui/MyTab";

import CompanyDetails from "./employerregisterdetails/CompanyDetails";
import AddressDetails from "./employerregisterdetails/AddressDetails";
import RecruiterDetails from "./employerregisterdetails/RecruiterDetails";

import { employerSchema } from "../../schemas/employerSchema";
import type { EmployerRegister } from "../../schemas/employerSchema";
import employerDefaultValues from "../../config/EmployerRegister";





// DEFAULT VALUES  //

// const defaultValues: EmployerRegister = {
//   companyName: "",
//   email: "",
//   phone: "",
//   website: "",
//   industry: "",
//   companySize: "",
//   foundedYear: null,

//   address1: "",
//   address2: "",
//   city: "",
//   state: "",
//   country: "",
//   zip: "",

//   recruiterName: "",
//   recruiterEmail: "",
//   recruiterPhone: "",
//   designation: "",

//   password: "",
//   confirmPassword: "",
//   userType: 2,
// };

//component//

const EmployerRegister = () => {
  const [activeTab, setActiveTab] = useState(0); //state management active tab =0//

  const [completedTabs, setCompletedTabs] = useState<number[]>([]); //store tabs are success validated//

  const [errorTabs, setErrorTabs] = useState<number[]>([]); //store tabs that have validation errors//

  //Hook form setup//

  const employerregister = useForm<EmployerRegister>({
    resolver: yupResolver(employerSchema),
    defaultValues: employerDefaultValues,
    mode: "onChange",
    shouldUnregister: false,
    reValidateMode: "onChange",
  });

  //helpers//

  const {
    handleSubmit,
    formState: { isValid },
    trigger,
  } = employerregister;

  const stepFields: (keyof EmployerRegister)[][] = [
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
  //all steps are valid and user clicks Register//

  const onSubmit = async (data: EmployerRegister) => {
    console.log("FORM DATA:", data);
  };

  //handle next button//

  const handleNext = async () => {
    const fields = stepFields[activeTab];
    const isValid = await trigger(fields);

    if (isValid) {
      setCompletedTabs((prev) => {
        if (prev.includes(activeTab)) {
          return prev;
        } else {
          return [...prev, activeTab];
        }
      });

      setErrorTabs((prev) => prev.filter((t) => t !== activeTab));
      console.log(errorTabs, "errorTabs", activeTab);
    } else {
      setErrorTabs((prev) =>
        prev.includes(activeTab) ? prev : [...prev, activeTab]
      );
    }

    if (activeTab < stepFields.length - 1) {
      setActiveTab((prev) => prev + 1);
    }
  };

  //handle back//

  // const handleBack = () => {
  //   setActiveTab((prev) => Math.max(prev - 1, 0));
  // };

  const handleBack = async () => {
    const fields = stepFields[activeTab];
    const isValid = await trigger(fields);

    if (isValid) {
      setCompletedTabs((prev) => {
        if (prev.includes(activeTab)) {
          return prev;
        } else {
          return [...prev, activeTab];
        }
      });

      setErrorTabs((prev) => prev.filter((t) => t !== activeTab));
      console.log(errorTabs, "errorTabs", activeTab);
    } else {
      setErrorTabs((prev) =>
        prev.includes(activeTab) ? prev : [...prev, activeTab]
      );
    }

    
      setActiveTab((prev) => Math.max(prev - 1, 0));
    
  };
  

  const handleTabChange = async (nextTab: number) => {
    const fields = stepFields[activeTab];
    const isValid = await trigger(fields);

    //if isvalid setcompletedtabs for previous for duplicate remove//

    if (isValid) {
      setCompletedTabs((prev) =>
        prev.includes(activeTab) ? prev : [...prev, activeTab]
      );
      setErrorTabs((prev) => prev.filter((t) => t !== activeTab)); //Remove tab from error list//
    } else {
      setErrorTabs(
        (prev) => (prev.includes(activeTab) ? prev : [...prev, activeTab]) //If invalid → mark error//
      );
    }

    setActiveTab(nextTab);
  };

  return (
    <Grid container justifyContent="center" py={5}>
      <Grid size={{ xs: 12, md: 10, lg: 8 }}>
        <Card
          sx={{
            maxWidth: 800,
            width: "100%",
            margin: "0 auto",
            padding: 2,
          }}
        >
          <CardContent>
            <MyHeading
              title="Company Registration"
              subtitle="Register your company to start hiring"
              center
            />

            <FormProvider {...employerregister}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* ---------------- TABS ---------------- */}
                <Grid container>
                  <Grid size={{ xs: 12 }}>
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
                  </Grid>
                </Grid>

                {/* ---------------- NAV BUTTONS ---------------- */}
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  mt={2}
                >
                  <Grid>
                    <MyButton
                      label="Back"
                      type="button"
                      variant="outlined"
                      onClick={handleBack}
                      disabled={activeTab === 0}
                    />
                  </Grid>

                  <Grid>
                    <MyButton
                      label="Next"
                      type="button"
                      variant="contained"
                      onClick={handleNext}
                      disabled={activeTab === stepFields.length - 1}
                    />
                  </Grid>
                </Grid>

                {/* ---------------- FINAL ACTIONS ---------------- */}
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                  mt={3}
                >
                 

                  {/* RESET */}
                  <Grid>
                    <MyButton
                      label="Reset"
                      type="button"
                      variant="contained"
                      color="info"
                      sx={{
                        minWidth: 160,
                        height: 45,
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        employerregister.reset(employerDefaultValues);
                        employerregister.clearErrors();
                        setActiveTab(0);
                        setCompletedTabs([]);
                        setErrorTabs([]);
                      }}
                    />
                  </Grid>
                  <Grid>
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
                  </Grid>

                  {/* CANCEL */}
                  <Grid>
                    <MyButton
                      label="Cancel"
                      type="button"
                      variant="contained"
                      color="error"
                      sx={{
                        minWidth: 160,
                        height: 45,
                        fontWeight: 600,
                      }}
                      onClick={() => window.history.back()}
                    />
                  </Grid>
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
