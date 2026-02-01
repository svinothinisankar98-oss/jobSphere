import * as yup from "yup";
import { RequiredMessage } from "../constants/ValidationMessages";

export const jobListSchema = yup.object({
  companyName: yup.string().required( RequiredMessage("Company name required")),
  website: yup.string().url().required(RequiredMessage("Website required")),
  title: yup.string().required(RequiredMessage("Job Title")),
  jobType: yup.string().required(RequiredMessage("Job Type")),
  state: yup.string().required(RequiredMessage("State")),
  location: yup.string().required(RequiredMessage(" Location")),
  experience: yup.string().required(RequiredMessage("Expereince")),
  salary: yup.string().required(RequiredMessage("Salary")),
  benefits: yup.string().required(RequiredMessage("Benefits")),
  tags: yup.string().required(RequiredMessage("Skills")),
  description: yup.string().required(RequiredMessage("Description")),
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
