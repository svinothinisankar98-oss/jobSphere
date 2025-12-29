
import {  Stack } from "@mui/material";

import MyHeading from "../../../Components/newui/MyHeading";
import MyTextField from "../../../Components/newui/MyTextField";
import MyDropDown from "../../../Components/newui/MyDropDown";

const INDUSTRY_OPTIONS = [
  { id: 1, item: "IT" },
  { id: 2, item: "Finance" },
  { id: 3, item: "Healthcare" },
  { id: 4, item: "Education" },
];

const COMPANY_SIZE_OPTIONS = [
  { id: 1, item: "1–10" },
  { id: 2, item: "11–50" },
  { id: 3, item: "51–200" },
  { id: 4, item: "200+" },
];

function CompanyDetails() {
  return (
    <div>
      {/* <TabPanel value={1} index={0}> */}
        {/* <MyHeading title="Company Details" /> */}

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <MyTextField name="companyName" label="Company Name" required />
            <MyTextField name="email" label="Company Email" required />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <MyTextField name="phone" label="Company Phone" required />
            <MyTextField name="website" label="Company Website" required />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <MyTextField name="foundedYear" label="Founded Year" />
            <MyTextField name="gstNumber" label="GST Number" />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <MyDropDown
              name="industry"
              label="Industry"
              options={INDUSTRY_OPTIONS}
            />
            <MyDropDown
              name="companySize"
              label="Company Size"
              options={COMPANY_SIZE_OPTIONS}
            />
            {/* <MyTextField name="foundedYear" label="Founded Year" />
                      <MyTextField name="gstNumber" label="GST Number" /> */}
          </Stack>
        </Stack>
      {/* </TabPanel> */}
    </div>
  );
}

export default CompanyDetails;
