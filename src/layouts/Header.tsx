import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [registerAnchor, setRegisterAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setUser(authStorage.get());

    const handleAuthChange = () => {
      setUser(authStorage.get());
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    authStorage.remove();
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={1}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* LEFT SIDE */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1, md: 2 }}
          sx={{ flexWrap: "wrap" }}
        >
          {/* Hamburger */}
          <IconButton>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: "bold",
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            JobSphere
          </Typography>

          {/* Menu Items (NOW VISIBLE ON MOBILE) */}
          <Stack
            direction="row"
            spacing={{ xs: 1, md: 3 }}
            sx={{ ml: { xs: 0, md: 3 } }}
          >
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/jobs"
              color="inherit"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              Jobs
            </Button>
            <Button
              component={Link}
              to="/company"
              color="inherit"
              sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
            >
              Company
            </Button>
          </Stack>
        </Stack>

        {/* RIGHT SIDE (NOW VISIBLE ON MOBILE) */}
        <Box>
          {!user ? (
            <Stack direction="row" spacing={{ xs: 1, md: 2 }}>
              <MyButton
                variant="contained"
                icon={<AccountCircleIcon />}
                onClick={handleLogin}
                label="Login"
              />

              <MyButton
                variant="contained"
                icon={<PersonAddIcon />}
                onClick={(e) => setRegisterAnchor(e.currentTarget)}
                label="Register"
              />

              <Menu
                anchorEl={registerAnchor}
                open={Boolean(registerAnchor)}
                onClose={() => setRegisterAnchor(null)}
              >
                <MenuItem
                  component={Link}
                  to="/employer-register"
                  onClick={() => setRegisterAnchor(null)}
                >
                  Employer
                </MenuItem>
                <MenuItem
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
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {user.name}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={() => setAnchorEl(null)}
                >
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
