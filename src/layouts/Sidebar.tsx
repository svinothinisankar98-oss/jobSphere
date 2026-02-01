import { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";

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
import GroupIcon from "@mui/icons-material/Group";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DomainIcon from "@mui/icons-material/Domain";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";



const drawerWidth = 250;
const collapsedWidth = 70;

//role based menu//

type Role = 1 | 2 | 3 | 4;

type MenuItem = {
  item: string;
  path: string;
};

//routes set//

const MENU_CONFIG: Record<Role, MenuItem[]> = {

  //JobSeeker//

  1: [
    { item: "Home", path: "/" },
    { item: "Profile", path: "/profile" },
    { item: "Jobs", path: "/jobs" },
    // { item: "Logout", path: "/logout" },
  ],

  //employer//
  2: [
    { item: "Home", path: "/" },
    { item: "Profile", path: "/profile" },
    { item: "Company Information", path: "/company-information" },
    { item: "Post a Job", path: "/job-list-add" },
    // { item: "Logout", path: "/logout" },
  ],

  //admin//

  3: [
    // { item: "Profile", path: "/profile" },
    { item: "Company Information", path: "/company-information" },
    { item: "Company Information List", path: "/company-information-list" },
    { item: "Post a Job", path: "/job-list-add" },
    { item: "Jobs", path: "/jobs" },
    { item: "Employer List", path: "/Employer-List" },
    { item: "Job Seeker", path: "/job-seeker-register" },
    { item: "Employer", path: "/employer-register" },
    // { item: "Logout", path: "/logout" },
  ],

  //all//
  4: [
    // { item: "Profile", path: "/profile" },
    { item: "Home", path: "/" },
    { item: "Company Information", path: "/company-information" },
    { item: "Company Information List", path: "/company-information-list" },
    { item: "Post a Job", path: "/job-list-add" },
    { item: "Jobs", path: "/jobs" },
    { item: "Employer List", path: "/Employer-List" },
    { item: "Job Seeker", path: "/job-seeker-register" },
    { item: "Employer", path: "/employer-register" },
    // { item: "Logout", path: "/logout" },
  ],
};


//icon mapping//

const ICON_MAP: any = {
  Home: <HomeIcon htmlColor="blue" />,
  Profile: <AccountCircleIcon htmlColor="blue" />,
  Jobs: <WorkIcon htmlColor="blue" />,
  "Post a Job": <ApartmentIcon htmlColor="blue" />,
  "Company Information": <DomainIcon htmlColor="blue" />,
  "Company Information List": <ListAltIcon htmlColor="blue" />,
  "Employer List": <GroupIcon htmlColor="blue" />,
  "Job Seeker": <PersonOutlineIcon htmlColor="blue" />,
  Employer: <AssignmentIndIcon htmlColor="blue" />,
  Logout: <CloseIcon htmlColor="blue" />,
};

//component//
export default function Sidebar() {
  //mobile deduction//

  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  //User role from localStorage//

  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");    //if login userrole//
  const userType = authUser?.userType || 4;

  //loads for menu//

  const roleMenu = MENU_CONFIG[userType as 1 | 2 | 3] || [];

  //active menu hightligh//

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
    ...(active && {
      backgroundColor: "#53a2e3",
      color: "#0f0f0f",
    }),
  });
//. Navigation logic//
  const handleMenuClick = (path: string) => {
    if (path === "/logout") {
      localStorage.clear();
      navigate("/login");
    } else {
      navigate(path);
    }

    if (isMobile) setOpen(false);
  };

  return (
    <>
      {isMobile && !open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "fixed", top: 12, left: 12, zIndex: 1400 }}
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
        {/* HEADER */}
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

        {/* //Menu rendering// */}
        <List sx={{ px: 0 }}>

          
          {roleMenu.map((menu) => (
            <ListItemButton
              key={menu.item}
              selected={isActive(menu.path)}
              sx={navItemStyle(isActive(menu.path))}
              onClick={() => handleMenuClick(menu.path)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {ICON_MAP[menu.item]}
              </ListItemIcon>

              {open && <ListItemText primary={menu.item} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
