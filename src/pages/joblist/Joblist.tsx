import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";

import SearchSection from "../home/SearchSection";

/* Job Type */
type Job = {
  id: number;
  title: string;
  company: string;
  state: string;
  location: string;
  salary?: string;
  tags: string[];
  description: string;
};

const JobList = () => {
  const location = useLocation();

  const [searchText, setSearchText] = useState(location.state?.search || "");
  const [selectedState, setSelectedState] = useState(
    location.state?.selected || ""
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:4000/jobs");
      const data = Array.isArray(response.data) ? response.data : [];
      setJobs(data);

      // auto select first job (optional UX improvement)
      if (data.length) setActiveJob(data[0]);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const titleMatch =
        !searchText ||
        job.title.toLowerCase().includes(searchText.toLowerCase());

      const stateMatch =
        !selectedState || job.state === selectedState;

      return titleMatch && stateMatch;
    });
  }, [jobs, searchText, selectedState]);

  return (
    <Box px={{ xs: 2, md: 4 }} py={2}>
      {/* Search Section */}
      <SearchSection
        search={searchText}
        setSearch={setSearchText}
        selected={selectedState}
        setSelected={setSelectedState}
        onSearch={() => {}}
      />

      <Grid container spacing={2} mt={2}>
        {/* LEFT – Job List */}
        
          <Grid size = {{xs:12,md:5}}>
          <Paper elevation={1} sx={{ p: 2, height: "100%",  ml: "50px" }}>
            {loading && (
              <Stack alignItems="center" py={4}>
                <CircularProgress />
              </Stack>
            )}

            {error && <Typography color="error">{error}</Typography>}

            {!loading && filteredJobs.length === 0 && (
              <Typography>No jobs found</Typography>
            )}

            <Stack spacing={2}>
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  onClick={() => setActiveJob(job)}
                  sx={{
                    cursor: "pointer",
                    border:
                      activeJob?.id === job.id
                        ? "2px solid"
                        : "1px solid",
                    borderColor:
                      activeJob?.id === job.id
                        ? "primary.main"
                        : "divider",
                    "&:hover": { boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2">
                      {job.company}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {job.location}, {job.state}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT – Job Details */}
      
          <Grid size = {{xs:12, md:7}}>
          <Paper elevation={1} sx={{ p: 3, height: "100%" , mr: "20px"}}>
            {activeJob ? (
              <>
                <Typography variant="h5" fontWeight={600}>
                  {activeJob.title}
                </Typography>

                <Typography mt={1}>{activeJob.company}</Typography>

                <Typography color="text.secondary">
                  {activeJob.location}, {activeJob.state}
                </Typography>

                {activeJob.salary && (
                  <Typography mt={1} fontWeight={500}>
                    {activeJob.salary}
                  </Typography>
                )}

                <Button variant="contained" sx={{ mt: 2 }}>
                  Apply Now
                </Button>

                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Job Description
                  </Typography>
                  <Typography mt={1}>
                    {activeJob.description}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">
                Select a job to see details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobList;
