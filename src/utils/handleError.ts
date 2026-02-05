export const handleError = (
  error: any,
  options: {
    showBoundary?: (err: any) => void;
    setLocalError?: (err: any) => void;
  }
) => {
  // 🌐 No response = server/network down
  if (!error?.response) {
    const serverError = new Error("Server loading failed. Please try again.");
    options.showBoundary?.(serverError);
    return;
  }

  // 📛 API message (if exists)
  const message =
    error.response?.data?.message ||
    "Something went wrong. Please try again.";

  const friendlyError = new Error(message);

  // ⚠️ Small error → snackbar
  options.setLocalError?.(friendlyError);
};
