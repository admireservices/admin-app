import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function Summaryrecipe() {
  const [predefinedData, setPredefinedData] = useState([]);


  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [data, setData] = useState([]);

  // Fetch all data from /api/predefined
  useEffect(() => {
    const fetchPredefinedData = async () => {
      try {
        const response = await axios.get("http://localhost:4040/api/predefined");
        setPredefinedData(response.data);
      } catch (error) {
        console.error("Error fetching predefined data:", error);
      }
    };
    fetchPredefinedData();
  }, []);

  // Filtered Outlets
  const filteredOutlets = predefinedData
    .filter((item) => item.city === selectedCity)
    .flatMap((item) => item.outlets);

  // Filtered Categories
  const filteredCategories = filteredOutlets
    .filter((outlet) => outlet.name === selectedOutlet)
    .flatMap((outlet) => outlet.categories);

  // Fetch Recipes when all filters are selected
  useEffect(() => {
    if (selectedCity && selectedOutlet && selectedCategory) {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4040/api/fooditems?city=${selectedCity}&outlet=${selectedOutlet}&category=${selectedCategory}`
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };
      fetchRecipes();
    }
  }, [selectedCity, selectedOutlet, selectedCategory]);

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

  return (
    <div style={{ padding: "20px" }}>
      {/* Dropdown Menus */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {/* City Dropdown */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedOutlet("");
              setSelectedCategory("");
            }}
          >
            <MenuItem value="">Select City</MenuItem>
            {predefinedData.map((item, index) => (
              <MenuItem key={index} value={item.city}>
                {item.city}
              </MenuItem>
            ))}

          </Select>
        </FormControl>

        {/* Outlet Dropdown */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Outlet</InputLabel>
          <Select
            value={selectedOutlet}
            onChange={(e) => {
              setSelectedOutlet(e.target.value);
              setSelectedCategory("");
            }}
            disabled={!selectedCity}
          >
            <MenuItem value="">Select Outlet</MenuItem>
            {filteredOutlets.map((outlet, index) => (
              <MenuItem key={index} value={outlet.name}>
                {outlet.name}
              </MenuItem>
            ))}

          </Select>
        </FormControl>

        {/* Category Dropdown */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedOutlet}
          >
            <MenuItem value="">Select Category</MenuItem>
            {filteredCategories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
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
                <TableCell>{index + 1}</TableCell>
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
                    <Button variant="contained" color="success" onClick={() => handleSave(index)}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
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




{/*}
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function RecipeSummary() {
  const [cities, setCities] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [data, setData] = useState([]);

  // Fetch Cities from Backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:4040/api/predefined");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch Outlets when City is selected
  useEffect(() => {
    if (selectedCity) {
      const fetchOutlets = async () => {
        try {
          const response = await axios.get(`http://localhost:4040/api/predefined?city=${selectedCity}`);
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

  // Fetch Categories when Outlet is selected
  useEffect(() => {
    if (selectedOutlet) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`http://localhost:4040/api/predefined?outlet=${selectedOutlet}`);
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [selectedOutlet]);

  // Fetch Recipes when all filters are selected
  useEffect(() => {
    if (selectedCity && selectedOutlet && selectedCategory) {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4040/api/fooditems?city=${selectedCity}&outlet=${selectedOutlet}&category=${selectedCategory}`
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };
      fetchRecipes();
    }
  }, [selectedCity, selectedOutlet, selectedCategory]);

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = (index) => {
    // Here you can add API call to save the updated data
    setEditIndex(null);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    setData(updatedData);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Dropdown Menus /}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {/* City Dropdown /}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedOutlet("");
              setSelectedCategory("");
            }}
          >
            <MenuItem value="">Select City</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Outlet Dropdown /}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Outlet</InputLabel>
          <Select
            value={selectedOutlet}
            onChange={(e) => {
              setSelectedOutlet(e.target.value);
              setSelectedCategory("");
            }}
            disabled={!selectedCity}
          >
            <MenuItem value="">Select Outlet</MenuItem>
            {outlets.map((outlet) => (
              <MenuItem key={outlet.id} value={outlet.name}>
                {outlet.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Category Dropdown /}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedOutlet}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Table /}
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
                <TableCell>{index + 1}</TableCell>
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
                    <Button variant="contained" color="success" onClick={() => handleSave(index)}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
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






{/*}
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
       {/* Dropdown Menus /}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {/* City Dropdown /}
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

        {/* Outlet Dropdown /}
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

      {/* Table /}
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
*/}