import { useEffect, useState } from "react";
// import { toastService, ToastMessage } from "./Toast";
import { toastService, type ToastMessage } from "../../utils/Toast";

const CommonToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastService.subscribe(({ message, type }) => {
      const toast: ToastMessage = {
        id: Date.now(),
        message,
        type,
      };

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    });
  }, []);

  return (
   <div
  className="toast-container"
  style={{
    position: "fixed",
    top: "20px",
    right: "16px",
    zIndex: 1301,
  }}
>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show text-white ${
            toast.type === "success" ? "bg-success" : "bg-danger"
          } mb-2`}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommonToast;
