import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { CustomerForm, Customer } from "../types";

type EditCustomerProps = {
  fetchCustomers: () => void;
  customerRow: Customer;
};

export default function EditCustomer({
  fetchCustomers,
  customerRow,
}: EditCustomerProps) {
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
    setCustomer({
      firstname: customerRow.firstname,
      lastname: customerRow.lastname,
      email: customerRow.email,
      phone: customerRow.phone,
      streetaddress: customerRow.streetaddress,
      postcode: customerRow.postcode,
      city: customerRow.city,
    });
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

    fetch(customerRow._links.self.href, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then(response => {
        if (!response.ok)
          throw new Error("Error when editing customer");

        return response.json();
      })
      .then(() => {
        fetchCustomers();
        handleClose();
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Button size="small" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit customer</DialogTitle>
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
