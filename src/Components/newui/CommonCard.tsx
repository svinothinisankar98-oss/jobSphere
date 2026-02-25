import { Card, Box, Typography, IconButton } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";
import { downloadChartImage } from "../../utils/downloadChart";
import DownloadIcon from "@mui/icons-material/Download";
import { useRef } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export default function CommonCard({ title, children, sx }: Props) {

  // ✅ CREATE REF HERE
  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        p: 2,
        backgroundColor: "#fff",

        boxShadow: `
          0px 1px 2px rgba(16, 24, 40, 0.04),
          0px 2px 6px rgba(16, 24, 40, 0.06),
          0px 8px 24px rgba(16, 24, 40, 0.08)
        `,

        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `
            0px 4px 10px rgba(16, 24, 40, 0.08),
            0px 12px 28px rgba(16, 24, 40, 0.12)
          `,
        },

        ...sx,
      }}
    >
      {/* Title + Download icon row */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {title && (
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        )}

        <IconButton
          onClick={() => {
            if (chartRef.current) {
              downloadChartImage(
                chartRef.current,
                (title ?? "chart").replaceAll(" ", "_")
              );
            }
          }}
        >
          <DownloadIcon />
        </IconButton>
      </Box>

      {/* Chart / Content Area */}
      <Box
        ref={chartRef}
        sx={{
          flex: 1,
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </Card>
  );
}