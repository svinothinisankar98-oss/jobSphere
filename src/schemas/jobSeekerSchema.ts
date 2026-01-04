import * as yup from "yup";
import {
  InvalidEmailMessage,
  InvalidPhoneMessage,
  InvalidUrlMessage,
  PasswordMismatchMessage,
  RequiredMessage,
  SelectMessage,
  URL_REGEX,
} from "../constants/ValidationMessages";

export const jobSeekerSchema = yup.object({
  Name: yup.string().required(RequiredMessage("Name")),

  email: yup
    .string()
    .email(InvalidEmailMessage)
    .required(RequiredMessage("Email")),

  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required(RequiredMessage("Password")),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], PasswordMismatchMessage)
    .required(RequiredMessage("Confirm password")),

  phoneno: yup
    .string()
    .required(RequiredMessage("Phone No"))
    .matches(/^[0-9]{10}$/, InvalidPhoneMessage),

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
      (value) => !value || URL_REGEX.test(value)
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
