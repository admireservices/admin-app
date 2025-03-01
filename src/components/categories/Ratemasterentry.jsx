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
  CircularProgress,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, CloudUpload } from "@mui/icons-material";

export default function RateMasterEntry() {
  const [formData, setFormData] = useState({
    city: "",
    restaurant: "",
    systemItemName: "",
    recipeItemName: "",
    unit: "",
    purchaseRate: "",
    packingUOM: "",
    conversion: "",
    yield: "",
    yieldFinalRate: "",
    category: "",
  });

  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCities();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/ratemasterentry")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchCities = () => {
    fetch("http://localhost:4040/api/restaurants")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => setError(error.message));
  };

  const fetchRestaurants = (city) => {
    fetch(`http://localhost:4040/api/restaurants?city=${city}`)
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => setError(error.message));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "city") {
      setFormData({ ...formData, city: value, restaurant: "" });
      fetchRestaurants(value);
    }

    if (name === "purchaseRate" || name === "packingUOM") {
      const purchaseRate = parseFloat(updatedFormData.purchaseRate) || 0;
      const packingUOM = parseFloat(updatedFormData.packingUOM) || 1;
      updatedFormData.conversion = packingUOM !== 0 ? (purchaseRate / packingUOM).toFixed(2) : "";
    }

    if (name === "yield" || name === "conversion") {
      const conversion = parseFloat(updatedFormData.conversion) || 0;
      const yieldValue = parseFloat(updatedFormData.yield) || 1;
      updatedFormData.yieldFinalRate = yieldValue !== 0 ? ((conversion * 100) / yieldValue).toFixed(2) : "";
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editId
      ? `http://localhost:4040/api/ratemasterentry/${editId}`
      : "http://localhost:4040/api/ratemasterentry";
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
        setFormData({
          city: "",
          restaurant: "",
          systemItemName: "",
          recipeItemName: "",
          unit: "",
          purchaseRate: "",
          packingUOM: "",
          conversion: "",
          yield: "",
          yieldFinalRate: "",
          category: "",
        });
        setEditId(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item._id);
  };

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:4040/api/ratemasterentry/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:4040/api/ratemasterentry/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        fetchData();
        setFile(null);
      })
      .catch((error) => setError(error.message));
  };


  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Entry</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {/* City & Restaurant Dropdowns */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px" }}>
        <FormControl style={{ width: "45%" }}>
          <InputLabel>City</InputLabel>
          <Select name="city" value={formData.city} onChange={handleChange}>
            {cities.map((c, index) => (
              <MenuItem key={index} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: "45%" }}>
          <InputLabel>Restaurant</InputLabel>
          <Select name="restaurant" value={formData.restaurant} onChange={handleChange}>
            {restaurants.map((r, index) => (
              <MenuItem key={index} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="System Item Name" name="systemItemName" value={formData.systemItemName} onChange={handleChange} required />
        <TextField label="Recipe Item Name" name="recipeItemName" value={formData.recipeItemName} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Purchase Rate" name="purchaseRate" type="number" value={formData.purchaseRate} onChange={handleChange} required />
        <TextField label="Packing UOM" name="packingUOM" type="number" value={formData.packingUOM} onChange={handleChange} required />

        {/* Auto-Calculated Fields */}
        <TextField label="Conversion" name="conversion" value={formData.conversion} disabled />
        <TextField label="Yield" name="yield" type="number" value={formData.yield} onChange={handleChange} required />
        <TextField label="Yield Final Rate" name="yieldFinalRate" value={formData.yieldFinalRate} disabled />

        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : editId ? "Update Rate" : "Add Rate"}
        </Button>
      </form>

      {/* File Upload */}
      <div style={{ marginTop: "20px" }}>
        <input type="file" onChange={handleFileChange} />
        <Button variant="contained" color="secondary" startIcon={<CloudUpload />} onClick={handleUpload}>
          Upload Excel
        </Button>
      </div>

      <h3 style={{ marginTop: "20px" }}>Entered Data</h3>

      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
             <TableCell>City</TableCell>
             <TableCell>Restaurant</TableCell>
              <TableCell>System Item Name</TableCell>
              <TableCell>Recipe Item Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Purchase Rate</TableCell>
              <TableCell>Packing UOM</TableCell>
              <TableCell>Conversion</TableCell>
              <TableCell>Yield</TableCell>
              <TableCell>Yield Final Rate</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.restaurant}</TableCell>
                <TableCell>{row.systemItemName}</TableCell>
                <TableCell>{row.recipeItemName}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.purchaseRate}</TableCell>
                <TableCell>{row.packingUOM}</TableCell>
                <TableCell>{row.conversion}</TableCell>
                <TableCell>{row.yield}</TableCell>
                <TableCell>{row.yieldFinalRate}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} color="error">
                    <Delete />
                  </IconButton>
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
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function RateMasterEntry() {
  const [formData, setFormData] = useState({
    systemItemName: "",
    recipeItemName: "",
    unit: "",
    purchaseRate: "",
    packingUOM: "",
    conversion: "",
    yield: "",
    yieldFinalRate: "",
    category: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/ratemasterentry")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Auto-calculate Conversion (purchaseRate / packingUOM)
    if (name === "purchaseRate" || name === "packingUOM") {
      const purchaseRate = parseFloat(updatedFormData.purchaseRate) || 0;
      const packingUOM = parseFloat(updatedFormData.packingUOM) || 1; // Avoid division by zero
      updatedFormData.conversion = packingUOM !== 0 ? (purchaseRate / packingUOM).toFixed(2) : "";
    }

    // Auto-calculate Yield Final Rate (conversion * 100 / yield)
    if (name === "yield" || name === "conversion") {
      const conversion = parseFloat(updatedFormData.conversion) || 0;
      const yieldValue = parseFloat(updatedFormData.yield) || 1; // Avoid division by zero
      updatedFormData.yieldFinalRate = yieldValue !== 0 ? ((conversion * 100) / yieldValue).toFixed(2) : "";
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editId
      ? `http://localhost:4040/api/ratemasterentry/${editId}`
      : "http://localhost:4040/api/ratemasterentry";
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setFormData({
          systemItemName: "",
          recipeItemName: "",
          unit: "",
          purchaseRate: "",
          packingUOM: "",
          conversion: "",
          yield: "",
          yieldFinalRate: "",
          category: "",
        });
        setEditId(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item._id);
  };

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:4040/api/ratemasterentry/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Entry</h2>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="System Item Name" name="systemItemName" value={formData.systemItemName} onChange={handleChange} required />
        <TextField label="Recipe Item Name" name="recipeItemName" value={formData.recipeItemName} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Purchase Rate" name="purchaseRate" type="number" value={formData.purchaseRate} onChange={handleChange} required />
        <TextField label="Packing UOM" name="packingUOM" type="number" value={formData.packingUOM} onChange={handleChange} required />

        {/* Auto-Calculated Fields /}
        <TextField label="Conversion" name="conversion" value={formData.conversion} disabled />
        <TextField label="Yield" name="yield" type="number" value={formData.yield} onChange={handleChange} required />
        <TextField label="Yield Final Rate" name="yieldFinalRate" value={formData.yieldFinalRate} disabled />

        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : editId ? "Update Rate" : "Add Rate"}
        </Button>
      </form>

      <h3 style={{ marginTop: "20px" }}>Entered Data</h3>

      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>System Item Name</TableCell>
              <TableCell>Recipe Item Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Purchase Rate</TableCell>
              <TableCell>Packing UOM</TableCell>
              <TableCell>Conversion</TableCell>
              <TableCell>Yield</TableCell>
              <TableCell>Yield Final Rate</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.systemItemName}</TableCell>
                <TableCell>{row.recipeItemName}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.purchaseRate}</TableCell>
                <TableCell>{row.packingUOM}</TableCell>
                <TableCell>{row.conversion}</TableCell>
                <TableCell>{row.yield}</TableCell>
                <TableCell>{row.yieldFinalRate}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} color="error">
                    <Delete />
                  </IconButton>
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
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function RateMasterEntry() {
  const [formData, setFormData] = useState({
    systemItemName: "",
    recipeItemName: "",
    unit: "",
    purchaseRate: "",
    packingUOM: "",
    conversion: "",
    yield: "",
    yieldFinalRate: "",
    category: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null); // Track the entry being edited

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/ratemasterentry")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const url = editId
      ? `http://localhost:4040/api/ratemasterentry/${editId}`
      : "http://localhost:4040/api/ratemasterentry";
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setFormData({
          systemItemName: "",
          recipeItemName: "",
          unit: "",
          purchaseRate: "",
          packingUOM: "",
          conversion: "",
          yield: "",
          yieldFinalRate: "",
          category: "",
        });
        setEditId(null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item._id);
  };

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:4040/api/ratemasterentry/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Entry</h2>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="System Item Name" name="systemItemName" value={formData.systemItemName} onChange={handleChange} required />
        <TextField label="Recipe Item Name" name="recipeItemName" value={formData.recipeItemName} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Purchase Rate" name="purchaseRate" type="number" value={formData.purchaseRate} onChange={handleChange} required />
        <TextField label="Packing UOM" name="packingUOM" value={formData.packingUOM} onChange={handleChange} required />
        <TextField label="Conversion" name="conversion" type="number" value={formData.conversion} onChange={handleChange} required />
        <TextField label="Yield" name="yield" type="number" value={formData.yield} onChange={handleChange} required />
        <TextField label="Yield Final Rate" name="yieldFinalRate" type="number" value={formData.yieldFinalRate} onChange={handleChange} required />
        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : editId ? "Update Rate" : "Add Rate"}
        </Button>
      </form>

      <h3 style={{ marginTop: "20px" }}>Entered Data</h3>

      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>System Item Name</TableCell>
              <TableCell>Recipe Item Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Purchase Rate</TableCell>
              <TableCell>Packing UOM</TableCell>
              <TableCell>Conversion</TableCell>
              <TableCell>Yield</TableCell>
              <TableCell>Yield Final Rate</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.systemItemName}</TableCell>
                <TableCell>{row.recipeItemName}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.purchaseRate}</TableCell>
                <TableCell>{row.packingUOM}</TableCell>
                <TableCell>{row.conversion}</TableCell>
                <TableCell>{row.yield}</TableCell>
                <TableCell>{row.yieldFinalRate}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} color="error">
                    <Delete />
                  </IconButton>
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