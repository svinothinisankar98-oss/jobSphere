import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

type TabItem = {
  tabName: string;
  tabContent: React.ReactNode;
};

type TabsProps = {
  activeTab: number;
  onTabChange: (index: number) => void;
  completedTabs?: number[];
  errorTabs?: number[];
  tabs: TabItem[];
};

const MyTab = ({
  activeTab,
  onTabChange,
  completedTabs = [],
  errorTabs = [],
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
          borderBottom: "2px solid #e0e0e0",
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: "3px",
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
              borderBottom:
                activeTab === index
                  ? "3px solid #1976d2"
                  : "3px solid transparent", //  manual border
              borderRadius: 0,
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: 600,
              },
            }}
          />
        ))}
      </Tabs>

      <Box>{tabs[activeTab]?.tabContent}</Box>
    </>
  );
};

export default MyTab;
