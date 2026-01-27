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
import EditIcon from "@mui/icons-material/Edit";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import MyTextField from "../../Components/newui/MyTextField";
import MyButton from "../../Components/newui/MyButton";
import MyFileUpload from "../../Components/newui/MyFileupLoad";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";


import {
  useForm,
  FormProvider,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";

import type { CompanyInformationType } from "../../types/companyInformation";
import { CompanyInformationdefault } from "./defaultvalues/CompanyInformationdefault";
import { companyInformationSchema } from "../../schemas/companyInformationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import MyTable from "../../Components/newui/MyTable";

import MyAccordion from "../../Components/newui/MyAccordion";

import { useCompanyInformation } from "../../hooks/companyinformation/useCompanyInformation";
import { useSnackbar } from "../../Components/newui/MySnackBar";

export default function CompanyInformation() {
  const methods = useForm<CompanyInformationType>({
    defaultValues: CompanyInformationdefault,
    resolver: yupResolver(companyInformationSchema),
    mode: "onChange",
  });

  const { createCompanyInformation } = useCompanyInformation();


  const { control, watch, setFocus, reset } = methods;

   const { showSnackbar } = useSnackbar();

  //Prevent adding empty rows//

  const watchedContacts = watch("contact");

  const isLastContactFilled = () => {
    if (!watchedContacts || watchedContacts.length === 0) return true;
    const last = watchedContacts[watchedContacts.length - 1];

    return last?.name?.trim() && last?.phone?.trim() && last?.email?.trim();
  };

  const watchedBranches = watch("branches");

  const isLastBranchFilled = () => {
    if (!watchedBranches || watchedBranches.length === 0) return true;

    const last = watchedBranches[watchedBranches.length - 1];

    // Check branch fields
    if (!last?.branchName?.trim() || !last?.branchEmail?.trim()) {
      return false;
    }

    // Check branch person exists
    if (!last?.branchContact || last.branchContact.length === 0) {
      return false;
    }

    // Check last branch person filled
    const lastPerson = last.branchContact[last.branchContact.length - 1];

    return (
      lastPerson?.name?.trim() &&
      lastPerson?.phone?.trim() &&
      lastPerson?.email?.trim()
    );
  };

  // Company Contacts
  const {
    fields: contactFields,
    append: addContactPerson,
    remove: removeContactPerson,
  } = useFieldArray({
    control,
    name: "contact",
  });

  // Branches
  const {
    fields: branchFields,
    append: addBranch,
    remove: removeBranch,
  } = useFieldArray({
    control,
    name: "branches",
  });

  // const onsubmit: SubmitHandler<CompanyInformationType> = (data) => {
  //   console.log("Form Data:", data);
  // };

 const onsubmit: SubmitHandler<CompanyInformationType> = async (data) => {
  try {  
    
   
data.createdAt=new Date();
console.log(data,"Data")

    const savedCompany = await createCompanyInformation(data);

    console.log("Saved in DB:", savedCompany);

    reset(); 
   
     showSnackbar("Company information saved successfully!", "success");

  } catch (error) {
    console.error("Failed to save company information", error);
    alert("Something went wrong while saving");
  }
};


  const [companyExpanded, setCompanyExpanded] = React.useState(true);
  const [branchesExpanded, setBranchesExpanded] = React.useState(true);

  const handleGlobalToggle = () => {
    const next = !(companyExpanded && branchesExpanded);
    setCompanyExpanded(next);
    setBranchesExpanded(next);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onsubmit)} noValidate>
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

          {/* Company Details */}
          {/* <Paper sx={{ mb: 1, width: "100%", }}> */}
          <MyAccordion
            title="Company Details"
            titleColor="#3d12e9"
            expanded={companyExpanded}
            // onChange={(e, isExpanded) => setCompanyExpanded(isExpanded)}
            onChange={setCompanyExpanded}
          >
            {/* <AccordionSummary >
                <Typography fontWeight="bold" color="#2b32bd">Company Details</Typography>
              </AccordionSummary> */}

            {/* <AccordionDetails> */}
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

            {/* Company Contacts */}
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

                   <Box display="flex"justifyContent="end">
                   
                    

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeContactPerson(index)}
                    >

                      
                      <DeleteIcon fontSize="medium" />

                    </IconButton>
                    </Box>
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
            {/* </AccordionDetails> */}
          </MyAccordion>
          {/* </Paper> */}

          {/* Branches */}
          {/* <Paper sx={{ mb: 2, width: "100%"}}> */}
          <MyAccordion
            title="Company Branches "
            titleColor="#ef10d9"
            expanded={branchesExpanded}
            // onChange={(e, isExpanded) => setBranchesExpanded(isExpanded)}
            onChange={setBranchesExpanded}
            count={branchFields.length}
          >
            {/* <AccordionDetails> */}
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
                        Designation: "",
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
                    // onClick={() => removeBranch(branchIndex)}
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

                {/* Branch Contacts */}
                <BranchContacts
                  nestIndex={branchIndex}
                  control={control}
                  watch={watch}
                />
              </Box>
            ))}
            {/* </AccordionDetails> */}
          </MyAccordion>
          {/* </Paper> */}

          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <MyButton type="submit" variant="contained" label="SUBMIT" />
            <MyButton
              type="reset"
              variant="contained"
              label="RESET"
              color="error"
              onClick={() => reset()}
            />
          </Stack>
        </Container>
      </form>
    </FormProvider>
  );
}
//Nested Component: BranchContacts//
/* Branch Contacts Component */
function BranchContacts({ nestIndex, control, watch }: any) {
  const name = `branches.${nestIndex}.branchContact`;

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const watched = watch(name);
  const [editIndex, setEditIndex] = React.useState<number | null>(0);

  const isRowFilled = (row: any) =>
    row?.name?.trim() && row?.phone?.trim() && row?.email?.trim();

  const isLastFilled = () => {
    if (!watched || watched.length === 0) return true;
    if (watched.length >= 5) return false;
    return isRowFilled(watched[watched.length - 1]);
  };

  const columns = [
    {
      id: "slno",
      label: "Person",
      sortable: false,
      render: (_: any, index: number) => index + 1,
    },
    {
      id: "name",
      label: "Contact Name",

      render: (_: any, index: number) =>
        editIndex === index ? (
          <MyTextField
            name={`${name}.${index}.name`}
            label=" Name"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography>{watched?.[index]?.name}</Typography>
        ),
    },
    {
      id: "phone",
      label: "Phone",
      render: (_: any, index: number) =>
        editIndex === index ? (
          <MyTextField
            name={`${name}.${index}.phone`}
            placeholder="Phone"
            label="Phone"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography>{watched?.[index]?.phone}</Typography>
        ),
    },
    {
      id: "email",
      label: "Email",
      render: (_: any, index: number) =>
        editIndex === index ? (
          <MyTextField
            name={`${name}.${index}.email`}
            placeholder="Email"
            label="Email"
            required
            fullWidth
            hideErrorText
          />
        ) : (
          <Typography>{watched?.[index]?.email}</Typography>
        ),
    },
    {
      id: "Designation",
      label: "Designation",
      render: (_: any, index: number) =>
        editIndex === index ? (
          <MyTextField
            name={`${name}.${index}.Designation`}
            placeholder="Designation"
            label="Designation"
            fullWidth
          />
        ) : (
          <Typography>{watched?.[index]?.Designation}</Typography>
        ),
    },
    {
  id: "actions",
  label: "Actions",
  sortable: false,
  render: (_: any, index: number) => {
    const isEditing = editIndex === index;

    return (
      <Box display="flex" justifyContent="center" gap={1}>
        {isEditing ? (
          /* SAVE */
          <IconButton
            size="small"
            color="success"
            disabled={!isRowFilled(watched?.[index])}
            onClick={() => setEditIndex(null)}
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        ) : (
          <>
            {/* EDIT */}
            <IconButton
              size="small"
              color="primary"
              onClick={() => setEditIndex(index)}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* DELETE */}
            <IconButton
              size="small"
              color="error"
              onClick={() => remove(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
    );
  },
}

  ];

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="end" mb={1}>
        <MyButton
          size="small"
          label="Add Branch Contact"
          icon={<PersonAddAlt1Icon />}
          variant="contained"
          color="primary"
          disabled={!isLastFilled()}
          onClick={() => {
            append({
              name: "",
              phone: "",
              email: "",
              Designation: "",
            });
            setEditIndex(fields.length);
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: { xs: "auto", sm: "visible" },
        }}
      >
        <MyTable
          rows={fields}
          columns={columns}
          tableSize="medium"
          disablePagination
        />
      </Box>
    </Box>
  );
}
