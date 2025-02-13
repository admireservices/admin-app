import React, { useState, useEffect } from "react";
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
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios"; // Import axios for API calls

export default function FoodRecipe() {
  const [editMode, setEditMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const cities = ["Mumbai", "Delhi", "Pune"];
  const outlets = ["Outlet A", "Outlet B", "Outlet C"];

  // Fetch recipes dynamically based on selected city and outlet
  useEffect(() => {
    if (selectedCity && selectedOutlet) {
      setLoading(true);
      axios
        .get(`https://localhost:4040/api/fooditems`, {
          params: { city: selectedCity, outlet: selectedOutlet },
        })
        .then((response) => {
          setRecipes(response.data);
          if (response.data.length > 0) {
            setSelectedRecipe(response.data[0]); // Select first recipe by default
            setData(
              response.data[0].ingredients.map((i) => ({
                ...i,
                amount: i.qty * i.rate,
              }))
            );
          }
        })
        .catch((error) => console.error("Error fetching recipes:", error))
        .finally(() => setLoading(false));
    }
  }, [selectedCity, selectedOutlet]);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["qty"] * updatedData[index]["rate"];
    setData(updatedData);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setData(recipe.ingredients.map((i) => ({ ...i, amount: i.qty * i.rate })));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={2}>
        {/* Left Side - Recipe List */}
        <Grid item xs={3}>
          <h3>Recipes</h3>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {recipes.map((recipe, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    selected={selectedRecipe?.name === recipe.name}
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <ListItemText primary={recipe.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Grid>

        {/* Right Side - Table & Controls */}
        <Grid item xs={9}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            {/* City Dropdown */}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>City</InputLabel>
              <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Outlet Dropdown */}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Outlet</InputLabel>
              <Select value={selectedOutlet} onChange={(e) => setSelectedOutlet(e.target.value)}>
                {outlets.map((outlet, index) => (
                  <MenuItem key={index} value={outlet}>
                    {outlet}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Recipe Title */}
          {selectedRecipe && (
            <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>
              {selectedRecipe.name}
            </h2>
          )}

          {/* Table */}
          <TableContainer component={Paper}>
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
                          onChange={(e) => handleChange(index, "qty", Number(e.target.value))}
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
                          onChange={(e) => handleChange(index, "rate", Number(e.target.value))}
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

          {/* Edit/Save Button */}
          <Button
            variant="contained"
            color={editMode ? "success" : "primary"}
            onClick={handleEdit}
            sx={{ marginTop: "20px" }}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        </Grid>
      </Grid>
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
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export default function FoodRecipe() {
  const [editMode, setEditMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [data, setData] = useState([]);

  // Sample cities and outlets
  const cities = ["Mumbai", "Delhi", "Pune"];
  const outlets = ["Outlet A", "Outlet B", "Outlet C"];

  // Sample API call to fetch recipe data based on city & outlet
  useEffect(() => {
    if (selectedCity && selectedOutlet) {
      // Simulate fetching data
      const fetchedRecipes = [
        {
          name: "TOM YUM TOFU",
          ingredients: [
            { ingredient: "Broccoli", unit: "Gm", qty: 10, rate: 0.26 },
            { ingredient: "Baby Corn", unit: "Gm", qty: 10, rate: 0.09 },
          ],
        },
        {
          name: "SPICY RAMEN",
          ingredients: [
            { ingredient: "Noodles", unit: "Gm", qty: 200, rate: 0.5 },
            { ingredient: "Soy Sauce", unit: "Ml", qty: 50, rate: 0.3 },
          ],
        },
      ];
      setRecipes(fetchedRecipes);
      setSelectedRecipe(fetchedRecipes[0]); // Default to first recipe
      setData(fetchedRecipes[0].ingredients.map(i => ({ ...i, amount: i.qty * i.rate })));
    }
  }, [selectedCity, selectedOutlet]);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["qty"] * updatedData[index]["rate"];
    setData(updatedData);
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setData(recipe.ingredients.map(i => ({ ...i, amount: i.qty * i.rate })));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={2}>
        {/* Left Side - Recipe List /}
        <Grid item xs={3}>
          <h3>Recipes</h3>
          <List>
            {recipes.map((recipe, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  selected={selectedRecipe?.name === recipe.name}
                  onClick={() => handleRecipeSelect(recipe)}
                >
                  <ListItemText primary={recipe.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Right Side - Table & Controls /}
        <Grid item xs={9}>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            {/* City Dropdown /}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>City</InputLabel>
              <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Outlet Dropdown /}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Outlet</InputLabel>
              <Select value={selectedOutlet} onChange={(e) => setSelectedOutlet(e.target.value)}>
                {outlets.map((outlet, index) => (
                  <MenuItem key={index} value={outlet}>
                    {outlet}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Recipe Title /}
          {selectedRecipe && (
            <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>
              {selectedRecipe.name}
            </h2>
          )}

          {/* Table /}
          <TableContainer component={Paper}>
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
                          onChange={(e) => handleChange(index, "qty", Number(e.target.value))}
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
                          onChange={(e) => handleChange(index, "rate", Number(e.target.value))}
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

          {/* Edit/Save Button /}
          <Button
            variant="contained"
            color={editMode ? "success" : "primary"}
            onClick={handleEdit}
            sx={{ marginTop: "20px" }}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
        </Grid>
      </Grid>
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
} from "@mui/material";

export default function Foodrecipe() {
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState([
    { ingredient: "Broccoli", unit: "Gm", qty: 10, rate: 0.26, amount: 2.63 },
    { ingredient: "Baby Corn", unit: "Gm", qty: 10, rate: 0.09, amount: 0.89 },
    { ingredient: "Button Mushroom", unit: "Gm", qty: 10, rate: 0.13, amount: 1.30 },
    { ingredient: "Zucchini Green", unit: "Gm", qty: 10, rate: 0.09, amount: 0.89 },
    { ingredient: "Tom Yum Curry Paste", unit: "Gm", qty: 30, rate: 0.52, amount: 15.46 },
    { ingredient: "Tomato", unit: "Gm", qty: 10, rate: 0.04, amount: 0.39 },
    { ingredient: "Lemon Grass Stick", unit: "Gm", qty: 2, rate: 0.09, amount: 0.17 },
  ]);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    updatedData[index]["amount"] = updatedData[index]["qty"] * updatedData[index]["rate"]; // Auto-update amount
    setData(updatedData);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ backgroundColor: "#d0e8b6", padding: "10px" }}>TOM YUM TOFU</h2>
      
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
                      onChange={(e) => handleChange(index, "qty", e.target.value)}
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
                      onChange={(e) => handleChange(index, "rate", e.target.value)}
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