import { Grid, Paper, Typography } from "@mui/material";
import { HOTKEYS } from "../config/hotkeys";

const  ShortCutSheet = () => {
  return (
    <Grid container spacing={2}>
      {HOTKEYS.map((item, index) => (
        <Grid size={{xs:12}}  key={index}>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 1.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: "monospace",
                background: "#f4f4f4",
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {item.keys}
            </Typography>

            <Typography>{item.action}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShortCutSheet;