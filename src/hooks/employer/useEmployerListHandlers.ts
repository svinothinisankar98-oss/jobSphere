import { useState } from "react";
import type { employerRegisterType } from "../../types/employerRegister";

type PendingAction = "delete" | "activate" | null;

export const useEmployerListHandlers = (
  updateUser: (id: number, data: any) => Promise<any>,
  showSnackbar: (msg: string, type: "success" | "error") => void
) => {
  //State Variables//

  const [showConfirm, setShowConfirm] = useState(false);
  //stores current action  delete activate//
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  //selected employees//
  const [pendingRows, setPendingRows] = useState<employerRegisterType[]>([]);

  //handleDeleteClick//

  const handleDeleteClick = (rows: employerRegisterType[]) => {
    setPendingRows(rows);
    setPendingAction("delete");
    setShowConfirm(true);
  };

  //handleActivateClick//

  const handleActivateClick = (rows: employerRegisterType[]) => {
    const list = Array.isArray(rows) ? rows : [rows];
    setPendingRows(list);
    setPendingAction("activate");
    setShowConfirm(true);
  };

  //handle confirm yes//

  const handleConfirmYes = async (reload: () => Promise<void>) => {
    if (!pendingAction || pendingRows.length === 0) return;

    try {
      await Promise.all(
        pendingRows.map((row) => {
          if (!row.id) return Promise.resolve();

          //api calls//

          return updateUser(row.id, {
            ...row,
            isActive: pendingAction === "activate",
            updatedAt: new Date(),
          });
        })
      );

      //Snackbar messages//

      const count = pendingRows.length;

      if (pendingAction === "delete") {
        showSnackbar(
          count === 1
            ? "1 employee deleted successfully"
            : `${count} employer deleted successfully`,
          "success"
        );
      }

      if (pendingAction === "activate") {
        showSnackbar(
          count === 1
            ? "1 employee activated successfully"
            : `${count} employer activated successfully`,
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

  //handle confirm no//

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
