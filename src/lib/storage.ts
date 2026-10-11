// Servicio de datos.
// Con PUBLIC_SHEETS_URL configurada, las reservas de regalos y las confirmaciones
// se guardan en Google Sheets a través de un Apps Script (ver google/apps-script.gs).
// Sin ella (p. ej. en desarrollo) se simulan en el navegador con localStorage.

const API = import.meta.env.PUBLIC_SHEETS_URL as string | undefined;

const RESERVATIONS_KEY = 'zoobebe-reservas';
const RSVP_KEY = 'zoobebe-rsvp';

export type Reservations = Record<string, string>; // giftId -> nombre ('' si viene de la hoja)

export type RsvpData = {
  name: string;
  phone: string;
};

/** Otra persona reservó el regalo antes. */
export class ReservationTakenError extends Error {}

type ApiResponse = { ok: boolean; error?: string; reserved?: number[] };

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

async function call(init?: RequestInit): Promise<ApiResponse> {
  const res = await fetch(API!, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// text/plain evita el preflight CORS, que Apps Script no soporta
const post = (body: object) =>
  call({ method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });

export async function getReservations(): Promise<Reservations> {
  if (!API) return readJson<Reservations>(RESERVATIONS_KEY, {});
  const data = await call();
  return Object.fromEntries((data.reserved ?? []).map((id) => [String(id), '']));
}

export async function reserveGift(giftId: number, giftName: string, giftUrl: string, name: string): Promise<void> {
  if (!API) {
    writeJson(RESERVATIONS_KEY, { ...readJson<Reservations>(RESERVATIONS_KEY, {}), [giftId]: name });
    return;
  }
  const data = await post({ type: 'reserve', giftId, giftName, giftUrl, name });
  if (data.error === 'taken') throw new ReservationTakenError();
  if (!data.ok) throw new Error(data.error ?? 'error');
}

export async function submitRsvp(data: RsvpData): Promise<void> {
  if (!API) {
    await wait(1500);
    writeJson(RSVP_KEY, { ...data, sentAt: new Date().toISOString() });
    return;
  }
  const res = await post({ type: 'rsvp', ...data });
  if (!res.ok) throw new Error(res.error ?? 'error');
}
