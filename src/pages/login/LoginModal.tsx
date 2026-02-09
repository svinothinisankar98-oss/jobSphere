import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Login from "./Login";

export default function LoginModal({ open, onClose }: any) {
  return (
    <Dialog
  open={open}
  onClose={(event, reason) => {
    if (reason === "backdropClick") {
      return; 
    }
    onClose(); 
  }}
  maxWidth="sm"
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

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={3}
        >
          Login
        </Typography>

        <Login />
      </DialogContent>
    </Dialog>
  );
}
