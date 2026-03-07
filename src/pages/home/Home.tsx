import { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PopularJobs from "./PopularJobs";
import SearchSection from "./SearchSection";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [jobType, setJobType] = useState<string[]>([]);
const [experience, setExperience] = useState<string[]>([]);
const [salary, setSalary] = useState<string[]>([]);

  const onSearch = () => {
    navigate("/jobs", {
      state: { search, selected },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ my: { xs: 2, md: 4 } }}>
      {/* Search Section */}
      <SearchSection
  search={search}
  setSearch={setSearch}
  selected={selected}
  setSelected={setSelected}
  onSearch={onSearch}

  jobType={jobType}
  setJobType={setJobType}
  experience={experience}
  setExperience={setExperience}
  salary={salary}
  setSalary={setSalary}
/>

      

      {/* Middle Section */}
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 3, md: 3 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.4rem", md: "2rem" } }}
        >
          Your Career Journey Starts Here
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 2,
            px: { xs: 1, md: 8 },
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Discover jobs tailored to your skills, location, and career goals.
        </Typography>

      <Box mt={3}>
  <Button
    variant="contained"
    color="secondary"
    size="medium"
  
    sx={{
      borderRadius: "999px",
      px: 5,
      textTransform: "none",
    }}
    onClick={() => navigate("/job-seeker-register")}  
  >
    Get Started →
  </Button>
</Box>
      </Box>

      {/* Popular Jobs */}
      <PopularJobs />
    </Container>
  );
}

export default Home;
