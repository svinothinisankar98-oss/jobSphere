// export type Contact = {
//   contactName: string;
//   contactPhone: string;
//   contactEmail: string;
//   profileImage: File | null;
// };

// export type BranchContact = {
//   branchContactName: string;
//   branchContactPhone: string;
//   branchperEmail: string;
//   branchcity: string;
// };

// export type CompanyInformationType = {
//   companyName: string;
//   companyEmail: string;
//   contacts: Contact[];
//   branchContacts: BranchContact[];
// };

export type Contact = {
  name: string;
  phone: string;
  email: string;
  designation?:  string;
  profileImage?: File | null;
};

export type Branch = {
  branchName: string;
  branchEmail: string;
  branchContact: Contact[];
};

export type CompanyInformationType = {
  id?:number
  companyName: string;
  companyEmail: string;
  contact: Contact[];
  branches: Branch[];   // multiple branches
  createdAt?:Date;
};

