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
  email: string;
  userType: number;
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
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const loadUser = () => {
      const raw = authStorage.get();

      if (!raw) {
        setUser(null);
        return;
      }

      const user = typeof raw === "string" ? JSON.parse(raw) : raw;

      const capitalizeFirst = (text: string) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

      const nameFromEmail = capitalizeFirst(user.email?.split("@")[0] || "");

      setUser({
        ...user,
        email: nameFromEmail,
      });
    };

    loadUser();

    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
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
        {/* LEFT */}
        <Stack direction="row" alignItems="center" spacing={2} paddingLeft={9}>
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

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
          }}
        >
          {!user ? (
            <Stack direction="row" spacing={2}>
              <MyButton
                variant="contained"
                icon={<AccountCircleIcon />}
                onClick={handleLogin}
                label="Login"
                sx={{
                  minWidth: { xs: 70, md: 120 },
                  fontSize: { xs: "0.7rem", md: "0.9rem" },
                  px: { xs: 1.2, md: 3 },
                  height: { xs: 32, md: 38 },
                }}
              />

              <MyButton
                variant="contained"
                icon={<PersonAddIcon />}
                onClick={(e) => setRegisterAnchor(e.currentTarget)}
                label="Register"
                sx={{
                  minWidth: { xs: 75, md: 120 },
                  fontSize: { xs: "0.7rem", md: "0.9rem" },
                  px: { xs: 1.2, md: 3 },
                  height: { xs: 32, md: 38 },
                }}
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
                onClick={handleProfileClick}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {user.email}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  <PersonIcon sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>

                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
