import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip";

/* ---------------- TYPES ---------------- */

type Props<T> = {
  title?: string;
  axisLabel?: string;
  data?: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  valueLabel?: string;
  barColor?: string;
  orientation?: "horizontal" | "vertical";
};

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ item, valueLabel }: any) => {
  if (!item) return null;

  return (
    <div
      style={{
        background: "#1e1e1e",
        color: "white",
        padding: "8px 12px",
        borderRadius: 6,
        fontSize: 13,
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ fontWeight: 600 }}>{item.label}</div>
      <div>
        {valueLabel}: {item.value}
      </div>
    </div>
  );
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

  const labels = useMemo(
    () => safeData.map((d: any) => String(d[labelKey] ?? "")),
    [safeData, labelKey]
  );

  const values = useMemo(
    () => safeData.map((d: any) => Number(d[valueKey] ?? 0)),
    [safeData, valueKey]
  );

  const maxValue = useMemo(() => {
    if (!values.length) return 0;
    return Math.max(...values);
  }, [values]);

  const dynamicLeft = useMemo(() => {
    if (!labels.length) return 80;
    const maxLength = Math.max(...labels.map((l) => l.length), 10);
    return Math.min(260, maxLength * 7);
  }, [labels]);

  const dynamicTop = Math.min(70, 20 + maxValue * 1.5);

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
    valueFormatter: (value: string) =>
      value.length > 22 ? value.slice(0, 22) + "…" : value,
    tickLabelStyle: { fontSize: 12 },
  };

  const xAxisConfig = isVertical ? [categoryAxis] : [numericAxis];
  const yAxisConfig = isVertical ? [numericAxis] : [categoryAxis];

  return (
    <Box sx={{ height: "100%" }}>
      {title && (
        <Typography variant="h6" mb={2} textAlign="center">
          {title}
        </Typography>
      )}

      <BarChart
        layout={isVertical ? "vertical" : "horizontal"}
        height={Math.max(320, labels.length * 45 + maxValue * 2)}
        margin={{
          left: dynamicLeft,
          right: 20,
          top: dynamicTop,
          bottom: 35,
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
        slots={{
          tooltip: (props: any) => (
            <ChartsTooltip {...props}>
              {(item: any) => (
                <CustomTooltip item={item} valueLabel={valueLabel} />
              )}
            </ChartsTooltip>
          ),
        }}
      />
    </Box>
  );
}