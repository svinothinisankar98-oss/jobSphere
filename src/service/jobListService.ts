import { apiService } from "./apiService";

import type { jobsListType } from "../types/jobListType";

export const jobService = {
  //  Get all jobs
  async getJobs(): Promise<jobsListType[]> {
    const res = await apiService.get<jobsListType []>("/jobs");
    return res;
  },

  // Get single job by id
  async getJobById(id: number | string): Promise<jobsListType> {
    const res = await apiService.get<jobsListType>(`/jobs/${id}`);
    return res;
  },

  //  Create job
  async createJob(payload: jobsListType) {
    const res = await apiService.post<jobsListType>("jobs", payload);
    return res;
  },

  // Update job
  async updateJob(id: number | string, payload: jobsListType) {
    const res = await apiService.put<jobsListType>(`/jobs/${id}`, payload);
    return res;
  },

  //  Delete job
  async deleteJob(id: number | string) {
    const res = await apiService.delete<jobsListType>(`/jobs/${id}`);
    return res;
  },
};