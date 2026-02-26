import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { UIProvider } from "./context/UIProvider";

export function customRender(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <UIProvider>
          {ui}
        </UIProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}