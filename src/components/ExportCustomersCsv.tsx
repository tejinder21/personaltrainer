import Button from "@mui/material/Button";
import type { Customer } from "../types";


// Tänne saadaan CustomersList-komponentista asiakaslista
type ExportCustomersCsvProps = {
  customers: Customer[];
};

export default function ExportCustomersCsv({ customers }: ExportCustomersCsvProps) {
    // Tämä funktio ajetaan, kun käyttäjä painaa "Export customers (CSV)" -nappia
  const handleExportCsv = () => {
    if (customers.length === 0) {
      alert("No customers to export");
      return;
    }

   
    const separator = ";";

    const headers = [
      "firstname",
      "lastname",
      "email",
      "phone",
      "streetaddress",
      "postcode",
      "city",
    ];
// Ensimmäinen rivi = otsikkorivi
    const csvRows: string[] = [];
    csvRows.push(headers.join(separator));

    customers.forEach((c) => {
      const row = [
        c.firstname,
        c.lastname,
        c.email,
        c.phone,
        c.streetaddress,
        c.postcode,
        c.city,
      ];

      const escaped = row.map((value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`
      );

      csvRows.push(escaped.join(separator));
    });

    const csvString = csvRows.join("\r\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleExportCsv}>Export customers (CSV)</Button>;
}
