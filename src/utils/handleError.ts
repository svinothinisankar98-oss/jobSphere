export const handleError = (
  error: any,
  options: {
    showBoundary?: (err: Error) => void;
    setLocalError?: (err: Error) => void;
  }
) => {

  // Server/network error
  if (!error?.response) {
    const serverError = new Error("Server loading failed. Please try again.");

    if (options.showBoundary) {
      options.showBoundary(serverError);
    } else {
      throw serverError; //  fallback safety
    }

    return;
  }

  // API/ error
  const message =
    error.response?.data?.message ||
    "Something went wrong. Please try again.";

  const friendlyError = new Error(message);

  options.setLocalError?.(friendlyError);
};
