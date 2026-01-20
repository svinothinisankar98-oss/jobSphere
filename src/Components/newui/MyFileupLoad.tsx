import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormHelperText,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
  onChange?: (file: File | null) => void;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  buttonText?: string;
  showPreview?: boolean; // for images
};

const MyFileUpload: React.FC<Props> = ({
  name,
  label,
  required = false,
  accept,
  color = "primary",
  onChange,
  buttonText = "Upload File",
  showPreview = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [preview, setPreview] = useState<string | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        useEffect(() => {
          if (
            showPreview &&
            field.value &&
            (field.value as File).type.startsWith("image/")
          ) {
            const objectUrl = URL.createObjectURL(field.value);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
          } else {
            setPreview(null);
          }
        }, [field.value]);

        return (
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
                {buttonText}
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
                <Box display="flex" alignItems="center" gap={1}>
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

                  {/* Remove Button */}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      field.onChange(null);
                      onChange?.(null);
                      setPreview(null);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Image Preview */}
            {showPreview && preview && (
              <Box mt={1}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              </Box>
            )}

            {/* Error message */}
            {errors?.[name] && (
              <FormHelperText error>
                {errors[name]?.message as string}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};

export default MyFileUpload;
