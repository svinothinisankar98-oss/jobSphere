import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";


export default function ErrorPage({ error, resetErrorBoundary }: any) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ebebed, #764ba2)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          animation: "fadeIn 0.6s ease",
        }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 80, color: "error.main", mb: 2 }}
        />

        <Typography variant="h4" fontWeight={700}>
          Oops!
        </Typography>

        <Typography mt={1} color="text.secondary">
          Something went wrong
        </Typography>

        <Typography mt={2} fontSize={14}>
          {error?.message || "Unexpected error occurred"}
        </Typography>
<Button
 
  variant="contained"
  sx={{ mt: 4, py: 1.3, borderRadius: 3 }}
  onClick={() => {
    resetErrorBoundary();  
    navigate("/");         
  }}
>
  Go Back Home
</Button>

      </Paper>

      <style>
        {`
          @keyframes fadeIn {
            from { transform: scale(0.9); opacity: 0 }
            to { transform: scale(1); opacity: 1 }
          }
        `}
      </style>
    </Box>
  );
}
