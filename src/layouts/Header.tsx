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

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store"; 
import { fetchSavedJobs } from "../redux/thunks/savedJobsThunk";
import { setSavedJobs } from "../redux/slices/savedJobsSlice"; 

import { authStorage } from "../utils/authStorage";
import MyButton from "../Components/newui/MyButton";
import { useThemeContext } from "../context/ThemeContext";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LoginModal from "../pages/login/LoginModal";

type AuthUser = {
  id: number;
  email: string;
  userType: number;
};

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const { theme, toggleTheme } = useThemeContext();

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

        // ✅ Clear saved jobs on logout
        dispatch(setSavedJobs([]));
        return;
      }

      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

      const capitalizeFirst = (text: string) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

      const nameFromEmail = capitalizeFirst(
        parsed.email?.split("@")[0] || "",
      );

      setUser({
        ...parsed,
        email: nameFromEmail,
      });

      // ✅ Fetch saved jobs immediately when user changes
      dispatch(fetchSavedJobs(String(parsed.id)));
    };

    loadUser();

    window.addEventListener("auth-change", loadUser);
    return () => window.removeEventListener("auth-change", loadUser);
  }, [dispatch]);

  const handleLogout = () => {
    authStorage.remove();

    // ✅ Clear redux state
    dispatch(setSavedJobs([]));

    setUser(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
      }}
    >
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
            <Button
              component={Link}
              to="/companies"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              Companies
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
          <IconButton onClick={toggleTheme} color="inherit">
            {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {!user ? (
            <Stack direction="row" spacing={2}>
              <>
                <MyButton
                  variant="contained"
                  icon={<AccountCircleIcon />}
                  label="Login"
                  onClick={() => setOpenLogin(true)}
                />

                <LoginModal
                  open={openLogin}
                  onClose={() => setOpenLogin(false)}
                />
              </>

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
