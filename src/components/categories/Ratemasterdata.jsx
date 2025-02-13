import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function RateMasterData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4040/api/rateMaster") // Update with actual API endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Rate Master Data</h2>

      {/* Loading Indicator */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
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
