import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

type TabItem = {
  tabName: string;
  tabContent: React.ReactNode;
};

type TabsProps = {
  activeTab: number;
  onTabChange: (index: number) => void;
  completedTabs: number[];
  errorTabs: number[];
  tabs: TabItem[];
};

const MyTabs = ({
  activeTab,
  onTabChange,
  completedTabs,
  errorTabs,
  tabs,
}: TabsProps) => {
  const getTabColor = (index: number) => {
    if (activeTab === index) return "primary.main";
    if (errorTabs.includes(index)) return "error.main";
    if (completedTabs.includes(index)) return "#28ae38ff";
    return "text.primary";
  };

  const getFontWeight = (index: number) => {
    if (activeTab === index) return 600;
    if (completedTabs.includes(index)) return 700;
    return 400;
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.tabName}
            sx={{
              color: getTabColor(index),
              fontWeight: getFontWeight(index),
              textTransform: "none",

              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: 600,
              },
            }}
          />
        ))}
      </Tabs>

      <Box mt={2}>{tabs[activeTab]?.tabContent}</Box>
    </>
  );
};

export default MyTabs;
