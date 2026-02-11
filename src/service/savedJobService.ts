import { apiService } from "../service/apiService";

type UserResponse = {
  id: number;
  savedJobs?: number[];
  [key: string]: any;
};

export const savedJobService = {
 
  //getsavedjobs//

  async getSavedJobs(userId: string): Promise<number[]> {
    const res = await apiService.get<UserResponse>(
      `/users/${userId}`
    );

    return res.savedJobs ?? [];
  },

  //Toggle Saved Jobs//

  async toggleSavedJob(userId: string, jobId: number): Promise<void> {
    const user = await apiService.get<UserResponse>(
      `/users/${userId}`
    );

    const current = user.savedJobs ?? [];

    const updated = current.includes(jobId)
      ? current.filter((id) => id !== jobId)
      : [...current, jobId];

    await apiService.put(`/users/${userId}`, {
      ...user,
      savedJobs: updated,
    });
  },
};
