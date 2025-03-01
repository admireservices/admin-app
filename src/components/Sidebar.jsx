import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";
import {
  HomeOutlined,
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  ReceiptLongOutlined,
  ExpandLess,
  ExpandMore,
  KitchenOutlined,
  LiquorOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (index) => {
    setOpenDropdown((prevOpen) => (prevOpen === index ? null : index));
  };

  const sidebar = [
    { title: "Home", icon: <HomeOutlined />, route: "/home" },
    {
      title: "Recipe Inventory",
      icon: <ReceiptLongOutlined />,
      subcategories: [
        { name: "Recipe Summary", icon: <KitchenOutlined />, route: "/recipesummary" },
        { name: "Food Recipe", icon: <KitchenOutlined />, route: "/foodrecipe" },
        { name: "Rate Master", icon: <KitchenOutlined />, route: "/ratemasterdata" },
        { name: "Base Recipe", icon: <KitchenOutlined />, route: "/baserecipe" },
      ],
    },
  
    {
      title: "Recipe Data Entry",
      icon: <ReceiptLongOutlined />,
      subcategories: [
        { name: "Recipe Summary Entry", icon: <KitchenOutlined />, route: "/summaryentry" },
        { name: "Food Recipe Entry", icon: <KitchenOutlined />, route: "/foodrecipeentry" },
        { name: "Rate Master Entry", icon: <KitchenOutlined />, route: "/ratemasterentry" },
        { name: "Base Recipe Entry", icon: <KitchenOutlined />, route: "/baserecipeentry" },
        { name: "Menu Engineering Entry", icon: <KitchenOutlined />, route: "/menuengentry" },
      ],
    },
    //{ title: "Rate Master", icon: <DescriptionOutlined />, route: "/ratemaster" },
    { title: "Restaurant", icon: <DescriptionOutlined />, route: "/restaurant" },
    { title: "Menu Engg Report", icon: <DescriptionOutlined />, route: "/menueng" },
    { title: "predefined", icon: <DescriptionOutlined />, route: "/comingsoon" },
    { title: "Access", icon: <DescriptionOutlined />, route: "/access" },
    { title: "Logout", icon: <SettingsOutlined />, route: "/logout" },
    {/*}
    {
      title: "Bar Inventory",
      icon: <Inventory2Outlined />,
      subcategories: [
        { name: "Main Bar", icon: <LiquorOutlined />, route: "/comingsoon" },
        { name: "Storeroom", icon: <LiquorOutlined />, route: "/comingsoon" },
      ],
    },
    */}
  ];

  return (
    <List>
      {sidebar.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                item.subcategories ? handleDropdownToggle(index) : navigate(item.route)
              }
              selected={!item.subcategories && currentPage === item.route}
              sx={{ mb: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
              {item.subcategories && (openDropdown === index ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          {item.subcategories && (
            <Collapse in={openDropdown === index} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subcategories.map((sub, subIndex) => (
                  <ListItemButton
                    key={subIndex}
                    sx={{ pl: 4 }}
                    onClick={() => navigate(sub.route)}
                    selected={currentPage === sub.route}
                  >
                    <ListItemIcon>{sub.icon}</ListItemIcon>
                    <ListItemText primary={sub.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
}



{/*}
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
import "./css/sidebar.css";

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
      title: "Recipe Inventory",
      icon: <ReceiptLongOutlined fontSize="medium" color="primary" />,
      route: "/inventory",
      subcategories: [
        { name: "Recipe Summary", route: "/recipesummary" },
        { name: "Food Recipe", route: "/foodrecipe" },
        { name: "Rate Master", route: "/mocktails" },
        { name: "Base Recipe", route: "/mocktails" },
        
      ],
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
      title: "Recipe Data Entry",
      icon: <ReceiptLongOutlined fontSize="medium" color="primary" />,
      route: "/inventory",
      subcategories: [
        { name: "Recipe Summary entry", route: "/summaryentry" },
        { name: "Food Recipe entry", route: "/foodrecipeentry" },
        { name: "Rate Master", route: "/rate" },
        { name: "Base Recipe", route: "/baserecipe" },
        { name: "Menu Engineering report", route: "/mocktails" },
      ],
    },
    {
      title: "Reports",
      icon: <DescriptionOutlined fontSize="medium" color="primary" />,
      route: "/reports",
    },
    {
      title: "Access",
      icon: <DescriptionOutlined fontSize="medium" color="primary" />,
      route: "/access",
    },
    {
      title: "Rate Master",
      icon: <SettingsOutlined fontSize="medium" color="primary" />,
      route: "/ratemaster",
    },
    {
      title: "Settings",
      icon: <SettingsOutlined fontSize="medium" color="primary" />,
      route: "/settings",
    },
    {
      title: "Logout",
      icon: <logoutOutlined fontSize="medium" color="primary" />,
      route: "/log",
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
          {/* Render Subcategories /}
          {item.subcategories &&
            openDropdown === index &&
            renderSubcategories(item.subcategories, item.route)}
        </React.Fragment>
      ))}
    </List>
  );
}
*/}