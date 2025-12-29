import * as yup from "yup";

export const employerSchema = yup.object({
  companyName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  website: yup.string().required(),
  industry: yup.string().required(),
  companySize: yup.string().required(),

  foundedYear: yup.number().nullable().defined(),

  address1: yup.string().required(),
  address2: yup.string().nullable().defined(),
  city: yup.string().required(),
  state: yup.string().required(),
  country: yup.string().required(),
  zip: yup.string().required(),

  recruiterName: yup.string().required(),
  recruiterEmail: yup.string().email().required(),
  recruiterPhone: yup.string().required(),
  designation: yup.string().required(),

  password: yup.string().required(),
  confirmPassword: yup.string().required(),

  userType: yup.number().defined(),
});

export type CompanyForm = yup.InferType<typeof employerSchema>;
