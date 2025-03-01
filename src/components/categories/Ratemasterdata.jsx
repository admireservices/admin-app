import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField,
} from "@mui/material";

export default function RateMasterData() {
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4040/api/cities")
      .then((response) => setCities(response.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const handleCitySelect = (event, newValue) => {
    setSelectedCity(newValue);
    setSelectedRestaurant(null);
    setData([]);
    if (newValue) {
      axios.get(`http://localhost:4040/api/restaurants?cityId=${newValue._id}`)
        .then((response) => setRestaurants(response.data))
        .catch((error) => console.error("Error fetching restaurants:", error));
    }
  };

  const handleRestaurantSelect = (event, newValue) => {
    setSelectedRestaurant(newValue);
    if (newValue) {
      fetchData(newValue._id);
    }
  };

  const fetchData = (restaurantId) => {
    setLoading(true);
    axios.get(`http://localhost:4040/api/ratemasterentry?restaurantId=${restaurantId}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Data</h2>
      
      {/* City Selection */}
      <Autocomplete
        options={cities}
        getOptionLabel={(option) => option.name}
        onChange={handleCitySelect}
        renderInput={(params) => <TextField {...params} label="Select City" />}
        sx={{ width: 300, marginBottom: "10px", margin: "auto" }}
      />
      
      {/* Restaurant Selection */}
      {selectedCity && (
        <Autocomplete
          options={restaurants}
          getOptionLabel={(option) => option.name}
          onChange={handleRestaurantSelect}
          renderInput={(params) => <TextField {...params} label="Select Restaurant" />}
          sx={{ width: 300, marginBottom: "20px", margin: "auto" }}
        />
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {/* Table */}
      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto", maxHeight: "500px", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow style={{ backgroundColor: "#8BC34A" }}>
              <TableCell><strong>System Item Name</strong></TableCell>
              <TableCell><strong>Recipe Item Name</strong></TableCell>
              <TableCell><strong>UNIT</strong></TableCell>
              <TableCell><strong>Purchase Rate</strong></TableCell>
              <TableCell><strong>Packing UOM</strong></TableCell>
              <TableCell><strong>Conversion</strong></TableCell>
              <TableCell><strong>Yield</strong></TableCell>
              <TableCell><strong>Yield Final Rate</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.systemItemName}</TableCell>
                <TableCell>{row.recipeItemName}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.purchaseRate}</TableCell>
                <TableCell>{row.packingUOM}</TableCell>
                <TableCell>{row.conversion}</TableCell>
                <TableCell>{row.yield}</TableCell>
                <TableCell>{row.yieldFinalRate}</TableCell>
                <TableCell>{row.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}


{/*}
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function RateMasterData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4040/api/ratemasterentry") // Update with actual API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Data</h2>

      {/* Loading Indicator /}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Table /}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>System Item Name</strong></TableCell>
                <TableCell><strong>Recipe Item Name</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>Purchase Rate</strong></TableCell>
                <TableCell><strong>Packing UOM</strong></TableCell>
                <TableCell><strong>Conversion</strong></TableCell>
                <TableCell><strong>Yield</strong></TableCell>
                <TableCell><strong>Yield Final Rate</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.systemItemName}</TableCell>
                  <TableCell>{row.recipeItemName}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.purchaseRate}</TableCell>
                  <TableCell>{row.packingUOM}</TableCell>
                  <TableCell>{row.conversion}</TableCell>
                  <TableCell>{row.yield}</TableCell>
                  <TableCell>{row.yieldFinalRate}</TableCell>
                  <TableCell>{row.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
*/}