import { userService, type User } from "../service/userService";
import type { employerRegisterType } from "../types/employerRegister";
import type { JobSeeker } from "../types/jobSeeker";

type CreateUserPayload = employerRegisterType | JobSeeker;

export const useUserService = () => {
  const getAllUsers = async (): Promise<User[]> => {
  try {
    return await userService.getUsers({ keyword: "" });
  } catch (error) {
    console.error("Failed to get users", error);
    return [];
  }
};

  // const createUser = async (data: Omit<User, "id">): Promise<User | null> => {
  //   try {
  //     return await userService.createUser(data);
  //   } catch (error) {
  //     console.error("Failed to create user", error);
  //     return null;
  //   }
  // };

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
      return await userService.getUserByEmail(email);
    } catch (error) {
      console.error("Failed to get user by email", error);
      return null;
    }
  };

  const getRecruiterDetails = async (): Promise<employerRegisterType[]> => {
  try {
    return await userService.getRecruiterDetails();
  } catch (error) {
    console.error("Failed to get Recruiter details", error);
    return []; 
  }
};

  
  const getEmployerByEmail = async (recruiterEmail: string): Promise<User | null> => {
    try {
      return await userService.getEmployerByEmail(recruiterEmail);
    } catch (error) {
      console.error("Failed to get user by email", error);
      return null;
    }
  };

const getEmployerById = async (id: string): Promise<employerRegisterType | null> => {
  try {
    return await userService.getEmployerById(id);
  } catch (error) {
    console.error("Failed to get user by id", error);
    return null;
  }
};

const updateUser = async (id: string, data: employerRegisterType) => {
  try {
    return await userService.updateUser(id, data);
  } catch (error) {
    console.error("Failed to update user", error);
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
  };
};
