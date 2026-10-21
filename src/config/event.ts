// Datos del evento: edita aquí y se actualiza todo el sitio.
export const event = {
  babyName: 'Eithan',
  parents: 'María & Julio',

  // Fecha y hora del evento (zona horaria de Perú, UTC-5)
  dateISO: '2026-11-28T17:30:00-05:00',
  durationHours: 3,
  weekday: 'Sábado',
  day: '28',
  month: 'Noviembre',
  year: '2026',
  time: '17:30 hrs',
  dateLong: 'sábado 28 de noviembre',
  dateShort: '28 · 11 · 2026',

  rsvpDeadline: '21 de noviembre',

  venue: {
    name: 'Av. República del Perú 546',
    address: 'Comas',
    city: 'Lima',
  },

  // Música opcional: deja un archivo en /public/audio y pon su ruta aquí
  musicSrc: '/audio/musica.m4a',
} as const;

const placeQuery = encodeURIComponent(
  `${event.venue.name} ${event.venue.address} ${event.venue.city}`,
);
export const mapsHref = 'https://maps.app.goo.gl/zEr6ybzjeTbhE8dV8';
export const wazeHref = `https://waze.com/ul?q=${placeQuery}`;

/** Genera un .ics como data URL para "Agregar al calendario". */
export function buildIcsHref(): string {
  const start = new Date(event.dateISO);
  const end = new Date(start.getTime() + event.durationHours * 3600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const esc = (s: string) => s.replace(/,/g, '\\,');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZooBebe//ES',
    'BEGIN:VEVENT',
    `UID:zoobebe-${fmt(start)}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Baby shower de ${event.babyName}`,
    `LOCATION:${esc(`${event.venue.name}, ${event.venue.address}, ${event.venue.city}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}
