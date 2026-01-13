export type employerRegisterType = {
  id?:number;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  foundedYear?:number;
  serialNo?:number;

  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  designation: string;

  password: string;
  confirmPassword: string;
  remoteopportunity:string;
  employmentType:string [];
  userType: number;
  createdAt?: Date;
updatedAt?: Date|null;
// deletedAt?: Date|null;
isActive?:boolean;

};