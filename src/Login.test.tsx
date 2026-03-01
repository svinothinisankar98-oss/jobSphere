import { vi } from "vitest";

//Hoisted mocks //
const {
  mockGetUser,
  mockGetEmployer,
  mockShowSnackbar,
  mockNavigate,
  mockAuthSet,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetEmployer: vi.fn(),
  mockShowSnackbar: vi.fn(),
  mockNavigate: vi.fn(),
  mockAuthSet: vi.fn(),
}));

//service mock-api layer//
vi.mock("./hooks/useUserService", () => ({
  useUserService: () => ({
    getUserByEmail: mockGetUser,
    getEmployerByEmail: mockGetEmployer,
  }),
}));

//snackbar ui context  mock//
vi.mock("./context/UIProvider", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./context/UIProvider")>();

  return {
    ...actual,
    useUI: () => ({
      showSnackbar: mockShowSnackbar,
      openConfirm: vi.fn(),
      openCustom: vi.fn(),
      closeDialog: vi.fn(),
    }),
  };
});

//Snackbar (UI context) mock//
vi.mock("./utils/authStorage", () => ({
  authStorage: {
    set: mockAuthSet,
  },
}));

//router mock navigate//
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

//test imports//
import { screen, waitFor } from "@testing-library/react";
import { customRender } from "./test-utils";
import Login from "./pages/login/Login";
import userEvent from "@testing-library/user-event";



//test setup helpers//
beforeEach(() => {
  vi.clearAllMocks();
});

function setup() {
  customRender(<Login />);

  return {
    emailInput: screen.getByLabelText(/email address/i),
    passwordInput: screen.getByLabelText(/password/i),
    loginBtn: screen.getByRole("button", { name: /login/i }),
  };
}

//test suite//

describe("Login Form Event Trigger", () => {

  test("labels are visible", () => {
    customRender(<Login />);

    expect(screen.getByText(/email address/i, { selector: "label" })).toBeInTheDocument();
    expect(screen.getByText(/password/i, { selector: "label" })).toBeInTheDocument();
  });

  //Validation Tests//

  test("click login triggers validation errors", async () => {
    const { loginBtn } = setup();

    await userEvent.click(loginBtn);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  //when valid type error remove//

  test("typing removes validation errors", async () => {
    const { emailInput, passwordInput, loginBtn } = setup();

    await userEvent.click(loginBtn);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();

    await userEvent.type(emailInput, "test@gmail.com");
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();

    await userEvent.type(passwordInput, "123456");
    expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
  });

  //shows error invalid email format//

  test("shows error for invalid email format", async () => {
    const { emailInput, passwordInput, loginBtn } = setup();

    await userEvent.type(emailInput, "testgmail.com");
    await userEvent.type(passwordInput, "Test@123");
    await userEvent.click(loginBtn);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });


  //inital form open input fields empty//

  test("inputs are empty initially", () => {
    const { emailInput, passwordInput } = setup();

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  //Successful USER login test//

  test("logs in successfully as user", async () => {

  mockGetUser.mockResolvedValue({
    id: 7778,
    email: "vino@gmail.com",
    password: "112233",
    userType: 1,
  });

  const { emailInput, passwordInput, loginBtn } = setup();

  await userEvent.type(emailInput, "vino@gmail.com");
  await userEvent.type(passwordInput, "112233");
  await userEvent.click(loginBtn);

  // wait for FINAL effect (navigation)
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // now all previous effects are guaranteed completed
  expect(mockAuthSet).toHaveBeenCalledWith({
    id: 7778,
    email: "vino@gmail.com",
    userType: 1,
  });

   await waitFor(() => {
      expect(mockAuthSet).toHaveBeenCalledWith({
        id: 7778,
        email: "vino@gmail.com",
        userType: 1,
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  //wrong password//

  test("shows error when password is incorrect", async () => {
    mockGetUser.mockResolvedValue({
      id: 1,
      email: "vino@gmail.com",
      password: "correctpass",
      userType: 1,
    });

    const { emailInput, passwordInput, loginBtn } = setup();

    await userEvent.type(emailInput, "vino@gmail.com");
    await userEvent.type(passwordInput, "wrongpass");
    await userEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith("Invalid credentials", "error");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  //user not found test//

  test("shows error if user not found", async () => {
   mockGetUser.mockResolvedValue(undefined);
mockGetEmployer.mockResolvedValue(undefined);

    const { emailInput, passwordInput, loginBtn } = setup();

    await userEvent.type(emailInput, "nouser@gmail.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith("User not found", "error");
    });
  });

  //Employer login test//

  test("logs in successfully as employer", async () => {
    mockGetUser.mockResolvedValue(null);

    mockGetEmployer.mockResolvedValue({
      id: 2,
      recruiterEmail: "hr@company.com",
      password: "112233",
      userType: 2,
    });

    const { emailInput, passwordInput, loginBtn } = setup();

    await userEvent.type(emailInput, "hr@company.com");
    await userEvent.type(passwordInput, "112233");
    await userEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockAuthSet).toHaveBeenCalledWith({
        id: 2,
        email: "hr@company.com",
        userType: 2,
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

 //test if employer password is incorrect//
  
  test("shows error when employer password is incorrect", async () => {
  mockGetUser.mockResolvedValue(null);

  mockGetEmployer.mockResolvedValue({
    id: 2,
    recruiterEmail: "hr@company.com",
    password: "correctpass",
    userType: 2,
  });

  const { emailInput, passwordInput, loginBtn } = setup();

  await userEvent.type(emailInput, "hr@company.com");
  await userEvent.type(passwordInput, "wrongpass");
  await userEvent.click(loginBtn);

  await waitFor(() => {
    expect(mockShowSnackbar).toHaveBeenCalledWith("Invalid credentials", "error");
  });

  expect(mockNavigate).not.toHaveBeenCalled();
});

});