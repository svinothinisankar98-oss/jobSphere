// // import axios from "axios";
// import { apiService } from "./apiService";

// // const ApiURl = `http://localhost:4000`;

// export const userService = {
//   getUsers: async (): Promise<any> => {
//     return apiService.get("users");
//   },

//   //create user //

//   createUser: async (data: any): Promise<any> => {
//     try {
//       console.log(data, "from service");
//       return await apiService.post("users", data);
//     } catch (error: any) {
//       throw new Error(error);
//     }
//   },

//   //get user by email//

//   getUserbyEmail: async (email: string): Promise<any> => {
//     try {
//       const getData = await apiService.get("users", {email});
//       console.log(getData, "from ");
//       return getData;
//     } catch (error: any) {
//       console.log(error, "from error");
//       throw new Error(error);
//     }
//   },
// };

// export function getUsers() {
//   throw new Error("Function not implemented.");
// }

import type { employerRegisterType } from "../types/employerRegister";
import { apiService } from "./apiService";

/* ================= TYPES ================= */

export interface User {
  id: number;
  email: string;
  password: string;
  userType: number;
}

/* ================= SERVICE ================= */

export const userService = {
  // GET ALL USERS
  getUsers: async (p0: { keyword: string; }): Promise<User[]> => {
    const response = await apiService.get<User[]>("users");
    return response;
  },

  // CREATE USER
  createUser: async (data: any): Promise<User> => {
    const response = await apiService.post<User>("users", data);
    return response;
  },

  // GET USER BY EMAIL (json-server compatible)
  getUserByEmail: async (email: string): Promise<User | null> => {
    const response = await apiService.get<User[]>(`users?email=${email}`);
    return response[0] ?? null;
  },

  getEmployerByEmail:async (recruiterEmail:string): Promise<User | null>=>{
    const response = await apiService.get<User[]>(`users?recruiterEmail=${recruiterEmail}&userType=2`);
    return response[0]??null;
  },
  getRecruiterDetails:async(getRecruiterDetails:string):Promise<employerRegisterType []|[]>=>{
    const response = await apiService.get<employerRegisterType[]>(`users?userType=2`)
    return response;
  },

  deleteUser: async (id: string,data:any): Promise<any> => {
    // getData.isDelete = true;
  return apiService.put(`users/${id}`, data);
}
};
