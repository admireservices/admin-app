import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress,
  Alert, IconButton, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function BaseRecipeEntry() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeyield, setYield] = useState("");
  const [recipeData, setRecipeData] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [finalYieldRate, setFinalYieldRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    ingredient: "",
    unit: "",
    quantity: "",
    rate: "",
    amount: "",
  });

  // City & Restaurant
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  useEffect(() => {
    fetchData();
    fetchCities();
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

  const fetchCities = () => {
    fetch("http://localhost:4040/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((error) => setError(error.message));
  };

  const fetchRestaurants = (city) => {
    fetch(`http://localhost:4040/api/restaurants?city=${city}`)
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((error) => setError(error.message));
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setSelectedRestaurant("");
    fetchRestaurants(event.target.value);
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

  const handleSubmit = () => {
    if (!recipeTitle || recipeData.length === 0 || !recipeyield || !selectedCity || !selectedRestaurant) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const calculatedYieldRate = recipeData.reduce((acc, item) => acc + parseFloat(item.amount), 0) / recipeyield;
    setFinalYieldRate(calculatedYieldRate.toFixed(2));

    const newRecipe = {
      recipeTitle, ingredients: recipeData, recipeyield, finalYieldRate: calculatedYieldRate.toFixed(2),
      city: selectedCity, restaurant: selectedRestaurant
    };

    fetch("http://localhost:4040/api/baserecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save data");
        return response.json();
      })
      .then(() => {
        fetchData();
        setRecipeTitle("");
        setRecipeData([]);
        setYield("");
        setSelectedCity("");
        setSelectedRestaurant("");
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

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px" }}>
      <FormControl fullWidth>
          <InputLabel>City</InputLabel>
          <Select value={selectedCity} onChange={handleCityChange}>
            {cities.map((city) => <MenuItem key={city} value={city}>{city}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedCity}>
          <InputLabel>Restaurant</InputLabel>
          <Select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)}>
            {restaurants.map((rest) => <MenuItem key={rest} value={rest}>{rest}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField label="Recipe Title" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} required fullWidth />
        <TextField label="Yield" value={recipeyield} onChange={(e) => setYield(e.target.value)} required fullWidth type="number" />
        <TextField label="Final Yield Rate" value={finalYieldRate} fullWidth />
      </div>

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

      {/* Display Submitted Recipes */}
      <h3 style={{ marginTop: "20px" }}>Recipes</h3>
      {loading && <CircularProgress />}
      {!loading && allRecipes.length === 0 && <p>No recipes available.</p>}

      {!loading && allRecipes.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Restaurant</strong></TableCell>
                <TableCell><strong>Recipe Title</strong></TableCell>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Yield</strong></TableCell>
                <TableCell><strong>Final Yield Rate</strong></TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRecipes.map((row, index) => (
                row.ingredients.map((ing, idx) => (
                  <TableRow key={`${index}-${idx}`}>
                    {idx === 0 && <TableCell rowSpan={row.ingredients.length}>{row.city}</TableCell>}
                    {idx === 0 && <TableCell rowSpan={row.ingredients.length}>{row.restaurant}</TableCell>}
                    {idx === 0 && <TableCell rowSpan={row.ingredients.length}>{row.recipeTitle}</TableCell>}

                    <TableCell>{ing.ingredient}</TableCell>
                    <TableCell>{ing.quantity}</TableCell>
                    <TableCell>{ing.unit}</TableCell>
                    <TableCell>{ing.rate}</TableCell>
                    <TableCell>{ing.amount}</TableCell>
                   
                    {idx === 0 &&  <TableCell rowSpan={row.ingredients.length}>{row.recipeyield}</TableCell>}
                    {idx === 0 &&  <TableCell rowSpan={row.ingredients.length}>{row.finalYieldRate}</TableCell>}
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

export default function BaseRecipeEntry() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeyield, setYield] = useState("");
  const [recipeData, setRecipeData] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [finalYieldRate, setFinalYieldRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  
  const [formData, setFormData] = useState({
    ingredient: "",
    unit: "",
    quantity: "",
    rate: "",
    amount: "",
  });

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

  const handleSubmit = () => {
    if (!recipeTitle || recipeData.length === 0 || !recipeyield) {
      setError("Please enter a Recipe Title, Yield value, and at least one ingredient.");
      return;
    }
    setLoading(true);
    const calculatedYieldRate = recipeData.reduce((acc, item) => acc + parseFloat(item.amount), 0) / recipeyield;
    setFinalYieldRate(calculatedYieldRate.toFixed(2));

    const newRecipe = { recipeTitle, ingredients: recipeData, recipeyield, finalYieldRate: calculatedYieldRate.toFixed(2) };

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
        setYield("");
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

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "20px" }}>
        <TextField label="Recipe Title" value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} required fullWidth />
        <TextField label="Yield" value={recipeyield} onChange={(e) => setYield(e.target.value)} required fullWidth type="number" />
        <TextField label="Final Yield Rate" value={finalYieldRate} fullWidth />
      </div>

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

      {/* Display Submitted Recipes /}
      <h3 style={{ marginTop: "20px" }}>Recipes</h3>
      {loading && <CircularProgress />}
      {!loading && allRecipes.length === 0 && <p>No recipes available.</p>}

      {!loading && allRecipes.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Recipe Title</strong></TableCell>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Yield</strong></TableCell>
                <TableCell><strong>Final Yield Rate</strong></TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRecipes.map((row, index) => (
                row.ingredients.map((ing, idx) => (
                  <TableRow key={`${index}-${idx}`}>
                    {idx === 0 && <TableCell rowSpan={row.ingredients.length}>{row.recipeTitle}</TableCell>}
                    <TableCell>{ing.ingredient}</TableCell>
                    <TableCell>{ing.quantity}</TableCell>
                    <TableCell>{ing.unit}</TableCell>
                    <TableCell>{ing.rate}</TableCell>
                    <TableCell>{ing.amount}</TableCell>
                   
                    {idx === 0 &&  <TableCell rowSpan={row.ingredients.length}>{row.recipeyield}</TableCell>}
                    {idx === 0 &&  <TableCell rowSpan={row.ingredients.length}>{row.finalYieldRate}</TableCell>}
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

      {/* Display Submitted Recipes /}
      <h3 style={{ marginTop: "20px" }}>Recipes</h3>
      {loading && <CircularProgress />}
      {!loading && allRecipes.length === 0 && <p>No recipes available.</p>}

      {!loading && allRecipes.length > 0 && (
        <TableContainer component={Paper} sx={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>Recipe Title</strong></TableCell>
                <TableCell><strong>Ingredient</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Unit</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRecipes.map((row, index) => (
                row.ingredients.map((ing, idx) => (
                  <TableRow key={`${index}-${idx}`}>
                    {idx === 0 && <TableCell rowSpan={row.ingredients.length}>{row.recipeTitle}</TableCell>}
                    <TableCell>{ing.ingredient}</TableCell>
                    <TableCell>{ing.quantity}</TableCell>
                    <TableCell>{ing.unit}</TableCell>
                    <TableCell>{ing.rate}</TableCell>
                    <TableCell>{ing.amount}</TableCell>
                    <TableCell>
                  <IconButton onClick={() => handleEdit(index)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(index)}><Delete /></IconButton>
                </TableCell>
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