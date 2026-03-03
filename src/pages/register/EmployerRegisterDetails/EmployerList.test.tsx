import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmployerList from "./EmployerList";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../../test-utils";   //ui provider,router theme//
import { employerlistmock } from "./employerlist.mock";  //mock data//

//global mocks//

const mockOpenConfirm = vi.fn();   //detect openconfirm opened//
const mockSnackbar = vi.fn();       //detect success message shown//

// Router navigate mock//
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// UI Provider spy (no fake dialog DOM)
vi.mock("../../../context/UIProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../context/UIProvider")>();
  return {
    ...actual,
    useUI: () => ({
      showSnackbar: mockSnackbar,
      openConfirm: mockOpenConfirm,
    }),
  };
});

// Error boundary  - component throw error//
vi.mock("react-error-boundary", () => ({
  useErrorBoundary: () => ({ showBoundary: vi.fn() }),
}));

// API service
const mockGetRecruiterDetails = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("../../../hooks/useUserService", () => ({
  useUserService: () => ({
    getRecruiterDetails: mockGetRecruiterDetails,
    updateUser: mockUpdateUser,
  }),
}));

//test suite//

describe("EmployerList Page", () => {

  //Reset before each test//
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //load data test//

  it("loads and displays employers", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    render(<EmployerList />);

    expect(await screen.findByText("ewallhost")).toBeInTheDocument();
    expect(screen.getByText("Logictech")).toBeInTheDocument();
  });

  //navigation test//

  it("navigates to add employer page", async () => {
    mockGetRecruiterDetails.mockResolvedValue([]);
    customRender(<EmployerList />);

    await userEvent.click(screen.getByRole("button", { name: /add employee/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/employer-register");
  });

  //edit employee test//

  it("navigates to edit employer page", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    render(<EmployerList />);

    const editIcons = await screen.findAllByTestId("EditIcon");
    await userEvent.click(editIcons[0].closest("button")!);

    expect(mockNavigate).toHaveBeenCalledWith("/employer-register/edit/1");
  });

  //filter test//

  it("filters by company name", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    render(<EmployerList />);

    fireEvent.change(screen.getByPlaceholderText(/company name/i), {
      target: { value: "ewallhost" },
    });

    userEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("ewallhost")).toBeInTheDocument();
    expect(screen.queryByText("Logitech")).not.toBeInTheDocument();
  });

  //Reset Filter//

  it("resets filters", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    render(<EmployerList />);

    const input = screen.getByPlaceholderText(/company name/i);
    fireEvent.change(input, { 
      target: { value: "ewallhost" } 
    });
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });

//activate flow//

  it("activates employer when user confirms dialog", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    mockUpdateUser.mockResolvedValue({ success: true });

    render(<EmployerList />);

    const activateIcons = await screen.findAllByTestId("CheckCircleIcon");
    await userEvent.click(activateIcons[0].closest("button")!);

    expect(mockOpenConfirm).toHaveBeenCalled();

    const confirmConfig = mockOpenConfirm.mock.calls[0][0];       
    await confirmConfig.onConfirm();

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockSnackbar).toHaveBeenLastCalledWith(
        "1 employee activated successfully",
        "success"
      );
    });
  });

  it("does NOT activate employer when cancelled", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    render(<EmployerList />);

    const activateIcons = await screen.findAllByTestId("CheckCircleIcon");
    await userEvent.click(activateIcons[0].closest("button")!);

    expect(mockOpenConfirm).toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  //delete//

  it("deletes employer when user confirms open dialog", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    mockUpdateUser.mockResolvedValue({ success: true });

    render(<EmployerList />);

    const deleteIcons = await screen.findAllByTestId("DeleteIcon");
    await userEvent.click(deleteIcons[0].closest("button")!);

    expect(mockOpenConfirm).toHaveBeenCalled();

    const confirmConfig = mockOpenConfirm.mock.calls[0][0];
    await confirmConfig.onConfirm();

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockSnackbar).toHaveBeenLastCalledWith(
        "1 employee deleted successfully",
        "success"
      );
    });
  });

  it("does NOT delete employer when cancelled", async () => {
    mockGetRecruiterDetails.mockResolvedValue(employerlistmock);
    render(<EmployerList />);

    const deleteIcons = await screen.findAllByTestId("DeleteIcon");
    await userEvent.click(deleteIcons[0].closest("button")!);

    expect(mockOpenConfirm).toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  
});