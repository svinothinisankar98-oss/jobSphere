import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  height?: number;
};

export default function BaseChart({ title, children, height = 320 }: Props) {
  return (
    <Card sx={{ height }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>

        <div style={{ width: "100%", height: height - 80 }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}