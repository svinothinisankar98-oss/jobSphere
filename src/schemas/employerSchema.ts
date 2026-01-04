import * as yup from "yup";
import {
  RequiredMessage,
  InvalidEmailMessage,
  InvalidPhoneMessage,
  PasswordMismatchMessage,
  SelectMessage,
  URL_REGEX,
  InvalidUrlMessage,
} from "../constants/ValidationMessages";

export const employerSchema = yup.object({
  companyName: yup.string().required(RequiredMessage("Company Name")),

  email: yup
    .string()
    .email(InvalidEmailMessage)
    .required(RequiredMessage("Email")),

  phone: yup
    .string()
    .required(RequiredMessage("Phone No"))
    .matches(/^[0-9]{10}$/, InvalidPhoneMessage),

  website: yup
    .string()
    .trim()
    .required(RequiredMessage("Website"))
    .matches(URL_REGEX, InvalidUrlMessage),

  industry: yup.string().required(SelectMessage("Industry")),

  companySize: yup.string().required(SelectMessage("Company size")),

  address1: yup.string().required(RequiredMessage("Office Address")),

  city: yup.string().required(RequiredMessage("City")),

  state: yup.string().required(RequiredMessage("State")),

  country: yup.string().required(SelectMessage("Country")),

  zip: yup.string().required(RequiredMessage("Zip code")),

  recruiterName: yup.string().required(RequiredMessage("Recruiter name")),

  recruiterEmail: yup
    .string()
    .email(InvalidEmailMessage)
    .required(RequiredMessage("Recruiter email")),

  recruiterPhone: yup
    .string()
    .required(RequiredMessage("Recruiter phone No"))
    .matches(/^[0-9]{10}$/, InvalidPhoneMessage),

  designation: yup.string().required(RequiredMessage("Designation")),

  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required(RequiredMessage("Password")),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], PasswordMismatchMessage)
    .required(RequiredMessage("Confirm password")),

  userType: yup.number().required(RequiredMessage("User type")),
});
