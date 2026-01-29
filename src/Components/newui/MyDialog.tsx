import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { fontSize } from "@mui/system";

type CommonConfirmDialogProps = {
  open: boolean;
  title?: string;

  // Confirm dialog
  message?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "success" | "error" | "warning";

  // Custom content (preview etc.)
  children?: React.ReactNode;

  onClose: () => void;

  // Controls dialog width
  fullWidth?: boolean;
};

const MyDialog = ({
  open,
  title = "Confirm",
  message,
  onClose,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmColor = "primary",
  children,
  fullWidth = false,
}: CommonConfirmDialogProps) => {
  const isConfirmDialog = Boolean(onConfirm);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      disableEscapeKeyDown
      scroll={fullWidth ? "body" : "paper"}
      fullWidth={fullWidth}
      maxWidth={fullWidth ? false : "sm"}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "flex-start",
          mt: 4,
        },
      }}
      PaperProps={{
        sx: fullWidth
          ? {
              width: "90vw",
              maxWidth: 900,
            }
          : {
              minWidth: 400,
            },
      }}
    >
      <DialogTitle
  sx={{
    pr: 5,
    textAlign: "center",
    color: "primary.main",
    fontWeight: 600,
    fontSize: "1.25rem",
  }}
>

        {title}

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          overflow: fullWidth ? "hidden" : "visible",
          pt: 2,
          pb: 3,
        }}
      >
        {children ?? <DialogContentText>{message}</DialogContentText>}
      </DialogContent>

      {isConfirmDialog && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {cancelText}
          </Button>

          <Button onClick={onConfirm} color={confirmColor} variant="contained">
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MyDialog;
