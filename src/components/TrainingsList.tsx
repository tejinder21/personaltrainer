import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import "dayjs/locale/fi";

import {
  getTrainings,
  getCustomerName,
  deleteTraining,
} from "../ptapi";
import type { TrainingRow } from "../types";
import AddTraining from "./AddTraining";

function TrainingsList() {
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [filter, setFilter] = useState({ activity: "", customer: "" });

  const fetchTrainings = () => {
    (async () => {
      const data = await getTrainings();
      const list = data._embedded.trainings;

      const result: TrainingRow[] = [];

      for (const training of list) {
        const url = training._links.customer?.href;
        const customerName = url ? await getCustomerName(url) : "";
        result.push({ ...training, customerName });
      }

      setTrainings(result);
    })().catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const filteredTrainings = useMemo(
    () =>
      trainings.filter(
        t =>
          t.activity.toLowerCase().includes(filter.activity.toLowerCase()) &&
          t.customerName.toLowerCase().includes(filter.customer.toLowerCase())
      ),
    [trainings, filter]
  );

  const handleDelete = (row: TrainingRow) => {
    if (window.confirm("Poistetaanko tämä harjoitus?")) {
      deleteTraining(row._links.self.href)
        .then(() => fetchTrainings())
        .catch(err => console.error(err));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueGetter: params =>
        dayjs(params.value as string).format("DD.MM.YYYY HH:mm"),
    },
    { field: "activity", headerName: "Activity", width: 160 },
    { field: "duration", headerName: "Duration (min)", width: 150 },
    { field: "customerName", headerName: "Customer", width: 200 },
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
          onClick={() => handleDelete(params.row as TrainingRow)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <TextField
            size="small"
            label="Filter activity"
            value={filter.activity}
            onChange={e =>
              setFilter({ ...filter, activity: e.target.value })
            }
          />
          <TextField
            size="small"
            label="Filter customer"
            value={filter.customer}
            onChange={e =>
              setFilter({ ...filter, customer: e.target.value })
            }
          />
        </Box>

        {/* UUDEN HARJOITUKSEN LISÄYS */}
        <AddTraining fetchTrainings={fetchTrainings} />
      </Paper>

      <Paper sx={{ height: 520 }}>
        <DataGrid
          rows={filteredTrainings}
          columns={columns}
          getRowId={row => row._links.self.href}
          autoPageSize
          rowSelection={false}
        />
      </Paper>
    </>
  );
}

export default TrainingsList;
