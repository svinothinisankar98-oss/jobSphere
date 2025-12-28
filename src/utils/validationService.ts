import { userService } from "../service/userService";

//Form Field Validation//

export const validateField = (
  name: string,
  value: string,
  form?: any
): string => {
  if (!value?.trim() && name !== "resume") {          //Required Field Validation//
    return `${name} is required`;
  }

  //Email Format Validation//

  if (name === "email") {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      return "Invalid email format";
    }
  }

  //Password Length Validation//

  if (name === "password" && value.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (name === "confirmPassword" && form) {
    if (value !== form.password) {
      return "Passwords do not match";
    }
  }

  return "";
};

//Email Already Exists Check//

export const validateUser = async (email: string): Promise<any> => {
  try {
    const getAllUsers: any[] = (await userService.getUsers()) || [];

    if (getAllUsers?.length == 0) {
      return false;
    }

    if (getAllUsers?.length > 0) {
      const checkEMail = getAllUsers?.some((d) => d?.email?.includes(email));
      return checkEMail;
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};
