import type { jobsListType } from "../../types/jobListType";
import { jobService } from "../../service/jobListService";

export const useJobService = () => {

  // create job

  const createJob = async (data: jobsListType) => {
    try {
      return await jobService.createJob(data);
    } catch (error) {
      console.error("Failed to create job", error);
      throw error;
    }
  };

  // get all jobs list

  const getAllJobs = async (): Promise<jobsListType[]> => {
    try {
      return await jobService.getJobs();
    } catch (error) {
      console.error("Failed to load jobs", error);
      throw error;
      
      
    }
  };

  // get job by id

  const getJobById = async (id: number): Promise<jobsListType> => {
    try {
      return await jobService.getJobById(id);
    } catch (error) {
      console.error("Failed to load job by id", error);
      throw error;
    }
  };

  // update job

  const updateJob = async (id: number, data: jobsListType) => {
    try {
      return await jobService.updateJob(id, data);
    } catch (error) {
      console.error("Failed to update job", error);
      throw error;
    }
  };

  // delete job

  const deleteJob = async (id: number) => {
    try {
      await jobService.deleteJob(id);
    } catch (error) {
      console.error("Delete job failed", error);
      throw error;
    }
  };

  return {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
  };
};
