import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

/* ================= TYPES ================= */

type SeriesConfig<T> = {
  label: string;
  dataKey: keyof T;
  color?: string; // show value on bar
  barLabelPlacement?: string;
};

type Props<T extends Record<string, any>> = {
  title?: string;
  data?: T[];
  labelKey: keyof T;
  axisLabel?: string;
  yLabel?: string;
  series: SeriesConfig<T>[];
  orientation?: "horizontal" | "vertical";
  height?: number;
  showLabel?: boolean;
};

/* ================= COMPONENT ================= */

export default function CommonBarChart<T extends Record<string, any>>({
  title,
  data = [],
  labelKey,
  axisLabel,
  yLabel = "Count",
  series,
  orientation = "vertical",
  height = 380,
  showLabel,
}: Props<T>) {
  const isVertical = orientation === "vertical";

  //labels//
  const labels = data.map((d) => String(d[labelKey] ?? ""));

  //series//
  const chartSeries: any[] = series.map((s) => {
    const base = {
      label: s.label,
      color: s.color,
      data: data.map((d) => Number(d[s.dataKey] ?? 0)),
      barLabelPlacement: "outside",
    };

    // attach label only when needed
    if (showLabel) {
      return {
        ...base,
        barLabel: (item: any) => (item.value > 0 ? item.value : ""),
      };
    }

    return base;
  });

  //scale//
  const maxValueRaw = Math.max(0, ...chartSeries.flatMap((s) => s.data));

  const maxValue = Math.ceil(maxValueRaw * 1.2);

  const numericAxis = {
    min: 0,
    max: maxValue,
    tickMinStep: 1,
    label: yLabel,
  };

  const categoryAxis = {
    scaleType: "band" as const,
    data: labels,
    label: axisLabel,
  };

  const xAxis = isVertical ? [categoryAxis] : [numericAxis];
  const yAxis = isVertical ? [numericAxis] : [categoryAxis];

  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <Typography variant="h6" textAlign="center" mb={1.5}>
          {title}
        </Typography>
      )}

      <BarChart
        height={height}
        layout={isVertical ? "vertical" : "horizontal"}
        xAxis={xAxis}
        yAxis={yAxis}
        series={chartSeries}
        // barLabelPlacement="center"
        slotProps={
          showLabel
            ? {
                barLabel: {
                  style: {
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "#111827",
                    transform: "translateY(-9px)",
                  },
                },
              }
            : undefined
        }
      />
    </Box>
  );
}
