import { Box, Typography, Button } from "@mui/material";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      sx={{ color: "#9e9e9e" }}
    >
      <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 120, mb: 2 }} />

      <Typography variant="h2" fontWeight={500}>
        404
      </Typography>

      <Typography fontSize={18} mt={1}>
        Page not found
      </Typography>

      

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={() => navigate("/")}
      >
        Go back home
      </Button>
    </Box>
  );
}
