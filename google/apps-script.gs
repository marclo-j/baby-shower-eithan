/**
 * Backend del baby shower: guarda confirmaciones de asistencia y reservas de
 * regalos en esta hoja de cálculo.
 *
 * Despliegue:
 *   1. En la hoja: Extensiones → Apps Script, pega este archivo y guarda.
 *   2. Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo · Quién tiene acceso: Cualquier persona.
 *   3. Autoriza los permisos y copia la URL que termina en /exec.
 *      Va en PUBLIC_SHEETS_URL (.env local y variables de entorno de Vercel).
 *   Si cambias este código: Implementar → Gestionar implementaciones → Editar
 *   → Versión: Nueva versión. Así la URL no cambia.
 */

const SHEETS = {
  rsvp: { name: 'Asistencia', headers: ['Fecha', 'Nombre', 'Teléfono', 'Actualizado'] },
  reserve: { name: 'Reservas', headers: ['Fecha', 'ID', 'Regalo', 'Nombre', 'Link'] },
};
const MAX_LEN = 100;
const MAX_URL = 500;

function doGet() {
  const rows = dataRows(sheet(SHEETS.reserve));
  return json({ ok: true, reserved: rows.map((r) => Number(r[1])) });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'invalid' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (body.type === 'rsvp') return json(saveRsvp(body));
    if (body.type === 'reserve') return json(saveReservation(body));
    return json({ ok: false, error: 'invalid' });
  } finally {
    lock.releaseLock();
  }
}

function saveRsvp(body) {
  const name = clean(body.name);
  const phone = clean(body.phone);
  if (!name || !phone) return { ok: false, error: 'invalid' };

  const sh = sheet(SHEETS.rsvp);
  const key = digits(phone);
  const rows = dataRows(sh);
  const idx = rows.findIndex((r) => digits(r[2]) === key);
  if (idx >= 0) {
    // Misma persona editando su respuesta: se actualiza su fila
    sh.getRange(idx + 2, 2, 1, 3).setValues([[name, phone, new Date()]]);
  } else {
    sh.appendRow([new Date(), name, phone, '']);
  }
  return { ok: true };
}

function saveReservation(body) {
  const giftId = Number(body.giftId);
  const giftName = clean(body.giftName);
  const name = clean(body.name);
  const giftUrl = /^https?:\/\//.test(body.giftUrl) ? clean(body.giftUrl, MAX_URL) : '';
  if (!giftId || !name) return { ok: false, error: 'invalid' };

  const sh = sheet(SHEETS.reserve);
  if (dataRows(sh).some((r) => Number(r[1]) === giftId)) return { ok: false, error: 'taken' };
  sh.appendRow([new Date(), giftId, giftName, name, giftUrl]);
  return { ok: true };
}

// --- utilidades ---

function sheet(def) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(def.name);
  if (!sh) {
    sh = ss.insertSheet(def.name);
    sh.appendRow(def.headers);
    sh.setFrozenRows(1);
  } else if (sh.getRange(1, 1, 1, def.headers.length).getValues()[0].join() !== def.headers.join()) {
    // Hoja creada con una versión anterior del script: completa los encabezados nuevos
    sh.getRange(1, 1, 1, def.headers.length).setValues([def.headers]);
  }
  return sh;
}

function dataRows(sh) {
  const last = sh.getLastRow();
  return last < 2 ? [] : sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
}

// Evita que un texto empiece con = + - @ y se interprete como fórmula
function clean(v, max) {
  const s = String(v == null ? '' : v).trim().slice(0, max || MAX_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

const digits = (v) => String(v).replace(/\D/g, '');

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
