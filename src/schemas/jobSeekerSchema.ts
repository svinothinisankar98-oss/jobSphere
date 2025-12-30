import * as yup from "yup";

export const jobSeekerSchema = yup.object({
  Name: yup.string().required("Full name is required"),

  email: yup
    .string()
    .email("Invalid email")
    
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  phoneno: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter valid mobile number")
    .required("Mobile number is required"),

  location: yup.string().required("Location is required"),

  experience: yup.string().required("Experience is required"),

  skills: yup.string().required("Skills are required"),

   portfolio: yup
  .string()
  .trim()
  .nullable()
  .test(
    "valid-url",
    "Please enter a valid website URL",
    (value) =>
      !value ||
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(value)
  ),

  
  
      resume: yup.mixed<File>().nullable(),
});
