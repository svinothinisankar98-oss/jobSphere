import * as yup from "yup";

export const employerSchema = yup.object({
  companyName: yup.string().required("Enter your company name"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string()
  .matches(/^[0-9]{10}$/, "Enter valid mobile number")
  .required("Enter you company mobile no"),
  website: yup.string().required("Enter your website name"),
  industry: yup.string().required("Select Industry"),
  companySize: yup.string().required("Select your company size"),

  foundedYear: yup.number().nullable().defined(),

  address1: yup.string().required("Enter your office Address"),
  address2: yup.string().nullable().defined(),
  city: yup.string().required("Enter your city"),
  state: yup.string().required("Enter your state"),
  country: yup.string().required("select country"),
  zip: yup.string().required("Enter your zip code"),

  recruiterName: yup.string().required("Enter your Name"),
  recruiterEmail: yup.string().email("Invalid Email format").required("Enter your email address"),
  recruiterPhone: yup.string().required("Enter your Phone no"),
  designation: yup.string().required("Enter your designation"),

  password: yup.string()
  .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup.string()
  .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
      
  userType: yup.number().defined(),
});

export type EmployerRegister = yup.InferType<typeof employerSchema>;
