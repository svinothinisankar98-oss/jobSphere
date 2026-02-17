import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import MyTextField from "../../Components/newui/MyTextField";
import MyDropDown from "../../Components/newui/MyDropDown";
import MyTextarea from "../../Components/newui/MyTextarea";
import MyButton from "../../Components/newui/MyButton";

import { locationService } from "../../service/locationService";
import { jobListSchema } from "../../schemas/jobListSchema";
import type { jobsListType } from "../../types/jobListType";
import { JobAddDefault } from "./defaultvalues/JobAddDefault";
import MyMultiSelect from "../../Components/newui/MyMultiSelect";
import { useJobService } from "../../hooks/joblist/useJobService";

type Option = {
  id: number;
  item: string;
};

const educationOptions = [
  { id: "high_school", item: "High School" },
  { id: "diploma", item: "Diploma" },
  { id: "bachelors", item: "Bachelor's Degree" },
  { id: "masters", item: "Master's Degree" },
  { id: "phd", item: "PhD" },
  { id: "others", item: "others" },
];

export default function JobAdd() {
  const methods = useForm<jobsListType>({
    defaultValues: { ...JobAddDefault },
    resolver: yupResolver(jobListSchema),
    mode: "onChange",
  });

  const { handleSubmit, reset, watch } = methods;

  const educationSelected = watch("educationQualification");

  const { createJob } = useJobService();

  const [locations, setLocations] = useState<Option[]>([]);
  const navigate = useNavigate();

  //dynamic location lodaint//

  useEffect(() => {
    locationService.getLocations().then((data) => {
      setLocations(data ?? []);
    });
  }, []);

  //Submit form cleanup//

  const onSubmit = async (data: jobsListType) => {
    const payload: jobsListType = {
      ...data,
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        ?.toString(),
      benefits: data.benefits
        .split(",")
        .map((b) => b.trim())
        ?.toString(),
      id: Date.now(),
    };

    //useapi service//

    try {
      await createJob(payload);
      console.log("Employer Job Post:", payload);

      reset({ ...JobAddDefault });
    } catch (error) {
      console.error("Job creation failed", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Box p={3} maxWidth={900} mx="auto">
        <Typography variant="h5" mb={2}>
          Post a Job
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="companyName" label="Company Name" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="website" label="Company Website" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="title" label="Job Title" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="jobType" label="Job Type" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="state" label="State" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyDropDown
                name="location"
                label="Location"
                options={locations}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField
                name="noOfOpenings"
                label="Number of Openings"
                type="number"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyMultiSelect
                name="educationQualification"
                label="Education Qualification"
                options={educationOptions}
                required
                size="small"
              />

              {/*  SHOW WHEN OTHERS SELECTED */}
              {educationSelected?.includes("others") && (
                <Box mt={2}>
                  <MyTextField
                    name="otherEducation"
                    label="Other Qualification"
                    placeholder="Enter qualification"
                    required
                  />
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="experience" label="Experience" required />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MyTextField name="salary" label="Salary" required />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MyTextField name="benefits" label="Benefits" required />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MyTextField
                name="tags"
                label="Skills"
                placeholder="React, Java, Node"
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <MyTextarea
                name="description"
                label="Job Description"
                required
                minRows={4}
                maxRows={10}
              />
            </Grid>

            <Grid
              size={{ xs: 12 }}
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                mt: 2,
              }}
            >
              <MyButton
                label="Reset"
                type="button"
                color="secondary"
                variant="contained"
                onClick={() => reset({ ...JobAddDefault })}
              />

              <MyButton
                label="Post Job"
                type="submit"
                color="primary"
                variant="contained"
              />

              <MyButton
                label="Cancel"
                type="button"
                color="error"
                variant="contained"
                onClick={() => navigate("/")}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
    </FormProvider>
  );
}
