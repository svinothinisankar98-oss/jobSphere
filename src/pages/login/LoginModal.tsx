import {
  Dialog,
  DialogContent,
  IconButton,
  type DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Login from "./Login";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const handleClose: DialogProps["onClose"] = (_, reason) => {
    if (reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      keepMounted
      disableScrollLock
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        },
      }}
    >
      <DialogContent>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>

        <Login onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
