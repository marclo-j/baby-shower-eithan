---
description: Agrega uno o más regalos a la lista a partir del link del producto
argument-hint: <link del producto> [categoría] [más links...]
allowed-tools: Read, Edit, Bash(npm run gifts*)
---

Agrega a la lista de regalos de la web los productos de estos links:

$ARGUMENTS

Si no hay ningún link arriba, pídele al usuario que pegue el link del producto y detente.

## Pasos

1. Lee `src/data/gift-links.json` y la lista `categories` de `src/data/gifts.ts`.
2. Por cada link:
   - Si ya está en `gift-links.json` (mismo producto, aunque cambien los parámetros de rastreo como `utm_*` o `fbclid`), no lo dupliques: avisa y sigue con el siguiente.
   - Elige la categoría (`cat`): usa la que indicó el usuario; si no indicó ninguna, dedúcela del nombre del producto (está en la URL) eligiendo una de `categories`. Si ninguna encaja, agrega una nueva a `categories` en `gifts.ts`.
   - Agrega `{ "url": "<link tal cual>", "cat": "<categoría>" }` **al final** del array. Nunca reordenes ni borres entradas: el id de cada regalo es su posición y las reservas dependen de él.
3. Ejecuta `npm run gifts`.
4. Revisa la salida y `src/data/gifts.json` para los regalos nuevos:
   - Si un nombre tiene errores de tipeo, tildes mal puestas o texto de relleno, agrega `"name"` con el nombre corregido en su entrada de `gift-links.json`.
   - Si salió `(sin foto)`, precio 0 o un aviso ⚠, intenta corregirlo con overrides (`name`, `desc`, `price`) y, si no se puede, avísale al usuario.
   - Si cambiaste algo, vuelve a ejecutar `npm run gifts`.
5. Muestra una tabla corta con los regalos agregados: #, nombre, categoría y precio.

No hagas commit ni push.
