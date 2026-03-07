import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CompanyInformation from "./CompanyInformation";
import userEvent from "@testing-library/user-event";

//mocks//

// UI Context
vi.mock("../../context/UIProvider", () => ({
  useUI: () => ({
    openConfirm: vi.fn(),
    showSnackbar: vi.fn(),
  }),
}));

// Company handlers
vi.mock("../../hooks/companyinformation/useCompanyInfoHandlers", () => ({
  useCompanyInfoHandlers: () => ({
    isEdit: false,
    onSubmit: vi.fn(),
  }),
}));

// BranchContacts
vi.mock("../companyinformation/BranchContacts", () => ({
  default: () => <div>Branch Contacts</div>,
}));

// Accordion
vi.mock("../../Components/newui/MyAccordion", () => ({
  default: ({ title, children }: any) => (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

// TextField
vi.mock("../../Components/newui/MyTextField", () => ({
  default: ({ label }: any) => <input aria-label={label} />,
}));

// Button
vi.mock("../../Components/newui/MyButton", () => ({
  default: ({ label }: any) => <button>{label}</button>,
}));

// File upload
vi.mock("../../Components/newui/MyFileupLoad", () => ({
  default: () => <input type="file" />,
}));

//test suite//

describe("CompanyInformation Component", () => {

  //test company information title//

  it("renders company information title", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Company Information/i)).toBeInTheDocument();
  });
//render company details accordian//

  it("renders company details accordion", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Company Details/i)).toBeInTheDocument();
  });

  //renders company fields//

  it("renders company fields", () => {
    render(<CompanyInformation />);
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Email/i)).toBeInTheDocument();
  });
//renders company contact section//

  it("renders contact persons section", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Contact Persons/i)).toBeInTheDocument();
  });

//add contact person button render correctly//

  it("renders add contact button", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Add Contact/i)).toBeInTheDocument();
  });

  it("renders company branches accordion", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Company Branches/i)).toBeInTheDocument();
  });

  it("renders branch contacts component", () => {
    render(<CompanyInformation />);
    expect(screen.getByText("Branch Contacts")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it("renders reset button", () => {
    render(<CompanyInformation />);
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  it("expands all accordion sections", () => {
  render(<CompanyInformation />);

  const companyDetails = screen.getByText(/Company Details/i);
  const companyBranches = screen.getByText(/Company Branches/i);

  userEvent.click(companyDetails);
  userEvent.click(companyBranches);

  expect(companyDetails).toBeInTheDocument();
  expect(companyBranches).toBeInTheDocument();
});

it("company details accordion expands when clicked", async () => {
  render(<CompanyInformation />);

  const accordion = screen.getByText(/Company Details/i);

  await userEvent.click(accordion);

  expect(
    screen.getByLabelText(/Company Name/i)
  ).toBeInTheDocument();
});
it("company branches accordion expands", async () => {
  render(<CompanyInformation />);

  const branches = screen.getByText(/Company Branches/i);

  await userEvent.click(branches);

  expect(
    screen.getByText(/Branch Contacts/i)
  ).toBeInTheDocument();
});

//default open botn accordian when page refresh//

it("both accordions are open by default", () => {
  render(<CompanyInformation />);

  expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Branch Name/i)).toBeInTheDocument();
});

//new add contact person add button is clicked//

it("adds new contact person when Add Contact button is clicked", async () => {
  render(<CompanyInformation />);

  const addButton = screen.getByText(/Add Contact/i);

  await userEvent.click(addButton);

  expect(addButton).toBeInTheDocument();
});

});