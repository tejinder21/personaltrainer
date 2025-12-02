// src/ptapi.ts

import type { CustomerForm, TrainingForm } from "./types";

// käytetään samaa nimeä kuin .envissä: VITE_PT_API_URL
const API_BASE =
  import.meta.env.VITE_PT_API_URL ||
  "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api";

// Asiakkaat
export function getCustomers() {
  return fetch(API_BASE + "/customers")
    .then(response => {
      if (!response.ok)
        throw new Error("Error when fetching customers: " + response.statusText);

      return response.json();
    });
}
 //uuden asiakkaan lisääminen 
export function saveCustomer(newCustomer: CustomerForm) {
  return fetch(API_BASE + "/customers", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(newCustomer),
  })
    .then(response => {
      if (!response.ok)
        throw new Error(
          "Error when adding a new customer: " + response.statusText
        );

      return response.json();
    });
}

// Asiakkaan poisto 

export function deleteCustomer(url: string) {
  return fetch(url, { method: "DELETE" })
    .then(response => {
      if (!response.ok)
        throw new Error(
          "Error when deleting customer: " + response.statusText
        );

      return response.json();
    });
}

// harjoitusten lisääminen 
export function addTraining(newTraining: TrainingForm) {
  return fetch(API_BASE + "/trainings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(newTraining),
  }).then(response => {
    if (!response.ok) throw new Error("Error when adding training");
    return response.json();
  });
}
// harjoitusten poisto 

export function deleteTraining(url: string) {
  return fetch(url, { method: "DELETE" }).then(response => {
    if (!response.ok)
      throw new Error("Error when deleting training: " + response.statusText);
    return response.json();
  });
}




// Harjoitukset
export function getTrainings() {
  return fetch(API_BASE + "/trainings")
    .then(response => {
      if (!response.ok)
        throw new Error("Error when fetching trainings: " + response.statusText);

      return response.json();
    });
}


// Hakee asiakkaan nimen yhdestä linkistä
export async function getCustomerName(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) return "";
  const customer = await res.json();
  return `${customer.firstname} ${customer.lastname}`;
}



