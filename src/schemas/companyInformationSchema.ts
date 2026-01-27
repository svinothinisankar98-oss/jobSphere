import * as yup from "yup";
import {
  InvalidEmailMessage,
  InvalidPhoneMessage,
  RequiredMessage,
} from "../constants/ValidationMessages";
import { REGEX } from "../constants/regex";

export const companyInformationSchema = yup.object({
  companyName: yup
    .string()
    .required(RequiredMessage("Company Name"))
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")

    .trim(),

  companyEmail: yup
    .string()
    .email(InvalidEmailMessage)
    .required(RequiredMessage("Company Email"))
    .test(
      "is-company-email",
      "Enter your Company Email (not Gmail, Yahoo, Outlook, etc.)",
      (value: string) => {
        if (!value) return true;

        const blockedDomains = [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
        ];

        const domain = value.split("@")[1]?.toLowerCase();
        return domain ? !blockedDomains.includes(domain) : true;
      },
    )
    .trim(),

  contact: yup
    .array()
    .of(
      yup.object({
        name: yup
          .string()
          .required(RequiredMessage("Contact Name"))
          .min(3, "Name must be at least 3 characters")
          .max(50, "Name must not exceed 50 characters")
          .matches(REGEX.name, "Only letters allowed")

          .trim(),

        phone: yup
          .string()
          .required(RequiredMessage("Contact Phone"))
          .matches(REGEX.phone, InvalidPhoneMessage),

        email: yup
          .string()
          .email(InvalidEmailMessage)
          .required(RequiredMessage("Contact Email")),

        profileImage: yup.mixed<File>().nullable(),
      }),
    )
    .required()
    .min(1),

  branches: yup
    .array()
    .of(
      yup.object({
        branchName: yup
          .string()
          .required(RequiredMessage("Branch Name"))
          .min(2, "Branch name must be at least 3 characters")
          .max(50, "Branch name must not exceed 50 characters"),

        branchEmail: yup
          .string()
          .email(InvalidEmailMessage)
          .required(RequiredMessage("Branch Email"))
          .test(
            "is-company-email",
            "Enter your Company Email (not Gmail, Yahoo, Outlook, etc.)",
            (value: string) => {
              if (!value) return true;

              const blockedDomains = [
                "gmail.com",
                "yahoo.com",
                "outlook.com",
                "hotmail.com",
              ];

              const domain = value.split("@")[1]?.toLowerCase();
              return domain ? !blockedDomains.includes(domain) : true;
            },
          )
          .trim(),

        branchContact: yup
          .array()
          .of(
            yup.object({
              name: yup
                .string()
                .required(RequiredMessage("Contact Name"))
                .min(2, "Name must be at least 3 characters")
                .max(50, "Name must not exceed 50 characters")
                .matches(REGEX.name, "Only letters allowed"),

              phone: yup
                .string()
                .required(RequiredMessage("Contact Phone"))
                .matches(REGEX.phone, InvalidPhoneMessage),
              email: yup
                .string()
                .email(InvalidEmailMessage)
                .required(RequiredMessage("Contact Email")),

              Designation: yup.string(),
            }),
          )
          .required()
          .min(1),
      }),
    )
    .required(),
});
