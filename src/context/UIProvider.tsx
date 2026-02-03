import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import MyDialog from "../Components/newui/MyDialog";

/* ================= TYPES ================= */

type SnackbarSeverity = "success" | "error" | "warning" | "info";

type DialogOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "success" | "error" | "warning";
  onConfirm?: () => void;
};

type UIContextType = {
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  openConfirm: (options: DialogOptions) => void;
  openCustom: (content: React.ReactNode, title?: string) => void;
  closeDialog: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

/* ================= PROVIDER ================= */

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  /* ---- Snackbar ---- */
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] =
    useState<SnackbarSeverity>("success");

  /* ---- Dialog ---- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogOptions>({});
  const [customContent, setCustomContent] =
    useState<React.ReactNode>(null);
  const [dialogTitle, setDialogTitle] = useState("");

  /* ================= SNACKBAR ================= */

  const showSnackbar = (
    msg: string,
    sev: SnackbarSeverity = "success"
  ) => {
    setSnackOpen(false);
    setTimeout(() => {
      setSnackMessage(msg);
      setSnackSeverity(sev);
      setSnackOpen(true);
    }, 50);
  };

  const closeSnackbar = () => setSnackOpen(false);

  /* ================= DIALOG ================= */

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogProps({});
    setCustomContent(null);
    setDialogTitle("");
  };

  const openConfirm = (options: DialogOptions) => {
    setCustomContent(null);
    setDialogProps(options);
    setDialogTitle(options.title || "Confirm");
    setDialogOpen(true);
  };

  const openCustom = (content: React.ReactNode, title = "") => {
    setDialogProps({});
    setCustomContent(content);
    setDialogTitle(title);
    setDialogOpen(true);
  };

  return (
    <UIContext.Provider
      value={{
        showSnackbar,
        openConfirm,
        openCustom,
        closeDialog,
      }}
    >
      {children}

      {/* ===== GLOBAL SNACKBAR ===== */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackSeverity}
          variant="filled"
          onClose={closeSnackbar}
        >
          {snackMessage}
        </Alert>
      </Snackbar>

      {/* ===== GLOBAL DIALOG ===== */}
      <MyDialog
        open={dialogOpen}
        title={dialogTitle}
        message={dialogProps.message}
        confirmText={dialogProps.confirmText}
        cancelText={dialogProps.cancelText}
        confirmColor={dialogProps.confirmColor}
        onClose={closeDialog}
        onConfirm={
          dialogProps.onConfirm
            ? () => {
                dialogProps.onConfirm?.();
                closeDialog();
              }
            : undefined
        }
        fullWidth={!!customContent}
      >
        {customContent}
      </MyDialog>
    </UIContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx)
    throw new Error("useUI must be used inside UIProvider");
  return ctx;
};
