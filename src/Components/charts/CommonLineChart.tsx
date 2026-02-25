import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

// line series types//

export type LineSeries<T> = {
  label: string;
  dataKey: keyof T;
};

type Props<T> = {
  title?: string;
  data?: T[];
  xKey: keyof T;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  series: LineSeries<T>[];
  showGrid?: boolean;
};
//component//

export default function CommonLineChart<T>({
  title,
  data,
  xKey,
  xLabel,
  yLabel = "Count",
  height = 350,
  series,
  showGrid = true,
}: Props<T>) {


  //Data Preparation Logic//
  
  const safeData = Array.isArray(data) ? data : [];

  //x axis labels//

  const xLabels = safeData.map((d: any) => String(d?.[xKey] ?? ""));

 //series//
  const chartSeries = series.map((s) => ({
    label: s.label,
    data: safeData.map((d: any) => Number(d?.[s.dataKey] ?? 0)),
    showMark: true,
    curve: "monotoneX" as const,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <Typography variant="h6" mb={2} textAlign="center">
          {title}
        </Typography>
      )}

    
      <Box
        sx={{
          width: "100%",
         
        }}
      >
        <LineChart
          height={height}
          xAxis={[                          // xaxis //
            {
              scaleType: "point",
              data: xLabels,
              label: xLabel,
              tickLabelStyle: { fontSize: 12 },
            },
          ]}
          yAxis={[                           //y axis//
            {
              label: yLabel,
              min: 0,
              tickLabelStyle: { fontSize: 12 },
            },
          ]}
          series={chartSeries} 
          grid={{ horizontal: showGrid }}          //Toggle horizontal lines//
          margin={{ left: 60, right: 20, top : 20, bottom: 60 }} //Margin Fix//
          sx={{
            "& .MuiChartsAxis-bottom .MuiChartsAxis-label": {
              transform: "translateY(10px)", //  visible
            },
            "& .MuiMarkElement-root": {
              r: 5,
              strokeWidth: 2,
            },
            "& .MuiLineElement-root": {
              strokeWidth: 3,
            },
          }}
        />
      </Box>
    </Box>
  );
}