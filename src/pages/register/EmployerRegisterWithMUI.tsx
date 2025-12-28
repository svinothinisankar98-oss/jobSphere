import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Tabs,
  Tab,
  TextField,
  Typography,
} from "@mui/material";


//This tells TypeScript what data the form has //

type FormValues = {
  username: string;
  email: string;
  phoneno: string;
  website: string;
};

const EmployerRegisterWithMUI = () => {
  //Which tab is active (0 = Basic, 1 = Contact) //
  const [activeTab, setActiveTab] = useState(0);

  // react-hook-form setup //
  const {register,handleSubmit,trigger,formState: { errors }  } = useForm<FormValues>({
    mode: "onTouched",
  });

  // Runs when form is submitted //
  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
  };

  // Validate first tab and move to second tab //
  const goToNextTab = async () => {
    const isValid = await trigger(["username", "email"]);
    if (isValid) {
      setActiveTab(1);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={400}
      mx="auto"
      mt={4}

    >
 
      <Typography variant="h6" textAlign="center" mb={2}>
        Employer Registration
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        centered
      >
        <Tab label="Basic Info" />
        <Tab label="Contact Info" />
      </Tabs>

      
      {activeTab === 0 && (
        <>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register("username", {
              required: "Username is required",
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={goToNextTab}
            sx={{ mt: 2 }}
          >
            Next
          </Button>
        </>
      )}

      {/* -------- CONTACT INFO TAB -------- */}
      {activeTab === 1 && (
        <>
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            {...register("phoneno", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter 10 digit phone number",
              },
            })}
            error={!!errors.phoneno}
            helperText={errors.phoneno?.message}
          />

          <TextField
            label="Website"
            fullWidth
            margin="normal"
            {...register("website", {
              required: "Website is required",
            })}
            error={!!errors.website}
            helperText={errors.website?.message}
          />

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setActiveTab(0)}
            >
              Back
            </Button>

            <Button variant="contained" type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EmployerRegisterWithMUI;
