// Genera src/data/gifts.json a partir de los links de src/data/gift-links.json:
// lee nombre, descripción, precio e imagen de los metadatos de cada página
// (og:title, og:image, ...) y descarga la foto a public/img/regalos/.
//
//   npm run gifts            → importa (no vuelve a bajar fotos existentes)
//   npm run gifts -- --force → vuelve a bajar todas las fotos
//
// Cada entrada de gift-links.json: { url, cat, name?, desc?, price?, reserved? }.
// Los campos opcionales sobrescriben lo extraído de la página.
// El id de cada regalo es su posición en el archivo y las reservas se guardan
// por id: agrega los links nuevos SIEMPRE al final.

import { mkdir, readFile, readdir, rm, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const linksFile = path.join(root, 'src/data/gift-links.json');
const outFile = path.join(root, 'src/data/gifts.json');
const giftsTs = path.join(root, 'src/data/gifts.ts');
const imgDir = path.join(root, 'public/img/regalos');
const force = process.argv.includes('--force');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const TRACKING = /^(utm_|fbclid$|gclid$|sfnsn$|campaign_id$|ad_id$|media_type$|mibextid$)/;

function cleanUrl(raw) {
  const u = new URL(raw);
  for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
  return u.toString();
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

function meta(html, prop) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  const content = tag?.match(/content=["']([^"']*)["']/i)?.[1];
  return content ? decode(content) : undefined;
}

function cleanName(title) {
  // "Producto Marca MARCA | Tienda" → "Producto Marca"
  let name = title.split(' | ')[0].trim();
  const words = name.split(' ');
  const last = words.at(-1);
  if (words.length > 1 && last === last.toUpperCase() && /\p{L}/u.test(last) &&
      words.slice(0, -1).some((w) => w.toLowerCase() === last.toLowerCase())) {
    name = words.slice(0, -1).join(' ');
  }
  return name;
}

function cleanDesc(desc) {
  if (!desc || /^compra online/i.test(desc)) return ''; // texto SEO genérico (Falabella)
  if (desc.length <= 120) return desc;
  return desc.slice(0, 117).replace(/\s+\S*$/, '') + '…';
}

function findPrice(html) {
  // Falabella: precio normal (tachado) si hay oferta
  const normal = html.match(/"type":"normalPrice","price":\["([\d.,]+)"\]/)?.[1];
  // Shopify y otros
  const og = meta(html, 'og:price:amount') ?? meta(html, 'product:price:amount');
  // JSON-LD genérico
  const ld = html.match(/"offers":\s*\[?\s*\{[^}]*?"price":\s*"?([\d.]+)/)?.[1];
  const p = normal ?? og ?? ld;
  return p ? Number(p.replace(/,/g, '')) : undefined;
}

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

const exists = (p) => access(p).then(() => true, () => false);

async function downloadImage(src, base) {
  const res = await fetch(src.replace(/^http:/, 'https:'), { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`imagen HTTP ${res.status}`);
  const type = res.headers.get('content-type') ?? '';
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const file = `${base}.${ext}`;
  await writeFile(path.join(imgDir, file), Buffer.from(await res.arrayBuffer()));
  return file;
}

async function findExisting(base) {
  for (const ext of ['jpg', 'png', 'webp']) {
    if (await exists(path.join(imgDir, `${base}.${ext}`))) return `${base}.${ext}`;
  }
}

async function importGift(entry, id, categories) {
  const url = cleanUrl(entry.url);
  if (!categories.includes(entry.cat)) {
    console.warn(`  ⚠ #${id}: categoría "${entry.cat}" no está en categories de gifts.ts`);
  }

  let page = {};
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'es-PE,es;q=0.9' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const title = meta(html, 'og:title') ?? html.match(/<title>([^<]*)<\/title>/i)?.[1];
    page = {
      name: title && cleanName(decode(title)),
      desc: cleanDesc(meta(html, 'og:description')),
      price: findPrice(html),
      image: meta(html, 'og:image'),
    };
  } catch (err) {
    console.warn(`  ⚠ #${id}: no se pudo leer la página (${err.message})`);
  }

  const name = entry.name ?? page.name ?? `Regalo ${id}`;
  const base = `${id}-${slugify(name)}`;
  let img = force ? undefined : await findExisting(base);
  if (!img && page.image) {
    try {
      img = await downloadImage(page.image, base);
    } catch (err) {
      console.warn(`  ⚠ #${id}: no se pudo bajar la foto (${err.message})`);
    }
  }

  const gift = {
    id,
    cat: entry.cat,
    name,
    desc: entry.desc ?? page.desc ?? '',
    price: entry.price ?? page.price ?? 0,
    reserved: entry.reserved ?? false,
    url,
    ...(img && { img: `/img/regalos/${img}` }),
  };
  console.log(`  ✓ #${id} [${gift.cat}] ${gift.name} — S/ ${gift.price}${img ? '' : ' (sin foto)'}`);
  return gift;
}

const links = JSON.parse(await readFile(linksFile, 'utf8'));
const catsLine = (await readFile(giftsTs, 'utf8')).match(/categories = \[([^\]]*)\]/)?.[1] ?? '';
const categories = [...catsLine.matchAll(/'([^']+)'/g)].map((m) => m[1]);
await mkdir(imgDir, { recursive: true });

console.log(`Importando ${links.length} regalos…`);
const gifts = [];
for (const [i, entry] of links.entries()) gifts.push(await importGift(entry, i + 1, categories));

await writeFile(outFile, JSON.stringify(gifts, null, 2) + '\n');

// Borra fotos que ya no usa ningún regalo (p. ej. tras renombrar uno)
const used = new Set(gifts.map((g) => g.img && path.basename(g.img)));
for (const file of await readdir(imgDir)) {
  if (!used.has(file)) await rm(path.join(imgDir, file));
}
console.log(`Listo → ${path.relative(root, outFile)}`);
