import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/ExitToApp";

export default function SidebarLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session (Remove authentication data)
    localStorage.removeItem("userToken");
    sessionStorage.clear();

    // Redirect to login & prevent back navigation
    navigate("/login", { replace: true });

    // Block back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height to center the button
      }}
    >
      <Button
        onClick={handleLogout}
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        sx={{
          padding: "12px 30px",
          fontSize: "18px",
          borderRadius: "30px",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#d32f2f",
            transform: "scale(1.05)",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}




{/*}
import React from "react";
import { useNavigate } from "react-router-dom";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function SidebarLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session (Remove authentication data)
    localStorage.removeItem("userToken"); // Adjust based on your authentication
    sessionStorage.clear();

    // Redirect to login & prevent back navigation
    navigate("/login", { replace: true });

    // Block back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  return (
    <ListItemButton onClick={handleLogout}>
      <ListItemIcon>
        <SettingsOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  );
}



{/*}
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (localStorage or sessionStorage)
    localStorage.removeItem("userToken"); // Adjust key based on your auth system
    sessionStorage.clear();

    // Redirect to login page & prevent going back
    navigate("/login", { replace: true });

    // Prevent Back Navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<ExitToAppIcon />}
      onClick={handleLogout}
      fullWidth
    >
      Logout
    </Button>
  );
}
*/}
