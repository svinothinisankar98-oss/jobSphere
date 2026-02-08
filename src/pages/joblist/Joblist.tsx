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

import { useUserService } from "../../hooks/useUserService";
import { useErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../ErrorFallback";
import ScrollToTopButton from "../../Components/newui/ScrollToTopButton";

import { handleError } from "../../utils/handleError";

export default function JobList() {
  const { getAllJobs } = useJobService();
  const location = useLocation();
  const { getUser, updateUser } = useUserService();

  //Jobs & selection//

  const [jobs, setJobs] = useState<jobsListType[]>([]);
  const [selectedJob, setSelectedJob] = useState<jobsListType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const authUser = authStorage.get() || {};
  const authUserId = authUser?.id;

  //  DB SAVED JOB IDS //
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  //Error handling state//
  const [jobError, setJobError] = useState<any>();

  //react-error-boundary//

  const { showBoundary } = useErrorBoundary();

  // Load jobs //

  const loadJobs = async () => {
    try {
      const getJobs = await getAllJobs();
      setJobs(getJobs);
    } catch (error: any) {
 
}
  };

  useEffect(() => {
    loadJobs();
  }, []);

  /* Load saved jobs from DB  for logged user*/

  const loadSavedJobs = async () => {
    const user = await getUser(authUser?.email);
    setSavedJobIds(user?.savedJobs || []);
  };
  useEffect(() => {
    if (!authUserId) return;

    loadSavedJobs();
  }, [authUserId]);

  //Toggle save/unsave //
  const toggleSave = async (jobId: number) => {
    let updated;

    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];           //update ui//
    }

    setSavedJobIds(updated);

    const user = await getUser(authUser?.email);

    if (!user) return;

    user.savedJobs = updated;                        //update DB//
    await updateUser(authUser?.id, user);
    window.dispatchEvent(
      new CustomEvent("savedJobsUpdated", {
        //notify for sidebar//
        detail: updated.length,
      }),
    );
  };

  //if the job has already saved by user//

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
          backgroundColor: "background.paper",
    color: "text.primary",
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
          jobType={jobType}
          setJobType={setJobType}
          experience={experience}
          setExperience={setExperience}
          salary={salary}
          setSalary={setSalary}
        />
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
              <Typography
                p={2}
                textAlign="center"
                color="secondary"
                marginLeft={30}
              >
                No jobs found
              </Typography>
            )}


            {filteredJobs?.map((job) => (
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

         {jobError && (
        <ErrorFallback
          error={jobError}
          resetErrorBoundary={() => setJobError(null)}               //set job error//
        />
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
                

                <IconButton
                  onClick={() =>
                    toggleSave(selectedJob.id!).catch(showBoundary)
                  }
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
      <ScrollToTopButton/>
    </Box>
  );
}
