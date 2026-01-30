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
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";

import SearchSection from "../home/SearchSection";

/* Types */
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

  /* Filters */
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");

  /* Fetch */
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/jobs");
      const data = Array.isArray(res.data) ? res.data : [];
      setJobs(data);
      if (data.length) setActiveJob(data[0]);
    } catch {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* Filtering */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const titleMatch =
        !searchText ||
        job.title.toLowerCase().includes(searchText.toLowerCase());

      const stateMatch =
        !selectedState || job.state === selectedState;

      const remoteMatch =
        !remoteOnly || job.tags.includes("remote");

      const typeMatch =
        !jobType || job.tags.includes(jobType);

      return titleMatch && stateMatch && remoteMatch && typeMatch;
    });
  }, [jobs, searchText, selectedState, remoteOnly, jobType]);

  return (
    <Box px={{ xs: 2, md: 4 }} py={2}>
      {/* Search */}
      <SearchSection
        search={searchText}
        setSearch={setSearchText}
        selected={selectedState}
        setSelected={setSelectedState}
        onSearch={() => {}}
      />

      {/* FILTER BAR */}
      <Box mt={2} marginLeft={10} >
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={remoteOnly ? "Remote ✓" : "Remote"}
            clickable
            color={remoteOnly ? "primary" : "default"}
            onClick={() => setRemoteOnly((p) => !p)}
          />

          <Chip 
            label={jobType || "Job Type"}
            clickable
            onClick={() =>
              setJobType(jobType === "fulltime" ? "" : "fulltime")
            }
            color={jobType ? "primary" : "default"}
          />

          <Chip
            label="Clear Filters"
            onClick={() => {
              setRemoteOnly(false);
              setJobType("");
              setSalaryRange("");
            }}
            variant="outlined"
          />
        </Stack>
      </Box>

      <Grid container spacing={2} mt={2}>

        {/* LEFT LIST */}
       
          <Grid size={{xs:12,md:5}}>
          <Paper sx={{ p: 2, height: "75vh", overflow: "auto" ,marginLeft:5 }}>
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
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <CardContent>
                    <Typography fontWeight={600}>
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

        {/* RIGHT PREVIEW */}
     
          <Grid size={{xs:12,md:7}}>
          <Paper
            sx={{
              p: 3,
              height: "75vh",
              overflow: "auto",
              position: "sticky",
              top: 16,
            }}
          >
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
                  <Typography fontWeight={600}>
                    Job Description
                  </Typography>
                  <Typography mt={1}>
                    {activeJob.description}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography color="text.secondary">
                Select a job
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobList;
