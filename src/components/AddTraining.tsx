
import { useEffect, useState } from "react";

// Materia-UI komponentteja dialogia ja kenttiä varten
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// Tyypit (Customer ja TrainingForm)
import type { Customer, TrainingForm } from "../types";

// API-kutsut: 
import { addTraining, getCustomers } from "../ptapi";

// Parent-komponentilta tuleva prop: fetchTrainings päivittää treenilistan
type AddTrainingProps = {
  fetchTrainings: () => void;
};

export default function AddTraining({ fetchTrainings }: AddTrainingProps) {
  // Avataanko dialogi? false=kiinni, true=auki
  const [open, setOpen] = useState(false);

  // Lista kaikista asiakkaista (dropdowniin)
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Treenilomakkeen alkutila (TrainingForm-tyyppi)
  const [training, setTraining] = useState<TrainingForm>({
    date: "",
    duration: 0,
    activity: "",
    customer: "",
  });

  // Haetaan asiakkaat heti kun komponentti avataan → dropdown listaa varten
  useEffect(() => {
    // Haetaan asiakkaat REST API:sta
    getCustomers()
      .then(data => setCustomers(data._embedded.customers))
      .catch(err => console.error(err));
  }, []);

  const handleClickOpen = () => {
    // Asetetaan tämän hetken päivämäärä & aika valmiiksi kenttään
    // datetime-local vaatii muotoa YYYY-MM-DDTHH:mm
    const now = new Date().toISOString().slice(0, 16);
    setTraining(prev => ({
      ...prev,
      date: now,
    }));

    // Avataan dialogi
    setOpen(true);
  };

  const handleClose = () => {
    // Suljetaan dialogi
    setOpen(false);

    // Nollataan lomake
    setTraining({
      date: "",
      duration: 0,
      activity: "",
      customer: "",
    });
  };

  const handleSave = () => {
    
    if (!training.activity || !training.customer || !training.date) {
      alert("Fill at least date, activity and customer");
      return;
    }

    // Lähetetään POST-pyyntö REST API:lle
    addTraining({
      ...training,
      duration: Number(training.duration), 
    })
      .then(() => {
        
        
        fetchTrainings();
        
        handleClose();
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      
      <Button variant="outlined" onClick={handleClickOpen}>
        Add training
      </Button>

      {/* MUI Dialog — popup-lomake treenin lisäämistä varten */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add new training</DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Päivämäärä ja aika  */}
          <TextField
            label="Date and time"
            type="datetime-local"
            value={training.date}
            InputLabelProps={{ shrink: true }}
            onChange={e => setTraining({ ...training, date: e.target.value })}
          />

          {/* Aktiviteetin nimi */}
          <TextField
            label="Activity"
            value={training.activity}
            onChange={e =>
              setTraining({ ...training, activity: e.target.value })
            }
            fullWidth
          />

          {/* Kesto minuutteina */}
          <TextField
            label="Duration (min)"
            type="number"
            value={training.duration}
            onChange={e =>
              setTraining({
                ...training,
                duration: Number(e.target.value),
              })
            }
            fullWidth
          />

          {/* Asiakas valitaan dropdownista */}
          <TextField
            select
            label="Customer"
            value={training.customer}
            onChange={e =>
              setTraining({ ...training, customer: e.target.value })
            }
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value=""></option>

            {/* Dropdowniin luodaan option jokaiselle asiakkaalle */}
            {customers.map(c => (
              <option key={c._links.self.href} value={c._links.self.href}>
                {c.firstname} {c.lastname}
              </option>
            ))}
          </TextField>
        </DialogContent>

        {/* Alareunan Cancel ja Save napit */}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
