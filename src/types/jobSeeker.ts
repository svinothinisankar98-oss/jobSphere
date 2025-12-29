// /* ================= JOB SEEKER TYPES ================= */

// export type JobSeeker = {
//   id?: number;
//   Name: string;
//   email: string;
//   phoneno: string;
//   location: string;
//   experience: string;
//   skills: string;
//   resume: File | null;
//   password: string;
//   confirmPassword: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   deletedAt?: Date | null;
//   userType?: number             //flag uses jobseekers type//
//   fileName?: string;
//   resumeBase64?: Base64URLString; //base64 for resume convert to base64//
// };

// export type FormErrors = {
//   [K in keyof JobSeeker]?: string;
// };


 export type Option = {
  id: number;
  item: string;
 }

export type JobSeeker = {
  id?: number;
  Name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneno: string;
  location: string;
  experience: string;
  skills: string;
  fileName?: string;
  
   portfolio?: string | null;

  resume?: File | null;          
  resumeBase64?: string;

  userType?: number;
};
