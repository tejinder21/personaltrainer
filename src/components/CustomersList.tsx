import { useEffect, useState } from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { getCustomers, deleteCustomer } from "../ptapi";
import type { Customer } from "../types";
import Button from "@mui/material/Button";
import EditCustomer from "./EditCustomer";
import AddCustomer from "./AddCustomer";
import ExportCustomersCsv from "./ExportCustomersCsv"; 

function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const fetchCustomers = () => {
    getCustomers()
      .then(data => setCustomers(data._embedded.customers))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstname ?? ""} ${customer.lastname ?? ""}`.toLowerCase();
    const customerCity = (customer.city ?? "").toLowerCase();

    return (
      fullName.includes(name.toLowerCase()) &&
      customerCity.includes(city.toLowerCase())
    );
  });

  const handleDelete = (customer: Customer) => {
    if (window.confirm(`Poistetaanko asiakas ${customer.firstname} ${customer.lastname}?`)) {
      deleteCustomer(customer._links.self.href)
        .then(() => fetchCustomers())
        .catch(err => console.error(err));
    }
  };

  const columns: GridColDef[] = [
    { field: "firstname", headerName: "First name", width: 140 },
    { field: "lastname", headerName: "Last name", width: 140 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "streetaddress", headerName: "Address", width: 200 },
    { field: "postcode", headerName: "Postcode", width: 100 },
    { field: "city", headerName: "City", width: 120 },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <EditCustomer
          fetchCustomers={fetchCustomers}
          customerRow={params.row as Customer}
        />
      ),
    },
    {
      field: "delete",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          color="error"
          size="small"
          onClick={() => handleDelete(params.row as Customer)}
        >
          Delete
        </Button>
      ),
    },
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
        <AddCustomer fetchCustomers={fetchCustomers} />
        <ExportCustomersCsv customers={filteredCustomers} /> {/* CSV */}
      </Paper>

      <Paper sx={{ height: 520 }}>
        <DataGrid
          rows={filteredCustomers}
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
