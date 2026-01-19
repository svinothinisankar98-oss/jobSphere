import { useState } from "react";
import { Link } from "react-router-dom";
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

const drawerWidth = 200;
const collapsedWidth = 70;

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(!isMobile);

  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      {/* Hamburger button (Mobile) */}
      {/* {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1000 }}
        >
          <MenuIcon />
        </IconButton>
      )} */}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
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
        >
          {open && <strong>Menu</strong>}
          <IconButton onClick={toggleDrawer}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        {/* Menu */}
        <List>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItemButton>

          <ListItemButton component={Link} to="/jobs">
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Jobs" />}
          </ListItemButton>

          <ListItemButton component={Link} to="/companies">
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Companies" />}
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}
