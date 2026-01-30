import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DomainIcon from "@mui/icons-material/Domain";
import ApartmentIcon from "@mui/icons-material/Apartment";

const drawerWidth = 250;
const collapsedWidth = 70;

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null && !isMobile) {
      setOpen(JSON.parse(saved));
    } else {
      setOpen(!isMobile);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-open", JSON.stringify(open));
    }
  }, [open, isMobile]);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const navItemStyle = (active: boolean) => ({
    borderRadius: 2,
    mx: 0.5,
    mb: 0.5,

    // "&:hover": {
    //   backgroundColor: "#e3f2fd",
    // },

    ...(active && {
      backgroundColor: "#3690da",
    }),
  });

  return (
    <>
      {isMobile && !open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 1400,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? toggleDrawer : undefined}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? drawerWidth : open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? drawerWidth : open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={open ? "space-between" : "center"}
          p={2}
          sx={{ paddingBottom: "0 !important" }}
        >
          {open && <strong>Menu</strong>}
          <IconButton onClick={toggleDrawer}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 0 }}>
          <ListItemButton 
            component={Link}
            to="/"
            selected={isActive("/")}
            sx={navItemStyle(isActive("/"))}
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
              }}
            >
              <HomeIcon htmlColor="blue" />
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/jobs"
            selected={isActive("/jobs")}
            sx={navItemStyle(isActive("/jobs"))}
          >
            <ListItemIcon
            sx={{
                minWidth: 36,
              }}
            
            >
              <WorkIcon htmlColor="blue" />
            </ListItemIcon>
            {open && <ListItemText primary="Jobs" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/companies"
            selected={isActive("/companies")}
            sx={navItemStyle(isActive("/companies"))}
          >
            <ListItemIcon
            
            sx={{
                minWidth: 36,
              }}>
              <ApartmentIcon htmlColor="blue" />
            </ListItemIcon>
            {open && <ListItemText primary="Companies" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/Employer-List"
            selected={isActive("/Employer-List")}
            sx={navItemStyle(isActive("/Employer-List"))}
          >
            <ListItemIcon
            
            sx={{
                minWidth: 36,
              }}>
              <GroupIcon htmlColor="blue" />
            </ListItemIcon>
            {open && <ListItemText primary="Employer List" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/company-information"
            selected={isActive("/company-information")}
            sx={navItemStyle(isActive("/company-information"))}
          >
            <ListItemIcon
            
            sx={{
                minWidth: 36,
              }}>
              <DomainIcon htmlColor="blue" />
            </ListItemIcon>
            {open && <ListItemText primary="Company Information" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/company-information-list"
            selected={isActive("/company-information-list")}
            sx={navItemStyle(isActive("/company-information-list"))}
          >
            <ListItemIcon
            
            sx={{
                minWidth: 36,
              }}>
              <ListAltIcon htmlColor="blue" />
            </ListItemIcon>
            {open && <ListItemText primary="Company Information List" />}
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
