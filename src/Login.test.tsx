
import { screen } from "@testing-library/react";    // elements from render dom//
import { customRender } from "./test-utils";        // render component with providers router navigate//
import Login from "./pages/login/Login";            // which component testing//
import userEvent from "@testing-library/user-event";  //real user actions click tab paste typing//


function setup() {    //helper - arrange//
  customRender(<Login />);
  return {
    emailInput: screen.getByLabelText(/email address/i),
    passwordInput: screen.getByLabelText(/password/i),
    loginBtn: screen.getByRole("button", { name: /login/i })           //find the button//
  };
}

describe("Login Form Event Trigger", () => {             //test suite-//

  //label visibility//

  test("labels are visible", () => {
    customRender(<Login />);

    expect(screen.getByText(/email address/i, { selector: "label" }))
      .toBeInTheDocument();
    expect(screen.getByText(/password/i, { selector: "label" }))
      .toBeInTheDocument();
  });

  test("click login triggers validation errors", async () => {
    const { loginBtn } = setup();

    await userEvent.click(loginBtn);               // click submit//

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();     //error triggered//
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

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

  test("shows error for invalid email format", async () => {
  const { emailInput, passwordInput, loginBtn } = setup();

  await userEvent.type(emailInput, "testgmail.com"); //@gmail.com//
  await userEvent.type(passwordInput, "Test@123");
  await userEvent.click(loginBtn);

  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
});

test("inputs are empty initially", () => {
  const { emailInput, passwordInput } = setup();

  expect(emailInput).toHaveValue("");
  expect(passwordInput).toHaveValue("");
});




});