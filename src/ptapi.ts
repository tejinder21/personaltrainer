// src/ptapi.ts

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
  try {
    const res = await fetch(url);
    if (!res.ok) return "";
    const c = await res.json();
    return `${c.firstname} ${c.lastname}`;
  } catch {
    return "";
  }
}

