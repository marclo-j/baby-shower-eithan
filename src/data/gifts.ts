export type Gift = {
  id: number;
  cat: Category;
  name: string;
  desc: string;
  /** Precio referencial en soles (S/) */
  price: number;
  /** Reservado de antemano (p. ej. ya comprado por alguien). */
  reserved: boolean;
  /** Enlace a la tienda; si se omite, se usa una búsqueda en Google. */
  url?: string;
  /** Imagen en /public/img; si se omite, se muestra un placeholder. */
  img?: string;
};

export const categories = ['Ropa', 'Higiene y baño', 'Paseo', 'Juguetes', 'Habitación'] as const;
export type Category = (typeof categories)[number];

const g = (id: number, cat: Category, name: string, desc: string, price: number, reserved = false): Gift => ({
  id, cat, name, desc, price, reserved,
});

export const gifts: Gift[] = [
  g(1, 'Ropa', 'Set de bodys de algodón', 'Pack de 5 bodys de algodón orgánico, talla 0–3 meses.', 65, true),
  g(2, 'Ropa', 'Pijama enterito con pies', 'Suave y abrigador, con cierre doble. Talla 3–6 meses.', 55),
  g(3, 'Ropa', 'Gorrito y mitones tejidos', 'Tejidos a mano en lana merino hipoalergénica.', 40),
  g(4, 'Higiene y baño', 'Bañera plegable', 'Con soporte reclinable y tapón térmico.', 120, true),
  g(5, 'Higiene y baño', 'Kit de cuidado del bebé', 'Cortaúñas, cepillo, peineta y termómetro digital.', 60),
  g(6, 'Higiene y baño', 'Toallas con capucha', 'Set de 2 toallas de muselina con orejitas.', 70, true),
  g(7, 'Paseo', 'Portabebé ergonómico', 'Posición en M, para recién nacido hasta 15 kg.', 220),
  g(8, 'Paseo', 'Bolso maternal', 'Impermeable, con cambiador y bolsillos térmicos.', 150, true),
  g(9, 'Paseo', 'Saco para el coche', 'Forro polar para los paseos de invierno.', 110),
  g(10, 'Juguetes', 'Móvil musical para cuna', 'Animalitos de fieltro y melodías suaves.', 100, true),
  g(11, 'Juguetes', 'Gimnasio de actividades', 'Alfombra acolchada con arco y juguetes colgantes.', 180),
  g(12, 'Juguetes', 'Sonajeros de madera', 'Set de 3, madera natural y pinturas no tóxicas.', 45),
  g(13, 'Habitación', 'Monitor de bebé', 'Con cámara, visión nocturna y sensor de temperatura.', 250, true),
  g(14, 'Habitación', 'Lámpara proyectora', 'Luz cálida de noche que proyecta estrellitas.', 85),
  g(15, 'Habitación', 'Sábanas para cuna', 'Set de 2 juegos de algodón percal, salvia y crema.', 95, true),
  g(16, 'Habitación', 'Cesto organizador', 'Para pañales y básicos del cambiador, en fibra natural.', 65),
];

export const formatPrice = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const giftUrl = (gift: Gift) =>
  gift.url ?? 'https://www.google.com/search?q=' + encodeURIComponent(gift.name);
