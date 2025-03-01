import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Box, Grid } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

export default function RootComponent() {
  const location = useLocation();

  // Hide Navbar & Sidebar on Login Page
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Box>
        <Grid container spacing={0}>
          {!isLoginPage && (
            <Grid item md={2} sm={0}>
              <Sidebar />
            </Grid>
          )}
          <Grid item md={isLoginPage ? 12 : 10}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}



{/*}
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
*/}
