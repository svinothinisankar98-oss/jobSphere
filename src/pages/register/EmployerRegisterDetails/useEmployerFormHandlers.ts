// useEmployerFormHandlers.ts
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { employerRegisterType } from "../../../types/employerRegister";

export function useEmployerFormHandlers(
  form: UseFormReturn<employerRegisterType>,
  stepFields: (keyof employerRegisterType)[][]
) {
  const { trigger } = form;

  const [activeTab, setActiveTab] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);
  const [errorTabs, setErrorTabs] = useState<number[]>([]);

  /* ---------- COMMON TAB VALIDATION ---------- */
  const validateCurrentTab = async () => {
    const fields = stepFields[activeTab];
    const valid = await trigger(fields);

    if (valid) {
      setCompletedTabs((prev) =>
        prev.includes(activeTab) ? prev : [...prev, activeTab]
      );
      setErrorTabs((prev) => prev.filter((t) => t !== activeTab));
    } else {
      setErrorTabs((prev) =>
        prev.includes(activeTab) ? prev : [...prev, activeTab]
      );
    }

    return valid;
  };

  /* ---------- NEXT ---------- */
  const handleNext = async () => {
    const valid = await validateCurrentTab();
    // if (!valid) return;

    setActiveTab((prev) =>
      Math.min(prev + 1, stepFields.length - 1)
    );
  };

  /* ---------- BACK ---------- */
  const handleBack = async () => {
    await validateCurrentTab();
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  /* ---------- TAB CLICK ---------- */
  const handleTabChange = async (nextTab: number) => {
    await validateCurrentTab();
    setActiveTab(nextTab);
  };

  /* ---------- RESET ---------- */
  const handleResetState = () => {
    setActiveTab(0);
    setCompletedTabs([]);
    setErrorTabs([]);
  };

  return {
    activeTab,
    completedTabs,
    errorTabs,
    handleNext,
    handleBack,
    handleTabChange,
    handleResetState,
  };
}
