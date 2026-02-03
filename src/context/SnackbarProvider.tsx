// SnackbarProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

type SnackbarContextType = {
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
};

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const MySnackBar = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<SnackbarSeverity>("success");

  const showSnackbar = (
    msg: string,
    sev: SnackbarSeverity = "success"
  ) => {
    setOpen(false); // 🔥 reset first so it always reopens
    setTimeout(() => {
      setMessage(msg);
      setSeverity(sev);
      setOpen(true);
    }, 50);
  };

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={handleClose}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used inside MySnackBar");
  }
  return ctx;
};
