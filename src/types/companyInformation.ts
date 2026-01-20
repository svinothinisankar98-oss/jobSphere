export type Contact = {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  profileImage: File | null;
};

export type BranchContact = {
  branchContactName: string;
  branchContactPhone: string;
  branchperEmail: string;
  branchcity: string;
};

export type CompanyInformationType = {
  companyName: string;
  companyEmail: string;
  contacts: Contact[];
  branchContacts: BranchContact[];
};
