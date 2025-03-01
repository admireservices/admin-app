import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function MenuEngineering() {
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define threshold values for categorization
  const profitThreshold = 50; // Example value, adjust as needed
  const popularityThreshold = 30; // Example value, adjust as needed

  // Fetch cities from backend
  useEffect(() => {
    fetch("http://localhost:4040/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(() => setError("Failed to fetch cities"));
  }, []);

  // Fetch restaurants when city changes
  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:4040/api/restaurants?city=${selectedCity}`)
        .then((res) => res.json())
        .then((data) => setRestaurants(data))
        .catch(() => setError("Failed to fetch restaurants"));
    }
  }, [selectedCity]);

  // Fetch menu data when restaurant changes
  useEffect(() => {
    if (selectedRestaurant) {
      setLoading(true);
      fetch(`http://localhost:4040/api/menu?restaurant=${selectedRestaurant}`)
        .then((res) => res.json())
        .then((data) => {
          const updatedData = data.map((item) => {
            const profit = item.sellingPrice - item.costPrice;
            const totalCost = item.costPrice * item.sold;
            const totalRevenue = item.sellingPrice * item.sold;
            const costPercentage = totalRevenue !== 0 ? (totalCost / totalRevenue) * 100 : 0;
            const totalProfit = totalRevenue - totalCost;

            // Calculate Profit Category
            const profitCategory = profit < profitThreshold ? "Low" : "High";

            // Calculate Popularity Category
            const popularityCategory = item.popularity < popularityThreshold ? "Low" : "High";

            return {
              ...item,
              profit,
              totalCost,
              totalRevenue,
              costPercentage,
              totalProfit,
              profitCategory,
              popularityCategory,
            };
          });

          setMenuData(updatedData);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch menu data");
          setLoading(false);
        });
    }
  }, [selectedRestaurant]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Menu Engineering</h2>

      {/* Error Handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Dropdown Filters */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
        <FormControl style={{ minWidth: 150 }}>
          <InputLabel>Select City</InputLabel>
          <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map((city) => (
              <MenuItem key={city._id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Select Restaurant</InputLabel>
          <Select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)}>
            {restaurants.map((restaurant) => (
              <MenuItem key={restaurant._id} value={restaurant.name}>
                {restaurant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Display Loading Spinner */}
      {loading && <CircularProgress />}

      {/* Table Structure */}
      <TableContainer component={Paper} sx={{ width: "95%", margin: "auto", marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#8BC34A", color: "white" }}>
              <TableCell><strong>Menu Item</strong></TableCell>
              <TableCell><strong>Sold (Month)</strong></TableCell>
              <TableCell><strong>Popularity%</strong></TableCell>
              <TableCell><strong>Cost Price</strong></TableCell>
              <TableCell><strong>Selling Price</strong></TableCell>
              <TableCell><strong>Profit</strong></TableCell>
              <TableCell><strong>Total Cost</strong></TableCell>
              <TableCell><strong>Total Revenue</strong></TableCell>
              <TableCell><strong>Cost%</strong></TableCell>
              <TableCell><strong>Total Profit</strong></TableCell>
              <TableCell><strong>Profit Category</strong></TableCell>
              <TableCell><strong>Popularity Category</strong></TableCell>
              <TableCell><strong>Menu Item Class</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuData.length > 0 ? (
              menuData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.menuItem}</TableCell>
                  <TableCell>{item.sold}</TableCell>
                  <TableCell>{item.popularity}%</TableCell>
                  <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                  <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>${item.profit.toFixed(2)}</TableCell>
                  <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                  <TableCell>${item.totalRevenue.toFixed(2)}</TableCell>
                  <TableCell>{item.costPercentage.toFixed(2)}%</TableCell>
                  <TableCell>${item.totalProfit.toFixed(2)}</TableCell>
                  <TableCell>{item.profitCategory}</TableCell>
                  <TableCell>{item.popularityCategory}</TableCell>
                  <TableCell>{item.menuItemClass}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} style={{ textAlign: "center", color: "#999" }}>
                  Select a city and restaurant to view data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}




{/*}
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function MenuEngineering() {
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities from backend
  useEffect(() => {
    fetch("http://localhost:4040/api/restaurants")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(() => setError("Failed to fetch cities"));
  }, []);

  // Fetch restaurants when city changes
  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:4040/api/restaurants?city=${selectedCity}`)
        .then((res) => res.json())
        .then((data) => setRestaurants(data))
        .catch(() => setError("Failed to fetch restaurants"));
    }
  }, [selectedCity]);

  // Fetch menu data when restaurant changes
  useEffect(() => {
    if (selectedRestaurant) {
      setLoading(true);
      fetch(`http://localhost:4040/api/menu?restaurant=${selectedRestaurant}`)
        .then((res) => res.json())
        .then((data) => {
          setMenuData(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch menu data");
          setLoading(false);
        });
    }
  }, [selectedRestaurant]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Menu Engineering</h2>

      {/* Error Handling /}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Dropdown Filters /}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
        <FormControl style={{ minWidth: 150 }}>
          <InputLabel>Select City</InputLabel>
          <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map((city) => (
              <MenuItem key={city._id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Select Restaurant</InputLabel>
          <Select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)}>
            {restaurants.map((restaurant) => (
              <MenuItem key={restaurant._id} value={restaurant.name}>
                {restaurant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Display Loading Spinner /}
      {loading && <CircularProgress />}

      {/* Table Structure /}
      <TableContainer component={Paper} sx={{ width: "95%", margin: "auto", marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#8BC34A", color: "white" }}>
              <TableCell><strong>Menu Item</strong></TableCell>
              <TableCell><strong>Sold (Month)</strong></TableCell>
              <TableCell><strong>Popularity%</strong></TableCell>
              <TableCell><strong>Item Cost Price</strong></TableCell>
              <TableCell><strong>Item Selling Price</strong></TableCell>
              <TableCell><strong>Item Profit</strong></TableCell>
              <TableCell><strong>Total Cost</strong></TableCell>
              <TableCell><strong>Total Revenue</strong></TableCell>
              <TableCell><strong>Cost%</strong></TableCell>
              <TableCell><strong>Total Profit</strong></TableCell>
              <TableCell><strong>Profit Category</strong></TableCell>
              <TableCell><strong>Popularity Category</strong></TableCell>
              <TableCell><strong>Menu Item Class</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuData.length > 0 ? (
              menuData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.menuItem}</TableCell>
                  <TableCell>{item.sold}</TableCell>
                  <TableCell>{item.popularity}%</TableCell>
                  <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                  <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>${item.profit.toFixed(2)}</TableCell>
                  <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                  <TableCell>${item.totalRevenue.toFixed(2)}</TableCell>
                  <TableCell>{item.costPercentage.toFixed(2)}%</TableCell>
                  <TableCell>${item.totalProfit.toFixed(2)}</TableCell>
                  <TableCell>{item.profitCategory}</TableCell>
                  <TableCell>{item.popularityCategory}</TableCell>
                  <TableCell>{item.menuItemClass}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} style={{ textAlign: "center", color: "#999" }}>
                  Select a city and restaurant to view data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
*/}
