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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function FoodRecipeEntry() {
  const [category, setCategory] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [city, setCity] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    ingredient: "",
    unit: "",
    quantity: "",
    rate: "",
    amount: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cities from API
  useEffect(() => {
    fetch("http://localhost:4040/api/cities")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Fetch restaurants based on selected city
  useEffect(() => {
    if (city) {
      fetch(`http://localhost:4040/api/restaurants/${city}`)
        .then((response) => response.json())
        .then((data) => setRestaurants(data))
        .catch((error) => console.error("Error fetching restaurants:", error));
    } else {
      setRestaurants([]);
    }
  }, [city]);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/recipes")
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const { quantity, rate } = formData;
    if (quantity && rate) {
      setFormData((prev) => ({ ...prev, amount: (quantity * rate).toFixed(2) }));
    }
  }, [formData.quantity, formData.rate]);

  const addIngredient = () => {
    if (!formData.ingredient || !formData.unit || !formData.quantity || !formData.rate) {
      setError("Please fill all ingredient fields.");
      return;
    }
    setIngredients([...ingredients, formData]);
    setFormData({ ingredient: "", unit: "", quantity: "", rate: "", amount: "" });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !recipeName || !city || !restaurant || ingredients.length === 0) {
      setError("Please fill all fields including City and Restaurant.");
      return;
    }

    setLoading(true);

    const newRecipe = { city, restaurant, category, recipeName, ingredients };

    fetch("http://localhost:4040/api/recipes", {
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
        setCategory("");
        setRecipeName("");
        setCity("");
        setRestaurant("");
        setIngredients([]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Food Recipe Entry</h2>

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px" }}>
        <FormControl style={{ width: "45%" }}>
          <InputLabel>City</InputLabel>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map((c, index) => (
              <MenuItem key={index} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: "45%" }}>
          <InputLabel>Restaurant</InputLabel>
          <Select value={restaurant} onChange={(e) => setRestaurant(e.target.value)}>
            {restaurants.map((r, index) => (
              <MenuItem key={index} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Second Row: Category & Recipe Name */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px" }}>
        <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "45%" }} required />
        <TextField label="Recipe Name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} style={{ width: "45%" }} required />
      </div>
      {/* Form for Ingredients */}
      <form style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="Ingredient" name="ingredient" value={formData.ingredient} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Amount" name="amount" value={formData.amount} disabled />

        <Button variant="contained" color="primary" onClick={addIngredient}>
          Add Ingredient
        </Button>
      </form>

      {/* Show Added Ingredients in Table */}
      {ingredients.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto", marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.ingredient}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Submit Recipe */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Recipe"}
      </Button>

      {/* Display Submitted Recipes */}
      <h3 style={{ marginTop: "20px" }}>Recipes</h3>
      {loading && <CircularProgress />}
      {!loading && data.length === 0 && <p>No recipes available.</p>}

      {!loading && data.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Restaurant</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Recipe Name</strong></TableCell>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
          row.ingredients.map((ing, idx) => (
            <TableRow key={`${index}-${idx}`}>
              {idx === 0 && (
                <>
                <TableCell rowSpan={row.ingredients.length}>{row.city}</TableCell>
                <TableCell rowSpan={row.ingredients.length}>{row.restaurant}</TableCell>
                  <TableCell rowSpan={row.ingredients.length}>{row.category}</TableCell>
                  <TableCell rowSpan={row.ingredients.length}>{row.recipeName}</TableCell>
                  
                </>
              )}
              <TableCell>{ing.ingredient}</TableCell>
              <TableCell>{ing.quantity}</TableCell>
              <TableCell>{ing.unit}</TableCell>
              <TableCell>{ing.rate}</TableCell>
              <TableCell>{ing.amount}</TableCell>
              {idx === 0 && (
                      <TableCell rowSpan={row.ingredients.length}>
                        <IconButton onClick={() => handleEdit(index)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(index)}><Delete /></IconButton>
                      </TableCell>
                    )}
            </TableRow>
          ))
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

  const [ingredients, setIngredients] = useState([]); // Store multiple ingredients
  const [data, setData] = useState([]); // Store fetched recipes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing recipes
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:4040/api/recipes") // Update with actual backend API
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

  // Add ingredient to list
  const addIngredient = () => {
    if (!formData.ingredient || !formData.unit || !formData.quantity || !formData.rate) {
      setError("Please fill all ingredient fields.");
      return;
    }
    setIngredients([...ingredients, formData]);
    setFormData({ ingredient: "", unit: "", quantity: "", rate: "", amount: "" });
    setError(null);
  };

  // Handle form submission (Submit entire recipe)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!course || !recipeName || ingredients.length === 0) {
      setError("Please enter Course, Recipe Name, and add at least one ingredient.");
      return;
    }

    setLoading(true);

    const newRecipe = { course, recipeName, ingredients };

    fetch("http://localhost:4040/api/recipes", {
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
        setCourse("");
        setRecipeName("");
        setIngredients([]); // Clear ingredient list
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Food Recipe Entry</h2>

      {/* Error Message /}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Course & Recipe Name /}
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

      {/* Form for Ingredients /}
      <form style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="Ingredient" name="ingredient" value={formData.ingredient} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Amount" name="amount" value={formData.amount} disabled />

        <Button variant="contained" color="primary" onClick={addIngredient}>
          Add Ingredient
        </Button>
      </form>

      {/* Show Added Ingredients in Table /}
      {ingredients.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto", marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.ingredient}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Submit Recipe /}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Recipe"}
      </Button>

      {/* Display Submitted Recipes /}
<h3 style={{ marginTop: "20px" }}>Recipes</h3>
{loading && <CircularProgress />}
{!loading && data.length === 0 && <p>No recipes available.</p>}

{!loading && data.length > 0 && (
  <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
    <Table>
      <TableHead>
        <TableRow style={{ backgroundColor: "#8BC34A" }}>
          <TableCell><strong>Course</strong></TableCell>
          <TableCell><strong>Recipe Name</strong></TableCell>
          <TableCell><strong>Ingredient</strong></TableCell>
          <TableCell><strong>Quantity</strong></TableCell>
          <TableCell><strong>Unit</strong></TableCell>
          <TableCell><strong>Rate</strong></TableCell>
          <TableCell><strong>Amount</strong></TableCell>
          <TableCell><strong>Actions</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          row.ingredients.map((ing, idx) => (
            <TableRow key={`${index}-${idx}`}>
              {idx === 0 && (
                <>
                  <TableCell rowSpan={row.ingredients.length}>{row.course}</TableCell>
                  <TableCell rowSpan={row.ingredients.length}>{row.recipeName}</TableCell>
                  
                </>
              )}
              <TableCell>{ing.ingredient}</TableCell>
              <TableCell>{ing.quantity}</TableCell>
              <TableCell>{ing.unit}</TableCell>
              <TableCell>{ing.rate}</TableCell>
              <TableCell>{ing.amount}</TableCell>
              {idx === 0 && (
                      <TableCell rowSpan={row.ingredients.length}>
                        <IconButton onClick={() => handleEdit(index)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(index)}><Delete /></IconButton>
                      </TableCell>
                    )}
            </TableRow>
          ))
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}

    </div>
  );
}
  */}