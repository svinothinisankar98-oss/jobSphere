import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { UIProvider } from "./context/UIProvider";

const AllProviders = ({ children }: { children: ReactNode }) => {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

export const customRender = (ui: ReactElement, options = {}) =>
  render(ui, { wrapper: AllProviders, ...options });