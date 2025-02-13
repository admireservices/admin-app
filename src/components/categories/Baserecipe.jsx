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
      {/* Dropdowns for City, Outlet, and Recipe */}
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

      {/* Recipe Name */}
      <h2 style={{ backgroundColor: '#d0e8b6', padding: '10px' }}>
        {recipes.find((r) => r._id === selectedRecipe)?.recipeTitle}
      </h2>

      {/* Table */}
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
           {/* Cost Calculations */}
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

      {/* Edit/Save Button */}
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function BaseRecipe() {
  const [city, setCity] = useState("New York");
  const [outlet, setOutlet] = useState("Outlet A");
  const [editMode, setEditMode] = useState(false);
  const [recipe, setRecipe] = useState("LEMON JUICE (SF)");

  const recipesData = {
    "LEMON JUICE (SF)": [
      { ingredient: "Lemon", unit: "Gm", qty: 1000, rate: 0.09, amount: 90.00 },
    ],
    "RED CHILLI PASTE (SF)": [
      { ingredient: "Kashmiri Chilli Whole", unit: "Gm", qty: 1000, rate: 0.79, amount: 790.13 },
      { ingredient: "Water", unit: "Ml", qty: 1000, rate: 0, amount: 0 },
    ],
  };

  const [data, setData] = useState(recipesData[recipe]);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["qty"] * updatedData[index]["rate"]; // Auto-update amount
    setData(updatedData);
  };

  const handleRecipeChange = (event) => {
    setRecipe(event.target.value);
    setData(recipesData[event.target.value]); // Update table based on recipe selection
  };

  // Calculations
  const costPerBatch = data.reduce((sum, row) => sum + row.amount, 0);
  const yieldValue = recipe === "LEMON JUICE (SF)" ? 300 : 1500;
  const costPerGmMl = costPerBatch / yieldValue;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Dropdowns for City and Outlet /}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
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
          <Select value={recipe} onChange={handleRecipeChange}>
            <MenuItem value="LEMON JUICE (SF)">LEMON JUICE (SF)</MenuItem>
            <MenuItem value="RED CHILLI PASTE (SF)">RED CHILLI PASTE (SF)</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Recipe Name /}
      <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>{recipe}</h2>

      {/* Table /}
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
                      value={row.qty}
                      onChange={(e) => handleChange(index, "qty", parseFloat(e.target.value) || 0)}
                      sx={{ width: "60px" }}
                    />
                  ) : (
                    row.qty
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