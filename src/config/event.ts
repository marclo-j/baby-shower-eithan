// Datos del evento: edita aquí y se actualiza todo el sitio.
export const event = {
  babyName: 'Eithan',
  parents: 'María & Julio',

  // Fecha y hora del evento (zona horaria de Perú, UTC-5)
  dateISO: '2026-12-13T16:00:00-05:00',
  durationHours: 3,
  weekday: 'Sábado',
  day: '13',
  month: 'Diciembre',
  year: '2026',
  time: '16:00 hrs',
  dateLong: 'sábado 13 de diciembre',
  dateShort: '13 · 12 · 2026',

  rsvpDeadline: '30 de noviembre',

  venue: {
    name: '[Nombre del lugar]',
    address: '[Dirección]',
    city: '[Distrito / Ciudad]',
  },

  // Música opcional: deja un archivo en /public/audio y pon su ruta aquí
  musicSrc: '/audio/musica.mp3',
} as const;

const placeQuery = encodeURIComponent(
  `${event.venue.name} ${event.venue.address} ${event.venue.city}`,
);
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${placeQuery}`;
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
