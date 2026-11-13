import giftsJson from './gifts.json';

export type Gift = {
  id: number;
  cat: Category;
  name: string;
  desc: string;
  /** Precio referencial en soles (S/) */
  price: number;
  /** Reservado de antemano (p. ej. ya comprado por alguien). */
  reserved: boolean;
  /** Advertencia visible en la tarjeta; los regalos con nota se muestran primero. */
  note?: string;
  /** Enlace a la tienda; si se omite, se usa una búsqueda en Google. */
  url?: string;
  /** Imagen en /public/img; si se omite, se muestra un placeholder. */
  img?: string;
};

export const categories = ['Ropa', 'Alimentación', 'Higiene y baño', 'Paseo', 'Juguetes', 'Habitación'] as const;
export type Category = (typeof categories)[number];

/**
 * Generado con `npm run gifts` a partir de gift-links.json.
 * Orden: los ya reservados al final; entre el resto, los que tienen nota primero.
 * (Las reservas hechas por invitados se reordenan en el navegador, ver GiftList.astro.)
 */
export const gifts = [...(giftsJson as Gift[])].sort(
  (a, b) => Number(a.reserved) - Number(b.reserved) || Number(!!b.note) - Number(!!a.note),
);

export const formatPrice = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const giftUrl = (gift: Gift) =>
  gift.url ?? 'https://www.google.com/search?q=' + encodeURIComponent(gift.name);
