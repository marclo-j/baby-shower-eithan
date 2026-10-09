// Servicio de datos SIMULADO.
// Reservas de regalos y confirmaciones se guardan en el navegador (localStorage)
// y el envío del RSVP se simula con un retardo. Cuando haya backend, basta con
// reemplazar el cuerpo de estas funciones (fetch a una API, Supabase, etc.).

const RESERVATIONS_KEY = 'zoobebe-reservas';
const RSVP_KEY = 'zoobebe-rsvp';

export type Reservations = Record<string, string>; // giftId -> nombre

export type RsvpData = {
  name: string;
  phone: string;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

export async function getReservations(): Promise<Reservations> {
  return readJson<Reservations>(RESERVATIONS_KEY, {});
}

export async function reserveGift(giftId: number, name: string): Promise<Reservations> {
  const saved = { ...readJson<Reservations>(RESERVATIONS_KEY, {}), [giftId]: name };
  writeJson(RESERVATIONS_KEY, saved);
  return saved;
}

export async function submitRsvp(data: RsvpData): Promise<void> {
  await wait(1500);
  writeJson(RSVP_KEY, { ...data, sentAt: new Date().toISOString() });
}
