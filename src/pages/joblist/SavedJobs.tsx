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

export default function SavedJobs() {
  const { getAllJobs } = useJobService();

  const [jobs, setJobs] = useState<jobsListType[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<jobsListType | null>(null);

  // ✅ load jobs
  useEffect(() => {
    getAllJobs().then(setJobs);
  }, []);

  const getAuthUser = authStorage.get() || {};
  const authUserId = getAuthUser?.id;
  // ✅ load saved jobs (fix string → number issue)
  useEffect(() => {
    const stored = localStorage.getItem("savedJobs");

    if (!stored) {
      setSavedJobs([]);
      return;
    }

    const parsed: number[] = JSON.parse(stored);

    setSavedJobs(parsed);
  }, []);

  const getJobNumber = Array.isArray(savedJobs)
    ? savedJobs?.filter((d: any)=>{
      if(d?.jobId && d?.id == authUserId){
        return d
      }
    })
    : [];
  console.log(getJobNumber, "getJobNumber");
  const gejobId = getJobNumber?.map(d=>d?.jobId)
  // ✅ filter correctly
  const savedJobList = useMemo(() => {
    // return getJobNumber;
    return jobs.filter((job) => gejobId?.includes(job?.id));
  }, [jobs, savedJobs]);

  console.log(jobs, "savedJobList", savedJobs);

  useEffect(() => {
    if (savedJobList.length) setSelectedJob(savedJobList[0]);
    else setSelectedJob(null);
  }, [savedJobList]);

  // ✅ save / unsave
  const toggleSave = (id: number) => {
  const authUserId = getAuthUser?.id;

  const alreadySaved = savedJobs.some(
    (job: any) => job.id === authUserId && job.jobId === id
  );

  let savedJobData;

  if (alreadySaved) {
    // 👉 UNSAVE (remove it)
    savedJobData = savedJobs.filter(
      (job: any) => !(job.id === authUserId && job.jobId === id)
    );
  } else {
    // 👉 SAVE
    savedJobData = [
      ...savedJobs,
      { id: authUserId, jobId: id }
    ];
  }

  setSavedJobs(savedJobData);
  localStorage.setItem("savedJobs", JSON.stringify(savedJobData));
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
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
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
                    <BookmarkIcon color="primary" />
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
