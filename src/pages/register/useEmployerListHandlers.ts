import { useState } from "react";
import type { employerRegisterType } from "../../types/employerRegister";

type PendingAction = "delete" | "activate" | null;

export const useEmployerActions = (
  updateUser: (id: string, data: any) => Promise<any>,
  showSnackbar: (msg: string, type: "success" | "error") => void
) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingRows, setPendingRows] = useState<employerRegisterType[]>([]);

  const handleDeleteClick = (rows: employerRegisterType[]) => {
    setPendingRows(rows);
    setPendingAction("delete");
    setShowConfirm(true);
  };

  
  const handleActivateClick = (
    rows: employerRegisterType | employerRegisterType[]
  ) => {
    const list = Array.isArray(rows) ? rows : [rows];
    setPendingRows(list);
    setPendingAction("activate");
    setShowConfirm(true);
  };

  const handleConfirmYes = async (reload: () => Promise<void>) => {
    if (!pendingAction || pendingRows.length === 0) return;

    try {
      await Promise.all(
        pendingRows.map((row) => {
          if (!row.id) return Promise.resolve();

          return updateUser(row.id, {
            ...row,
            isActive: pendingAction === "activate",
            updatedAt: new Date(),
          });
        })
      );

    //   showSnackbar(
    //     pendingAction === "delete"
    //       ? "Employee(s) deleted successfully"
    //       : "Employee(s) activated successfully",
    //     "success"
    //   );

    const count = pendingRows.length;

if (pendingAction === "delete") {
  showSnackbar(
    count === 1
      ? "1 employee deleted successfully"
      : `${count} employees deleted successfully`,
    "success"
  );
}

if (pendingAction === "activate") {
  showSnackbar(
    count === 1
      ? "1 employee activated successfully"
      : `${count} employees activated successfully`,
    "success"
  );
}

    

      await reload();
    } catch (error) {
      console.error(error);
      showSnackbar("Action failed", "error");
    } finally {
      setShowConfirm(false);
      setPendingRows([]);
      setPendingAction(null);
    }
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    setPendingRows([]);
    setPendingAction(null);
  };

  return {
    showConfirm,
    pendingAction,
    pendingRows,
    handleDeleteClick,
    handleActivateClick,
    handleConfirmYes,
    handleConfirmNo,
  };
};
