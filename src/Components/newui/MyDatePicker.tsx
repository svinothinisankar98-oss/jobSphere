import * as React from "react";
import { Controller, useFormContext, get } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

//type for year and date//

type PickerType = "year" | "date";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  size?: "small" | "medium";
  pickerType?: PickerType; //type of pickertype//
  sx?: object;
};

const MyDatePicker = ({
  name,
  label,
  required = false,
  size = "small",
  pickerType = "date", // default full date
  sx,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  

  const error = get(errors, name);

  //Detect year only mode//

  const isYearOnly = pickerType === "year";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DesktopDatePicker
            label={label}

            //  switch views dynamically datepicker configuration//

            views={isYearOnly ? ["year"] : ["year", "month", "day"]}

            // display value handling//
            value={
              field.value
                ? isYearOnly
                  ? new Date(field.value, 0, 1)
                  : new Date(field.value)
                : null
            }

            //  store value
            onChange={(date) => {
              if (!date) return field.onChange(null);

              field.onChange(
                isYearOnly ? date.getFullYear() : date
              );
            }}

            //Disable future dates//

            maxDate={new Date()}

            //styling + error//

            slotProps={{
              textField: {
                fullWidth: true,
                size,
                required,
                error: !!error,
                helperText: error?.message as string,
                // sx: {
                //   "& .MuiFormLabel-asterisk": {
                //     color: "red",
                //   },
                //   ...sx,
                // },
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
