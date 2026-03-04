import { Grid, Card, CardContent, Tooltip, IconButton } from "@mui/material";
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
import { useEffect, useState } from "react";

import { useUserService } from "../../../hooks/useUserService";

import { useUI } from "../../../context/UIProvider";
import { useKeyboardShortcuts } from "../../../hooks/useKeyboardShortcuts";

import { useHotkeys } from "react-hotkeys-hook";                  //keyboard shortcut //
import MyDialog from "../../../Components/newui/MyDialog";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ShortCutSheet from "../../../shortcutkey/ShortCutSheet";

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

  const [openHotkeys, setOpenHotkeys] = useState(false);      //hotkey open dialog state//
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
    // No changes → reset 
    if (!isDirty) {
      reset(employerDefaultValues);
      handleResetState();
      return;
    }openConfirm({
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
       const id: any = employerId;
        const updateuser = updateUser(id, data);
        console.log("upate user", updateuser);
        
        showSnackbar("Employee Details Updated.", "success");
       reset();

        navigate("/employer-list");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Something went wrong. Please try again.", "error");
    }
  };

  //Keyboard Shortcuts//

  const shortcuts = [
    { keys: "alt+r", handler: handleReset },
    { keys: "ctrl+arrowright", handler: handleNext },
    { keys: "ctrl+arrowleft", handler: handleBack },

    {
      keys: "escape",
      handler: () => {
        if (!isDirty) {
          navigate("/");
          return;
        }

        openConfirm({
          title: "Cancel Changes",
          message: "Are you sure you want to leave?",
          confirmText: "Yes, Leave",
          cancelText: "Stay",
          confirmColor: "error",
          onConfirm: () => navigate("/"),
        });
      },
    },

    {
      keys: "ctrl+s",
      handler: (e?: KeyboardEvent) => {
        e?.preventDefault();
        if (!editData && isValid) handleSubmit(onSubmit)();
      },
    },

    {
      keys: "ctrl+u",
      handler: (e?: KeyboardEvent) => {
        e?.preventDefault();
        if (editData && isValid) handleSubmit(onSubmit)();
      },
    },
    {
      keys: "ctrl+b",
      handler: (e?: KeyboardEvent) => {
        e?.preventDefault();
        if (activeTab > 0) handleBack();
      },
    },

    // page up
    {
      keys: "shift+arrowup",
      handler: () => {
        window.scrollBy({ top: -400, behavior: "smooth" });
      },
    },

    // page down
    {
      keys: "shift+arrowdown",
      handler: () => {
        window.scrollBy({ top: 400, behavior: "smooth" });
      },
    },
  ];
  useKeyboardShortcuts(shortcuts);

  //Hotkey Help Dialog//
  useHotkeys(
    "ctrl+K",
    (e) => {
      e.preventDefault();
      setOpenHotkeys(true);
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
  );

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
                  <Tooltip title="Reset (Alt+R)" arrow>
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
                

                <MyDialog                                  //Keyboard Shortcuts Dialog opens//
                  open={openHotkeys}
                  onClose={() => setOpenHotkeys(false)}
                  title="Keyboard Shortcuts"
                >
                  <ShortCutSheet />
                </MyDialog>
              </form>
            </FormProvider>
            <IconButton onClick={() => setOpenHotkeys(true)} color="info">          
              <HelpOutlineIcon />
            </IconButton>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EmployerRegister;
