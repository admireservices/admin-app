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
} from "@mui/material";

export default function RateMasterEntry() {
  const [formData, setFormData] = useState({
    systemItemName: "",
    recipeItemName: "",
    unit: "",
    purchaseRate: "",
    packingUOM: "",
    conversion: "",
    yield: "",
    yieldFinalRate: "",
    category: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/ratemaster") // Update with actual backend API
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

    fetch("http://localhost:5000/api/ratemaster", {
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
          packingUOM: "",
          conversion: "",
          yield: "",
          yieldFinalRate: "",
          category: "",
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Entry</h2>

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        <TextField label="System Item Name" name="systemItemName" value={formData.systemItemName} onChange={handleChange} required />
        <TextField label="Recipe Item Name" name="recipeItemName" value={formData.recipeItemName} onChange={handleChange} required />
        <TextField label="Unit" name="unit" value={formData.unit} onChange={handleChange} required />
        <TextField label="Purchase Rate" name="purchaseRate" type="number" value={formData.purchaseRate} onChange={handleChange} required />
        <TextField label="Packing UOM" name="packingUOM" value={formData.packingUOM} onChange={handleChange} required />
        <TextField label="Conversion" name="conversion" type="number" value={formData.conversion} onChange={handleChange} required />
        <TextField label="Yield" name="yield" type="number" value={formData.yield} onChange={handleChange} required />
        <TextField label="Yield Final Rate" name="yieldFinalRate" type="number" value={formData.yieldFinalRate} onChange={handleChange} required />
        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required />

        <Button type="submit" variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : "Add Rate"}
        </Button>
      </form>

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
                <TableCell><strong>Packing UOM</strong></TableCell>
                <TableCell><strong>Conversion</strong></TableCell>
                <TableCell><strong>Yield</strong></TableCell>
                <TableCell><strong>Yield Final Rate</strong></TableCell>
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
                  <TableCell>{row.packingUOM}</TableCell>
                  <TableCell>{row.conversion}</TableCell>
                  <TableCell>{row.yield}</TableCell>
                  <TableCell>{row.yieldFinalRate}</TableCell>
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
import { useTable } from "@tanstack/react-table";
import * as XLSX from "xlsx";

const Ratemaster = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    systemItemName: "",
    unit: "",
    purchaseRate: "",
    packingUOM: "",
    conversionPerGMML: "",
    yield: "",
    yieldFinalRate: "",
    category: "",
  });

  // Table Columns
  const columns = [
    { Header: "System Item Name", accessor: "systemItemName" },
    { Header: "UNIT", accessor: "unit" },
    { Header: "Purchase Rate", accessor: "purchaseRate" },
    { Header: "Packing UOM", accessor: "packingUOM" },
    { Header: "Conversion Per GM/ML", accessor: "conversionPerGMML" },
    { Header: "Yield", accessor: "yield" },
    { Header: "Yield Final Rate", accessor: "yieldFinalRate" },
    { Header: "Category", accessor: "category" },
  ];

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Data Manually
  const handleAdd = () => {
    setData([...data, formData]);
    setFormData({
      systemItemName: "",
      unit: "",
      purchaseRate: "",
      packingUOM: "",
      conversionPerGMML: "",
      yield: "",
      yieldFinalRate: "",
      category: "",
    });
  };

  // Handle Excel Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData([...data, ...parsedData]);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Rate Master</h2>

      {/* Form Inputs /}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded shadow">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key.replace(/([A-Z])/g, " $1").trim()}
            value={formData[key]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        ))}
        <button onClick={handleAdd} className="col-span-4 bg-blue-500 text-white p-2 rounded">
          Add Entry
        </button>
      </div>

      {/* Upload Excel /}
      <div className="my-4">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

      {/* Table /}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="border p-2">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="border p-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ratemaster;
*/}