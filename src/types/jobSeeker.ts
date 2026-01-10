


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
