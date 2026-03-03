import { Grid, Card, CardContent, Tooltip } from "@mui/material";
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

import { useEmployerFormHandlers } from "../../../hooks/employer/useEmployerFormHandlers";

import { useNavigate, useParams } from "react-router-dom";

import { Box } from "@mui/system";
import { useEffect } from "react";

import { useUserService } from "../../../hooks/useUserService";

import { useUI } from "../../../context/UIProvider";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";

//(Tabs Validation)//

const stepFields: (keyof employerRegisterType)[][] = [
  [
    "companyName",
    "email",
    "phone",
    "website",
    "industry",
    "companySize",
    "foundedYear",
  ],
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
  const { showSnackbar, openConfirm } = useUI();

  const { getEmployerById, getEmployerByEmail, createUser, updateUser } =
    useUserService();

  //Detect Edit Mode//

  const { id: employerId } = useParams<{ id: string }>();
  const editData = Boolean(employerId);

  //Form Setup//

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
    setError,
    setFocus,
    formState: { isValid, isDirty },
  } = form;

  //Load Data in Edit Mode//

  useEffect(() => {
    console.log(employerId, "employerId");
    if (editData && employerId) {
      loadEmployer(employerId);
    } else {
      form.reset(employerDefaultValues);
      handleResetState();
    }
  }, [editData, employerId]);

  //Fetch Employer Data//

  const loadEmployer = async (id: string) => {
    try {
      const employer = await getEmployerById(id);

      if (employer) {
        form.reset({
          ...employerDefaultValues,
          ...employer,
        });
      }
    } catch (error: any) {
      showSnackbar(error.message, "error");
    }
  };

  const handleReset = () => {
    // No changes → reset silently
    if (!isDirty) {
      reset(employerDefaultValues);
      handleResetState();
      return;
    }

    // Has changes → ask confirmation
    openConfirm({
      title: "Reset Form",
      message: "Are you sure you want to reset all entered data?",
      confirmText: "Yes, Reset",
      cancelText: "Cancel",
      confirmColor: "warning",

      onConfirm: () => {
        reset(employerDefaultValues);
        handleResetState();
        showSnackbar("Form has been reset", "success");
      },
    });
  };

  //onsubmit//

  const onSubmit: SubmitHandler<employerRegisterType> = async (data) => {
    //create Mode//
    try {
      data.userType = 2;

      if (!editData) {
        const existingemployer = await getEmployerByEmail(
          data.recruiterEmail?.trim()?.toLowerCase(),
        );

        if (existingemployer) {
          setError("recruiterEmail", {
            type: "manual",
            message: "Email already exists",
          });
          setFocus("recruiterEmail"); //auto focus//
          showSnackbar(" recruiter Email already exists", "error");

          return;
        }
        data.createdAt = new Date();
        data.updatedAt = null;
        // data.deletedAt = null;
        const createuser = await createUser(data);
        console.log("create employee", createuser);
        // await userService.createUser(data);

        showSnackbar("Registration successful!", "success");

        reset();

        navigate("/");
      }

      //edit flow//

      console.log(data, "data", employerId);
      if (editData) {
        data.updatedAt = new Date();
        // data.deletedAt = null;
        const id: any = employerId;
        const updateuser = updateUser(id, data);
        console.log("upate user", updateuser);
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

  useKeyboardShortcuts([
    {
      key: "r",            //Alt + R → Reset//
      alt: true,
      callback: handleReset,
    },

    {
      key: "ArrowRight",    //Ctrl + ArrowRight → Next Tab//
      ctrl: true,
      callback: () => {
        if (activeTab < stepFields.length - 1) {
          handleNext();
        }
      },
    },

    {
      key: "ArrowLeft",      //Ctrl + ArrowLeft → Previous Tab//
      ctrl: true,
      callback: () => {
        if (activeTab > 0) {
          handleBack();
        }
      },
    },

    {
      key: "Escape",           //Escape → Cancel / Leave Page//
      callback: () => {
        if (!isDirty) {
          navigate("/");
          return;
        }
     
        openConfirm({              //If form dirty → show confirm dialog//
          title: "Cancel Changes",
          message: "You have unsaved changes. Are you sure you want to leave?",
          confirmText: "Yes, Leave",
          cancelText: "Stay",
          confirmColor: "error",
          onConfirm: () => navigate("/"),
        });
      },
    },

    {
      key: "s",         //Ctrl + S → Submit (Create Mode)//
      ctrl: true,
      callback: () => {
        if (!editData && isValid) {
          handleSubmit(onSubmit)();
        }
      },
    },
    {
      key: "u",        //Ctrl + U → Update (Edit Mode)
      ctrl: true,
      callback: () => {
        if (editData && isValid) {
          handleSubmit(onSubmit)();
        }
      },
    },

    {
      key: "ArrowRight",                 //next button click//
      ctrl: true,
      callback: () => {
        if (activeTab < stepFields.length - 1) {
          handleNext();
        }
      },
    },

    {
      key: "b",                    //back button click//
      ctrl: true,
      callback: () => {
        if (activeTab > 0) {
          handleBack();
        }
      },
    },
  ]);

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
              <Box display="flex" gap={2} width={{ xs: "100%", sm: 420 }}></Box>
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
                  <Tooltip title="Press Ctrl + b" arrow>
                    <span>
                      <MyButton
                        label="Back"
                        color="secondary"
                        variant="contained"
                        onClick={handleBack}
                        disabled={activeTab === 0}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title="Press Ctrl + →" arrow>
                    <span>
                      <MyButton
                        label="Next "
                        type="button"
                        variant="contained"
                        onClick={handleNext}
                        disabled={activeTab === stepFields.length - 1}
                      />
                    </span>
                  </Tooltip>
                </Grid>

                {/* Actions */}
                <Grid container justifyContent="center" spacing={2} mt={3}>
                  <Tooltip title="Press Alt+R to Reset" arrow>
                    <span>
                      <MyButton
                        label="Reset"
                        color="info"
                        type="button"
                        variant="contained"
                        onClick={handleReset}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={
                      !editData
                        ? "Press Ctrl + S to submit"
                        : "Press Ctrl + U to update"
                    }
                    arrow
                  >
                    <span>
                      <MyButton
                        label={!editData ? "Register " : "Update "}
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid}
                      />
                    </span>
                  </Tooltip>

                  <Tooltip title="Press Esc to cancel" arrow>
                    <span>
                      <MyButton
                        label="Cancel"
                        color="error"
                        type="button"
                        variant="contained"
                        onClick={() => navigate("/")}
                      />
                    </span>
                  </Tooltip>
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
