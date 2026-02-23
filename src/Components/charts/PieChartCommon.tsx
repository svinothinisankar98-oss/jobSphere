import { Typography, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

/* ---------- TYPES ---------- */

export type PieItem = {
  label: string;
  value: number;
};

type Props = {
  title?: string;
  data?: PieItem[];
  centerLabel?: string;
  centerValue?: number;
  height?: number;
  showGap?: boolean;
  colors?: string[];
};

/* ---------- COMPONENT ---------- */

export default function PieChartCommon({
  title,
  data,
  centerLabel,
  centerValue,
  showGap = true,
  height = 260,
  colors,
}: Props) {
  /* ---------- SAFE DATA ---------- */

  const validData = Array.isArray(data)
    ? data.filter((d) => d && d.value > 0)
    : [];

  const total = validData.reduce((a, b) => a + b.value, 0);

  const isDonut = centerValue !== undefined || centerLabel !== undefined;

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {/* TITLE */}
      {title && (
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 1.5, textAlign: "center" }}
        >
          {title}
        </Typography>
      )}

      {/* CHART CONTAINER */}
      <Box
        sx={{
          position: "relative",
          width: "90%",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* EMPTY STATE */}
        {total === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No data available
          </Typography>
        ) : (
          <PieChart
            height={height}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            series={[
              {
                innerRadius: isDonut ? 70 : 0,
                outerRadius: 110,
                paddingAngle: showGap ? 3 : 0,
                cornerRadius: 6,
                startAngle: -90,
                endAngle: 270,

                data: validData.map((item, i) => ({
                  id: i,
                  value: item.value,
                  label: item.label,
                })),
              },
            ]}
            colors={colors}
          />
        )}

        {/* CENTER TEXT */}
        {isDonut && total > 0 && (
          <Box
            sx={{
              position: "absolute",
              textAlign: "left",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                position: "absolute",
               
                width: 120, // = innerRadius * 2
                height: 120,
                transform: "translate(-80%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  // display: "flex",
                  // alignItems: "center", // <-- fix
                  // justifyContent: "center",
                  // gap: 1,
                  // lineHeight: 1,
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                <Box
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                  component="div"
                >
                  {centerValue ?? total}
                </Box>

                {centerLabel && (
                  <Box
                    component="div"
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    {centerLabel}
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
