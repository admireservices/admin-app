import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function Access() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "employee",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/users") // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.role) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    const url = editingUserId
      ? `http://localhost:4040/api/users/${editingUserId}`
      : "http://localhost:4040/api/users";
    const method = editingUserId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save user");
        }
        return response.json();
      })
      .then(() => {
        fetchUsers();
        setFormData({ username: "", password: "", role: "employee" });
        setEditingUserId(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Handle delete user
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    fetch(`http://localhost:4040/api/users/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        fetchUsers();
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  // Handle edit user
  const handleEdit = (user) => {
    setFormData({ username: user.username, password: "", role: user.role });
    setEditingUserId(user._id);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>User Access Management</h2>

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Form for User Entry */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
        <Select name="role" value={formData.role} onChange={handleChange} required>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="office">Office</MenuItem>
          <MenuItem value="employee">Employee</MenuItem>
        </Select>
        <Button variant="contained" color="primary" type="submit">
          {editingUserId ? "Update User" : "Add User"}
        </Button>
      </form>

      {/* Display Users in Table */}
      <h3 style={{ marginTop: "20px" }}>Users</h3>
      {loading && <CircularProgress />}
      {!loading && users.length === 0 && <p>No users available.</p>}

      {!loading && users.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto", marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(user._id)}><Delete /></IconButton>
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