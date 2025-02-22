import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, Select, MenuItem, TextField
} from "@mui/material";

export default function Summaryentry() {
  const [predefinedData, setPredefinedData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fooditems, setFooditems] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({ recipeName: "", costPrice: "" });

  // Fetch predefined data from MongoDB on component mount
  useEffect(() => {
    const fetchPredefinedData = async () => {
      try {
        const response = await axios.get("http://localhost:4040/api/predefined");
        setPredefinedData(response.data);
      } catch (error) {
        console.error("Error fetching predefined data:", error);
      }
    };
    fetchPredefinedData();
  }, []);

  const fetchFooditems = async () => {
    try {
      const response = await axios.get("http://localhost:4040/api/fooditems");
      setFooditems(response.data);
    } catch (error) {
      console.error("Error fetching fooditems:", error);
    }
  };

  useEffect(() => {
    fetchFooditems();
  }, []);

  const handleAddFoodItem = async () => {
    if (!selectedCity || !selectedOutlet || !selectedCategory || !newFoodItem.recipeName || !newFoodItem.costPrice) {
      alert("Please fill all fields.");
      return;
    }

    const foodItemData = {
      recipeName: newFoodItem.recipeName,
      costPrice: parseFloat(newFoodItem.costPrice),
      city: selectedCity,
      outlet: selectedOutlet,
      category: selectedCategory,
    };

    try {
      await axios.post("http://localhost:4040/api/fooditems", foodItemData);
      fetchFooditems(); // Refresh data after adding
      setNewFoodItem({ recipeName: "", costPrice: "" });
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    try {
      await axios.delete(`http://localhost:4040/api/fooditems/${id}`);
      fetchFooditems(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  // Filter outlets and categories based on selections
  const filteredOutlets = predefinedData
    .filter((data) => data.city === selectedCity)
    .flatMap((data) => data.outlets);

  const filteredCategories = filteredOutlets
    .filter((outlet) => outlet.name === selectedOutlet)
    .flatMap((outlet) => outlet.categories);

    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Recipe Summary Data Entry</h2>
  
        <div style={{ marginBottom: "20px" }}>
          <Select value={selectedCity} onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedOutlet("");
            setSelectedCategory("");
          }} displayEmpty sx={{ marginRight: "10px", width: "150px" }}>
            <MenuItem value="" disabled>Select City</MenuItem>
            {predefinedData.map((data, index) => (
              <MenuItem key={index} value={data.city}>{data.city}</MenuItem>
            ))}
          </Select>
  
          <Select value={selectedOutlet} onChange={(e) => {
            setSelectedOutlet(e.target.value);
            setSelectedCategory("");
          }} displayEmpty sx={{ marginRight: "10px", width: "150px" }} disabled={!selectedCity}>
            <MenuItem value="" disabled>Select Outlet</MenuItem>
            {filteredOutlets.map((outlet, index) => (
              <MenuItem key={index} value={outlet.name}>{outlet.name}</MenuItem>
            ))}
          </Select>
  
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty sx={{ width: "150px" }} disabled={!selectedOutlet}>
            <MenuItem value="" disabled>Select Category</MenuItem>
            {filteredCategories.map((category, index) => (
              <MenuItem key={index} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <TextField label="Recipe Name" value={newFoodItem.recipeName} onChange={(e) => setNewFoodItem({ ...newFoodItem, recipeName: e.target.value })} sx={{ width: "200px" }} />
        <TextField label="Cost Price" type="number" value={newFoodItem.costPrice} onChange={(e) => setNewFoodItem({ ...newFoodItem, costPrice: e.target.value })} sx={{ width: "150px" }} />
        <Button variant="contained" color="primary" onClick={handleAddFoodItem}>Add ITEMS</Button>
      </div>

      <TableContainer component={Paper} sx={{ width: "80%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#8BC34A" }}>
              <TableCell><strong>SR NO</strong></TableCell>
              <TableCell><strong>RECIPE NAME</strong></TableCell>
              <TableCell><strong>COST PRICE</strong></TableCell>
              <TableCell><strong>CITY</strong></TableCell>
              <TableCell><strong>OUTLET</strong></TableCell>
              <TableCell><strong>CATEGORY</strong></TableCell>
              <TableCell><strong>ACTIONS</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fooditems.map((fooditem, index) => (
              <TableRow key={fooditem._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fooditem.recipeName}</TableCell>
                <TableCell>{fooditem.costPrice}</TableCell>
                <TableCell>{fooditem.city}</TableCell>
                <TableCell>{fooditem.outlet}</TableCell>
                <TableCell>{fooditem.category}</TableCell>
                <TableCell><Button variant="contained" color="secondary" onClick={() => handleDeleteFoodItem(fooditem._id)}>Delete</Button></TableCell>
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
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Paper, Select, MenuItem, TextField
} from "@mui/material";

export default function Summaryentry() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fooditems, setFooditems] = useState([]);
  const [newFoodItem, setNewFoodItem] = useState({ recipeName: "", costPrice: "" });

  const cities = ["Mumbai", "Delhi", "Pune"];
  const outlets = { "Mumbai": ["One8", "Lod"], "Delhi": ["Yazu", "Pincode"], "Pune": ["2 BHK", "Ballr"] };
  const categories = ["Soups", "Main Course", "Appetizers"];

  // Fetch fooditems from MongoDB on component mount
  useEffect(() => {
    fetchFooditems();
  }, []);

  const fetchFooditems = async () => {
    try {
      const response = await axios.get("http://localhost:4040/api/fooditems");
      setFooditems(response.data);
    } catch (error) {
      console.error("Error fetching fooditems:", error);
    }
  };

  const handleAddFoodItem = async () => {
    if (!selectedCity || !selectedOutlet || !selectedCategory || !newFoodItem.recipeName || !newFoodItem.costPrice) {
      alert("Please fill all fields.");
      return;
    }

    const foodItemData = {
      recipeName: newFoodItem.recipeName,
      costPrice: parseFloat(newFoodItem.costPrice),
      city: selectedCity,
      outlet: selectedOutlet,
      category: selectedCategory,
    };

    try {
      await axios.post("http://localhost:4040/api/fooditems", foodItemData);
      fetchFooditems(); // Refresh data after adding
      setNewFoodItem({ recipeName: "", costPrice: "" });
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    try {
      await axios.delete(`http://localhost:4040/api/fooditems/${id}`);
      fetchFooditems(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Recipe Summary Data Entry</h2>

      <div style={{ marginBottom: "20px" }}>
        <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} displayEmpty sx={{ marginRight: "10px", width: "150px" }}>
          <MenuItem value="" disabled>Select City</MenuItem>
          {cities.map((city, index) => <MenuItem key={index} value={city}>{city}</MenuItem>)}
        </Select>

        <Select value={selectedOutlet} onChange={(e) => setSelectedOutlet(e.target.value)} displayEmpty sx={{ marginRight: "10px", width: "150px" }} disabled={!selectedCity}>
          <MenuItem value="" disabled>Select Outlet</MenuItem>
          {selectedCity && outlets[selectedCity].map((outlet, index) => <MenuItem key={index} value={outlet}>{outlet}</MenuItem>)}
        </Select>

        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty sx={{ width: "150px" }} disabled={!selectedOutlet}>
          <MenuItem value="" disabled>Select Category</MenuItem>
          {categories.map((category, index) => <MenuItem key={index} value={category}>{category}</MenuItem>)}
        </Select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <TextField label="Recipe Name" value={newFoodItem.recipeName} onChange={(e) => setNewFoodItem({ ...newFoodItem, recipeName: e.target.value })} sx={{ width: "200px" }} />
        <TextField label="Cost Price" type="number" value={newFoodItem.costPrice} onChange={(e) => setNewFoodItem({ ...newFoodItem, costPrice: e.target.value })} sx={{ width: "150px" }} />
        <Button variant="contained" color="primary" onClick={handleAddFoodItem}>Add ITEMS</Button>
      </div>

      <TableContainer component={Paper} sx={{ width: "80%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#8BC34A" }}>
              <TableCell><strong>SR NO</strong></TableCell>
              <TableCell><strong>RECIPE NAME</strong></TableCell>
              <TableCell><strong>COST PRICE</strong></TableCell>
              <TableCell><strong>CITY</strong></TableCell>
              <TableCell><strong>OUTLET</strong></TableCell>
              <TableCell><strong>CATEGORY</strong></TableCell>
              <TableCell><strong>ACTIONS</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fooditems.map((fooditem, index) => (
              <TableRow key={fooditem._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{fooditem.recipeName}</TableCell>
                <TableCell>{fooditem.costPrice}</TableCell>
                <TableCell>{fooditem.city}</TableCell>
                <TableCell>{fooditem.outlet}</TableCell>
                <TableCell>{fooditem.category}</TableCell>
                <TableCell><Button variant="contained" color="secondary" onClick={() => handleDeleteFoodItem(fooditem._id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
*/}