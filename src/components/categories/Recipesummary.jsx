import React, { useState, useEffect } from "react";
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TextField } from "@mui/material";

export default function Recipesummary() {
  const [cities, setCities] = useState([]); // Stores city options
  const [outlets, setOutlets] = useState([]); // Stores outlets based on selected city
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [data, setData] = useState([
    { srNo: 1, recipeName: "TOM YUM TOFU", costPrice: 588 },
    { srNo: 2, recipeName: "TOM YUM CHICKEN", costPrice: 788 },
  ]);

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = (index) => {
    setEditIndex(null);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    setData(updatedData);
  };

// Fetch cities from backend
useEffect(() => {
  const fetchCities = async () => {
    try {
      const response = await axios.get("/api/cities"); // Adjust API endpoint
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  fetchCities();
}, []);

// Fetch outlets based on selected city
useEffect(() => {
  if (selectedCity) {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get(`/api/outlets?city=${selectedCity}`);
        setOutlets(response.data);
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };
    fetchOutlets();
  } else {
    setOutlets([]);
  }
}, [selectedCity]);

  return (
    <div style={{ padding: "20px" }}>
       {/* Dropdown Menus */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {/* City Dropdown */}
        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          displayEmpty
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Select City</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.name}>
              {city.name}
            </MenuItem>
          ))}
        </Select>

        {/* Outlet Dropdown */}
        <Select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          displayEmpty
          sx={{ minWidth: 150 }}
          disabled={!selectedCity} // Disable if no city is selected
        >
          <MenuItem value="">Select Outlet</MenuItem>
          {outlets.map((outlet) => (
            <MenuItem key={outlet.id} value={outlet.name}>
              {outlet.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Table */}
      <TableContainer component={Paper} sx={{ width: "80%", margin: "auto", backgroundColor: "#e0e0e0" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>SR NO</strong></TableCell>
              <TableCell><strong>RECIPE NAME</strong></TableCell>
              <TableCell><strong>COST PRICE</strong></TableCell>
              <TableCell><strong>ACTION</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.srNo}</TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      value={row.recipeName}
                      onChange={(e) => handleChange(index, "recipeName", e.target.value)}
                    />
                  ) : (
                    row.recipeName
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      type="number"
                      value={row.costPrice}
                      onChange={(e) => handleChange(index, "costPrice", e.target.value)}
                    />
                  ) : (
                    row.costPrice
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === index ? (
                    <Button variant="contained" color="success" onClick={() => handleSave(index)}>Save</Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
