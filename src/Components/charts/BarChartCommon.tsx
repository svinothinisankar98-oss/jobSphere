import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

// ---------------- TYPES ----------------

type Props<T> = {
  title?: string; // chart heading
  axisLabel?: string; // category axis name
  data?: T[]; // array of objects
  labelKey: keyof T; // category field
  valueKey: keyof T; // numeric field
  valueLabel?: string; // numeric axis label (Count)
  barColor?: string;
  orientation?: "horizontal" | "vertical";
};

/* ---------------- COMPONENT ---------------- */

export default function CommonGroupedBarChart<T>({
  title,
  axisLabel,
  data,
  labelKey,
  valueKey,
  valueLabel = "Count",
  barColor = "#1976d2",
  orientation = "horizontal",
}: Props<T>) {
  const safeData = Array.isArray(data) ? data : [];
  const isVertical = orientation === "vertical";

  // labels
  const labels = useMemo(
    () => safeData.map((d: any) => String(d[labelKey] ?? "")),
    [safeData, labelKey]
  );

  // values
  const values = useMemo(
    () => safeData.map((d: any) => Number(d[valueKey] ?? 0)),
    [safeData, valueKey]
  );

  // max value
  const maxValue = useMemo(() => {
    if (!values.length) return 0;
    return Math.max(...values);
  }, [values]);

  // dynamic left space based on label length
  const dynamicLeft = useMemo(() => {
    if (!labels.length) return 80;
    const maxLength = Math.max(...labels.map((l) => l.length), 10);
    return Math.min(260, maxLength * 7);
  }, [labels]);

  // ---------------- AXES ----------------

  const numericAxis = {
    min: 0,
    max: maxValue,
    tickMinStep: 1,
    nice: false,
    domainLimit: "strict" as const,
    label: valueLabel,
  };

  const categoryAxis = {
    scaleType: "band" as const,
    data: labels,
    label: axisLabel,
    width: dynamicLeft,
    tickLabelStyle: { fontSize: 12 },
    valueFormatter: (value: string) =>
      value.length > 22 ? value.slice(0, 22) + "…" : value,
  };

  const xAxisConfig = isVertical ? [categoryAxis] : [numericAxis];
  const yAxisConfig = isVertical ? [numericAxis] : [categoryAxis];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {title && (
        <Typography variant="h6" mb={1.5} textAlign="center">
          {title}
        </Typography>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          "& .MuiChartsSurface-root": {
            width: "100% !important",
            height: "100% !important",
          },
        }}
      >
        <BarChart
          layout={isVertical ? "vertical" : "horizontal"}
          height={300}
          margin={{
            left: isVertical ? 60 : dynamicLeft + 20,
            right: 30,
            top: 30,
            bottom: isVertical ? 60 : 70,
          }}
          yAxis={yAxisConfig}
          xAxis={xAxisConfig}
          series={[
            {
              data: values,
              label: valueLabel,
              color: barColor,
            },
          ]}
        />
      </Box>
    </Box>
  );
}
