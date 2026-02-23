import { useEffect, useMemo, useState } from "react";
import { Grid, Box, Select, MenuItem, Typography, Stack } from "@mui/material";
import PieChartCommon from "../../Components/charts/PieChartCommon";
import { useUserService } from "../../hooks/useuserService";
import { useErrorBoundary } from "react-error-boundary";

import {
  buildEmployerCharts,
  extractAvailableYears,
} from "../../utils/chartHelpers";
import CommonGroupedBarChart from "../../Components/charts/BarChartCommon";
import CommonCard from "../../Components/newui/CommonCard";

import CommonLineChart from "../../Components/charts/CommonLineChart";
import AnalyticsCard from "../../Components/charts/AnalyticsCard";

export default function Dashboard() {
  //state manage//
  const [employers, setEmployers] = useState<any[]>([]);
  const { showBoundary } = useErrorBoundary();
  const { getRecruiterDetails } = useUserService(showBoundary); //userservice hook//
  const [year, setYear] = useState<number>();

  //loading data//

  useEffect(() => {
    loadEmployers();
  }, []);

  //Runs once on page load//

  const loadEmployers = async () => {
    const res = await getRecruiterDetails();
    setEmployers(res || []);
  };

  //active and inactive count//

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

  //chart builders-converts api data to chart builders//
  const charts = useMemo(
    () => buildEmployerCharts(employers ?? [], year),
    [employers, year],
  );

  // console.log("charts",charts)

  //  detect all years mode
  const isAllYears = !year; //all years year comparison chart//
  const yearOptions = extractAvailableYears(employers); //specific year monthly comparision chart//

  /* ---------------- UI ---------------- */

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600} sx={{ ml: 80 }}>
          Employer Analytics
        </Typography>
      </Stack>

      {/* Cards */}
      <Grid container spacing={2} mb={3} ml={10}>
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

      <Grid container spacing={3}>
        {/* Status Pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CommonCard title="Employer Status" sx={{ ml: 10 }}>
            <PieChartCommon
              data={chartdata}
              centerValue={activeCount + inactiveCount}
              centerLabel=" Employers"
              showGap
            />
          </CommonCard>
        </Grid>

        {/* Industry Pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CommonCard title="Industry Distribution" sx={{ mr: 9 }}>
            <PieChartCommon
              data={charts.industryPie.data}
              colors={charts.industryPie.colors}
              showGap={false}
            />
          </CommonCard>
        </Grid>

        {/* Company Size Bar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CommonCard title="Company Size" sx={{ ml: 10 }}>
            <CommonGroupedBarChart
              axisLabel="Company Size"
              data={charts.companySize}
              orientation="vertical"
              labelKey="label"
              valueKey="count"
              valueLabel="count"
            />
          </CommonCard>
        </Grid>

        {/* Monthly Registrations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CommonCard
            title={`Monthly  Recruiter Registrations ${year ? `(${year})` : "(All Years)"}`}
            sx={{ mr: 9 }}
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

            <CommonLineChart
              title={
                isAllYears
                  ? "Yearly Registration Comparison"
                  : "Monthly Registrations"
              }
              data={isAllYears ? charts.yearlyComparison.data : charts.monthly}
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
    </Box>
  );
}
