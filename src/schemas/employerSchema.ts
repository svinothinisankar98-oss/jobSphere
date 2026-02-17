import * as yup from "yup";
import {
  RequiredMessage,
  InvalidEmailMessage,
  InvalidPhoneMessage,
  PasswordMismatchMessage,
  SelectMessage,
  InvalidUrlMessage,
} from "../constants/ValidationMessages";

import { REGEX } from "../constants/ValidationRegex";


  const currentYear = new Date().getFullYear();

export const employerSchema = yup.object({


  companyName: yup
    .string()
    .required(RequiredMessage("Company Name"))

    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")

    .matches(/^[A-Za-z ]+$/, "Name can contain only letters"),

  email: yup
    .string()
    .email(InvalidEmailMessage)
    .required(RequiredMessage("Email"))
    .matches(REGEX.email, InvalidEmailMessage),

  phone: yup
    .string()
    .required(RequiredMessage("Phone No"))
    .matches(REGEX.phone, InvalidPhoneMessage),

  website: yup
    .string()
    .trim()
    .required(RequiredMessage("Website"))
    .matches(REGEX.url, InvalidUrlMessage),

  //   foundedYear: yup
  // .number()
  // .typeError("Year must be a valid number")
  // .required("Founded Year is required")
  // .min(1900, `Year must be after 1900`)
  // .max(currentYear, `Year cannot be in the future`),


  industry: yup.string().required(SelectMessage("Industry")),

  companySize: yup.string().required(SelectMessage("Company size")),

  address1: yup
    .string()
    .required(RequiredMessage("Office Address"))

    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),

  city: yup.string().required(RequiredMessage("City")),

  state: yup.string().required(RequiredMessage("State")),

  country: yup.string().required(SelectMessage("Country")),

  zip: yup.string().required(RequiredMessage("Zip code")),

  recruiterName: yup
    .string()
    .required(RequiredMessage("Recruiter name"))

    .min(3, " Recruiter Name must be at least 3 characters")
    .max(50, "Recruiter Name must be at most 50 characters")
    .matches(/^[A-Za-z ]+$/, "Name can contain only letters"),

  recruiterEmail: yup
    .string()
    .email(InvalidEmailMessage)
    .required(RequiredMessage("Recruiter email"))
    .matches(REGEX.email, InvalidEmailMessage),

  recruiterPhone: yup
    .string()
    .required(RequiredMessage("Recruiter phone No"))
    .matches(REGEX.phone, InvalidPhoneMessage),

  designation: yup
    .string()
    .required(RequiredMessage("Designation"))
    .min(3, "Designation must be at least 3 characters")
    .max(50, "Designation must be at most 50 characters")
    .matches(/^[A-Za-z ]+$/, "Name can contain only letters"),

  password: yup
    .string()
    .required(RequiredMessage("Password"))
    .matches(
      REGEX.strongpassword,
      "Password must contain uppercase, lowercase, number, special character and be 6+ characters",
    ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], PasswordMismatchMessage)
    .required(RequiredMessage("Confirm password")),

  remoteopportunity: yup
    .string()
    .required(RequiredMessage("Remote Opportunity")),

  employmentType: yup
    .array()
    .of(yup.string().required())
    .required(RequiredMessage("Employment type"))
    .min(1, SelectMessage(" atleast one Employment type")),

  userType: yup.number().required(RequiredMessage("User type")),
});
