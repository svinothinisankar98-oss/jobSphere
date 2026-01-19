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
    <Box sx={{ my: { xs: 3, md: 3 } }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        mb={2}
      >
        Popular Jobs
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {jobs.map((job) => (
         <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Chip
              icon={job.icon}
              label={job.label}
              variant="outlined"
              sx={{
                width: "100%",
                py: 2,
                fontSize: "0.9rem",
                borderRadius: "999px",
                justifyContent: "center",
                "& .MuiChip-label": {
                  px: 1,
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
