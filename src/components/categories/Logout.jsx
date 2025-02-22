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
