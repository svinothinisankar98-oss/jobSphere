import { Box, Paper, Stack } from "@mui/material";
import CommonMultiSelect from "../../Components/ui/CommonMultiSelect";
import MyButton from "../../Components/newui/MyButton";

type Option = {
  id: number;
  item: string;
  value: string;
};

type Props = {
  jobType: string[];
  setJobType: (v: string[]) => void;
  experience: string[];
  setExperience: (v: string[]) => void;
  salary: string[];
  setSalary: (v: string[]) => void;
};

/* OPTIONS */

const jobTypeOptions: Option[] = [
  { id: 1, item: "Full Time", value: "Full Time" },
  { id: 2, item: "Part Time", value: "Part Time" },
  { id: 3, item: "Remote", value: "remote" },
  { id: 4, item: "Contract", value: "contract" },
];

const experienceOptions: Option[] = [
  { id: 1, item: "0–1 Years", value: "0–1 Years" },
  { id: 2, item: "1–3 Years", value: "1–3 Years" },
  { id: 3, item: "3–5 Years", value: "3-5 Years" },
  { id: 4, item: "5+ Years", value: "5+ Years" },
];

const salaryOptions: Option[] = [
  { id: 1, item: "₹3 LPA+", value: "300000" },
  { id: 2, item: "₹6 LPA+", value: "600000" },
  { id: 3, item: "₹9 LPA+", value: "900000" },
  { id: 4, item: "₹12 LPA+", value: "1200000" },
];

export default function JobFilters({
  jobType,
  setJobType,
  experience,
  setExperience,
  salary,
  setSalary,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 1,
        mx: 2,
        px: 2,
        py: 1
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="center"   
      >
        <Box width={{ xs: "100%", md: 220 }}>
          <CommonMultiSelect
            label="Job Type"
            value={jobType}
            options={jobTypeOptions}
            onChange={setJobType}
          />
        </Box>

        <Box width={{ xs: "100%", md: 220 }}>
          <CommonMultiSelect
            label="Experience"
            value={experience}
            options={experienceOptions}
            onChange={setExperience}
          />
        </Box>

        <Box width={{ xs: "100%", md: 240 }}>
          <CommonMultiSelect
            label="Salary Range"
            value={salary}
            options={salaryOptions}
            onChange={setSalary}
          />
        </Box>

        <MyButton
          label="Reset"
          variant="outlined"
          color="warning"
          sx={{
            height: 44,
            px: 3,
            borderRadius: 2,
            width: { xs: "100%", md: "auto" },
          }}
          onClick={() => {
            setJobType([]);
            setExperience([]);
            setSalary([]);
          }}
        />
      </Stack>
    </Paper>
  );
}
