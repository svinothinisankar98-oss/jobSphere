//  export const CompanyInformationdefault = {
//       companyName: "",
//       companyEmail: "",
//       contacts: [
//         {
//           contactName: "",
//           contactPhone: "",
//           contactEmail: "",
//           profileImage: null,
//         },
//       ],
//       branchContacts: [
//         {
//           branchContactName: "",
//           branchContactPhone: "",
//           branchperEmail: "",
//           branchcity: "",
//         },
//       ],
//     }

export const CompanyInformationdefault = {
  companyName: "",
  companyEmail: "",
  createdAt:new Date(),

  contact: [
    {
      name: "",
      phone: "",
      email: "",
      profileImage: null,
    },
  ],

  branches: [
    {
      branchName: "",
      branchEmail: "",
      branchContact: [
        {
          name: "",
          phone: "",
          email: "",
          Designation: "",
        },
      ],
    },
  ],
};


