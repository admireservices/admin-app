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

export default function FoodRecipeEntry() {
  const [course, setCourse] = useState("");
  const [recipeName, setRecipeName] = useState("");
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
    fetch("http://localhost:5000/api/foodrecipe") // Update with actual backend API
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
    if (!course || !recipeName) {
      setError("Please enter Course and Recipe Name.");
      return;
    }

    setLoading(true);

    const newEntry = { course, recipeName, ...formData };

    fetch("http://localhost:5000/api/foodrecipe", {
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
      fetch("http://localhost:5000/api/foodrecipe/upload", {
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
      <h2>Food Recipe Entry</h2>

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Course & Recipe Name */}
      <TextField
        label="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        fullWidth
        required
        style={{ marginBottom: "20px" }}
      />

      <TextField
        label="Recipe Name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
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
          {loading ? <CircularProgress size={24} /> : "Add Ingredient"}
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
                <TableCell><strong>Course</strong></TableCell>
                <TableCell><strong>Recipe Name</strong></TableCell>
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
                  <TableCell>{row.course}</TableCell>
                  <TableCell>{row.recipeName}</TableCell>
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
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Select,
  MenuItem,
  TextField,
  Input,
} from "@mui/material";

export default function RecipeTable() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [recipes, setRecipes] = useState({});
  const [newRecipe, setNewRecipe] = useState({ recipeName: "", ingredients: [] });
  const [newIngredient, setNewIngredient] = useState({ ingredient: "", unit: "", qty: "", rate: "", amount: 0 });

  const courses = ["Soups", "Appetizers", "Main Course", "Desserts"];

  // Add multiple ingredients in one go
  const handleAddIngredient = () => {
    if (!newIngredient.ingredient || !newIngredient.unit || !newIngredient.qty || !newIngredient.rate) {
      alert("Please fill all ingredient fields.");
      return;
    }
    const amount = (parseFloat(newIngredient.qty) * parseFloat(newIngredient.rate)).toFixed(2);
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { ...newIngredient, amount }],
    });
    setNewIngredient({ ingredient: "", unit: "", qty: "", rate: "", amount: 0 });
  };

  const handleAddRecipe = () => {
    if (!selectedCourse || !newRecipe.recipeName || newRecipe.ingredients.length === 0) {
      alert("Please select a course, add a recipe name, and at least one ingredient.");
      return;
    }

    setRecipes((prev) => ({
      ...prev,
      [selectedCourse]: [...(prev[selectedCourse] || []), newRecipe],
    }));

    setNewRecipe({ recipeName: "", ingredients: [] });
  };

  // Handle file upload without requiring manual input
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const structuredData = {};
      parsedData.forEach((row) => {
        const { Course, RecipeName, Ingredient, Unit, Qty, Rate } = row;
        if (!structuredData[Course]) structuredData[Course] = [];

        const ingredientEntry = {
          ingredient: Ingredient,
          unit: Unit,
          qty: parseFloat(Qty),
          rate: parseFloat(Rate),
          amount: (parseFloat(Qty) * parseFloat(Rate)).toFixed(2),
        };

        const existingRecipe = structuredData[Course].find((r) => r.recipeName === RecipeName);
        if (existingRecipe) {
          existingRecipe.ingredients.push(ingredientEntry);
        } else {
          structuredData[Course].push({ recipeName: RecipeName, ingredients: [ingredientEntry] });
        }
      });

      setRecipes(structuredData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Recipe Management</h2>
      <div>
        <Input type="file" onChange={handleFileUpload} />
      </div>

      <Select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        displayEmpty
        sx={{ width: "200px", margin: "20px" }}
      >
        <MenuItem value="" disabled>
          Select Course
        </MenuItem>
        {courses.map((course, index) => (
          <MenuItem key={index} value={course}>
            {course}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Recipe Name"
        value={newRecipe.recipeName}
        onChange={(e) => setNewRecipe({ ...newRecipe, recipeName: e.target.value })}
        sx={{ width: "200px", margin: "10px" }}
      />

      <div>
        <TextField
          label="Ingredient"
          value={newIngredient.ingredient}
          onChange={(e) => setNewIngredient({ ...newIngredient, ingredient: e.target.value })}
          sx={{ width: "150px" }}
        />
        <TextField
          label="Unit"
          value={newIngredient.unit}
          onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
          sx={{ width: "100px" }}
        />
        <TextField
          label="Qty"
          type="number"
          value={newIngredient.qty}
          onChange={(e) => setNewIngredient({ ...newIngredient, qty: e.target.value })}
          sx={{ width: "80px" }}
        />
        <TextField
          label="Rate"
          type="number"
          value={newIngredient.rate}
          onChange={(e) => setNewIngredient({ ...newIngredient, rate: e.target.value })}
          sx={{ width: "80px" }}
        />
        <Button variant="contained" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>
      </div>

      <Button variant="contained" color="primary" onClick={handleAddRecipe} sx={{ margin: "20px" }}>
        Add Recipe
      </Button>

      {/* Table Display /}
      {Object.keys(recipes).length > 0 && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto", marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Course</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Recipe Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "18px" }}>Ingredients</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(recipes).map((course, courseIndex) => (
                <React.Fragment key={courseIndex}>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#f0f0f0" }}>
                      {course}
                    </TableCell>
                  </TableRow>
                  {recipes[course].map((recipe, recipeIndex) => (
                    <React.Fragment key={recipeIndex}>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{recipe.recipeName}</TableCell>
                        <TableCell>
                          <Table>
                            <TableBody>
                              {recipe.ingredients.map((ing, ingIndex) => (
                                <TableRow key={ingIndex}>
                                  <TableCell>{ing.ingredient}</TableCell>
                                  <TableCell>{ing.unit}</TableCell>
                                  <TableCell>{ing.qty}</TableCell>
                                  <TableCell>{ing.rate}</TableCell>
                                  <TableCell>{ing.amount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </React.Fragment>
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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Select,
  MenuItem,
  TextField,
  Input,
} from "@mui/material";

export default function RecipeTable() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [recipes, setRecipes] = useState({
    Soups: [],
    Appetizers: [],
    "Main Course": [],
    Desserts: [],
  });
  const [newRecipe, setNewRecipe] = useState({ recipeName: "", ingredients: [] });
  const [newIngredient, setNewIngredient] = useState({ ingredient: "", unit: "", qty: "", rate: "", amount: 0 });

  const courses = ["Soups", "Appetizers", "Main Course", "Desserts"];

  const handleAddIngredient = () => {
    if (!newIngredient.ingredient || !newIngredient.unit || !newIngredient.qty || !newIngredient.rate) {
      alert("Please fill all ingredient fields.");
      return;
    }
    const amount = (parseFloat(newIngredient.qty) * parseFloat(newIngredient.rate)).toFixed(2);
    setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, { ...newIngredient, amount }] });
    setNewIngredient({ ingredient: "", unit: "", qty: "", rate: "", amount: 0 });
  };

  const handleAddRecipe = () => {
    if (!selectedCourse || !newRecipe.recipeName || newRecipe.ingredients.length === 0) {
      alert("Please select a course, add a recipe name, and at least one ingredient.");
      return;
    }
    setRecipes({
      ...recipes,
      [selectedCourse]: [...recipes[selectedCourse], newRecipe],
    });
    setNewRecipe({ recipeName: "", ingredients: [] });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      const structuredData = {};
      parsedData.forEach((row) => {
        const { Course, RecipeName, Ingredient, Unit, Qty, Rate } = row;
        if (!structuredData[Course]) structuredData[Course] = [];
        const existingRecipe = structuredData[Course].find((r) => r.recipeName === RecipeName);
        const ingredientEntry = { ingredient: Ingredient, unit: Unit, qty: parseFloat(Qty), rate: parseFloat(Rate), amount: (parseFloat(Qty) * parseFloat(Rate)).toFixed(2) };
        if (existingRecipe) {
          existingRecipe.ingredients.push(ingredientEntry);
        } else {
          structuredData[Course].push({ recipeName: RecipeName, ingredients: [ingredientEntry] });
        }
      });
      setRecipes((prev) => ({ ...prev, ...structuredData }));
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Recipe Management</h2>
      <div>
        <Input type="file" onChange={handleFileUpload} />
      </div>
      <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} displayEmpty sx={{ width: "200px", margin: "20px" }}>
        <MenuItem value="" disabled>Select Course</MenuItem>
        {courses.map((course, index) => (
          <MenuItem key={index} value={course}>{course}</MenuItem>
        ))}
      </Select>
      <TextField label="Recipe Name" value={newRecipe.recipeName} onChange={(e) => setNewRecipe({ ...newRecipe, recipeName: e.target.value })} sx={{ width: "200px", margin: "10px" }} />
      <div>
        <TextField label="Ingredient" value={newIngredient.ingredient} onChange={(e) => setNewIngredient({ ...newIngredient, ingredient: e.target.value })} sx={{ width: "150px" }} />
        <TextField label="Unit" value={newIngredient.unit} onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })} sx={{ width: "100px" }} />
        <TextField label="Qty" type="number" value={newIngredient.qty} onChange={(e) => setNewIngredient({ ...newIngredient, qty: e.target.value })} sx={{ width: "80px" }} />
        <TextField label="Rate" type="number" value={newIngredient.rate} onChange={(e) => setNewIngredient({ ...newIngredient, rate: e.target.value })} sx={{ width: "80px" }} />
        <Button variant="contained" onClick={handleAddIngredient}>Add Ingredient</Button>
      </div>
      <Button variant="contained" color="primary" onClick={handleAddRecipe} sx={{ margin: "20px" }}>Add Recipe</Button>
      {selectedCourse && recipes[selectedCourse].length > 0 && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto" }}>
          <h3>{selectedCourse}</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Recipe Name</strong></TableCell>
                <TableCell><strong>Ingredients</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes[selectedCourse].map((recipe, index) => (
                <TableRow key={index}>
                  <TableCell>{recipe.recipeName}</TableCell>
                  <TableCell>
                    {recipe.ingredients.map((ing, idx) => (
                      <div key={idx}>{ing.ingredient} - {ing.unit} - {ing.qty} - {ing.rate} - {ing.amount}</div>
                    ))}
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
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

export default function RecipeTable() {
  // Dropdown Selection for Course
  const [selectedCourse, setSelectedCourse] = useState("");

  // Table Data (Grouped by Course Type)
  const [recipes, setRecipes] = useState({
    Soups: [],
    Appetizers: [],
    "Main Course": [],
    Desserts: [],
  });

  // Form Inputs
  const [newRecipe, setNewRecipe] = useState({
    recipeName: "",
    ingredient: "",
    unit: "",
    qty: "",
    rate: "",
    amount: 0,
  });

  // Course Options
  const courses = ["Soups", "Appetizers", "Main Course", "Desserts"];

  // Handle Adding New Recipe
  const handleAddRecipe = () => {
    if (!selectedCourse) {
      alert("Please select a course before adding a recipe.");
      return;
    }

    if (!newRecipe.recipeName || !newRecipe.ingredient || !newRecipe.unit || !newRecipe.qty || !newRecipe.rate) {
      alert("Please fill all fields before adding a recipe.");
      return;
    }

    const amount = (parseFloat(newRecipe.qty) * parseFloat(newRecipe.rate)).toFixed(2);

    setRecipes({
      ...recipes,
      [selectedCourse]: [
        ...recipes[selectedCourse],
        {
          recipeName: newRecipe.recipeName,
          ingredient: newRecipe.ingredient,
          unit: newRecipe.unit,
          qty: parseFloat(newRecipe.qty),
          rate: parseFloat(newRecipe.rate).toFixed(2),
          amount,
        },
      ],
    });

    // Reset Form
    setNewRecipe({ recipeName: "", ingredient: "", unit: "", qty: "", rate: "", amount: 0 });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Recipe Management</h2>

      {/* Course Selection Dropdown /}
      <div style={{ marginBottom: "20px" }}>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          displayEmpty
          sx={{ width: "200px" }}
        >
          <MenuItem value="" disabled>Select Course</MenuItem>
          {courses.map((course, index) => (
            <MenuItem key={index} value={course}>{course}</MenuItem>
          ))}
        </Select>
      </div>

      {/* Form to Add Recipe /}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <TextField
          label="Recipe Name"
          value={newRecipe.recipeName}
          onChange={(e) => setNewRecipe({ ...newRecipe, recipeName: e.target.value })}
          sx={{ width: "180px" }}
        />
        <TextField
          label="Ingredient"
          value={newRecipe.ingredient}
          onChange={(e) => setNewRecipe({ ...newRecipe, ingredient: e.target.value })}
          sx={{ width: "150px" }}
        />
        <TextField
          label="Unit"
          value={newRecipe.unit}
          onChange={(e) => setNewRecipe({ ...newRecipe, unit: e.target.value })}
          sx={{ width: "100px" }}
        />
        <TextField
          label="Qty"
          type="number"
          value={newRecipe.qty}
          onChange={(e) => setNewRecipe({ ...newRecipe, qty: e.target.value })}
          sx={{ width: "80px" }}
        />
        <TextField
          label="Rate"
          type="number"
          value={newRecipe.rate}
          onChange={(e) => setNewRecipe({ ...newRecipe, rate: e.target.value })}
          sx={{ width: "80px" }}
        />
        <Button variant="contained" color="primary" onClick={handleAddRecipe}>
          Add Recipe
        </Button>
      </div>

      {/* Table for Selected Course /}
      {selectedCourse && recipes[selectedCourse].length > 0 && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto" }}>
          <h3>{selectedCourse}</h3>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>RECIPE NAME</strong></TableCell>
                <TableCell><strong>INGREDIENT</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>QTY</strong></TableCell>
                <TableCell><strong>RATE</strong></TableCell>
                <TableCell><strong>AMOUNT</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes[selectedCourse].map((recipe, index) => (
                <TableRow key={index}>
                  <TableCell>{recipe.recipeName}</TableCell>
                  <TableCell>{recipe.ingredient}</TableCell>
                  <TableCell>{recipe.unit}</TableCell>
                  <TableCell>{recipe.qty}</TableCell>
                  <TableCell>{recipe.rate}</TableCell>
                  <TableCell>{recipe.amount}</TableCell>
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