import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CompanyDetails from "./CompanyDetails";
import { employerSchema } from "../../../schemas/employerSchema";
import { RequiredMessage } from "../../../constants/ValidationMessages";

//form wrapper//
function renderForm() {
  const Wrapper = () => {
    const methods = useForm({
      resolver: yupResolver(employerSchema),
      mode: "all",
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



//tests//

describe("Company Name validation", () => {

  it("shows required error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.click(input);
    await userEvent.tab();

    
     expect(await screen.findByText(RequiredMessage("Company Name"))).toBeInTheDocument();
  });

  it("shows min character error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.type(input, "ab");

    expect(
      await screen.findByText(/at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it("shows max character error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.type(input, "a".repeat(101));

    expect(
      await screen.findByText(/at most 100 characters/i)
    ).toBeInTheDocument();
  });

  it("accepts valid company name", async () => {
    renderForm();

    const input = screen.getByLabelText(/company name/i);

    await userEvent.type(input, "OpenAI Technologies");

    expect(
      screen.queryByText(/at least|at most|required/i)
    ).not.toBeInTheDocument();
  });

  it("shows invalid phone error", async () => {
    renderForm();

    const input = screen.getByLabelText(/company phone/i);

    await userEvent.type(input, "123");

    expect(
      await screen.findByText(/valid mobile number/i)
    ).toBeInTheDocument();
  });
it("shows invalid website url error", async () => {
  renderForm();
  const user = userEvent.setup();

  const input = screen.getByLabelText(/company website/i);

  await user.type(input, "abc");
  await user.tab();

  expect(
    await screen.findByText(/valid website/i)
  ).toBeInTheDocument();
});

});