import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import MyTextField from "../../../Components/newui/MyTextField";

function RecruiterDetails() {
  const [remoteWork, setRemoteWork] = useState("");

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
        <MyTextField name="password" type="password" label="Password" required />
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

      {/* ✅ RADIO BUTTON SECTION */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              mb: 1,
              color: "#0e0e0eff",
            }}
          >
            Do you offer remote opportunities?
          </Typography>

          <RadioGroup
            row
            value={remoteWork}
            onChange={(e) => setRemoteWork(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Box>
      </Grid>

    </Grid>
  );
}

export default RecruiterDetails;
