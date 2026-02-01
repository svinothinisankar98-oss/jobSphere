import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { authStorage } from "../utils/authStorage";
import MyButton from "../Components/newui/MyButton";


type AuthUser = {
  id: number;
  name: string;
};

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [registerAnchor, setRegisterAnchor] = useState<null | HTMLElement>(
    null,
  );

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    console.log("wrong working");
    setIsMenuOpen(true);
  };

  console.log(isMenuOpen, "isMenuOpen");

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };
  useEffect(() => {
    setUser(authStorage.get());

    const handleAuthChange = () => {
      setUser(authStorage.get());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    authStorage.remove();
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" alignItems="center" spacing={2} paddingLeft={9}>
          {/* Logo */}
          <Typography
            mr={10}
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "blue",
              fontWeight: "bold",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            JobSphere
          </Typography>

          {/* Desktop Navigation ONLY */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/jobs"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Jobs
            </Button>
          </Stack>
        </Stack>

        {/* RIGHT SIDE */}
        <Box>
          {!user ? (
            <Stack direction="row" spacing={2}>
              <MyButton
                variant="contained"
                icon={<AccountCircleIcon />}
                onClick={handleLogin}
                label="Login"
                sx={{ fontWeight: "600" }}
              />

              <MyButton
                variant="contained"
                icon={<PersonAddIcon />}
                onClick={(e) => setRegisterAnchor(e.currentTarget)}
                label="Register"
                sx={{ fontWeight: "600" }}
              />

              <Menu
                anchorEl={registerAnchor}
                open={Boolean(registerAnchor)}
                onClose={() => setRegisterAnchor(null)}
              >
                <MenuItem
                  sx={{ fontWeight: "600" }}
                  component={Link}
                  to="/employer-register"
                  onClick={() => setRegisterAnchor(null)}
                >
                  Employer
                </MenuItem>
                <MenuItem
                  sx={{ fontWeight: "600" }}
                  component={Link}
                  to="/job-seeker-register"
                  onClick={() => setRegisterAnchor(null)}
                >
                  Job Seeker
                </MenuItem>
              </Menu>
            </Stack>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AccountCircleIcon />}
                onClick={handleProfileClick}
              >
                {user.name}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  <PersonIcon sx={{ mr: 1 }} /> My Profile
                </MenuItem>

                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
