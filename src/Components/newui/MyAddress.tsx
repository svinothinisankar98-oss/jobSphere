import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Controller, useFormContext, get } from "react-hook-form";

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

  const renderTextField = (
    name: string,
    label: string,
    required = false
  ) => {
    const error = get(errors, name);

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            size="small"
            fullWidth
            required={required}
            error={!!error}
            helperText={error?.message as string}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          />
        )}
      />
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {renderTextField("address1", "Address Line 1", true)}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderTextField("address2", "Address Line 2")}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderTextField("city", "City", true)}
        </Grid>

       <Grid size={{ xs: 12, md: 6 }}>
          {renderTextField("state", "State", true)}
        </Grid>

       <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => {
              const error = get(errors, "country");

              return (
                <TextField
                  {...field}
                  select
                  label="Country"
                  size="small"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error?.message as string}
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
              );
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {renderTextField("zip", "ZIP / PIN", true)}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyAddress;
