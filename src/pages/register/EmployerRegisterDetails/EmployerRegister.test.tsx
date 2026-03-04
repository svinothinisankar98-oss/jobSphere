import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../../test-utils";
import EmployerRegister from "./EmployerRegister";

//mock resolver//

vi.mock("@hookform/resolvers/yup", () => ({
  yupResolver: () => async () => ({
    values: {},
    errors: {},
  }),
}));

//mock api//

vi.mock("../../../hooks/useUserService", () => ({
  useUserService: () => ({
    getEmployerById: vi.fn(),
    getEmployerByEmail: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

//test suite//

describe("Employer Register Tab  Navigation", () => {

  it("moves to Address tab when Next is clicked", async () => {
    customRender(<EmployerRegister />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: /next/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: /address/i })
      ).toHaveAttribute("aria-selected", "true");
    });
  });

  it("moves back to Company tab when Back is clicked", async () => {
    customRender(<EmployerRegister />);
    const user = userEvent.setup();

    // Move to Address first
    await user.click(
      screen.getByRole("button", { name: /next/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: /address/i })
      ).toHaveAttribute("aria-selected", "true");
    });

    // Click Back
    await user.click(
      screen.getByRole("button", { name: /back/i })
    );

    await waitFor(() => {                         //wait for state update //
      expect(
        screen.getByRole("tab", { name: /company/i })
      ).toHaveAttribute("aria-selected", "true");
    });
  });
  
});