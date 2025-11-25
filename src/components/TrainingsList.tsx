import { useEffect, useMemo, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "dayjs/locale/fi";

import { getTrainings, getCustomerName } from "../ptapi";
import type { TrainingRow } from "../types";

function TrainingsList() {
  // Kaikki treenit, joihin on lisätty myös customerName
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [filter, setFilter] = useState({ activity: "", customer: "" });

  useEffect(() => {
    async function loadTrainings() {
      const data = await getTrainings();
      const list = data._embedded.trainings;

      const result: TrainingRow[] = [];

      // Lisätään jokaiseen treeniin myös asiakkaan nimi customer-linkin avulla
      for (const training of list) {
        const url = training._links.customer?.href;
        const customerName = url ? await getCustomerName(url) : "";

        result.push({ ...training, customerName });
      }

      setTrainings(result);
    }

    loadTrainings();
  }, []);

  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) =>
      t.activity.toLowerCase().includes(filter.activity.toLowerCase()) &&
      t.customerName.toLowerCase().includes(filter.customer.toLowerCase())
    );
  }, [trainings, filter]);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueGetter: (p) =>
        dayjs(p.value as string).format("DD.MM.YYYY HH:mm"),
    },
    { field: "activity", headerName: "Activity", width: 160 },
    { field: "duration", headerName: "Duration (min)", width: 150 },
    { field: "customerName", headerName: "Customer", width: 200 },
  ];

  return (
    <>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="Filter activity"
            value={filter.activity}
            onChange={(e) =>
              setFilter({ ...filter, activity: e.target.value })
            }
          />
          <TextField
            size="small"
            label="Filter customer"
            value={filter.customer}
            onChange={(e) =>
              setFilter({ ...filter, customer: e.target.value })
            }
          />
        </Box>
      </Paper>

      <Paper sx={{ height: 520 }}>
        <DataGrid
          rows={filteredTrainings}
          columns={columns}
          getRowId={(row) => row._links.self.href}
          autoPageSize
          rowSelection={false}
        />
      </Paper>
    </>
  );
}

export default TrainingsList;
