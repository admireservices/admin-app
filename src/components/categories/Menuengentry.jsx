import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import * as XLSX from "xlsx";

export default function MenuEngineeringEntry() {
  const [menuItems, setMenuItems] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    menuItem: "",
    sold: "",
    popularity: "",
    sellingPrice: "",
    menuItemClass: "",
  });

  useEffect(() => {
    fetchCities();
    fetchMenuItems();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch("http://localhost:4040/api/cities");
      const data = await response.json();
      setCityList(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const fetchRestaurants = async (cityId) => {
    try {
      const response = await fetch(`http://localhost:4040/api/restaurants?cityId=${cityId}`);
      const data = await response.json();
      setRestaurantList(data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4040/api/menu");
      const data = await response.json();

      if (Array.isArray(data)) {
        setMenuItems(data);
      } else {
        setMenuItems([]); // Ensure menuItems is an array even if data is unexpected
        console.error("Unexpected API response format", data);
      }
    } catch (err) {
      setError("Failed to fetch menu data");
      setMenuItems([]); // Avoid setting it to null
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedRestaurant || Object.values(formData).some((val) => val === "")) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4040/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cityId: selectedCity, restaurantId: selectedRestaurant }),
      });
      if (!response.ok) throw new Error("Failed to add menu item");
      const newItem = await response.json();
      setMenuItems([...menuItems, newItem]);
      setFormData({ menuItem: "", sold: "", popularity: "", sellingPrice: "", menuItemClass: "" });
    } catch (err) {
      setError("Error adding menu item");
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setMenuItems(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Menu Engineering Entry</h2>
      {error && <Alert severity="error">{error}</Alert>}

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <Select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); fetchRestaurants(e.target.value); }} displayEmpty>
          <MenuItem value="" disabled>Select City</MenuItem>
          {cityList.map((city) => (
            <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
          ))}
        </Select>

        <Select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)} displayEmpty disabled={!selectedCity}>
          <MenuItem value="" disabled>Select Restaurant</MenuItem>
          {restaurantList.map((restaurant) => (
            <MenuItem key={restaurant.id} value={restaurant.id}>{restaurant.name}</MenuItem>
          ))}
        </Select>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <TextField label="Menu Item" name="menuItem" value={formData.menuItem} onChange={handleChange} required />
        <TextField label="Sold (Month)" name="sold" type="number" value={formData.sold} onChange={handleChange} required />
        <TextField label="Popularity (%)" name="popularity" type="number" value={formData.popularity} onChange={handleChange} required />
        <TextField label="Selling Price ($)" name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} required />
        <TextField label="Menu Item Class" name="menuItemClass" value={formData.menuItemClass} onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? <CircularProgress size={24} /> : "Add Item"}</Button>
      </form>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ marginBottom: "20px" }} />

      <TableContainer component={Paper} sx={{ width: "95%", margin: "auto", marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#8BC34A", color: "white" }}>
              <TableCell><strong>Menu Item</strong></TableCell>
              <TableCell><strong>Sold (Month)</strong></TableCell>
              <TableCell><strong>Popularity%</strong></TableCell>
              <TableCell><strong>Selling Price ($)</strong></TableCell>
              <TableCell><strong>Menu Item Class</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(menuItems) && menuItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.menuItem}</TableCell>
                <TableCell>{item.sold}</TableCell>
                <TableCell>{item.popularity}</TableCell>
                <TableCell>{item.sellingPrice}</TableCell>
                <TableCell>{item.menuItemClass}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
