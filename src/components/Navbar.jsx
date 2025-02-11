import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
  
} from "@mui/material";
import { useState } from "react";

export default function Navbar() {
  

  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar sx={{ padding: 2 }} position="static">
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/home"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  ADMIRE SERVICES ADMIN
                </Typography>

              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
