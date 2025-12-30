import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
// import Grid from "@mui/material/Grid2";
import Grid from '@mui/material/Grid';
import { Controller, useFormContext } from "react-hook-form";

const COUNTRY_OPTIONS = [
  { id: 1, label: "India" },
  { id: 2, label: "United States" },
  { id: 3, label: "United Kingdom" },
  { id: 4, label: "Canada" },
];

const MyAddress = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>

        {/* Address Line 1 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="address1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address Line 1"
                size="small"
                fullWidth
                required
                error={!!errors.address1}
                helperText={errors.address1?.message as string}
              />
            )}
          />
        </Grid>

        {/* Address Line 2 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="address2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address Line 2"
                size="small"
                fullWidth
                error={!!errors.address2}
                helperText={errors.address2?.message as string}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                size="small"
                fullWidth
                required
                error={!!errors.city}
                helperText={errors.city?.message as string}
              />
            )}
          />
        </Grid>

        {/* State */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="State"
                size="small"
                fullWidth
                required
                error={!!errors.state}
                helperText={errors.state?.message as string}
              />
            )}
          />
        </Grid>

        {/* Country */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Country"
                size="small"
                fullWidth
                required
                error={!!errors.country}
                helperText={errors.country?.message as string}
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* ZIP */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="zip"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ZIP / PIN"
                size="small"
                fullWidth
                required
                error={!!errors.zip}
                helperText={errors.zip?.message as string}
              />
            )}
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default MyAddress;
