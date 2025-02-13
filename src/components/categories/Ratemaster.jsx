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

export default function RateMaster() {
  const [formData, setFormData] = useState({
    systemItemName: "",
    recipeItemName: "",
    unit: "",
    purchaseRate: "",
    quantity: "",
    rate: "",
    category: "",
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
    fetch("http://localhost:4040/api/rateMaster") // Update with actual backend API
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

    fetch("http://localhost:4040/api/rateMaster", {
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
        setFormData({
          systemItemName: "",
          recipeItemName: "",
          unit: "",
          purchaseRate: "",
          quantity: "",
          rate: "",
          category: "",
        });
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
      fetch("http://localhost:4040/api/rateMaster/upload", {
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
      <h2>Rate Master</h2>

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="System Item Name" name="systemItemName" value={formData.systemItemName} onChange={handleChange} required />
        <TextField label="Recipe Item Name" name="recipeItemName" value={formData.recipeItemName} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Purchase Rate" name="purchaseRate" type="number" value={formData.purchaseRate} onChange={handleChange} required />
        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        <TextField label="Rate" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : "Add Rate"}
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
                <TableCell><strong>System Item Name</strong></TableCell>
                <TableCell><strong>Recipe Item Name</strong></TableCell>
                <TableCell><strong>UNIT</strong></TableCell>
                <TableCell><strong>Purchase Rate</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Rate</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.systemItemName}</TableCell>
                  <TableCell>{row.recipeItemName}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.purchaseRate}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.rate}</TableCell>
                  <TableCell>{row.category}</TableCell>
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

const Ratemaster = () => {
  const [formData, setFormData] = useState({
    systemItemName: "",
    recipeItemName: "",
    unit: "",
    purchaseRate: "",
    quantity: "",
    rate: "",
    category: "",
  });

  const [dataList, setDataList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addData = () => {
    if (!formData.systemItemName.trim() || !formData.recipeItemName.trim()) {
      alert("System Item Name and Recipe Item Name are required!");
      return;
    }

    setDataList([...dataList, formData]);
    setFormData({
      systemItemName: "",
      recipeItemName: "",
      unit: "",
      purchaseRate: "",
      quantity: "",
      rate: "",
      category: "",
    });
  };

  const removeData = (index) => {
    setDataList(dataList.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(sheet);

      const formattedData = excelData.map((row) => ({
        systemItemName: row["System Item Name"] || "",
        recipeItemName: row["Recipe Item Name"] || "",
        unit: row["Unit"] || "",
        purchaseRate: row["Purchase Rate"] || "",
        quantity: row["Quantity"] || "",
        rate: row["Rate"] || "",
        category: row["Category"] || "",
      }));

      setDataList([...dataList, ...formattedData]);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-300">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Ingredients Rate Master
      </h2>

      {/* Excel Upload /}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Upload Excel File:
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Input Fields in Single Row /}
      <div className="grid grid-cols-7 gap-x-4 items-end mb-6">
        {[
          { label: "System Item Name", name: "systemItemName" },
          { label: "Recipe Item Name", name: "recipeItemName" },
          { label: "Unit", name: "unit" },
          { label: "Purchase Rate", name: "purchaseRate", type: "number" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Rate", name: "rate", type: "number" },
          { label: "Category", name: "category" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name} className="flex flex-col">
            <label className="text-gray-700 font-semibold">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Add Button /}
      <button
        onClick={addData}
        className="w-full bg-green-500 text-white py-3 text-lg font-semibold rounded-lg hover:bg-green-600 transition"
      >
        Add Data
      </button>

      {/* Data Table /}
      {dataList.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Entered Data
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-700 text-white">
                  {[
                    "System Item Name",
                    "Recipe Item Name",
                    "Unit",
                    "Purchase Rate",
                    "Quantity",
                    "Rate",
                    "Category",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="border px-6 py-3">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList.map((data, index) => (
                  <tr
                    key={index}
                    className={`text-center ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="border px-6 py-3">{data.systemItemName}</td>
                    <td className="border px-6 py-3">{data.recipeItemName}</td>
                    <td className="border px-6 py-3">{data.unit}</td>
                    <td className="border px-6 py-3">{data.purchaseRate}</td>
                    <td className="border px-6 py-3">{data.quantity}</td>
                    <td className="border px-6 py-3">{data.rate}</td>
                    <td className="border px-6 py-3">{data.category}</td>
                    <td className="border px-6 py-3">
                      <button
                        onClick={() => removeData(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                       Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ratemaster;
*/}