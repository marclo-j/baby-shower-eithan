# Prompt para Claude Design — Web Baby Shower "Zoo Bebé"

> **Cómo usarlo:** copia todo lo que está bajo la línea en Claude Design y adjunta las 4 imágenes de la carpeta `recursos/` (`example.png`, `web-example.png`, `web-example-2.png`, `web-example-3.png`) como referencias visuales. Reemplaza los valores entre `[corchetes]` antes de enviarlo si ya los tienes; si no, deja que use los placeholders.

---

## Contexto

Diseña la maqueta completa de una **invitación web para un baby shower**. Es un sitio de una sola página (one-page), pensado **mobile-first** porque se compartirá principalmente por WhatsApp, pero debe verse bien también en tablet y escritorio.

El sitio tiene dos funciones principales que deben destacar sobre todo lo demás:

1. **Formulario de confirmación de asistencia (RSVP)** dentro de la misma web.
2. **Wishlist (lista de regalos)** donde los invitados pueden ver los regalos y reservar uno para que no se repitan.

El resto de secciones acompañan y ambientan la invitación.

Más adelante el diseño se implementará en **Astro + TailwindCSS**, así que organiza la maqueta en **secciones/componentes claramente separados** y define los colores, tipografías, espaciados y radios como **design tokens** reutilizables.

## Imágenes de referencia adjuntas

- **`example.png`** → referencia principal de **color** y de estructura de una invitación web larga (secciones apiladas, nubes, ilustración tierna de elefante bebé, botones de lista de regalos y confirmación).
- **`web-example.png`** → referencia de la **pantalla de entrada**: marco tipo arco, moño/lazo arriba, título "BABY SHOWER" en serif + nombre en caligrafía, **sobre cerrado con sello de cera** y el texto "Click para ver la invitación". Fondo con patrón toile de animales (jirafa, elefante, globos aerostáticos).
- **`web-example-2.png`** → referencia de la sección **fecha + cuenta regresiva + lugar**: tipografía elegante, fecha en formato "Sábado | 18 | Julio", contador con días/horas/minutos/segundos, ícono de ubicación.
- **`web-example-3.png`** → referencia de **dress code** (paleta de colores en cuadritos) y de la sección **confirmar asistencia** (título serif + palabra en caligrafía, texto cálido, botón).

Toma de estas referencias el estilo elegante, delicado y espacioso, pero **no las copies literalmente**: adáptalas a la temática y paleta que se describen abajo.

## Temática: "Zoo Bebé"

- Animales de zoológico **en versión bebé**, tiernos y suaves (no realistas ni toscos): **elefantito, jirafita, leoncito, cebrita, monito, hipopótamo bebé** y opcionalmente un pandita o koala.
- Estilo de ilustración: **acuarela suave / línea delicada**, mejillas sonrosadas, ojos grandes, expresiones dulces. Similar al elefante bebé de `example.png`.
- Elementos decorativos de apoyo: **nubes esponjosas, globos, estrellitas, banderines (guirnalda), hojitas de selva suaves**, huellitas de animales.
- Mezcla las ilustraciones protagonistas por sección (cada sección puede tener "su" animalito) y usa los decorativos de forma sutil para no recargar.
- Si no puedes generar ilustraciones finales, usa ilustraciones SVG simples y limpias o placeholders bien marcados indicando qué animal va en cada lugar.

## Paleta de color

El color principal es el **celeste pastel** de `example.png`. Construye la paleta a partir de él:

| Token | Hex | Uso |
|---|---|---|
| `sky-300` (primario) | `#98C4D9` | Color de marca: fondos de sección destacados, botones, bandas |
| `sky-200` | `#C4DDE9` | Fondos secundarios, tarjetas, bordes suaves |
| `sky-100` | `#EAF4F8` | Fondo general de la página |
| `sky-500` | `#5E97B3` | Hover de botones, íconos, acentos |
| `ink` | `#2F4A5A` | Texto principal (azul grisáceo oscuro, nunca negro puro) |
| `cream` | `#FFFDF8` | Tarjetas y superficies claras |
| `butter` | `#F6E9C4` | Acento cálido (estrellas, detalles, estados "reservado") |
| `gold` | `#C9A961` | Detalles finos opcionales (líneas, sello, caligrafía), inspirado en `web-example-2/3` |

Asegura contraste suficiente (WCAG AA) en textos y botones. Evita colores saturados o chillones.

## Tipografía

- **Display / títulos:** serif elegante (ej. *Cormorant Garamond* o *Playfair Display*), en mayúsculas espaciadas para "BABY SHOWER", "CONFIRMAR", etc.
- **Caligrafía / acentos:** script fina (ej. *Great Vibes*, *Allura* o *Pinyon Script*) para el nombre del bebé y palabras destacadas ("Asistencia", "Lugar", "Te esperamos").
- **Cuerpo / formularios:** sans redondeada y legible (ej. *Nunito* o *Quicksand*).

Todas deben estar disponibles en Google Fonts.

## Datos del evento (placeholders)

- Nombre del bebé: `[Nombre del bebé]`
- Mamá / papás: `[Nombre de la mamá]` y `[Nombre del papá]`
- Fecha: `[Sábado 13 de diciembre de 2026]`
- Hora: `[16:00 hrs]`
- Lugar: `[Nombre del lugar]`, `[Dirección]`, `[Comuna/Ciudad]`
- Fecha límite para confirmar: `[30 de noviembre]`

## Estructura del sitio (en este orden)

### 0. Pantalla de bienvenida (intro / sobre)
- Pantalla completa con marco tipo **arco** sobre fondo con patrón de animalitos del zoo (estilo toile en celeste).
- Lazo/moño celeste arriba del arco.
- "BABY SHOWER" (serif) + `[Nombre del bebé]` (caligrafía).
- **Sobre celeste cerrado con sello** (el sello puede llevar una huellita o la cara de un animalito) y texto "Toca para abrir la invitación".
- Al tocar, el sobre se abre y da paso al sitio (ver animaciones).
- Opcional: botón pequeño de música (play/pausa) que se activa al abrir el sobre.

### 1. Hero
- Ilustración principal: elefantito bebé sentado sobre una nube, rodeado de globos y estrellitas.
- Texto pequeño superior: "Con mucho amor te invitamos al"
- "BABY SHOWER" + `[Nombre del bebé]` en caligrafía grande.
- Indicador de scroll (flechita o huellitas animadas).

### 2. Mensaje / bienvenida
- Texto cálido corto, ej.: *"Muy pronto llegará a nuestras vidas un pequeño gran aventurero. Queremos compartir contigo la alegría de esperarlo."*
- Firma de los papás en caligrafía.
- Jirafita asomándose por un costado.

### 3. Fecha + cuenta regresiva
- Título "Acompáñanos el día:"
- Fecha en formato elegante **"Sábado | 13 | Diciembre"** con año debajo (como `web-example-2.png`).
- **Cuenta regresiva** con 4 bloques: Días · Horas · Minutos · Segundos (tarjetas redondeadas en `sky-200`, número grande serif).
- Botón secundario "Agregar al calendario".

### 4. Lugar
- Ícono de ubicación + "Lugar" en caligrafía.
- Nombre del lugar, dirección y hora.
- Botón "Cómo llegar" (abre Google Maps / Waze).
- Leoncito bebé decorando.

### 5. Wishlist — Lista de regalos ⭐ (sección clave)
- Título "Lista de regalos" + subtítulo cariñoso: *"Tu presencia es nuestro mejor regalo, pero si quieres consentir a `[Nombre del bebé]`, aquí tienes algunas ideas."*
- **Filtros en chips/pestañas** por categoría: Todos · Ropa · Higiene y baño · Paseo · Juguetes · Habitación.
- **Grilla de tarjetas** (1 columna en móvil, 2 en tablet, 3 en escritorio). Cada tarjeta:
  - Imagen o ilustración del producto (placeholder).
  - Nombre del regalo, descripción breve, precio referencial opcional y enlace "Ver en tienda".
  - Botón **"Lo regalo yo 🎁"**.
  - **Estados:** *Disponible* (normal), *Reservado* (tarjeta atenuada con sello/etiqueta "Ya reservado ✓" en `butter`, botón deshabilitado).
- Al tocar "Lo regalo yo" → **modal pequeño** que pide nombre del invitado y confirma la reserva, con mensaje de éxito ("¡Gracias! `[Nombre del bebé]` te lo agradecerá 💙").
- Contador o barra de progreso opcional: "8 de 20 regalos reservados".
- Bloque alternativo opcional: "¿Prefieres hacer un aporte?" con datos para transferencia (placeholders).
- Decoración: monito colgando de una liana o con un regalo.

### 6. Dress code (opcional)
- Título "Dress code" + texto breve ("Tonos pastel").
- Fila de círculos/cuadrados con los colores sugeridos (celestes, crema, beige, blanco), como en `web-example-3.png`.

### 7. Confirmar asistencia (RSVP) ⭐ (sección clave)
- Título "CONFIRMAR" (serif) + "Asistencia" (caligrafía), ícono tierno (huellita o hipopótamo bebé con un sobre).
- Texto: *"Nos encantará saber que nos acompañarás. Por favor confirma antes del `[fecha límite]`."*
- **Formulario dentro de una tarjeta `cream` con bordes redondeados y sombra suave:**
  - Nombre completo (texto, requerido)
  - ¿Asistirás? (dos botones grandes tipo toggle: "¡Sí, ahí estaré! 🎉" / "No podré asistir 😢")
  - Número de acompañantes (selector − / + , solo si asiste)
  - Teléfono o WhatsApp (opcional)
  - Restricciones alimentarias (opcional)
  - Mensaje o buenos deseos para el bebé (textarea opcional)
  - Botón principal "Enviar confirmación"
- Diseña también los **estados**: campo con foco, error de validación (mensaje amable bajo el campo), botón cargando, y **pantalla de éxito** con un animalito celebrando y texto "¡Gracias por confirmar!".

### 8. Cierre / footer
- "Te esperamos" en caligrafía grande.
- Ilustración final: varios animalitos juntos (elefante, jirafa, león, cebra) sobre nubes.
- Firma de los papás y un pequeño "Hecho con 💙 para `[Nombre del bebé]`".

### Elementos globales
- **Navegación flotante mínima** (barra inferior en móvil o botón flotante) con accesos rápidos a: Inicio · Regalos · Confirmar.
- Separadores entre secciones con **bordes ondulados de nubes** o guirnaldas de banderines.
- Espacio en blanco generoso; todo centrado y con ancho máximo de lectura cómodo en escritorio.

## Animaciones y microinteracciones

Si Claude Design permite prototipar animaciones, inclúyelas; si no, descríbelas como anotaciones en cada sección para implementarlas después. Todas deben ser **suaves y lentas** (ease-out, 400–900 ms), nunca bruscas.

- **Intro:** el sello "late" suavemente; al tocar, la solapa del sobre se abre en 3D, sale la tarjeta y la pantalla hace **fade-out** hacia el hero.
- **Hero:** el título aparece letra por letra (**text reveal / typewriter suave**); el nombre en caligrafía se "dibuja" (efecto de trazo SVG). Globos con **flotación** vertical en loop.
- **Scroll reveal:** cada sección entra con **fade-in + leve desplazamiento hacia arriba** (fade-up), con stagger en elementos hijos (tarjetas de regalo, bloques del contador).
- **Nubes:** movimiento horizontal lento en parallax a distintas velocidades.
- **Animalitos:** pequeñas animaciones idle (la jirafa asoma y se esconde, el elefante mueve las orejas, el mono se balancea).
- **Cuenta regresiva:** los números cambian con un **flip** o slide vertical suave.
- **Botones:** hover/tap con leve escala (1.03) y cambio a `sky-500`; ripple suave al tocar en móvil.
- **Wishlist:** al reservar, la tarjeta hace un pequeño "pop" y aparece el sello "Reservado" con rebote suave.
- **RSVP:** al enviar, **lluvia de confeti** de estrellitas/huellitas celestes y el animalito de la pantalla de éxito salta de alegría.
- Respetar `prefers-reduced-motion`: desactivar animaciones decorativas y dejar solo fades simples.

## Entregables esperados

1. Maqueta **mobile (390 px)** completa de todas las secciones, incluida la pantalla de intro.
2. Maqueta **desktop (1440 px)** completa.
3. Estados de componentes: botones (normal/hover/disabled/cargando), inputs (normal/foco/error), tarjeta de regalo (disponible/reservada), modal de reserva, pantalla de éxito del RSVP.
4. Hoja de **design tokens** (colores, tipografías con tamaños, radios, sombras, espaciados) lista para trasladar a `tailwind.config`.
5. Anotaciones de las animaciones por sección.

## Tono general

Tierno, delicado, alegre y elegante a la vez. Debe sentirse como una invitación hecha a mano con cariño, **no infantil en exceso ni recargada**. Todo el texto en **español**.
