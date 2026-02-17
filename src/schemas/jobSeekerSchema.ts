import * as yup from "yup";
import {
  InvalidEmailMessage,
  InvalidPhoneMessage,
  InvalidUrlMessage,
  PasswordMismatchMessage,
  RequiredMessage,
  SelectMessage,
  
} from "../constants/ValidationMessages";
import { REGEX } from "../constants/ValidationRegex"



export const jobSeekerSchema = yup.object({
 Name: yup
  .string()
  .trim()
  .required(RequiredMessage("Name"))
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters")
  .matches(/^[A-Za-z ]+$/, "Name can contain only letters"),


  email: yup
  .string()
  .trim()
  .required(RequiredMessage("Email"))
  .matches(REGEX.email, InvalidEmailMessage),


  password: yup
    .string()
    
    .required(RequiredMessage("Password"))
     .matches(REGEX.strongpassword, "Password must contain uppercase, lowercase, number, special character and be 6+ characters"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], PasswordMismatchMessage)
    .required(RequiredMessage("Confirm password")),

  phoneno: yup
    .string()
    .required(RequiredMessage("Phone No"))
    .matches(REGEX.phone, InvalidPhoneMessage),

  location: yup.string().required(SelectMessage("Current Location")),

  experience: yup.string().required(SelectMessage(" Work Experience")),

  skills: yup.string().required(RequiredMessage("Skills ")),

  portfolio: yup
    .string()
    .trim()
    .nullable()
    .test(
      "valid-url",
      InvalidUrlMessage,
      (value) => !value || REGEX.url.test(value)
    ),
  resume: yup.mixed<File>().nullable(),
});

// portfolio: yup
//   .string()
//   .trim()
//   .nullable()
//   .test(
//     "valid-url",
//     "Please enter a valid website URL",
//     (value) =>
//       !value ||
//       /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(value)
//   ),
