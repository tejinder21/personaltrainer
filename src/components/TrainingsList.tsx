import { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { getTrainings, getCustomerName } from "../ptapi";
import type { TrainingRow } from "../types";

function TrainingsList() {
  const [rows, setRows] = useState<TrainingRow[]>([]);
  const [filter, setFilter] = useState({ activity: "", customer: "" });

  useEffect(() => {
    async function load() {
      const data = await getTrainings();
      const list = data._embedded.trainings;

      const result: TrainingRow[] = [];

      for (const t of list) {
        const url = t._links.customer?.href;
        const customerName = url ? await getCustomerName(url) : "";

        result.push({ ...t, customerName });
      }

      setRows(result);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter(r =>
      r.activity.toLowerCase().includes(filter.activity.toLowerCase()) &&
      r.customerName.toLowerCase().includes(filter.customer.toLowerCase())
    );
  }, [rows, filter]);

  return (
    <>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            label="Filter activity"
            value={filter.activity}
            onChange={e => setFilter({ ...filter, activity: e.target.value })}
          />
          <TextField
            size="small"
            label="Filter customer"
            value={filter.customer}
            onChange={e => setFilter({ ...filter, customer: e.target.value })}
          />
        </Box>
      </Paper>

      <Paper sx={{ height: 520 }}>
        <DataGrid
          rows={filtered}
          columns={[
            {
              field: "date",
              headerName: "Date",
              width: 200,
              valueGetter: p => dayjs(p.value).format("DD.MM.YYYY HH:mm")
            },
            { field: "activity", headerName: "Activity", width: 160 },
            { field: "duration", headerName: "Duration (min)", width: 150 },
            { field: "customerName", headerName: "Customer", width: 200 }
          ]}
          getRowId={row => row._links.self.href}
          autoPageSize
          rowSelection={false}
        />
      </Paper>
    </>
  );
}

export default TrainingsList;
