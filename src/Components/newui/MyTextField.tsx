import { Controller, useFormContext, get } from "react-hook-form";
import TextField from "@mui/material/TextField";

//props types//

type  MyTextFieldProps ={
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  rows?: number;
  helpertext?:string;
  size?: "small" | "medium";
  sx?: object;                      //custom mui styling//
}

const MyTextField = ({
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  inputMode,
 
  rows,
  size = "small",
  sx,
}: MyTextFieldProps) => {
  const {                           //accessing form context//
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);    

  return (
    <Controller                   //controller usage//
      name={name}
      control={control}
      render={({ field }) => (    //value onchange onblur ref//
        <TextField
          {...field}
          fullWidth
          label={label}
          type={type}
          placeholder={placeholder}
         
          required={required}
          size={size}
          inputMode={inputMode}
          multiline={Boolean(rows)}
          rows={rows}
          error={!!error}         //shows red border error handling//
          helperText={error?.message as string}  //display yup validation message//
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "red",
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default MyTextField;
