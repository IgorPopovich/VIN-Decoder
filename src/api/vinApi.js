const BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

export async function decodeVin(vin) {
  const normalized = String(vin).trim().toUpperCase();
  const res = await fetch(
    `${BASE_URL}/vehicles/decodevin/${encodeURIComponent(normalized)}?format=json`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.Message || 'Помилка запиту');
  }
  return data;
}

export async function getVehicleVariableList() {
  const res = await fetch(
    `${BASE_URL}/vehicles/getvehiclevariablelist?format=json`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.Message || 'Помилка запиту');
  }
  return data;
}
