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

import { authStorage } from "../../utils/authStorage";


import ErrorFallback from "../../ErrorFallback";
import ScrollToTopButton from "../../Components/newui/ScrollToTopButton";

/*  REDUX */
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import {
  fetchSavedJobs,
  toggleSavedJobThunk,
} from "../../redux/thunks/savedJobsThunk";

export default function JobList() {
  const { getAllJobs } = useJobService();
  const location = useLocation();


  const dispatch = useDispatch<AppDispatch>();

  /* ================= AUTH ================= */

  const authUser = authStorage.get() || {};
  const authUserId = authUser?.id;

  /* ================= REDUX SAVED JOBS ================= */

  const savedJobIds = useSelector(
    (state: RootState) => (state.savedJobs as any).ids
  );

  /* ================= JOB STATE ================= */

  const [jobs, setJobs] = useState<jobsListType[]>([]);
  const [selectedJob, setSelectedJob] = useState<jobsListType | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [jobError, setJobError] = useState<any>();

  /* ================= LOAD JOBS ================= */

  const loadJobs = async () => {
    try {
      const getJobs = await getAllJobs();
      setJobs(getJobs);
    } catch (error) {
      setJobError(error);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  /* ================= LOAD SAVED JOBS ================= */

  useEffect(() => {
    if (!authUserId) return;
    dispatch(fetchSavedJobs(authUserId.toString()));
  }, [authUserId, dispatch]);

  /* ================= TOGGLE SAVE ================= */

  const toggleSave = (jobId: number) => {
    if (!authUserId) return;

    dispatch(
      toggleSavedJobThunk({
        userId: authUserId.toString(),
        jobId,
      })
    );
  };

  const isSaved = (id: number) => savedJobIds.includes(id);

  /* ================= SEARCH ================= */

  const [searchInput, setSearchInput] = useState(location.state?.search || "");
  const [selectedInput, setSelectedInput] = useState(
    location.state?.selected || ""
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [searched, setSearched] = useState(false);

  /* ================= FILTERS ================= */

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

  /* ================= FILTERED JOBS ================= */

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

  /* ================= AUTO SELECT ================= */

  useEffect(() => {
    if (filteredJobs.length) setSelectedJob(filteredJobs[0]);
    else setSelectedJob(null);
  }, [filteredJobs]);

  const isMobile = window.innerWidth < 900;

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* SEARCH */}
      <Box px={{ xs: 1, md: 4 }} py={2}>
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
          jobType={jobType}
          setJobType={setJobType}
          experience={experience}
          setExperience={setExperience}
          salary={salary}
          setSalary={setSalary}
        />
      </Box>

      <Box display="flex" flex={1} overflow="hidden">
        {/* JOB LIST */}
        {(!showDetails || !isMobile) && (
          <Box width={{ xs: "100%", md: "40%" }} overflow="auto" ml={{ md: 10 }}>
            {searched && filteredJobs.length === 0 && (
              <Typography p={2} textAlign="center">
                No jobs found
              </Typography>
            )}

            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                onClick={() => {
                  setSelectedJob(job);
                  if (isMobile) setShowDetails(true);
                }}
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
                <Typography color="text.secondary">
                  {job.companyName}
                </Typography>
                <Typography>{job.location}</Typography>
                <Typography>₹ {job.salary}</Typography>
              </Card>
            ))}
          </Box>
        )}

        {jobError && (
          <ErrorFallback
            error={jobError}
            resetErrorBoundary={() => setJobError(null)}
          />
        )}

        {/* JOB DETAILS */}
        {selectedJob && (showDetails || !isMobile) && (
          <Box width={{ xs: "100%", md: "65%" }} overflow="auto">
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                {selectedJob.title}
              </Typography>

              <Typography color="text.secondary">
                {selectedJob.companyName} • {selectedJob.location}
              </Typography>

              <Stack direction="row" spacing={1} my={2}>
                <MyButton label="Apply now" variant="contained" />

                <IconButton
                  onClick={() => toggleSave(selectedJob.id!)}
                >
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
               {selectedJob.description
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <Typography key={i} mb={1}>
                      {line}
                    </Typography>
                  ))}
            </Card>
          </Box>
        )}
      </Box>

      <ScrollToTopButton />
    </Box>
  );
}
