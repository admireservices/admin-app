import React from "react";
import Navbar from "./Navbar"; // Adjust the path as needed
import Sidebar from "./Sidebar"; // Adjust the path as needed
import { Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function RootComponent() {
  return (
    <>
      <Navbar />
      <Box>
        <Grid container spacing={0}>
          <Grid item md={2} sm={0}>
            <Sidebar />
          </Grid>
          <Grid item md={10}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
