import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import PieChartCommon from "../../Components/charts/PieChartCommon";
import { useUserService } from "../../hooks/useuserService";
import { useErrorBoundary } from "react-error-boundary";

import { buildEmployerCharts } from "../../utils/chartHelpers";
import CommonGroupedBarChart from "../../Components/charts/BarChartCommon";

export default function Dashboard() {
  const [employers, setEmployers] = useState<any[]>([]);
  const { showBoundary } = useErrorBoundary();
  const { getRecruiterDetails } = useUserService(showBoundary);

  useEffect(() => {
    loadEmployers();
  }, []);

  const loadEmployers = async () => {
    const res = await getRecruiterDetails();
    setEmployers(res || []);
  };

  /* -----------------------------
      Status Count
  ----------------------------- */
  const activeCount = employers.filter((e) => e.isActive === true).length;
  const inactiveCount = employers.filter((e) => e.isActive === false).length;

  const chartdata = [
    { label: "Active", value: activeCount, color: "#4CAF50" },
    { label: "Inactive", value: inactiveCount, color: "#F44336" },
  ];

  /* -----------------------------
      Build all charts from ONE helper
  ----------------------------- */
  const charts = buildEmployerCharts(employers);

  console.log("Company Size Chart:", charts.companySize);

  console.log(
    "All company sizes:",
    employers.map((e) => e.companySize),
  );

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Status Pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCommon
            title="Employer Status"
            data={chartdata}
            centerValue={activeCount + inactiveCount}
            centerLabel="Total Employers"
            showGap
          />
        </Grid>

        {/* Industry Pie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCommon
            title="Industry Distribution"
            data={charts.industryPie}
            centerValue={employers.length}
            centerLabel="Companies"
            showGap={false}
          />
        </Grid>

        {/* Company Size Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CommonGroupedBarChart
            title="Employers by Company Size"
            axisLabel="Company Size"
            data={charts.companySize}
            orientation="vertical"
            labelKey="label"
            valueKey="count"
            valueLabel="Count"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
