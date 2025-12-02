import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { CustomerForm } from "../types";
import { saveCustomer } from "../ptapi";

type AddCustomerProps = {
  fetchCustomers: () => void;
};

export default function AddCustomer({ fetchCustomers }: AddCustomerProps) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    streetaddress: "",
    postcode: "",
    city: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCustomer({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      streetaddress: "",
      postcode: "",
      city: "",
    });
  };

  const handleSave = () => {
    if (!customer.firstname || !customer.lastname) {
      alert("Enter first and last name");
      return;
    }

    saveCustomer(customer)
      .then(() => {
        fetchCustomers();
        handleClose();
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            required
            label="First name"
            value={customer.firstname}
            onChange={e =>
              setCustomer({ ...customer, firstname: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            required
            label="Last name"
            value={customer.lastname}
            onChange={e =>
              setCustomer({ ...customer, lastname: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Email"
            value={customer.email}
            onChange={e =>
              setCustomer({ ...customer, email: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Phone"
            value={customer.phone}
            onChange={e =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Street address"
            value={customer.streetaddress}
            onChange={e =>
              setCustomer({ ...customer, streetaddress: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Postcode"
            value={customer.postcode}
            onChange={e =>
              setCustomer({ ...customer, postcode: e.target.value })
            }
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="City"
            value={customer.city}
            onChange={e =>
              setCustomer({ ...customer, city: e.target.value })
            }
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
