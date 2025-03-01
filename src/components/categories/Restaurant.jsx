import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

// API URLs
const API_URL = "http://localhost:4040/api/restaurant";
const CATEGORY_API_URL = "http://localhost:4040/api/predefined/list-by-type";

export default function Restaurant() {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchCity();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.post(CATEGORY_API_URL, { entityType: "CATEGORY" });
      setAllCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCity = async () => {
    try {
      const response = await axios.post(CATEGORY_API_URL, { entityType: "CITY", parentId: 14 });
      setCityList(response.data.data);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const addCategory = () => {
    const category = allCategories.find((cat) => cat.id == selectedCategory);
    if (category && !categories.some((cat) => cat.id == category.id)) {
      setCategories([...categories, category]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCity || !name || categories.length == 0) {
      alert("Please enter City, Restaurant Name, and at least one category.");
      return;
    }

    const newEntry = {
      "cityId": parseInt(selectedCity),
      "name": name,
      "categories": categories,
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newEntry);
      } else {
        await axios.post(`${API_URL}/save`, newEntry);
      }
      fetchData();
      resetFields();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEdit = (entry) => {
    setName(entry.name);
    setCategories(entry.categories);
    setEditingId(entry._id);
  };

  const resetFields = () => {
    setName("");
    setCategories([]);
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Restaurant Entry</h2>

      <FormControl fullWidth style={{ marginBottom: "20px", textAlign: "left" }}>
        <InputLabel>Select City</InputLabel>
        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          variant="outlined"
          style={{ width: "300px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}
        >
          <MenuItem value="">Select City</MenuItem>
          {cityList.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Restaurant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
        <FormControl style={{ width: "300px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <InputLabel>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="">Select Category</MenuItem>
            {allCategories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="secondary" onClick={addCategory}>
          Add Category
        </Button>
      </div>

      {categories.length > 0 && (
        <p>
          <strong>Categories: </strong>
          {categories.map((category) => `${category.name}`).join(", ")}
        </p>
      )}
      <Button
        variant="contained"
        color={editingId ? "warning" : "primary"}
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        {editingId ? "Update Entry" : "Submit Entry"}
      </Button>

      <h3 style={{ marginTop: "20px" }}>Restaurant List</h3>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>City ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Categories</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.cityId}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.categories.map((category) => category.name).join(", ")}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}




{/*}
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

// API URLs
const API_URL = "http://localhost:4040/api/restaurant";
const CATEGORY_API_URL = "http://localhost:4040/api/predefined/list-by-type";

export default function Restaurant() {
  const [cityId, setCityId] = useState("");
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [categories, setCategories] = useState([]); // Selected categories for the restaurant
  const [allCategories, setAllCategories] = useState([]); // All available categories fetched from API
  const [cityList, setCityList] = useState([]); // All available categories fetched from API
  const [data, setData] = useState([]); // Stores restaurant data
  const [editingId, setEditingId] = useState(null); // Stores ID of the entry being edited

  // Fetch restaurant data and categories on component mount
  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchCity();
  }, []);

  // Fetch restaurant data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.post(CATEGORY_API_URL, { entityType: "CATEGORY" });
      setAllCategories(response.data.data); // Update categories state
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch city list from the API
  const fetchCity = async () => {
    try {
      const response = await axios.post(CATEGORY_API_URL, { entityType: "CITY", parentId: 14 });
      setCityList(response.data.data); // Update city list state
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  // Add selected category to categories list
  const addCategory = () => {
    const category = allCategories.find((cat) => cat.id == selectedCategory);
    if (category && !categories.some((cat) => cat.id == category.id)) {
      setCategories([...categories, category]);
    }
  };

  // Handle form submission for adding or updating a restaurant
  const handleSubmit = async () => {
    if (!selectedCity || !name || categories.length== 0) {
      alert("Please enter City ID, Restaurant Name, and at least one category.");
      return;
    }

    const categoryIds = categories.map((category) => category);

    const newEntry = {
      "cityId": parseInt(selectedCity),
      "name":name,
      "categories": categories, // Send only category IDs if needed
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newEntry);
      } else {
        await axios.post(`${API_URL}/save`, newEntry);
      }
      fetchData(); // Refresh data
      resetFields(); // Reset form fields
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Delete a restaurant entry
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Edit a restaurant entry
  const handleEdit = (entry) => {
    setCityId(entry.cityId);
    setName(entry.name);
    setCategories(entry.categories); // Populate categories for editing
    setEditingId(entry._id); // Set editing ID
  };

  // Reset the form fields
  const resetFields = () => {
    setCityId("");
    setName("");
    setCategories([]);
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Restaurant Entry</h2>

      <TextField
        label="City ID"
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          <option value="">Select City</option>
          {cityList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <TextField
        label="Restaurant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Select Category</option>
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <Button variant="contained" color="secondary" onClick={addCategory}>
          Add Category
        </Button>
      </div>

      {categories.length > 0 && (
        <p>
          <strong>Categories: </strong>
          {categories
            .map((category) => {
              return `${category.name}`; // Show full category name and code
            })
            .join(", ")}
        </p>
      )}

      <Button
        variant="contained"
        color={editingId ? "warning" : "primary"}
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        {editingId ? "Update Entry" : "Submit Entry"}
      </Button>

      <h3 style={{ marginTop: "20px" }}>Restaurant List</h3>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>City ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Categories</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.cityId}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  {/* <TableCell>{row.name}</TableCell> /}
                  <TableCell>
                    {row.categories.map((category) => {
                        return `${category.name}`; // Show full category name and code
                    })
                  .join(", ")}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
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