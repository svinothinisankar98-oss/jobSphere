import React from "react";
import { Stack, TextField, MenuItem } from "@mui/material";
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
    <Stack spacing={2}>
      {/* Row 1 */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Stack flex={1} maxWidth={420}>
          <Controller
            name="address1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address Line 1"
                size="small"
                required
                error={!!errors.address1}
                helperText={errors.address1?.message as string}
              />
            )}
          />
        </Stack>

        <Stack flex={1} maxWidth={420}>
          <Controller
            name="address2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address Line 2"
                error={!!errors.address2}
                size="small"
                helperText={errors.address2?.message as string}
              />
            )}
          />
        </Stack>
      </Stack>

      {/* Row 2 */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Stack flex={1} maxWidth={420}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                size="small"
                error={!!errors.city}
                required
                helperText={errors.city?.message as string}
              />
            )}
          />
        </Stack>

        <Stack flex={1} maxWidth={420}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="State"
                size="small"
                required
                error={!!errors.state}
                helperText={errors.state?.message as string}
              />
            )}
          />
        </Stack>
      </Stack>

      {/* Row 3 */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Stack flex={1} maxWidth={420}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField select label="Country" {...field}>
                {COUNTRY_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>

        <Stack flex={1} maxWidth={420}>
          <Controller
            name="zip"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ZIP / PIN"
                size="small"
                required
                error={!!errors.zip}
                helperText={errors.zip?.message as string}
              />
            )}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MyAddress;
