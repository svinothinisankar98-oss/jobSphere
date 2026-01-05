export const RequiredMessage = (field: string) =>
  `${field} is required`;

export const SelectMessage = (field: string) =>
  `Select ${field}`;

export const InvalidUrlMessage = "Please enter a valid website URL";


export const URL_REGEX =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;

export const InvalidEmailMessage = "Invalid email address";

export const InvalidPhoneMessage = "Enter valid mobile number";

export const PasswordMismatchMessage = "Passwords must match";