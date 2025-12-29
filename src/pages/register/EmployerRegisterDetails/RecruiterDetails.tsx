import React from "react";
import MyHeading from "../../../Components/newui/MyHeading";
import { Stack } from "@mui/system";
import MyTextField from "../../../Components/newui/MyTextField";

function RecruiterDetails() {
  return (
    <div>
      {/* <MyHeading title="Recruiter & Login Details" /> */}

      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <MyTextField name="recruiterName" label="Recruiter Name" required />
          <MyTextField name="recruiterEmail" label="Recruiter Email" required />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <MyTextField name="recruiterPhone" label="Recruiter Phone" required />
          <MyTextField name="designation" label="Designation" required />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <MyTextField
            name="password"
            type="password"
            label="Password"
            required
          />
          <MyTextField
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            required
          />
        </Stack>
      </Stack>
    </div>
  );
}

export default RecruiterDetails;
