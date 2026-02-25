import { Card, Box, Typography, CircularProgress } from "@mui/material";

type Props = {
  title: string;   //label//
  value: number;    //main metric//
  percent: number;  //progress indicator//
  color: string;    //theme color of card//
  bg?: string;
};

export default function AnalyticsCard({
  title,
  value,
  percent,
  color,
  bg,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        px: 3,
        py: 2.2,
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 110,

        //  dynamic background
        background: bg || `${color}12`,

        border: `1px solid ${color}22`,
        boxShadow: "0 6px 18px rgba(16, 24, 40, 0.06)",

        transition: "all .2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 28px rgba(16, 24, 40, 0.10)",
        },
      }}
    >
      {/* LEFT SIDE */}
      <Box>
        <Typography
          sx={{
            fontSize: 14,
            color: "#6b7280",
            fontWeight: 500,
            mb: 0.8,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 0.3,
            color: "#111827",
          }}
        >
          {value}
        </Typography>
      </Box>

      {/* RIGHT PROGRESS */}
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* background ring */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={70}
          thickness={5}
          sx={{ color: "#e5eaf2" }}
        />

        {/* progress ring */}
        <CircularProgress
          variant="determinate"
          value={percent}
          size={70}
          thickness={5}
          sx={{
            color: color,
            position: "absolute",
            left: 0,
          }}
        />

        {/* center text */}
        <Typography
          sx={{
            position: "absolute",
            fontWeight: 700,
            fontSize: 14,
            color: color,
          }}
        >
          {percent}%
        </Typography>
      </Box>
    </Card>
  );
}
