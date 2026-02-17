import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";

import MyTextField from "../../Components/newui/MyTextField";
import MyButton from "../../Components/newui/MyButton";
import MyFileUpload from "../../Components/newui/MyFileupLoad";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import BranchContacts from "../companyinformation/BranchContacts";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";

import type { CompanyInformationType } from "../../types/companyInformation";
import { CompanyInformationdefault } from "./defaultvalues/CompanyInformationdefault";
import { companyInformationSchema } from "../../schemas/companyInformationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useWatch } from "react-hook-form";

import MyAccordion from "../../Components/newui/MyAccordion";

//  use Hook for companyinformation handlers//
import { useCompanyInfoHandlers } from "../../hooks/companyinformation/useCompanyInfoHandlers";
import { COMPANY_INFORMATION_LIMITS } from "../../constants/CompanyInformationConstant";
import { useUI } from "../../context/UIProvider";



//component//

export default function CompanyInformation() {


  
  const methods = useForm<CompanyInformationType>({
    defaultValues: CompanyInformationdefault,
    resolver: yupResolver(companyInformationSchema),
    mode: "onChange",
  });

  // helpers
 const {
  control,
  watch,
  setFocus,
  reset,
  formState: { errors, isSubmitted, isDirty }
} = methods;

  //is edit and onsubmit for handlers//
  const { isEdit, onSubmit } = useCompanyInfoHandlers(reset);

  //contacts persons watch //

  const contacts = useWatch({
    control,
    name: "contact",
  });

  console.log("contacts", contacts);

  //if delte button is enabled for all fields filled default diasabled//

  const isRowFilled = (row?: any) => {
    if (!row) return false;

    return (
      row?.name?.trim() !== "" &&
      row?.phone?.trim() !== "" &&
      row?.email?.trim() !== ""
    );
  };

  //  Prevent adding empty rows  //

  const watchedContacts = watch("contact");

  const isLastContactFilled = () => {
    if (!watchedContacts || watchedContacts.length === 0) return true;

    if (
      watchedContacts.length >= COMPANY_INFORMATION_LIMITS.MAX_COMPANY_CONTACTS //constants default set//
    ) {
      return false;
    }

    const last = watchedContacts[watchedContacts.length - 1];

    return Boolean(
      last?.name?.trim() && last?.phone?.trim() && last?.email?.trim(),
    );
  };

  //watch branches//

  const watchedBranches = watch("branches");

  const isLastBranchFilled = () => {
    if (!watchedBranches || watchedBranches.length === 0) return true;

    const last = watchedBranches[watchedBranches.length - 1];

    if (!last?.branchName?.trim() || !last?.branchEmail?.trim()) return false;

    if (!last?.branchContact || last.branchContact.length === 0) return false;

    const lastPerson = last.branchContact[last.branchContact.length - 1];

    return (
      lastPerson?.name?.trim() &&
      lastPerson?.phone?.trim() &&
      lastPerson?.email?.trim()
    );
  };

  // Contacts//

  const {
    fields: contactFields,
    append: addContactPerson,
    remove: removeContactPerson,
  } = useFieldArray({
    control,
    name: "contact",
  });

  // Branches //

  const {
    fields: branchFields,
    append: addBranch,
    remove: removeBranch,
  } = useFieldArray({
    control,
    name: "branches",
  });

  //  Accordion //

  const [companyExpanded, setCompanyExpanded] = React.useState(true);
  const [branchesExpanded, setBranchesExpanded] = React.useState(true);

  // AUTO OPEN ACCORDION WHEN VALIDATION FAILS
React.useEffect(() => {
  if (!isSubmitted) return;

  // Company section errors
  if (
    errors.companyName ||
    errors.companyEmail ||
    errors.contact
  ) {
    setCompanyExpanded(true);
  }

  // Branch section errors (including nested contacts)
  if (errors.branches) {
    setBranchesExpanded(true);
  }
}, [errors, isSubmitted]);

// SCROLL TO FIRST INVALID FIELD
React.useEffect(() => {
  if (!isSubmitted) return;

  const firstErrorElement = document.querySelector(
    '[aria-invalid="true"]'
  ) as HTMLElement | null;

  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => firstErrorElement.focus(), 300);
  }
}, [errors, isSubmitted]);



  //golobal expand all//

  const handleGlobalToggle = () => {
    const next = !(companyExpanded && branchesExpanded);
    setCompanyExpanded(next);
    setBranchesExpanded(next);
  };



  const { openConfirm, showSnackbar } = useUI();

  const handleReset = () => {
    // no changes → do nothing
    if (!isDirty) return;

    openConfirm({
      title: "Reset Form",
      message: "Are you sure you want to reset all entered data?",
      confirmText: "Yes, Reset",
      cancelText: "Cancel",
      confirmColor: "warning",
      onConfirm: () => {
        reset();
        showSnackbar("Form reset successfully", "success");
      },
    });
  };

  // Render//

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={0.5}
            my={3}
            sx={{ cursor: "pointer", pt: 0 }}
            onClick={handleGlobalToggle}
          >
            <Typography fontWeight={600} fontSize="18px" color="#0d47a1">
              Company Information
            </Typography>

            <KeyboardArrowDownIcon
              sx={{
                transform:
                  companyExpanded && branchesExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                transition: "0.25s ease",
              }}
            />
          </Box>

          {/*  Company Details */}

          <MyAccordion
            title="Company Details"
            titleColor="#3d12e9"
            expanded={companyExpanded}
            onChange={setCompanyExpanded}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MyTextField name="companyName" label="Company Name" required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MyTextField
                  name="companyEmail"
                  label="Company Email"
                  required
                />
              </Grid>
            </Grid>

            {/*  Contacts */}

            <Box mt={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight="bold" color="primary">
                  Contact Persons
                </Typography>

                <MyButton
                  size="small"
                  label="Add Contact"
                  icon={<PersonAddAlt1Icon />}
                  variant="contained"
                  color="primary"
                  disabled={!isLastContactFilled()}
                  onClick={() => {
                    const newIndex = contactFields.length;
                    addContactPerson({
                      name: "",
                      phone: "",
                      email: "",
                    });
                    requestAnimationFrame(() => {
                      setFocus(`contact.${newIndex}.name`);
                    });
                  }}
                />
              </Box>

              {contactFields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    border: "1px solid #ddd",
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography fontWeight="bold">
                      Contact Person ({index + 1})
                    </Typography>

                    <IconButton
                      size="small"
                      color="error"
                      disabled={!isRowFilled(contacts?.[index])}
                      onClick={() => removeContactPerson(index)}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyTextField
                        name={`contact.${index}.name`}
                        label="Contact Name"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyTextField
                        name={`contact.${index}.phone`}
                        label="Contact Phone"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyTextField
                        name={`contact.${index}.email`}
                        label="Contact Email"
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <MyFileUpload
                        name={`contact.${index}.profileImage`}
                        accept="image/*"
                        buttonText="Upload Logo"
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </MyAccordion>

          {/*  Branches */}

          <MyAccordion
            title="Company Branches "
            titleColor="#ef10d9"
            expanded={branchesExpanded}
            onChange={setBranchesExpanded}
            count={branchFields.length}
          >
            <Box mb={2} display="flex" justifyContent="flex-end">
              <MyButton
                type="button"
                size="small"
                label="Add Branch"
                variant="contained"
                color="secondary"
                icon={<AddBusinessIcon />}
                disabled={!isLastBranchFilled()}
                onClick={() => {
                  const newIndex = branchFields.length;

                  addBranch({
                    branchName: "",
                    branchEmail: "",
                    branchContact: [
                      {
                        name: "",
                        phone: "",
                        email: "",
                        designation: "",
                      },
                    ],
                  });

                  requestAnimationFrame(() => {
                    setFocus(`branches.${newIndex}.branchName`);
                  });
                }}
              />
            </Box>

            {branchFields.map((branch, branchIndex) => (
              <Box
                key={branch.id}
                sx={{
                  border: "1px solid #ddd",
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography fontWeight="bold" color="secondary">
                    Branch {branchIndex + 1}
                  </Typography>

                  <MyButton
                    size="small"
                    color="error"
                    label="Remove Branch"
                    variant="contained"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this branch?",
                        )
                      ) {
                        removeBranch(branchIndex);
                      }
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField
                      name={`branches.${branchIndex}.branchName`}
                      label="Branch Name"
                      required
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField
                      name={`branches.${branchIndex}.branchEmail`}
                      label="Branch Email"
                      required
                    />
                  </Grid>
                </Grid>

                <BranchContacts
                  nestIndex={branchIndex}
                  control={control}
                  watch={watch}
                />
              </Box>
            ))}
          </MyAccordion>

          {/*  Buttons */}

          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <MyButton
              type="submit"
              variant="contained"
              label={isEdit ? "UPDATE" : "SUBMIT"}
            />
            <MyButton
              type="button"
              variant="contained"
              label="RESET"
              color="error"
              onClick={handleReset}
            />
          </Stack>
        </Container>
      </form>
    </FormProvider>
  );
}
