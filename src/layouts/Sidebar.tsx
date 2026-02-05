import { useEffect, useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useMediaQuery,
  Badge,
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
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { userService } from "../service/userService";

const drawerWidth = 250;
const collapsedWidth = 70;

type Role = 1 | 2 | 3 | 4;

type MenuItem = {
  item: string;
  path: string;
};

const MENU_CONFIG: Record<Role, MenuItem[]> = {
  1: [
    //jobseeker//
    { item: "Home", path: "/" },
    { item: "Profile", path: "/profile" },
    { item: "Jobs", path: "/jobs" },
    { item: "Saved Jobs", path: "/saved-jobs" },
  ],
  2: [
    //Employer//
    { item: "Home", path: "/" },
    { item: "Profile", path: "/profile" },
    { item: "Company Information", path: "/company-information" },
    { item: "Post a Job", path: "/job-list-add" },
  ],
  3: [
    //admin//
    { item: "Company Information", path: "/company-information" },
    { item: "Company Information List", path: "/company-information-list" },
    { item: "Post a Job", path: "/job-list-add" },
    { item: "Jobs", path: "/jobs" },
    { item: "Employer List", path: "/Employer-List" },
    { item: "Job Seeker", path: "/job-seeker-register" },
    { item: "Employer", path: "/employer-register" },
  ],
  4: [
    { item: "Home", path: "/" },
    { item: "Jobs", path: "/jobs" },
    // { item: "Employer List", path: "/Employer-List" },
    { item: "Job Seeker", path: "/job-seeker-register" },
    { item: "Employer", path: "/employer-register" },
  ],
};

const ICON_MAP: Record<string, JSX.Element> = {
  Home: <HomeIcon htmlColor="blue" />,
  Profile: <AccountCircleIcon htmlColor="blue" />,
  Jobs: <WorkIcon htmlColor="blue" />,
  "Saved Jobs": <BookmarkIcon htmlColor="blue" />,
  "Post a Job": <ApartmentIcon htmlColor="blue" />,
  "Company Information": <DomainIcon htmlColor="blue" />,
  "Company Information List": <ListAltIcon htmlColor="blue" />,
  "Employer List": <GroupIcon htmlColor="blue" />,
  "Job Seeker": <PersonOutlineIcon htmlColor="blue" />,
  Employer: <AssignmentIndIcon htmlColor="blue" />,
};

export default function Sidebar() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  const userType: Role = authUser?.userType || 4;
  const authUserId = authUser?.id;

  const roleMenu = MENU_CONFIG[userType] || [];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null && !isMobile) setOpen(JSON.parse(saved));
    else setOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-open", JSON.stringify(open));
    }
  }, [open, isMobile]);

//Fetch saved jobs from backend//

  const getSavedJobData = async () => {
    const getData = await userService.getUser(authUser?.email);
    const savedJobs: any[] = getData?.savedJobs || [];
    setSavedCount(savedJobs?.length);
  };

  //run login change of other user//
  useEffect(() => {
    // const updateCount = () => {
    //   const stored = localStorage.getItem("savedJobs");
    //   const list = stored ? JSON.parse(stored) : [];
    // };

    getSavedJobData();

    // window.addEventListener("storage", updateCount);
    // window.addEventListener("savedJobsUpdated", updateCount);

    const handleUpdate = (e: any) => {
      setSavedCount(e.detail);
    };

    window.addEventListener("savedJobsUpdated", handleUpdate);

    return () => {
      // window.removeEventListener("storage", updateCount);

      window.removeEventListener("savedJobsUpdated", handleUpdate);
    };
  }, [authUserId]);

  //active menu hightlight//

  const toggleDrawer = () => setOpen((p) => !p);

  const navItemStyle = (active: boolean) => ({
    borderRadius: 2,
    mx: 0.5,
    mb: 0.5,
    ...(active && {
      backgroundColor: "#53a2e3",
      color: "#0f0f0f",
    }),
  });

  const handleMenuClick = (path: string) => {
    navigate(path);
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
          "& .MuiDrawer-paper": {
            width: isMobile ? drawerWidth : open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
          },
        }}
      >
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

        <List sx={{ px: 0 }}>
          {roleMenu.map((menu) => (
            <ListItemButton
              key={menu.item}
              selected={isActive(menu.path)}
              sx={navItemStyle(isActive(menu.path))}
              onClick={() => handleMenuClick(menu.path)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {menu.item === "Saved Jobs" ? (
                  <Badge badgeContent={savedCount || null} color="secondary">
                    {ICON_MAP[menu.item]}
                  </Badge>
                ) : (
                  ICON_MAP[menu.item]
                )}
              </ListItemIcon>

              {open && <ListItemText primary={menu.item} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
