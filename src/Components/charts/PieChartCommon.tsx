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
  showLabel?: boolean; // 🔥 control slice label
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
  showLabel = false,
}: Props) {
  /* ---------- SAFE DATA ---------- */

  const validData = Array.isArray(data)
    ? data.filter((d) => d && d.value > 0)
    : [];

  const total = validData.reduce((a, b) => a + b.value, 0);

  const isDonut = centerValue !== undefined || centerLabel !== undefined;

  /* ---------- DYNAMIC RADIUS ---------- */

  const INNER_RADIUS = isDonut ? 90 : 0;
  const OUTER_RADIUS = 130;

  // exact middle of arc thickness
  const ARC_CENTER_PERCENT =
    INNER_RADIUS === 0
      ? 60
      : ((INNER_RADIUS + OUTER_RADIUS) / 2 / OUTER_RADIUS) * 100;

  return (
    <Box sx={{ width: "100%" }}>
      {/* TITLE */}
      {title && (
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 1.5, textAlign: "left" }}
        >
          {title}
        </Typography>
      )}

      {/* LAYOUT */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* ================= PIE AREA ================= */}
        <Box
          sx={{
            position: "relative",
            width: 300,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {total === 0 ? (
            <Typography color="text.secondary" variant="body2">
              No data available
            </Typography>
          ) : (
            <PieChart
              height={height}
              sx={{
                [`& .MuiChartsArcLabel-root`]: {
                  fill: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  whiteSpace: "pre-line", // allow multi-line label
                },
              }}
              series={[
                {
                  innerRadius: INNER_RADIUS,
                  outerRadius: OUTER_RADIUS,
                  paddingAngle: showGap ? 3 : 0,
                  cornerRadius: 6,
                  startAngle: -90,
                  endAngle: 270,

                  /* 🔥 LABEL CONTROL */
                 arcLabel: (item) =>
  showLabel ? `${item.value}` : "",

                  arcLabelMinAngle: 10,
                  arcLabelRadius: `${ARC_CENTER_PERCENT}%`,

                  data: validData.map((item, i) => ({
                    id: i,
                    value: item.value,
                    label: item.label,
                  })),
                },
              ]}
              colors={colors}
              slots={{ legend: () => null }}
            />
          )}

          {/* CENTER TEXT (DONUT ONLY) */}
          {isDonut && total > 0 && (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -60%)",
                pointerEvents: "none",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {centerValue ?? total}
              </Typography>

              {centerLabel && (
                <Typography variant="body2" color="text.secondary">
                  {centerLabel}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* ================= LEGEND AREA ================= */}
        <Box
          sx={{
            flex: 1,
            maxHeight: height,
            overflowY: "auto",
            pr: 1,
          }}
        >
          {validData.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: colors?.[i],
                  flexShrink: 0,
                }}
              />

              <Typography variant="body2">
                {item.label} ({item.value})
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}