import type { employerRegisterType } from "../types/employerRegister";
import type { JobSeeker } from "../types/jobSeeker";
import { apiService } from "./apiService";

/* ================= TYPES ================= */

export interface User {
  id: number;
  email: string;
  password: string;
  userType: number;
  recruiterEmail?: string;
  savedJobs?: any[];
   createdAt: string;

}
type CreateUserPayload = employerRegisterType | JobSeeker;

/* ================= SERVICE ================= */

export const userService = {
  // GET ALL USERS
  getUsers: async (p0: { keyword: string; }): Promise<User[]> => {
    const response = await apiService.get<User[]>("users");
    return response;
  },

  // CREATE USER

  createUser: async (data: CreateUserPayload): Promise<User> => {
    console.log(data, "user service");

    const response = await apiService.post<User>("users", data);
    return response;
  },

  // GET USER BY EMAIL 
  getUserByEmail: async (email: string): Promise<User | null> => {
    const response = await apiService.get<User[]>(`users?email=${email}`);
    console.log(response,"response")
    return response[0] ?? null;
  },

  getUser: async (email: string): Promise<any> => {
    const response: any = await apiService.get(`users?email=${email}`);
    return response[0] ?? null;
  },

  getEmployerByEmail: async (recruiterEmail: string): Promise<User | null> => {
    const response = await apiService.get<User[]>(
      `users?recruiterEmail=${recruiterEmail}&userType=2`,
    );
    return response[0] ?? null;
  },
  getRecruiterDetails: async (): Promise<employerRegisterType[]> => {
    const response =
      await apiService.get<employerRegisterType[]>(`users?userType=2`);
    return response;
  },

  updateUser: async (id: number, data: any): Promise<any> => {
    // getData.isDelete = true;
    return apiService.put(`users/${id}`, data);
  },
 getEmployerById: async (id: string): Promise<employerRegisterType | null> => {
  const response = await apiService.get<employerRegisterType>(
    `users/${id}`
  );

  return response;
},
  // USER TYPE STATS (Jobseeker vs Employer)
getUserTypeStats: async (): Promise<{ jobseeker: number; employer: number }> => {
  const users = await apiService.get<User[]>("users");

  let jobseeker = 0;
  let employer = 0;

  for (const u of users) {
    if (u.userType === 1) jobseeker++;
    else if (u.userType === 2) employer++;
  }

  return { jobseeker, employer };
},

  
};
