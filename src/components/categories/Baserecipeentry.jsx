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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch existing data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/baserecipe") // Update with actual backend API
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipeTitle) {
      setError("Please enter a Recipe Title.");
      return;
    }

    setLoading(true);

    const newEntry = { recipeTitle, ...formData };

    fetch("http://localhost:4040/api/baserecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save data");
        }
        return response.json();
      })
      .then(() => {
        fetchData();
        setFormData({ ingredient: "", unit: "", quantity: "", rate: "", amount: "" });
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

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Recipe Title */}
      <TextField
        label="Recipe Title"
        value={recipeTitle}
        onChange={(e) => setRecipeTitle(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="Ingredient" name="ingredient" value={formData.ingredient} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Amount" name="amount" value={formData.amount} disabled />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : "Add Recipe Item"}
        </Button>
      </form>

      {/* Excel Upload */}
      <div style={{ marginTop: "20px" }}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <Button variant="contained" color="secondary" onClick={handleExcelSubmit} disabled={!file}>
          Upload Excel
        </Button>
      </div>

      {/* Table */}
      <h3 style={{ marginTop: "20px" }}>Entered Data</h3>
      {loading && <CircularProgress />}
      {!loading && data.length === 0 && <p>No data available.</p>}

      {!loading && data.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Recipe Title</strong></TableCell>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.recipeTitle}</TableCell>
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
      )}
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
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    quantity: "",
    rate: "",
    amount: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch existing data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/baserecipe") // Update with actual backend API
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

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost:5000/api/baserecipe", {
      method: "POST",
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
        fetchData(); // Refresh table after adding new entry
        setFormData({ name: "", unit: "", quantity: "", rate: "", amount: "" });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Handle file upload and processing
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  // Read Excel file and send data to backend
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
      fetch("http://localhost:5000/api/baserecipe/upload", {
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

      {/* Form /}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : "Add Entry"}
        </Button>
      </form>

      {/* Excel Upload /}
      <div style={{ marginTop: "20px" }}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <Button variant="contained" color="secondary" onClick={handleExcelSubmit} disabled={!file}>
          Upload Excel
        </Button>
      </div>

      {/* Table /}
      <h3 style={{ marginTop: "20px" }}>Entered Data</h3>
      {loading && <CircularProgress />}
      {!loading && data.length === 0 && <p>No data available.</p>}

      {!loading && data.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.rate}</TableCell>
                  <TableCell>{row.amount}</TableCell>
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
import React, { useState } from "react";
import * as XLSX from "xlsx";

const Baserecipe = () => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", unit: "", quantity: "", rate: "", amount: "" },
  ]);

  // Handle input change for recipe title
  const handleRecipeTitleChange = (e) => {
    setRecipeTitle(e.target.value);
  };

  // Handle input change for ingredients
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;

    // Auto-calculate amount (quantity * rate)
    if (field === "quantity" || field === "rate") {
      const qty = parseFloat(updatedIngredients[index].quantity) || 0;
      const rate = parseFloat(updatedIngredients[index].rate) || 0;
      updatedIngredients[index].amount = (qty * rate).toFixed(2);
    }

    setIngredients(updatedIngredients);
  };

  // Add a new ingredient row
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", unit: "", quantity: "", rate: "", amount: "" },
    ]);
  };

  // Remove an ingredient row
  const removeIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  // Handle Excel file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(sheet);

      // Convert Excel Data to Ingredient Format
      const formattedData = excelData.map((row) => ({
        name: row["System Item Name"] || "",
        unit: row["UNIT"] || "",
        quantity: row["PURCHASE RATE"] || "",
        rate: row["PACKING UOM"] || "",
        amount:
          ((parseFloat(row["PURCHASE RATE"]) || 0) *
            (parseFloat(row["PACKING UOM"]) || 0)).toFixed(2) || "",
      }));

      setIngredients(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Submit the recipe
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeTitle.trim()) {
      alert("Recipe title is required!");
      return;
    }

    const recipeData = { recipeTitle, ingredients };

    try {
      await addRecipe(recipeData);
      alert("Recipe saved successfully!");
      setRecipeTitle("");
      setIngredients([
        { name: "", unit: "", quantity: "", rate: "", amount: "" },
      ]);
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Base Recipe Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipe Title Input /}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Recipe Title
          </label>
          <input
            type="text"
            value={recipeTitle}
            onChange={handleRecipeTitleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Excel Upload /}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Upload Excel File (Ingredients)
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Ingredient List /}
        <h3 className="text-lg font-semibold text-gray-700">Ingredients</h3>

        {ingredients.map((ingredient, index) => (
          <div key={index} className="grid grid-cols-6 gap-2 items-center">
            <input
              type="text"
              placeholder="Ingredient Name"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
              required
              className="col-span-2 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Unit"
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              required
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Qty"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, "quantity", e.target.value)
              }
              required
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Rate"
              value={ingredient.rate}
              onChange={(e) =>
                handleIngredientChange(index, "rate", e.target.value)
              }
              required
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Amount"
              value={ingredient.amount}
              readOnly
              className="px-3 py-2 border bg-gray-100 rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
            >
              ❌
            </button>
          </div>
        ))}

        {/* Add Ingredient Button /}
        <button
          type="button"
          onClick={addIngredient}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          ➕ Add Ingredient
        </button>

        {/* Submit Button /}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default Baserecipe;
*/}