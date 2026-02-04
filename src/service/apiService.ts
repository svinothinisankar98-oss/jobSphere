import axios, { AxiosError } from "axios";

// Base URL
const API_BASE_URL = "http://localhost:4000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Global Error Interceptors//

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    console.group("AXIOS ERROR");
    console.log("Full error:", error);
    console.log("Status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    console.log("Request:", error.request);
    console.groupEnd();
    let message = "Unexpected error occurred";

    if (error.response) {
      // Backend returned error response
      message = error.response.data?.message || "Server error occurred";
    } else if (error.request) {
      // Request made but no response (network issue)
      message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(new Error(message));
  },
);

// API service
export const apiService = {
  async get<T>(url: string, params?: any): Promise<T> {
    console.log(url, "url", params);
    const response: any = await api.get<T>(url, { params });
    return response.data;
  },

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<T>(url);
    return response.data;
  },
};
