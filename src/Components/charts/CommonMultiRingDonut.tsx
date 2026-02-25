import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

export type DonutItem = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  data: DonutItem[];
  centerLabel?: string;
  height?: number;
  onSliceClick?: (item: DonutItem) => void;
};

export default function UserDistributionDonut({
  data,
  centerLabel = "Total Users",
  height = 420,
  onSliceClick,
}: Props) {
  const total = data.reduce((a, b) => a + b.value, 0);

  if (!total) return <Typography>No data</Typography>;

  const getPercent = (value: number) => (value / total) * 100;

  return (
    <Box position="relative" width={500} height={height}>
      <PieChart
        height={height}
        sx={{ "& path": { cursor: "pointer" } }}
        series={[
          {
            id: "users",
            data: data.map((d, i) => ({
              id: i,
              value: d.value,
              label: d.label,
              color: d.color,
            })),
            innerRadius: 60,
            outerRadius: 120,
            arcLabel: (item) => `${getPercent(item.value).toFixed(2)}%`,
            arcLabelMinAngle: 10,
          },
        ]}
        slots={{ legend: () => null }}

        onItemClick={(e, params) => {
          const clicked = data[params.dataIndex];
          onSliceClick?.(clicked);
        }}
      />

      {/* CENTER TOTAL */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          pointerEvents: "none",
        }}
      >
        <Typography fontSize={14} color="text.secondary">
          {centerLabel}
        </Typography>

        <Typography fontSize={26} fontWeight={700}>
          {total}
        </Typography>
      </Box>

      {/* SIDE LEGEND WITH COUNT */}
      <Box mt={2}>
        {data.map((d, i) => (
          <Box key={i} display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box width={10} height={10} borderRadius="50%" bgcolor={d.color} />
            <Typography variant="body2">
              {d.label} — {d.value} ({getPercent(d.value).toFixed(1)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}