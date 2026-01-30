import * as yup from "yup";
import { InvalidEmailMessage, RequiredMessage } from "../constants/ValidationMessages";

export const loginSchema = yup.object({
 

      email: yup
        .string()
        .email(InvalidEmailMessage)
        .required(RequiredMessage("Email")),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});
