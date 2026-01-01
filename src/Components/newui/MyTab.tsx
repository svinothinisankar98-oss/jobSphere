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
    if (errorTabs.includes(index)) return "error.main"; 
    if (completedTabs.includes(index)) return "#11b124ff";
    return "text.primary"; 
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        // variant="fullWidth"
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
              fontWeight: activeTab === index ? 600 : 400,
              textTransform: "none",
              border:"1px",
            }}
          />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box mt={2}>{tabs[activeTab]?.tabContent}</Box>
    </>
  );
};

export default MyTabs;
