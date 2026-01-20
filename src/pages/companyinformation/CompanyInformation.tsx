import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MyTextField from "../../Components/newui/MyTextField";
import MyButton from "../../Components/newui/MyButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import MyFileUpload from "../../Components/newui/MyFileupLoad";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import React from "react";
import type { CompanyInformationType } from "../../types/companyInformation";
import { CompanyInformationdefault } from "./defaultvalues/CompanyInformationdefault";

export default function CompanyInformation() {
  const methods = useForm<CompanyInformationType>({
    defaultValues: CompanyInformationdefault,
  });

  const { control, watch } = methods;
  const watchedContacts = watch("contacts");
  const isLastContactFilled = () => {
    if (!watchedContacts || watchedContacts.length === 0) return true;

    const last = watchedContacts[watchedContacts.length - 1];
    return (
      last.contactName?.trim() &&
      last.contactPhone?.trim() &&
      last.contactEmail?.trim()
    );
  };

  const watchBranch = watch("branchContacts");

  const isLastBranchChecked = () => {
    if (!watchBranch || watchBranch.length === 0) return true;

    const last = watchBranch[watchBranch.length - 1];
    console.log(last, "last", watchBranch.length);
    if (watchBranch.length >= 3) return false;
    return (
      last?.branchContactName?.trim() &&
      last?.branchContactPhone?.trim() &&
      last?.branchperEmail?.trim() &&
      last?.branchcity?.trim()
    );
  };

  // Contact Persons
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  // Branch Contact Persons
  const {
    fields: branchFields,
    append: addBranchPerson,
    remove: removeBranchPerson,
  } = useFieldArray({
    control,
    name: "branchContacts",
  });

  const onsubmit = (data: CompanyInformationType) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onsubmit)}>
        <Container maxWidth="md">
          {/* Explore Topics */}
          <Box textAlign="center" my={4}>
            <Typography fontWeight="bold">Company Information Form</Typography>
            <KeyboardArrowDownIcon />
          </Box>

          {/* Company Details */}
          <Paper sx={{ mb: 2 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Company Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography fontWeight="bold" mb={1}>
                  Company Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField name="companyName" label="Company Name" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField name="companyEmail" label="Company Email" />
                  </Grid>
                </Grid>

                {/* Contact Persons */}
                <Box mt={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography fontWeight="bold">Contact Persons</Typography>

                    <MyButton
                      size="small"
                      label="Add Contact Person"
                      icon={<PersonAddAlt1Icon />}
                      disabled={!isLastContactFilled()}
                      onClick={() =>
                        append({
                          contactName: "",
                          contactPhone: "",
                          contactEmail: "",
                          profileImage: null,
                        })
                      }
                    />
                  </Box>

                  {fields.map((item, index) => (
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
                          Contact Person
                        </Typography>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => remove(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyTextField
                            name={`contacts.${index}.contactName`}
                            label="Contact Name"
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyTextField
                            name={`contacts.${index}.contactPhone`}
                            label="Contact Phone"
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyTextField
                            name={`contacts.${index}.contactEmail`}
                            label="Contact Email"
                          />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <MyFileUpload
                            name={`contacts.${index}.profileImage`}
                            accept="image/*"
                            buttonText="Upload Logo"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Branch Offices */}
          <Paper sx={{ mb: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Company Branches</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography fontWeight="bold">
                    Company Branch Details
                  </Typography>

                  <MyButton
                    size="small"
                    color="error"
                    // onClick={() => removeBranch(branchIndex)}
                    label="REMOVE BRANCH"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField name="BranchName" label="Branch Name" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField name="branchEmail" label="Branch Email" />
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography fontWeight="bold">
                      Contact Branch Persons
                    </Typography>

                    <MyButton
                      size="small"
                      label="Add Branch Person"
                      icon={<PersonAddAlt1Icon />}
                      disabled={!isLastBranchChecked()}
                      onClick={() =>
                        addBranchPerson({
                          branchContactName: "",
                          branchContactPhone: "",
                          branchperEmail: "",
                          branchcity: "",
                        })
                      }
                    />
                  </Box>

                  <Grid container spacing={2}>
                    {branchFields.map((item, index) => (
                      <Grid size={12} key={item.id}>
                        <Box
                          sx={{
                            border: "1px solid #ddd",
                            p: 2,
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
                              Branch Person
                            </Typography>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeBranchPerson(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <MyTextField
                                name={`branchContacts.${index}.branchContactName`}
                                label="Contact Name"
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <MyTextField
                                name={`branchContacts.${index}.branchContactPhone`}
                                label="Contact Phone"
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <MyTextField
                                name={`branchContacts.${index}.branchperEmail`}
                                label=" Contact Email"
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <MyTextField
                                name={`branchContacts.${index}.branchcity`}
                                label="City / County"
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Submit */}
          <Box textAlign="center" mt={3}>
            <MyButton
              type="submit"
              variant="contained"
              label="SUBMIT"
              size="medium"
            />
          </Box>
        </Container>
      </form>
    </FormProvider>
  );
}
