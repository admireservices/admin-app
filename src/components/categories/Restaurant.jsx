import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const API_URL = "http://localhost:4040/api/restaurants";
const CATEGORY_API_URL = "http://localhost:4040/api/predefined/list-by-type";

export default function Restaurant() {
  const [cityId, setCityId] = useState("");
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      setAllCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
    }
  };

  const handleSubmit = async () => {
    if (!cityId || !name || categories.length === 0) {
      alert("Please enter City ID, Restaurant Name, and at least one category.");
      return;
    }

    const newEntry = { cityId, name, categories };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, newEntry);
      } else {
        await axios.post(API_URL, newEntry);
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
    setCityId(entry.cityId);
    setName(entry.name);
    setCategories(entry.categories.map((cat) => cat._id));
    setEditingId(entry._id);
  };

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
        label="City"
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

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
            <option key={cat._id} value={cat._id}>
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
          {categories.map((id) => {
            const category = allCategories.find((cat) => cat._id === id);
            return category ? category.name : "Unknown";
          }).join(", ")}
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
                  <TableCell>
                    {row.categories.map((cat) => cat.name).join(", ")}
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




{/*}
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const API_URL = "http://localhost:4040/api/restaurants";

export default function Restaurant() {
  const [city, setCity] = useState("");
  const [outlet, setOutlet] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]); // Stores fetched data
  const [editingId, setEditingId] = useState(null); // Track editing row ID

  // Fetch data from backend on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Data
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Add category
  const addCategory = () => {
    if (category.trim() !== "" && !categories.includes(category)) {
      setCategories([...categories, category]);
      setCategory("");
    }
  };

  // Submit or Update Data
  const handleSubmit = async () => {
    if (!city || !outlet || categories.length === 0) {
      alert("Please enter a city, an outlet, and at least one category.");
      return;
    }

    const newEntry = { city, outlet, categories };

    try {
      if (editingId) {
        // Update Existing Entry
        await axios.put(`${API_URL}/${editingId}`, newEntry);
      } else {
        // Add New Entry
        await axios.post(API_URL, newEntry);
      }
      fetchData(); // Refresh Data
      resetFields();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Delete Data
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData(); // Refresh Data
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  // Edit Data
  const handleEdit = (entry) => {
    setCity(entry.city);
    setOutlet(entry.outlet);
    setCategories(entry.categories);
    setEditingId(entry._id);
  };

  // Reset Fields
  const resetFields = () => {
    setCity("");
    setOutlet("");
    setCategories([]);
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>City, Outlet & Category Entry</h2>

      {/* City Input /}
      <TextField
        label="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      
      <TextField
        label="Outlet"
        value={outlet}
        onChange={(e) => setOutlet(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button variant="contained" color="secondary" onClick={addCategory}>
          Add Category
        </Button>
      </div>

      
      {categories.length > 0 && (
        <p>
          <strong>Categories: </strong>
          {categories.join(", ")}
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

      {/* Table to Display Data /}
      <h3 style={{ marginTop: "20px" }}>Entered Data</h3>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Outlet</strong></TableCell>
                <TableCell><strong>Categories</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.outlet}</TableCell>
                  <TableCell>{row.categories.join(", ")}</TableCell>
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