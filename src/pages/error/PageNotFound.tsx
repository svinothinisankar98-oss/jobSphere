import { Box, Typography, Button, Divider } from "@mui/material";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f9fafb"
    >
      <Box
        textAlign="center"
        px={4}
        py={6}
        maxWidth={520}
        bgcolor="#ffffff"
        borderRadius={2}
        boxShadow="0 10px 30px rgba(0,0,0,0.08)"
      >
        {/* Icon */}
        <SentimentDissatisfiedOutlinedIcon
          sx={{ fontSize: 100, color: "#9e9e9e", mb: 2 }}
        />

        {/* 404 */}
        <Typography variant="h2" fontWeight={600}>
          404
        </Typography>

        {/* Title */}
        <Typography fontSize={18} mt={1} color="text.secondary">
          Page not found
        </Typography>

        {/* Description */}
        <Typography fontSize={14} color="#757575" mt={2}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Actions */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            startIcon={<HomeOutlinedIcon />}
            onClick={() => navigate("/", { replace: true })}
          >
            Home
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
