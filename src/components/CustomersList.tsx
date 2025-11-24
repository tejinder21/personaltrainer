import { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { getCustomers } from "../ptapi";
import type { Customer } from "../types";

function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    getCustomers()
      .then(data => setCustomers(data._embedded.customers))
      .catch(err => console.error(err));
  }, []);

  const filtered = customers.filter(c => {
    const fullName = `${c.firstname} ${c.lastname}`.toLowerCase();
    return (
      fullName.includes(name.toLowerCase()) &&
      c.city.toLowerCase().includes(city.toLowerCase())
    );
  });

  const columns: GridColDef[] = [
    { field: "firstname", headerName: "First name", width: 140 },
    { field: "lastname", headerName: "Last name", width: 140 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "streetaddress", headerName: "Address", width: 200 },
    { field: "postcode", headerName: "Postcode", width: 100 },
    { field: "city", headerName: "City", width: 120 },
  ];

  return (
    <>
      <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Search name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            size="small"
            label="Filter city"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </Box>
      </Paper>

      <Paper sx={{ height: 520 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={row => row._links.self.href}
          autoPageSize
          rowSelection={false}
        />
      </Paper>
    </>
  );
}

export default CustomersList;
