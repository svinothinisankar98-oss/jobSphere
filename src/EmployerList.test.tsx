import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmployerList from "./pages/register/employerregisterdetails/EmployerList";
import userEvent from "@testing-library/user-event";
import { customRender } from "./test-utils";


//Router Mock//
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

//ui provider mock snackbar//
vi.mock("./context/UIProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./context/UIProvider")>();

  return {
    ...actual, // keep UIProvider component
    useUI: () => ({
      showSnackbar: vi.fn(),
    }),
  };
});
//erro boundary mock//
vi.mock("react-error-boundary", () => ({
  useErrorBoundary: () => ({ showBoundary: vi.fn() }),
}));

//API Service mock//
const mockGetRecruiterDetails = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("./hooks/useUserService", () => ({
  useUserService: () => ({
    getRecruiterDetails: mockGetRecruiterDetails,
    updateUser: mockUpdateUser,
  }),
}));

//employers handlers activate delete//
const mockDelete = vi.fn();
const mockActivate = vi.fn();

vi.mock("./hooks/employer/useEmployerListHandlers", () => ({
  useEmployerListHandlers: () => ({
    handleDeleteClick: mockDelete,
    handleActivateClick: mockActivate,
  }),
}));

//mock data//

const employers = [
  {
    id: 1,
    companyName: "ewallhost",
    recruiterName: "John",
    recruiterEmail: "john@ewallhost.com",
    recruiterPhone:"7894561234",
    companySize: "1000+",
    industry: "IT",
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    companyName: "Logictech",
    recruiterName: "Sam",
    recruiterEmail: "sam@logitech.com",
    recruiterPhone: "8888888888",
    companySize: "500+",
    industry: "Ecommerce",
    isActive: false,
    createdAt: "2024-01-01",
  },
];

//test suite//

describe("EmployerList Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //read load employers//
  it("loads and displays employers", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employers);

    render(<EmployerList />);

    expect(await screen.findByText("ewallhost")).toBeInTheDocument();
    expect(screen.getByText("Logictech")).toBeInTheDocument();
  });

//create navigate to add employer page//
  it("navigates to add employer page", async () => {
    mockGetRecruiterDetails.mockResolvedValue([]);

     customRender(<EmployerList />);

    await userEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/employer-register");
  });

//update -edit employer//
  it("navigates to edit employer page", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employers);

    render(<EmployerList />);

    const editButtons = await screen.findAllByTestId("EditIcon");
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/employer-register/edit/1");
  });

  //delete - remove employer//
  it("calls delete handler", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employers);

    render(<EmployerList />);

    const deleteButtons = await screen.findAllByTestId("DeleteIcon");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  //activate — Activate Employer//
  it("calls activate handler for inactive employer", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employers);

    render(<EmployerList />);

    const activateButtons = await screen.findAllByTestId("CheckCircleIcon");
    fireEvent.click(activateButtons[0]);

    await waitFor(() => {
      expect(mockActivate).toHaveBeenCalled();
    });
  });

  //Search— Filter Data//
  it("filters by company name", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employers);

    render(<EmployerList />);

    fireEvent.change(screen.getByPlaceholderText(/company name/i), {
      target: { value: "ewallhost" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("ewallhost")).toBeInTheDocument();
    expect(screen.queryByText("Logitech")).not.toBeInTheDocument();
  });

  //reset//
  it("resets filters", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employers);

    render(<EmployerList />);

    const input = screen.getByPlaceholderText(/company name/i);

    fireEvent.change(input, { target: { value: "ewallhost" } });

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });
});