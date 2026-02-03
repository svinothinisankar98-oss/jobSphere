import type { employerRegisterType } from "../../types/employerRegister";
import { useUI } from "../../context/UIProvider";

type PendingAction = "delete" | "activate";

export const useEmployerListHandlers = (
  updateUser: (id: number, data: any) => Promise<any>,
  showSnackbar: (msg: string, type: "success" | "error") => void
) => {
  const { openConfirm } = useUI();

  const runAction = async (
    rows: employerRegisterType[],
    action: PendingAction,
    reload: () => Promise<void>
  ) => {
    try {
      await Promise.all(
        rows.map((row) =>
          row.id
            ? updateUser(row.id, {
                ...row,
                isActive: action === "activate",
                updatedAt: new Date(),
              })
            : Promise.resolve()
        )
      );

      const count = rows.length;

      if (action === "delete") {
        showSnackbar(
          count === 1
            ? "1 employee deleted successfully"
            : `${count} employees deleted successfully`,
          "success"
        );
      }

      if (action === "activate") {
        showSnackbar(
          count === 1
            ? "1 employee activated successfully"
            : `${count} employees activated successfully`,
          "success"
        );
      }

      await reload();
    } catch (err) {
      console.error(err);
      showSnackbar("Action failed", "error");
    }
  };

  /* ===== DELETE ===== */

  const handleDeleteClick = (
    rows: employerRegisterType[],
    reload: () => Promise<void>
  ) => {
    openConfirm({
      title: "Delete Employer",
      message:
        rows.length === 1
          ? "Are you sure you want to delete this employer?"
          : `Are you sure you want to delete ${rows.length} employers?`,
      confirmText: "Yes, Delete",
      confirmColor: "error",
      onConfirm: () => runAction(rows, "delete", reload),
    });
  };

  /* ===== ACTIVATE ===== */

  const handleActivateClick = (
    rows: employerRegisterType[],
    reload: () => Promise<void>
  ) => {
    openConfirm({
      title: "Activate Employer",
      message:
        rows.length === 1
          ? "Are you sure you want to activate this employer?"
          : `Are you sure you want to activate ${rows.length} employers?`,
      confirmText: "Yes, Activate",
      confirmColor: "success",
      onConfirm: () => runAction(rows, "activate", reload),
    });
  };

  return {
    handleDeleteClick,
    handleActivateClick,
  };
};
