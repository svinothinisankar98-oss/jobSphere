export type Contact = {
  name: string;
  phone: string;
  email: string;
  designation?: string;
  profileImage?: File | null;
};

export type Branch = {
  id?: number;
  branchName: string;
  branchEmail: string;
  branchContact: Contact[];
};

export type CompanyInformationType = {
  id?: number;
  companyName: string;
  companyEmail: string;
  contact: Contact[];
  branches: Branch[]; // multiple branches
  createdAt?: Date;
};
