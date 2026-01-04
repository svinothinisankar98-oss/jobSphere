import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { MySnackBar } from "./Components/newui/MySnackBar.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MySnackBar>
      <App />
    </MySnackBar>
  </BrowserRouter>
);
