import { userService, type User } from "../service/userService";

export const useUserService = () => {
  const getAllUsers = async (): Promise<User[]> => {
    try {
      return await userService.getUsers();
    } catch (error) {
      console.error("Failed to get users", error);
      return [];
    }
  };

  const createUser = async (data: Omit<User, "id">): Promise<User | null> => {
    try {
      return await userService.createUser(data);
    } catch (error) {
      console.error("Failed to create user", error);
      return null;
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

  return {
    getAllUsers,
    createUser,
    getUserByEmail,
  };
};
