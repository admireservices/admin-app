import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
} from "@mui/material";
import {
  HomeOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  CardTravelOutlined,
  ExpandLess,
  ExpandMore,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const [selected, setSelected] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelectedComponent = (index) => {
    setSelected(index);
    setOpenDropdown(null); // Close any open dropdown when selecting another main item
  };

  const handleDropdownToggle = (index) => {
    setOpenDropdown((prevOpen) => (prevOpen === index ? null : index));
  };

  const sidebar = [
    {
      title: "Home",
      icon: <HomeOutlined fontSize="medium" color="primary" />,
      route: "/home",
    },
    {
      title: "Bar Inventory",
      icon: <Inventory2Outlined fontSize="medium" color="primary" />,
      route: "/bar-inventory",
      subcategories: [
        { name: "Main Bar", route: "/rootpage" },
        { name: "Storeroom", route: "/supplierinfo" },
      ],
    },
    {
      title: "Recipe Inventory",
      icon: <ReceiptLongOutlined fontSize="medium" color="primary" />,
      route: "/inventory",
      subcategories: [
        { name: "Food Recipes", route: "/cocktails" },
        { name: "Beverages Recipes", route: "/mocktails" },
      ],
    },
    {
      title: "Reports",
      icon: <DescriptionOutlined fontSize="medium" color="primary" />,
      route: "/reports",
    },
    {
      title: "Settings",
      icon: <SettingsOutlined fontSize="medium" color="primary" />,
      route: "/settings",
    },
  ];

  const renderSubcategories = (subcategories, parentRoute) => (
    <Collapse in={openDropdown !== null} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {subcategories.map((sub, subIndex) => (
          <ListItemButton
            key={subIndex}
            sx={{ pl: 4 }}
            selected={currentPage === sub.route}
            onClick={() => navigate(sub.route)}
          >
            <ListItemText
              primary={sub.name}
              primaryTypographyProps={{
                fontSize: "small",
                fontWeight: currentPage === sub.route ? "bold" : "inherit",
                color: currentPage === sub.route ? "primary.main" : "inherit",
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Collapse>
  );

  return (
    <List>
      {sidebar.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                item.subcategories
                  ? handleDropdownToggle(index)
                  : (handleSelectedComponent(index), navigate(item.route))
              }
              selected={
                !item.subcategories && currentPage === item.route
              }
              sx={{
                mb: 1,
                borderLeft: selected === index ? "4px solid" : "none",
                borderColor: "primary.main",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: "medium",
                  fontWeight: selected === index ? "bold" : "inherit",
                  color: selected === index ? "primary.main" : "inherit",
                }}
              />
              {item.subcategories &&
                (openDropdown === index ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          {/* Render Subcategories */}
          {item.subcategories &&
            openDropdown === index &&
            renderSubcategories(item.subcategories, item.route)}
        </React.Fragment>
      ))}
    </List>
  );
}