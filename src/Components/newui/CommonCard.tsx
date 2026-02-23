import { Card, Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

type Props = {
  title?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;   // allow parent styling (margin, width, height, etc.)
};

export default function CommonCard({ title, children, sx }: Props) {
  return (
    <Card
      sx={{
        height: 400, // default height (can be overridden)
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        p: 2,
        backgroundColor: "#fff",

        /* -------- Professional soft shadow -------- */
        boxShadow: `
          0px 1px 2px rgba(16, 24, 40, 0.04),
          0px 2px 6px rgba(16, 24, 40, 0.06),
          0px 8px 24px rgba(16, 24, 40, 0.08)
        `,

        /* -------- Hover lift effect -------- */
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `
            0px 4px 10px rgba(16, 24, 40, 0.08),
            0px 12px 28px rgba(16, 24, 40, 0.12)
          `,
        },

        /* -------- External override styles -------- */
        ...sx,
      }}
    >
      {/* Title */}
      {title && (
        <Typography variant="h6" fontWeight={600} mb={1}>
          {title}
        </Typography>
      )}

      {/* Chart / Content Area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0, // IMPORTANT for charts (prevents overflow)
        }}
      >
        {children}
      </Box>
    </Card>
  );
}