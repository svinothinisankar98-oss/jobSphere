import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import MyTextField from "../../Components/newui/MyTextField";
import MyButton from "../../Components/newui/MyButton";
import MyFileUpload from "../../Components/newui/MyFileupLoad";
import { useFormContext } from "react-hook-form";

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

export default function CompanyInformation() {
  const methods = useForm<CompanyInformationType>({
    defaultValues: CompanyInformationdefault,
    resolver: yupResolver(companyInformationSchema),
    mode: "onChange",
  });

  const { control, watch, setFocus,reset } = methods;

  const watchedContacts = watch("contact");

  const isLastContactFilled = () => {
    if (!watchedContacts || watchedContacts.length === 0) return true;
    const last = watchedContacts[watchedContacts.length - 1];

    return last?.name?.trim() && last?.phone?.trim() && last?.email?.trim();
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

  const onsubmit: SubmitHandler<CompanyInformationType> = (data) => {
    console.log("Form Data:", data);
  };
  // const { setFocus } = useFormContext();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onsubmit)} noValidate>
        <Container maxWidth="md">
          <Box textAlign="center" my={4}>
            <Typography fontWeight="bold">Company Information</Typography>
            <KeyboardArrowDownIcon />
          </Box>

          {/* Company Details */}
          <Paper sx={{ mb: 2 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Company Details</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MyTextField
                      name="companyName"
                      label="Company Name"
                      required
                    />
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
                      disabled={!isLastContactFilled()}
                      onClick={() =>{
                        const newIndex = contactFields.length;
                        addContactPerson({
                          name: "",
                          phone: "",
                          email: "",
                        })
                        requestAnimationFrame(() => {
    setFocus(`contact.${newIndex}.name`);
  });
                        
                      }
                      }
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
                          onClick={() => removeContactPerson(index)}
                        >
                          <DeleteIcon fontSize="small" />
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
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Branches */}
          <Paper sx={{ mb: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight="bold">Company Branches</Typography>

                  <Box
                    px={1.5}
                    py={0.5}
                    borderRadius="50%"
                    bgcolor="grey"
                    color="white"
                    fontSize="13px"
                    // minWidth="24px"
                    textAlign="center"
                  >
                    {branchFields.length}
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box mb={2} display="flex" justifyContent="flex-end">
                  <MyButton
                    type="button"
                    size="small"
                    label="Add Branch"
                    variant="contained"
                    color="secondary"
                    icon={<PersonAddAlt1Icon />}
                    onClick={() => {

                      addBranch({
                        branchName: "",
                        branchEmail: "",
                        branchContact: [
                          {
                            name: "",
                            phone: "",
                            email: "",
                            city: "",
                          },
                        ],
                      });

                      // Wait for DOM update then focus
                      // requestAnimationFrame(() => {
                      //   setFocus(`branches.${newIndex}.branchContact.0.name`);
                      // });
                    }}
                    // onClick={() =>
                    //   addBranch({
                    //     branchName: "",
                    //     branchEmail: "",
                    //     branchContact: [
                    //       {
                    //         name: "",
                    //         phone: "",
                    //         email: "",
                    //         city: "",
                    //       },
                    //     ],
                    //   })
                    // }
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
                        onClick={() => removeBranch(branchIndex)}
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
              </AccordionDetails>
            </Accordion>
          </Paper>

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

/* Branch Contacts Component */
function BranchContacts({ nestIndex, control, watch }: any) {
  const name = `branches.${nestIndex}.branchContact`;

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const watched = watch(name);

  const isLastFilled = () => {
    if (!watched || watched.length === 0) return true;
    if (watched.length >= 3) {
      return false;
    }
    const last = watched[watched.length - 1];
    return last?.name?.trim() && last?.phone?.trim() && last?.email?.trim();
  };

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography fontWeight="bold" color="secondary">
          Branch Contacts
        </Typography>

        <MyButton
          size="small"
          label="Add Branch Contact"
          icon={<PersonAddAlt1Icon />}
          disabled={!isLastFilled()}
          onClick={() =>
            append({
              name: "",
              phone: "",
              email: "",
              city: "",
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
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight="bold">
              Branch Person({index + 1})
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, sm: 3 }}>
              <MyTextField
                name={`${name}.${index}.name`}
                label="Contact Name"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <MyTextField
                name={`${name}.${index}.phone`}
                label="Contact Phone"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <MyTextField
                name={`${name}.${index}.email`}
                label="Contact Email"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 2 }}>
              <MyTextField name={`${name}.${index}.city`} label="City" />
            </Grid>

            {/* Icons column */}
            <Grid size={{ xs: 12, sm: 1 }}>
              <Box display="flex" justifyContent="flex-end">
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
