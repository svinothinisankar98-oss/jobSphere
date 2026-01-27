import { useEffect, useState } from "react";
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
import GroupIcon from "@mui/icons-material/Group";



const drawerWidth = 200;
const collapsedWidth = 70;

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

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

  const toggleDrawer = () => setOpen(prev => !prev);

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
            // backgroundColor: "white",
            // boxShadow: 2,
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
          paddingBottom:0,
          "& .MuiDrawer-paper": {
            width: isMobile ? drawerWidth : open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {/* Sidebar Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={open ? "space-between" : "center"}
          p={2} color={"black"}
          sx={{paddingBottom:"0 !important"}}
        >
          {open && <strong>Menu</strong>}
          <IconButton onClick={toggleDrawer} >
            {open ? <CloseIcon /> : <MenuIcon   htmlColor={"primary"}/>}
          </IconButton>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 1}}>
          <ListItemButton
            component={Link}
            to="/"
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon >
              <HomeIcon  htmlColor={"primary"}/>
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/jobs"
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon>
              <WorkIcon htmlColor={"primary"}/>
            </ListItemIcon>
            {open && <ListItemText primary="Jobs" />}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/companies"
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon>
              <BusinessIcon htmlColor={"primary"}/>
            </ListItemIcon>
            {open && <ListItemText primary="Companies" />}
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/Employer-List"
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon>
              <GroupIcon htmlColor={"primary"}/>
            </ListItemIcon>
            {open && <ListItemText primary="Employer List" />}
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/company-information"
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon>
              <GroupIcon htmlColor={"primary"}/>
            </ListItemIcon>
            {open && <ListItemText primary="Company Information" />}
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/company-information-list"
            onClick={isMobile ? toggleDrawer : undefined}
          >
            <ListItemIcon>
              <GroupIcon htmlColor={"primary"}/>
            </ListItemIcon>
            {open && <ListItemText primary="Company Information List" />}
          </ListItemButton>

        </List>
      </Drawer>
    </>
  );
}
