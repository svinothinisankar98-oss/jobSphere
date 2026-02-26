import { useEffect, useMemo, useState } from "react";
import { Grid, Box, Select, MenuItem, Typography, Stack } from "@mui/material";
import PieChartCommon from "../../Components/charts/PieChartCommon";
import { useUserService } from "../../hooks/useuserService";
import { useErrorBoundary } from "react-error-boundary";

import {
  buildEmployerCharts,
  extractAvailableYears,
  buildUsersMonthlyStats,
 
} from "../../utils/chartHelpers";
import CommonGroupedBarChart from "../../Components/charts/CommonGroupedBarChart";
import CommonCard from "../../Components/newui/CommonCard";

import CommonLineChart from "../../Components/charts/CommonLineChart";
import AnalyticsCard from "../../Components/charts/AnalyticsCard";

import CommonMultiRingDonut, {
  type DonutItem,
} from "../../Components/charts/CommonMultiRingDonut";
import type { User } from "../../service/userService";
import FunnelChart from "../../Components/charts/FunnelChart";
import MyTab from "../../Components/newui/MyTab";

export default function Dashboard() {
  //state manage//
  const [employers, setEmployers] = useState<any[]>([]);
  const { showBoundary } = useErrorBoundary();
  const { getRecruiterDetails, getUserTypeStats, getAllUsers } =
    useUserService(showBoundary); //userservice hook//
  const [year, setYear] = useState<number>(); //selected year filter//
  const [userStats, setUserStats] = useState({ jobseeker: 0, employer: 0 });

  const [selectedUser, setSelectedUser] = useState<DonutItem | null>(null);//clicked donut slice//
  const [users, setUsers] = useState<User[]>([]);
  const [userMonthly, setUserMonthly] = useState<any[]>([]);
  const [tab, setTab] = useState(0);    //active tab index//

  //loading data//

  useEffect(() => {
    loadEmployers();
    loadUserStats();
    loadUsers();
  }, []);

  const loadUserStats = async () => {
    const res = await getUserTypeStats();
    setUserStats(res);
  };


  //User Types//

  const loadUsers = async () => {
    const res = await getAllUsers();
    console.log("FIRST USER:", res[0]);
    setUsers(res);
  };

  //Recruiters//

  const loadEmployers = async () => {
    const res = await getRecruiterDetails();
    setEmployers(res || []);
  };

  //Active / Inactive Employers//

  const activeCount = employers.filter((e) => e.isActive === true).length;
  const inactiveCount = employers.filter((e) => e.isActive === false).length;

  const totalEmployers = activeCount + inactiveCount;

  // percentages//
  const activePercent = totalEmployers
    ? Math.round((activeCount / totalEmployers) * 100)
    : 0;

  const inactivePercent = totalEmployers
    ? Math.round((inactiveCount / totalEmployers) * 100)
    : 0;

  //Pie chart data//

  const chartdata = [
    { label: "Active", value: activeCount },
    { label: "Inactive", value: inactiveCount },
  ];

 // Funnel Chart Data//

  const funnelData = [
    {
      label: "Total",
      value: 100,
      color: "#7C3AED",
    },
    {
      label: "Active",
      value: activePercent,
      color: "#22C55E",
    },
    {
      label: "Inactive",
      value: inactivePercent,
      color: "#F59E0B",
    },
  ];


  
  //Monthly Users//

  useEffect(() => {
    setUserMonthly(buildUsersMonthlyStats(users, 2025));
  }, [users]);

  //chart builders-converts api data to chart builders//
  const charts = useMemo(
    () => buildEmployerCharts(employers ?? [], year),
    [employers, year],
  );

  // console.log("charts",charts)

  //  detect all years mode
  const isAllYears = !year; //all years year comparison chart//
  const yearOptions = extractAvailableYears(employers); //specific year monthly comparision chart//


  const DRAWER_WIDTH = 100;

  return (
    <Box
      sx={{
        ml: { md: `${DRAWER_WIDTH}px` },
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        p: 3,
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600} sx={{ ml: 80 }}>
          Employer Analytics
        </Typography>
      </Stack>

      {/* Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard
            title="Total Employers"
            value={totalEmployers}
            percent={100}
            color="#7C3AED"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard
            title="Active Employers"
            value={activeCount}
            percent={activePercent}
            color="#22C55E"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsCard
            title="Inactive Employers"
            value={inactiveCount}
            percent={inactivePercent}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      <MyTab
        activeTab={tab}
        onTabChange={setTab}
        tabs={[
          {
            tabName: "Employer Analytics",
            tabContent: (
              <Grid container spacing={3}>
             

                {/* Status Pie  active and inactive*/}
                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard title="Employer Status">
                    <PieChartCommon
                      data={chartdata}
                      centerValue={activeCount + inactiveCount}
                      centerLabel="Employers"
                      showGap
                      
                    />
                  </CommonCard>
                </Grid>

                {/* Industry Pie */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard title="Industry Distribution">
                    <PieChartCommon
                      data={charts.industryPie.data}
                      colors={charts.industryPie.colors}
                      showGap={false}
                      showLabel
                    />
                  </CommonCard>
                </Grid>

                {/* Company Size Bar */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard title="Company Size">
                    <CommonGroupedBarChart
                      title="Company Size Distribution"
                      axisLabel="Company Size"
                      data={charts.companySize}
                      labelKey="label"
                      yLabel="Employers"
                      showLabel
                      series={[{ label: "Employers", dataKey: "count" ,barLabelPlacement:"outside"}]}
                    />
                  </CommonCard>
                </Grid>

                {/* Monthly Registrations */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard
                    title={`Monthly  Recruiter Registrations ${year ? `(${year})` : "(All Years)"}`}
                  >
                    <Select //drop down//
                      sx={{ ml: 60 }}
                      size="small"
                      value={year ?? ""}
                      displayEmpty
                      onChange={(e) => {
                        const value = e.target.value as unknown as string;
                        setYear(value === "" ? undefined : Number(value));
                      }}
                    >
                      <MenuItem value="">All Years</MenuItem>
                      {yearOptions.map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>

                    <CommonLineChart // //common line chart//
                      title={
                        isAllYears
                          ? "Yearly Registration Comparison"
                          : "Monthly Registrations"
                      }
                      data={
                        isAllYears
                          ? charts.yearlyComparison.data
                          : charts.monthly
                      }
                      xKey="month"
                      xLabel="Month"
                      yLabel="Registrations"
                      series={
                        isAllYears
                          ? charts.yearlyComparison.series
                          : [{ label: "Count", dataKey: "count" }]
                      }
                    />
                  </CommonCard>
                </Grid>
              </Grid>
            ),
          },

          {
            tabName: "User Analytics",
            tabContent: (
              <Grid container spacing={3}>
                

                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard title="Overall User Registrations">
                    <Box display="flex" alignItems="center" gap={6}>
                      {/* CHART */}
                      <CommonMultiRingDonut
                        data={[
                          {
                            label: "Jobseekers",
                            value: userStats.jobseeker,
                            color: "#4F46E5",
                          },
                          {
                            label: "Employers",
                            value: userStats.employer,
                            color: "#F59E0B",
                          },
                        ]}
                        onSliceClick={(item) => setSelectedUser(item)}
                         
                      />

                      {/* SIDE INFO PANEL */}
                      <Box minWidth={180}>
                        {selectedUser && (
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#f0c8ed",
                              color: "#0e0e0e",
                              fontFamily: "monospace",
                            }}
                          >
                            <Typography>{`Type  : ${selectedUser.label}`}</Typography>
                            <Typography>{`Count : ${selectedUser.value}`}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CommonCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard title=" Total Registerations 2025">
                    <CommonGroupedBarChart
                      axisLabel="Month"
                      data={userMonthly}
                      labelKey="month"
                      yLabel="Users"
                      showLabel={true}
                      series={[
                        { label: "Total", dataKey: "total", color: "#6366F1" },
                        {
                          label: "Jobseekers",
                          dataKey: "jobseeker",barLabelPlacement:"outside"
                          
                          
                        },
                        {
                          label: "Employers",
                          dataKey: "employer",barLabelPlacement:"outside"
                          
                        },
                      ]}
                      orientation="vertical"
                    />
                  </CommonCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <CommonCard title="Employer Conversion Funnel">
                    <Box sx={{ borderRadius: 3, p: 3 }}>
                      <FunnelChart data={funnelData} />
                    </Box>
                  </CommonCard>
                </Grid>
                
               
              </Grid>
            ),
          },
        ]}
      />
    </Box>
  );
}
