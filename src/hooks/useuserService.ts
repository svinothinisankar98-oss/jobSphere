
import { userService, type User } from "../service/userService";
import type { employerRegisterType } from "../types/employerRegister";
import type { JobSeeker } from "../types/jobSeeker";
import { handleError } from "../utils/handleError";
import { useErrorBoundary } from "react-error-boundary";


type CreateUserPayload = employerRegisterType | JobSeeker;

export const useUserService = ( showBoundary?: (error: any) => void) => {
  
    



  const getAllUsers = async (): Promise<User[]> => {
    
  try {
    return await userService.getUsers({ keyword: "" });
  } catch (error: any) {
    handleError(error, {
      showBoundary,
      setLocalError:error
    });
    throw error; 
  }
};

  const createUser = async (data: CreateUserPayload) => {
    try {
      return await userService.createUser(data);
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  };

  const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      const res = await userService.getUserByEmail(email);

      return res;
    } catch (error: any) {
       console.error("Failed to create user", error);
      // Otherwise real error
      throw error;
    }
  };

  const getRecruiterDetails = async (): Promise<employerRegisterType[]> => {
  
    try {
      return await userService.getRecruiterDetails();
    } catch (error: any) {
    handleError(error, {
      showBoundary,
        setLocalError:error
    });
    
    throw error; 
  }
  };

  const getEmployerByEmail = async (recruiterEmail: string ): Promise<User | null> => {
    try {
      return await userService.getEmployerByEmail(recruiterEmail);
    } catch (error:any) {
      console.error("Failed to get user by email", error);
     throw error;
    }
  };

  const getEmployerById = async (id: string,): Promise<employerRegisterType | null> => {
    try {
      return await userService.getEmployerById(id);
    } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      " Server Error Failed to fetch Employer  details";

    // return controlled failure
    return Promise.reject(new Error(message));
  }
  };

  const updateUser = async (id: number, data: employerRegisterType) => {
    try {
      return await userService.updateUser(id, data);
    } catch (error) {
      console.error("Failed to update user", error);
      return null;
    }
  };

  const getUser = async (email: string): Promise<any> => {
    try {
      return await userService.getUser(email);
    } catch (error) {
      console.error("Failed to get user by email", error);
      return null;
    }
  };

  return {
    getAllUsers,
    createUser,
    getUserByEmail,
    getEmployerByEmail,
    getEmployerById,
    updateUser,
    getRecruiterDetails,
    getUser,
  };
};

// const getUserByEmail = async (email: string): Promise<apiResponse<any>> => {
//     try {
//       const res = await userService.getUserByEmail(email);
//       console.log("res", res);
//       if (res) {
//         return {
//           success: false,
//           message: "Register Email Already exists",
//           data: res,
//         };
//       } else {
//         return {
//           success: true,
//           message: "",
//           data: res,
//         };
//       }
//     } catch (error: any) {
//       // Otherwise real error
//       throw error;
//     }
//   };