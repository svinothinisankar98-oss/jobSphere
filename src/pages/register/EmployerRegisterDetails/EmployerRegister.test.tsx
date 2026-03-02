import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CompanyDetails from "./CompanyDetails";
import { employerSchema } from "../../../schemas/employerSchema";
import { RequiredMessage } from "../../../constants/ValidationMessages";

/* ======================================================
   Helper: exact text matcher (handles MUI split text)
   ====================================================== */
function findError(text: string) {
  return screen.findByText((_, el) => el?.textContent === text);
}

/* ======================================================
   Form Wrapper
   ====================================================== */
function renderForm() {
  const Wrapper = () => {
    const methods = useForm({
      resolver: yupResolver(employerSchema),
      mode: "onBlur",
      defaultValues: {
        companyName: "",
      },
    });

    return (
      <FormProvider {...methods}>
        <CompanyDetails />
      </FormProvider>
    );
  };

  render(<Wrapper />);
}

/* ======================================================
   Tests
   ====================================================== */

describe("Company Name validation", () => {

  /* ---------- REQUIRED ---------- */
  it("shows required error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.click(input);
    await userEvent.tab(); // blur

    expect(await findError(RequiredMessage("Company Name"))).toBeInTheDocument();
  });

  /* ---------- MIN LENGTH ---------- */
  it("shows min character error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.type(input, "ab");
    await userEvent.tab();

    const error = await screen.findByRole("alert");
    expect(error.textContent?.toLowerCase()).toContain("at least");
  });

  /* ---------- MAX LENGTH ---------- */
  it("shows max character error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.type(input, "a".repeat(101));
    await userEvent.tab();

    const error = await screen.findByRole("alert");
    expect(error.textContent?.toLowerCase()).toContain("at most");
  });

  /* ---------- VALID INPUT ---------- */
  it("accepts valid company name", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.type(input, "OpenAI Technologies");
    await userEvent.tab();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

});