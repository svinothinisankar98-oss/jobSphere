import React from "react";
import { Box, Button, Typography, FormHelperText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
  onChange?: (file: File | null) => void;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
};

const MyFileUpload: React.FC<Props> = ({
  name,
  label,
  required = false,
  accept,
  color,
  onChange,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          {/* Label */}
          {label && (
            <Typography fontWeight={600} mb={1}>
              {label}
              {required && <span style={{ color: "red" }}> *</span>}
            </Typography>
          )}

          {/* Upload Row */}
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              component="label"
                color={color}
              startIcon={<CloudUploadIcon />}
            >
              Upload Resume
              <input
                hidden
                type="file"
                accept={accept}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  field.onChange(file);
                  onChange?.(file);
                }}
              />
            </Button>

            {/* File name */}
            {field.value && (
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {(field.value as File)?.name}
              </Typography>
            )}
          </Box>

          {/* Error message */}
          {errors?.[name] && (
            <FormHelperText error>
              {errors[name]?.message as string}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default MyFileUpload;
