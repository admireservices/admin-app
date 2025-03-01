import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function BaseRecipe() {
  const [cities, setCities] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4040/api/cities").then((res) => setCities(res.data));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      axios
        .get(`http://localhost:4040/api/restaurants?city=${selectedCity}`)
        .then((res) => setRestaurants(res.data));
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedRestaurant) {
      axios
        .get(`http://localhost:4040/api/baserecipe?restaurant=${selectedRestaurant}`)
        .then((res) => setRecipes(res.data));
    }
  }, [selectedRestaurant]);

  const handleRecipeSelect = (event, newValue) => {
    if (newValue) {
      setSelectedRecipe(newValue);
      axios
        .get(`http://localhost:4040/api/baserecipe/${newValue._id}`)
        .then((res) => setData(res.data.ingredients));
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      axios
        .put(`http://localhost:4040/api/baserecipe/${selectedRecipe._id}`, { ingredients: data })
        .then(() => console.log("Recipe updated successfully"));
    }
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["quantity"] * updatedData[index]["rate"];
    setData(updatedData);
  };

  const costPerBatch = data.reduce((sum, row) => sum + row.amount, 0);
  const yieldValue = selectedRecipe?.recipeyield || 1;
  const costPerGmMl = costPerBatch / yieldValue;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <FormControl sx={{ minWidth: 200, marginRight: 2 }}>
        <InputLabel>City</InputLabel>
        <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>{city}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200, marginRight: 2 }}>
        <InputLabel>Restaurant</InputLabel>
        <Select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          disabled={!selectedCity}
        >
          {restaurants.map((restaurant) => (
            <MenuItem key={restaurant} value={restaurant}>{restaurant}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
        options={recipes}
        getOptionLabel={(option) => option.recipeTitle}
        onChange={handleRecipeSelect}
        renderInput={(params) => <TextField {...params} label="Search Recipe" />}
        sx={{ width: 300, marginBottom: "20px", margin: "auto" }}
        disabled={!selectedRestaurant}
      />

      {selectedRecipe && <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>{selectedRecipe.recipeTitle}</h2>}

      {selectedRecipe && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto", maxHeight: 400, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>INGREDIENT</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>QTY</strong></TableCell>
                <TableCell><strong>RATE</strong></TableCell>
                <TableCell><strong>AMOUNT</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ingredient}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleChange(index, "quantity", parseFloat(e.target.value) || 0)}
                        sx={{ width: "60px" }}
                      />
                    ) : (
                      row.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        type="number"
                        value={row.rate}
                        onChange={(e) => handleChange(index, "rate", parseFloat(e.target.value) || 0)}
                        sx={{ width: "60px" }}
                      />
                    ) : (
                      row.rate
                    )}
                  </TableCell>
                  <TableCell>{row.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedRecipe && (
        <Button
          variant="contained"
          color={editMode ? "success" : "primary"}
          onClick={handleEdit}
          sx={{ marginTop: "20px" }}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
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
  Button,
  Paper,
  TextField,
  Autocomplete,
} from "@mui/material";

export default function BaseRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4040/api/baserecipe")
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  const handleRecipeSelect = (event, newValue) => {
    if (newValue) {
      setSelectedRecipe(newValue);
      axios
        .get(`http://localhost:4040/api/baserecipe/${newValue._id}`)
        .then((response) => setData(response.data.ingredients))
        .catch((error) => console.error("Error fetching recipe details:", error));
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      axios
        .put(`http://localhost:4040/api/baserecipe/${selectedRecipe._id}`, { ingredients: data })
        .then(() => console.log("Recipe updated successfully"))
        .catch((error) => console.error("Error updating recipe:", error));
    }
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["quantity"] * updatedData[index]["rate"];
    setData(updatedData);
  };

  const costPerBatch = data.reduce((sum, row) => sum + row.amount, 0);
  const yieldValue = selectedRecipe?.recipeyield || 1;
  const costPerGmMl = costPerBatch / yieldValue;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Autocomplete
        options={recipes}
        getOptionLabel={(option) => option.recipeTitle}
        onChange={handleRecipeSelect}
        renderInput={(params) => <TextField {...params} label="Search Recipe" />}
        sx={{ width: 300, marginBottom: "20px", margin: "auto" }}
      />

      {selectedRecipe && <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>{selectedRecipe.recipeTitle}</h2>}

      {selectedRecipe && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>INGREDIENT</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>QTY</strong></TableCell>
                <TableCell><strong>RATE</strong></TableCell>
                <TableCell><strong>AMOUNT</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ingredient}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleChange(index, "quantity", parseFloat(e.target.value) || 0)}
                        sx={{ width: "60px" }}
                      />
                    ) : (
                      row.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        type="number"
                        value={row.rate}
                        onChange={(e) => handleChange(index, "rate", parseFloat(e.target.value) || 0)}
                        sx={{ width: "60px" }}
                      />
                    ) : (
                      row.rate
                    )}
                  </TableCell>
                  <TableCell>{row.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}><strong>Cost Per Batch</strong></TableCell>
                <TableCell><strong>{costPerBatch.toFixed(2)}</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}><strong>Yield</strong></TableCell>
                <TableCell><strong>{yieldValue}</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}><strong>Cost Per Gm / Ml</strong></TableCell>
                <TableCell><strong>{costPerGmMl.toFixed(2)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedRecipe && (
        <Button
          variant="contained"
          color={editMode ? "success" : "primary"}
          onClick={handleEdit}
          sx={{ marginTop: "20px" }}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
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
  Button,
  Paper,
  TextField,
  Autocomplete,
} from "@mui/material";

export default function BaseRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch recipes from backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:4040/api/baserecipe")
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  }, []);

  // Fetch recipe details when a recipe is selected
  const handleRecipeSelect = (event, newValue) => {
    if (newValue) {
      setSelectedRecipe(newValue);
      setLoading(true);
      axios
        .get(`http://localhost:4040/api/baserecipe/${newValue._id}`)
        .then((response) => {
          setData(response.data.ingredients);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching recipe details:", error);
          setLoading(false);
        });
    }
  };

  // Handle edit mode and save updates
  const handleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      axios
        .put(`http://localhost:4040/api/baserecipe/${selectedRecipe._id}`, { ingredients: data })
        .then(() => console.log("Recipe updated successfully"))
        .catch((error) => console.error("Error updating recipe:", error));
    }
  };

  // Handle input changes for ingredients
  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["quantity"] * updatedData[index]["rate"];
    setData(updatedData);
  };

  // Cost calculations
  const costPerBatch = data.reduce((sum, row) => sum + row.amount, 0);
  const yieldValue = selectedRecipe?.recipeTitle === "LEMON JUICE (SF)" ? 300 : 1500;
  const costPerGmMl = costPerBatch / yieldValue;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Recipe Search Field /}
      <Autocomplete
        options={recipes}
        getOptionLabel={(option) => option.recipeTitle}
        onChange={handleRecipeSelect}
        renderInput={(params) => <TextField {...params} label="Search Recipe" />}
        sx={{ width: 300, marginBottom: "20px", margin: "auto" }}
      />

      {/* Recipe Title Header /}
      {selectedRecipe && (
        <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>{selectedRecipe.recipeTitle}</h2>
      )}

      {/* Table /}
      {selectedRecipe && (
        <TableContainer component={Paper} sx={{ width: "80%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8BC34A" }}>
                <TableCell><strong>INGREDIENT</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>QTY</strong></TableCell>
                <TableCell><strong>RATE</strong></TableCell>
                <TableCell><strong>AMOUNT</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ingredient}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleChange(index, "quantity", parseFloat(e.target.value) || 0)}
                        sx={{ width: "60px" }}
                      />
                    ) : (
                      row.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode ? (
                      <TextField
                        type="number"
                        value={row.rate}
                        onChange={(e) => handleChange(index, "rate", parseFloat(e.target.value) || 0)}
                        sx={{ width: "60px" }}
                      />
                    ) : (
                      row.rate
                    )}
                  </TableCell>
                  <TableCell>{row.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* Cost Calculations /}
              <TableRow>
                <TableCell colSpan={4}><strong>Cost Per Batch</strong></TableCell>
                <TableCell><strong>{costPerBatch.toFixed(2)}</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}><strong>Yield</strong></TableCell>
                <TableCell><strong>{yieldValue}</strong></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}><strong>Cost Per Gm / Ml</strong></TableCell>
                <TableCell><strong>{costPerGmMl.toFixed(2)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit/Save Button /}
      {selectedRecipe && (
        <Button
          variant="contained"
          color={editMode ? "success" : "primary"}
          onClick={handleEdit}
          sx={{ marginTop: "20px" }}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
      )}
    </div>
  );
}




{/*}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

export default function BaseRecipe() {
  const [city, setCity] = useState('New York');
  const [outlet, setOutlet] = useState('Outlet A');
  const [editMode, setEditMode] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch recipes from the backend
    axios
      .get('/api/recipes')
      .then((response) => {
        setRecipes(response.data);
        if (response.data.length > 0) {
          setSelectedRecipe(response.data[0]._id);
          setData(response.data[0].ingredients);
        }
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const handleEdit = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Save changes to the backend
      axios
        .put(`/api/recipes/${selectedRecipe}`, { ingredients: data })
        .then((response) => {
          console.log('Recipe updated:', response.data);
        })
        .catch((error) => {
          console.error('Error updating recipe:', error);
        });
    }
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]['amount'] =
      updatedData[index]['quantity'] * updatedData[index]['rate']; // Auto-update amount
    setData(updatedData);
  };

  const handleRecipeChange = (event) => {
    const recipeId = event.target.value;
    setSelectedRecipe(recipeId);
    const selected = recipes.find((recipe) => recipe._id === recipeId);
    setData(selected.ingredients);
  };

  // Calculations
  const costPerBatch = data.reduce((sum, row) => sum + row.amount, 0);
  const yieldValue = selectedRecipe === 'LEMON JUICE (SF)' ? 300 : 1500;
  const costPerGmMl = costPerBatch / yieldValue;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* Dropdowns for City, Outlet, and Recipe /}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <FormControl sx={{ width: 200 }}>
          <InputLabel>City</InputLabel>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <MenuItem value="New York">New York</MenuItem>
            <MenuItem value="Los Angeles">Los Angeles</MenuItem>
            <MenuItem value="Chicago">Chicago</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: 200 }}>
          <InputLabel>Outlet</InputLabel>
          <Select value={outlet} onChange={(e) => setOutlet(e.target.value)}>
            <MenuItem value="Outlet A">Outlet A</MenuItem>
            <MenuItem value="Outlet B">Outlet B</MenuItem>
            <MenuItem value="Outlet C">Outlet C</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: 200 }}>
          <InputLabel>Recipe</InputLabel>
          <Select value={selectedRecipe} onChange={handleRecipeChange}>
            {recipes.map((recipe) => (
              <MenuItem key={recipe._id} value={recipe._id}>
                {recipe.recipeTitle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Recipe Name /}
      <h2 style={{ backgroundColor: '#d0e8b6', padding: '10px' }}>
        {recipes.find((r) => r._id === selectedRecipe)?.recipeTitle}
      </h2>

      {/* Table /}
      <TableContainer component={Paper} sx={{ width: '80%', margin: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#8BC34A' }}>
              <TableCell>
                <strong>INGREDIENT</strong>
              </TableCell>
              <TableCell>
                <strong>UNIT</strong>
              </TableCell>
              <TableCell>
                <strong>QTY</strong>
              </TableCell>
              <TableCell>
                <strong>RATE</strong>
              </TableCell>
              <TableCell>
                <strong>AMOUNT</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.ingredient}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>
                  {editMode ? (
                    <TextField
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleChange(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      sx={{ width: '60px' }}
                    />
                  ) : (
                    row.quantity
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <TextField
                      type="number"
                      value={row.rate}
                      onChange={(e) =>
                        handleChange(index, 'rate', parseFloat(e.target.value) || 0)
                      }
                      sx={{ width: '60px' }}
                    />
                  ) : (
                    row.rate
                  )}
                </TableCell>
                <TableCell>{row.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
           {/* Cost Calculations /}
            <TableRow>
              <TableCell colSpan={4}><strong>Cost Per Batch</strong></TableCell>
              <TableCell><strong>{costPerBatch.toFixed(2)}</strong></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}><strong>Yield</strong></TableCell>
              <TableCell><strong>{yieldValue}</strong></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}><strong>Cost Per Gm / Ml</strong></TableCell>
              <TableCell><strong>{costPerGmMl.toFixed(2)}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit/Save Button /}
      <Button
        variant="contained"
        color={editMode ? "success" : "primary"}
        onClick={handleEdit}
        sx={{ marginTop: "20px" }}
      >
        {editMode ? "Save" : "Edit"}
      </Button>
    </div>
  );
}
*/}
