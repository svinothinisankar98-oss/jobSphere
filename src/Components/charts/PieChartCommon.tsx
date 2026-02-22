import { Typography, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

export type PieItem = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  title?: string;
  data: PieItem[];
  centerLabel?: string;  //text inside donut
  centerValue?: number;  //number inside donut
  height?: number;
  showGap?: boolean;      //gap between slice//
};

export default function PieChartCommon({
  title,
  data,
  centerLabel,
  centerValue,
  showGap = true,
  height=260 ,
}: Props) {

  //filtering invalid data//
  const validData = data.filter((d) => d.value > 0);

  return (

     /*title rendering*/
    <Box sx={{ height: "100%" }}>       
      {title && (
        <Typography variant="h6" gutterBottom textAlign="center">
          {title}
        </Typography>
      )}

      {/*chart*/}
      <Box
        sx={{
          position: "relative",
          width: 290,
          height: height,
          mx: "auto",
        }}
      >
       {/* pie chart configuration */}
        <PieChart
          width={260}
          height={height}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          series={[
            {
              innerRadius: 75,   //makes donut hole//
              outerRadius: 110,  //overall size//
              paddingAngle: showGap ? 2 : 0,   //gap between slices// modern chart like gap(true false//
              startAngle: showGap ? -90 : 0,   //charts starts//
              endAngle: showGap ? 270 : 360,   //charts ends//
              data: validData.map((item, i) => ({      //data mapping//
                id: i,
                value: item.value,
                label: item.label,
                color: item.color,
              })),
            },
          ]}
        />

        {/* center text*/}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <Box textAlign="center">
            {centerValue !== undefined && (
              <Typography variant="h4" fontWeight={700} lineHeight={1}>
                {centerValue}
              </Typography>
            )}

            {centerLabel && (
              <Typography variant="caption" color="text.secondary">
                {centerLabel}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}