import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Stack,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";

import BookmarkIcon from "@mui/icons-material/Bookmark";

import { useJobService } from "../../hooks/joblist/useJobService";
import type { jobsListType } from "../../types/jobListType";
import MyButton from "../../Components/newui/MyButton";
import { authStorage } from "../../utils/authStorage";
import { userService } from "../../service/userService";
import { useUserService } from "../../hooks/useUserService";

export default function SavedJobs() {
  const { getAllJobs } = useJobService();

  const { getUser ,updateUser} = useUserService();

  const [jobs, setJobs] = useState<jobsListType[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<jobsListType | null>(null);

  const authUser = authStorage.get() || {};
  const authUserId = authUser?.id;

  /* Load all jobs */
  useEffect(() => {
    getAllJobs().then(setJobs);
  }, []);

  /* Load saved jobs from DB */
  useEffect(() => {
    if (!authUserId) return;

    const loadSavedJobs = async () => {
      const user = await getUser(authUser?.email);
      setSavedJobIds(user?.savedJobs || []);
    };

    loadSavedJobs();
  }, [authUserId]);

  /* Filter saved jobs */
  const savedJobList = useMemo(() => {
    return jobs.filter((job) => savedJobIds.includes(job.id!));
  }, [jobs, savedJobIds]);

  /* Auto select first job */
  useEffect(() => {
    if (savedJobList.length) {
      setSelectedJob(savedJobList[0]);
    } else {
      setSelectedJob(null);
    }
  }, [savedJobList]);

  /* Toggle save/unsave */
  const toggleSave = async (jobId: number) => {
    let updated;

    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobIds, jobId];
    }

    setSavedJobIds(updated); 

    const user = await getUser(authUser?.email);

    user.savedJobs = updated;
    await updateUser(authUser?.id, user); 

    // window.dispatchEvent(new Event("savedJobsUpdated"));
    window.dispatchEvent(
      new CustomEvent("savedJobsUpdated", {
        detail: updated.length,
      }),
    );
  };

  return (
    <Box height="100vh" px={3} bgcolor="#f7f9fc">
      {/* EMPTY STATE */}
      {savedJobList.length === 0 && (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <BookmarkIcon sx={{ fontSize: 60, mb: 1, color: "#1976d2" }} />

            <Typography fontSize={20} fontWeight={600}>
              No saved jobs yet
            </Typography>

            <Typography color="text.secondary">
              Save jobs to view them here later
            </Typography>
          </Paper>
        </Box>
      )}

      {/* SAVED JOBS VIEW */}
      {savedJobList.length > 0 && (
        <Box display="flex" gap={3} height="100%">
          {/* LEFT LIST */}
          <Box width="38%" overflow="auto" py={3} marginLeft={10}>
            {savedJobList.map((job) => (
              <Card
                key={job.id}
                onClick={() => setSelectedJob(job)}
                sx={{
                  p: 2.5,
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: 3,
                  border:
                    selectedJob?.id === job.id
                      ? "2px solid #1976d2"
                      : "1px solid #eee",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Typography fontWeight={600}>{job.title}</Typography>
                <Typography color="text.secondary">
                  {job.companyName}
                </Typography>
                <Typography fontSize={13}>{job.location}</Typography>

                <Typography fontWeight={600} mt={1}>
                  ₹ {job.salary}
                </Typography>
              </Card>
            ))}
          </Box>

          {/* RIGHT DETAILS */}
          <Box width="62%" overflow="auto" py={3}>
            {selectedJob && (
              <Card sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" fontWeight={700}>
                  {selectedJob.title}
                </Typography>

                <Typography color="text.secondary" mb={1}>
                  {selectedJob.companyName} • {selectedJob.location}
                </Typography>

                <Typography fontWeight={700} fontSize={18} mb={2}>
                  ₹ {selectedJob.salary}
                </Typography>

                <Stack direction="row" spacing={1} mb={3}>
                  <MyButton label="Apply now" variant="contained" />

                  <IconButton onClick={() => toggleSave(selectedJob.id!)}>
                    <BookmarkIcon
                      color={
                        savedJobIds.includes(selectedJob.id!)
                          ? "primary"
                          : "disabled"
                      }
                    />
                  </IconButton>

                  <Chip label={selectedJob.jobType} />
                  <Chip label={selectedJob.experience} />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography>
                  <b>Openings:</b> {selectedJob.noOfOpenings}
                </Typography>

                <Typography>
                  <b>Skills:</b> {selectedJob.tags}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography fontWeight={700} mb={2}>
                  Job Description
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
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
