export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

type ToastListener = (msg: {
  message: string;
  type: "success" | "error";
}) => void;

let listener: ToastListener | null = null;

export const toastService = {
  subscribe(fn: ToastListener) {
    listener = fn;
  },

  success(message: string) {
    listener?.({ message, type: "success" });
  },

  error(message: string) {
    listener?.({ message, type: "error" });
  },
};
