import * as yup from "yup";
import { InvalidUrlMessage, RequiredMessage } from "../constants/ValidationMessages";
import { REGEX } from "../constants/ValidationRegex";

export const jobListSchema = yup.object({
  companyName: yup
  .string()
  .required( RequiredMessage("Company name "))
   .min(3, "Company Name must be at least 3 characters")
  .max(50, "Company Name must be at most 50 characters"),

  website: yup
  .string()
  .url()
   
  .required(RequiredMessage("Website "))
  .matches(REGEX.url, InvalidUrlMessage),

  title: yup
  .string()
  .required(RequiredMessage("Job Title"))
  .min(3, "Title must be at least 3 characters")
  .max(50, "Title must be at most 50 characters"),

  jobType: yup
  .string()
  .required(RequiredMessage("Job Type"))
  .min(3, "JoyType must be at least 3 characters")
  .max(50, "Title must be at most 50 characters"),

  state: yup
  .string()
  .required(RequiredMessage("State")),

  location: yup
  .string()
  .required(RequiredMessage(" Location")),

  experience: yup
  .string()
  .required(RequiredMessage("Expereince")),

  salary: yup
  .string()
  .required(RequiredMessage("Salary")),

  benefits: yup
  .string()
  .required(RequiredMessage("Benefits")),

  tags: yup
  .string()
  .required(RequiredMessage("Skills")),

  description: yup
  .string()
  .required(RequiredMessage("Description")),

  educationQualification: yup
  .array()
  .required(RequiredMessage("Education Qualification "))
  .min(1, "Select at least one education level"),
 

  noOfOpenings: yup
  .number()
  .typeError("Enter a valid number")
  .required(RequiredMessage("Number of openings "))
  .min(1, "At least 1 opening required")
  

});
