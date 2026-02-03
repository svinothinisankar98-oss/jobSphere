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
import { authStorage } from "../../utils/authStorage";
import { userService } from "../../service/userService";

export default function JobList() {
  const { getAllJobs } = useJobService();
  const location = useLocation();

  const [jobs, setJobs] = useState<jobsListType[]>([]);
  const [selectedJob, setSelectedJob] = useState<jobsListType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const authUser = authStorage.get() || {};
  const authUserId = authUser?.id;

  /* ✅ DB SAVED JOB IDS */
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  /* Load jobs */
  useEffect(() => {
    getAllJobs().then(setJobs);
  }, []);

  /* Load saved jobs from DB */
  useEffect(() => {
    if (!authUserId) return;

    const loadSavedJobs = async () => {
      const user = await userService.getUser(authUser?.email);
      setSavedJobIds(user?.savedJobs || []);
    };

    loadSavedJobs();
  }, [authUserId]);

  /* Toggle save/unsave */
  const toggleSave = async (jobId: number) => {
    let updated;

    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }

    setSavedJobIds(updated); // instant UI

    const getUser = await userService.getUser(authUser?.email);

    getUser.savedJobs = updated;
    await userService.updateUser(authUser?.id, getUser);
     window.dispatchEvent(
    new CustomEvent("savedJobsUpdated", {
      detail: updated.length,
    })
  );
  };

  const isSaved = (id: number) => savedJobIds.includes(id);

  /* SEARCH */
  const [searchInput, setSearchInput] = useState(location.state?.search || "");
  const [selectedInput, setSelectedInput] = useState(
    location.state?.selected || "",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [searched, setSearched] = useState(false);

  /* FILTERS */
  const [jobType, setJobType] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [salary, setSalary] = useState<string[]>([]);

  useEffect(() => {
    setSearchQuery(searchInput);
    setSelectedQuery(selectedInput);
  }, [searchInput, selectedInput]);

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  /* FILTERED JOBS */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const titleMatch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase());

      const stateMatch = !selectedQuery || job.state === selectedQuery;

      const jobTypeMatch =
        jobType.length === 0 || jobType.includes(job.jobType);

      const experienceMatch =
        experience.length === 0 || experience.includes(job.experience);

      const jobSalary = job.salary?.replace(/,/g, "") || "0";
      const salaryMatch = salary.length === 0 || salary.includes(jobSalary);

      return (
        titleMatch &&
        stateMatch &&
        jobTypeMatch &&
        experienceMatch &&
        salaryMatch
      );
    });
  }, [jobs, searchQuery, selectedQuery, jobType, experience, salary]);

  /* Auto select first job */
  useEffect(() => {
    if (filteredJobs.length) setSelectedJob(filteredJobs[0]);
    else setSelectedJob(null);
  }, [filteredJobs]);

  const isMobile = window.innerWidth < 900;

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* SEARCH */}
      <Box
        px={{ xs: 1, md: 4 }}
        py={2}
        sx={{
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
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

        <Box mt={2}>
          <JobFilters
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            salary={salary}
            setSalary={setSalary}
          />
        </Box>
      </Box>

      {/* CONTENT */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        px={{ xs: 1, md: 2 }}
        flex={1}
        overflow="hidden"
      >
        {/* JOB LIST */}
        {(!showDetails || !isMobile) && (
          <Box
            width={{ xs: "100%", md: "40%" }}
            overflow="auto"
            ml={{ xs: 0, md: 10 }}
            mt={{ xs: 1, md: 4 }}
          >
            {searched && filteredJobs.length === 0 && (
              <Typography p={2}>No jobs found</Typography>
            )}

            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  if (isMobile) setShowDetails(true);
                }}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  mb: 2,
                  cursor: "pointer",
                  border:
                    selectedJob?.id === job.id
                      ? "2px solid #1976d2"
                      : "1px solid #eee",
                }}
              >
                <Typography fontWeight={600}>{job.title}</Typography>
                <Typography color="text.secondary">
                  {job.companyName}
                </Typography>
                <Typography variant="body2">{job.location}</Typography>
                <Typography fontWeight={500}>₹ {job.salary}</Typography>
              </Card>
            ))}
          </Box>
        )}

        {/* JOB DETAILS */}
        {selectedJob && (showDetails || !isMobile) && (
          <Box width={{ xs: "100%", md: "65%" }} overflow="auto">
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              {isMobile && (
                <Typography
                  sx={{
                    mb: 1,
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => setShowDetails(false)}
                >
                  ← Back to jobs
                </Typography>
              )}

              <Typography variant="h6" fontWeight={600}>
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

                <IconButton onClick={() => toggleSave(selectedJob.id!)}>
                  {isSaved(selectedJob.id!) ? (
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

              <Typography fontWeight={600} mb={2}>
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
          </Box>
        )}
      </Box>
    </Box>
  );
}
