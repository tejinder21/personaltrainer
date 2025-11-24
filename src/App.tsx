import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import CustomersList from "./components/CustomersList";
import TrainingsList from "./components/TrainingsList";

function App() {
  const [page, setPage] = useState<"customers" | "trainings">("customers");

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            PersonalTrainer
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              color={page === "customers" ? "secondary" : "inherit"}
              onClick={() => setPage("customers")}
            >
              Customers
            </Button>
            <Button
              color={page === "trainings" ? "secondary" : "inherit"}
              onClick={() => setPage("trainings")}
            >
              Trainings
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {page === "customers" ? <CustomersList /> : <TrainingsList />}

      <CssBaseline />
    </Container>
  );
}

export default App;
