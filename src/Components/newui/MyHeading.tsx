import { Typography, Box } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
  center?: boolean;
  maxWidth?: number;
};

const MyHeading = ({ title, subtitle, center,  }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: center ? "center" : "left",
        mb: 3,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        sx={{
          whiteSpace: "normal",
          wordBreak: "normal",
          overflowWrap: "break-word",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 1,
            whiteSpace: "normal",
            wordBreak: "normal",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default MyHeading;
