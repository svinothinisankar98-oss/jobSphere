import React, { useState } from "react";
import Grid from "@mui/material/Grid";

import MyTextField from "../../../Components/newui/MyTextField";
import MyradioButton from "../../../Components/newui/MyRadioButton";
import MyCheckbox from "../../../Components/newui/MyCheckBox";
import { Yes_No_Options } from "../../../constants/EmployerRegister";
import { EmploymentTypes } from "../../../constants/EmployerRegister";

function RecruiterDetails() {
  // const [remoteWork, setRemoteWork] = useState("yes");
  // console.log(remoteWork, "remoteWorkremoteWorkremoteWork");

  return (
    <Grid container spacing={2}>
      {/* Recruiter Name */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="recruiterName" label="Recruiter Name" required />
      </Grid>

      {/* Recruiter Email */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="recruiterEmail" label="Recruiter Email" required />
      </Grid>

      {/* Recruiter Phone */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="recruiterPhone" label="Recruiter Phone" required />
      </Grid>

      {/* Designation */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField name="designation" label="Designation" required />
      </Grid>

      {/* Password */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField
          name="password"
          type="password"
          label="Password"
          required
        />
      </Grid>

      {/* Confirm Password */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyTextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          required
        />
      </Grid>

      {/* RADIO BUTTON SECTION */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MyradioButton
          name="remoteopportunity"
          label="Do you offer remote opportunities?"
          options={ Yes_No_Options}
          row
          
        />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <MyCheckbox
          name="employmentType"
          label="Employment Type "
          options={EmploymentTypes}
          row
        />
      </Grid>
      
    </Grid>
    
  );
}

export default RecruiterDetails;
