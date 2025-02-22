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

export default function BaseRecipeEntry() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [formData, setFormData] = useState({
    ingredient: "",
    unit: "",
    quantity: "",
    rate: "",
    amount: "",
  });
  const [recipeData, setRecipeData] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/baserecipe")
      .then((response) => response.json())
      .then((data) => {
        setAllRecipes(data);
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

  useEffect(() => {
    const { quantity, rate } = formData;
    if (quantity && rate) {
      setFormData((prev) => ({ ...prev, amount: (quantity * rate).toFixed(2) }));
    }
  }, [formData.quantity, formData.rate]);

  const handleAddIngredient = () => {
    if (!formData.ingredient || !formData.unit || !formData.quantity || !formData.rate) {
      setError("Please fill all ingredient details.");
      return;
    }
    if (editIndex !== null) {
      const updatedRecipe = [...recipeData];
      updatedRecipe[editIndex] = formData;
      setRecipeData(updatedRecipe);
      setEditIndex(null);
    } else {
      setRecipeData([...recipeData, formData]);
    }
    setFormData({ ingredient: "", unit: "", quantity: "", rate: "", amount: "" });
    setError(null);
  };

  const handleEdit = (index) => {
    setFormData(recipeData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setRecipeData(recipeData.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!recipeTitle || recipeData.length === 0) {
      setError("Please enter a Recipe Title and at least one ingredient.");
      return;
    }
    setLoading(true);
    const newRecipe = { recipeTitle, ingredients: recipeData };

    fetch("http://localhost:4040/api/baserecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setRecipeTitle("");
        setRecipeData([]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Base Recipe Entry</h2>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Recipe Title"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="Ingredient" name="ingredient" value={formData.ingredient} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Amount" name="amount" value={formData.amount} disabled />

        <Button variant="contained" color="secondary" onClick={handleAddIngredient}>
          {editIndex !== null ? "Update Ingredient" : "Add Ingredient"}
        </Button>
      </div>

      <h3>Recipe Ingredients</h3>
      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipeData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ingredient}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(index)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: "20px" }}>
        {loading ? <CircularProgress size={24} /> : "Submit Recipe"}
      </Button>
    </div>
  );
}



{/*}
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
} from "@mui/material";

export default function BaseRecipeEntry() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [formData, setFormData] = useState({
    ingredient: "",
    unit: "",
    quantity: "",
    rate: "",
    amount: "",
  });

  const [recipeData, setRecipeData] = useState([]); // Store multiple entries per recipe
  const [allRecipes, setAllRecipes] = useState([]); // Store all recipe entries from the backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch existing recipes from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/baserecipe")
      .then((response) => response.json())
      .then((data) => {
        setAllRecipes(data);
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

  // Calculate Amount (Quantity × Rate)
  useEffect(() => {
    const { quantity, rate } = formData;
    if (quantity && rate) {
      setFormData((prev) => ({ ...prev, amount: (quantity * rate).toFixed(2) }));
    }
  }, [formData.quantity, formData.rate]);

  // Add ingredient to recipeData list
  const handleAddIngredient = () => {
    if (!formData.ingredient || !formData.unit || !formData.quantity || !formData.rate) {
      setError("Please fill all ingredient details.");
      return;
    }
    setRecipeData([...recipeData, formData]);
    setFormData({ ingredient: "", unit: "", quantity: "", rate: "", amount: "" });
    setError(null);
  };

  // Submit entire recipe with all ingredients
  const handleSubmit = () => {
    if (!recipeTitle || recipeData.length === 0) {
      setError("Please enter a Recipe Title and at least one ingredient.");
      return;
    }

    setLoading(true);

    const newRecipe = {
      recipeTitle,
      ingredients: recipeData,
    };

    fetch("http://localhost:4040/api/baserecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setRecipeTitle("");
        setRecipeData([]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  // Read and upload Excel data
  const handleExcelSubmit = () => {
    if (!file) {
      setError("Please select an Excel file");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Send bulk data to backend
      fetch("http://localhost:4040/api/baserecipe/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to upload data");
          }
          return response.json();
        })
        .then(() => {
          fetchData();
          setFile(null);
        })
        .catch((error) => {
          setError(error.message);
        });
    };
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Base Recipe Entry</h2>

      {/* Error Message /}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Recipe Title /}
      <TextField
        label="Recipe Title"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      {/* Ingredient Form /}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="Ingredient" name="ingredient" value={formData.ingredient} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Amount" name="amount" value={formData.amount} disabled />

        <Button variant="contained" color="secondary" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>
      </div>

      {/* Display added ingredients before submitting /}
      <h3>Recipe Ingredients</h3>
      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Ingredient</strong></TableCell>
              <TableCell><strong>Unit</strong></TableCell>
              <TableCell><strong>Quantity</strong></TableCell>
              <TableCell><strong>Rate</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipeData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ingredient}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.rate}</TableCell>
                <TableCell>{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: "20px" }}>
        {loading ? <CircularProgress size={24} /> : "Submit Recipe"}
      </Button>

      {/* Excel Upload /}
      <div style={{ marginTop: "20px" }}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <Button variant="contained" color="secondary" onClick={handleExcelSubmit} disabled={!file}>
          Upload Excel
        </Button>
      </div>
    </div>
  );
}
*/}