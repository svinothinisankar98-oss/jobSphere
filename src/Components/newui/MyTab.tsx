import React from "react";

type TabItem = {
  tabName: string;
  tabContent: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: number;
  onTabChange?: (index: number) => void;
};

const MyTabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div>
      <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange?.(index)}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              border: "none",
              background: "none",
              fontWeight: activeTab === index ? 600 : 400,
              borderBottom:
                activeTab === index ? "2px solid #1976d2" : "2px solid transparent",
            }}
          >
            {tab.tabName}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {tabs[activeTab]?.tabContent}
      </div>
    </div>
  );
};

export default MyTabs;
