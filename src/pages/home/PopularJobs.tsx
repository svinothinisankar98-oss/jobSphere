import { Box, Grid, Typography, Chip } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

const jobs = [
  { label: "Banking", icon: <AccountBalanceIcon /> },
  { label: "Work From Home", icon: <HomeIcon /> },
  { label: "Software Dev", icon: <PeopleIcon /> },
  { label: "Design", icon: <WorkIcon /> },
  { label: "Accounting", icon: <AttachMoneyIcon /> },
  { label: "Support", icon: <HeadsetMicIcon /> },
];

const PopularJobs = () => {
  return (
    <Box sx={{ my: 4, px: 2 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        textAlign="center"
        mb={3}
      >
        Popular Jobs
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {jobs.map((job) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={job.label}>
            
            <Chip
              icon={job.icon}
              label={job.label}
              clickable
              sx={{
                width: "100%",
                py: 2.2,
                fontSize: "0.95rem",
                borderRadius: "14px",
                fontWeight: 500,
                // backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(227, 217, 217, 0.08)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  // backgroundColor: "#f5f9ff",
                },
                "& .MuiChip-icon": {
                  color: "#1976d2",
                  fontSize: 22,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularJobs;
