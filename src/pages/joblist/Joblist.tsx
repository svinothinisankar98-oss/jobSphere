import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Box,
  Card,
  Typography,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { useJobService } from "../../hooks/joblist/useJobService";
import type { jobsListType } from "../../types/jobListType";
import MyButton from "../../Components/newui/MyButton";
import SearchSection from "../home/SearchSection";
import JobFilters from "../joblist/JobFilters";

export default function JobList() {
  const { getAllJobs } = useJobService();
  const location = useLocation();

  const [jobs, setJobs] = useState<jobsListType[]>([]);
  const [selectedJob, setSelectedJob] = useState<jobsListType | null>(null);
  const [saved, setSaved] = useState(false);

  /* SEARCH INPUT */
  const [searchInput, setSearchInput] = useState(location.state?.search || "");
  const [selectedInput, setSelectedInput] = useState(location.state?.selected || "");
  console.log("location.state",location.state)

  /* APPLIED SEARCH */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [searched, setSearched] = useState(false);

  /* FILTER STATES */
  const [jobType, setJobType] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [salary, setSalary] = useState<string[]>([]);

  /* FETCH JOBS */
  useEffect(() => {
    getAllJobs().then(setJobs);

  }, []);

  useEffect(() => {
  setSearchQuery(searchInput);
  setSelectedQuery(selectedInput);
}, [searchInput, selectedInput]);

useEffect(() => {
  window.history.replaceState({}, document.title);
}, []);

  /*  FILTER LOGIC */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const salarys = parseInt(salary?.toString() || "0");
      console.log(salarys)

    
      const titleMatch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase());

      const stateMatch = !selectedQuery || job.state === selectedQuery;

      const jobTypeMatch =
        jobType.length === 0 || jobType.includes(job.jobType);

      const experienceMatch =
        experience.length === 0 || experience.includes(job.experience);

      const jobSalary = job.salary?.replace(/,/g, "") || "0";

      //  MULTI salary filter
      const salaryMatch = salary.length === 0 || salary.includes(jobSalary);

      // console.log(salarys, "jobTypeMatch", salarys, parseInt(job.salary));

      return (
        titleMatch &&
        stateMatch &&
        jobTypeMatch &&
        experienceMatch &&
        salaryMatch
      );
    });
  }, [jobs, searchQuery, selectedQuery, jobType, experience, salary]);

  /* AUTO SELECT FIRST RESULT */
  useEffect(() => {
    if (filteredJobs.length) setSelectedJob(filteredJobs[0]);
    else setSelectedJob(null);
  }, [filteredJobs]);

  console.log(selectedInput,'selectedInput')

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/*  SEARCH BAR */}
      <Box px={4} py={2}>
        <SearchSection
          search={searchInput}
          setSearch={setSearchInput}
          selected={selectedInput}
          setSelected={setSelectedInput}
          onSearch={() => {
            setSearchQuery(searchInput);
            setSelectedQuery(selectedInput);
            setSearched(true);
          }}
        />
      </Box>

      {/* 🎛 FILTERS */}
      <JobFilters
        jobType={jobType}
        setJobType={setJobType}
        experience={experience}
        setExperience={setExperience}
        salary={salary}
        setSalary={setSalary}
      />

      {/* MAIN CONTENT */}
      <Box display="flex" gap={2} px={2} flex={1} overflow="hidden">
        {/* LEFT LIST */}
        <Box width="35%" overflow="auto" marginLeft={10} marginTop={4}>
          {searched && filteredJobs.length === 0 && (
            <Typography p={2}>No jobs found</Typography>
          )}

          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              onClick={() => setSelectedJob(job)}
              sx={{
                p: 2,
                mb: 2,
                cursor: "pointer",
                border:
                  selectedJob?.id === job.id
                    ? "2px solid #1976d2"
                    : "1px solid #eee",
              }}
            >
              <Typography fontWeight={600}>{job.title}</Typography>
              <Typography color="text.secondary">{job.companyName}</Typography>
              <Typography variant="body2">{job.location}</Typography>
              <Typography fontWeight={500}>₹ {job.salary}</Typography>
            </Card>
          ))}
        </Box>

        {/* RIGHT DETAILS */}
        <Box width="65%" overflow="auto">
          {selectedJob ? (
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                {selectedJob.title}
              </Typography>

              <Typography color="text.secondary">
                {selectedJob.companyName} • {selectedJob.location}
              </Typography>

              <Typography fontWeight={600} mt={1}>
                ₹ {selectedJob.salary}
              </Typography>

              <Stack direction="row" spacing={1} my={2}>
                <MyButton label="Apply now" variant="contained" />

                <IconButton onClick={() => setSaved(!saved)}>
                  {saved ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>

                
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography>
                <b>Job Type:</b> {selectedJob.jobType}
              </Typography>
              <Typography>
                <b>Experience:</b> {selectedJob.experience}
              </Typography>
              <Typography>
                <b>Openings:</b> {selectedJob.noOfOpenings}
              </Typography>
              <Typography>
                <b>Skills:</b> {selectedJob.tags}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                fontWeight={600}
                display="flex"
                justifyContent="left"
                marginBottom={2}
              >
                Job Description
              </Typography>

              {selectedJob.description
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <Typography key={i} mb={0.5}>
                    {line}
                  </Typography>
                ))}
            </Card>
          ) : (
            <Typography p={2} color="text.secondary"></Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
