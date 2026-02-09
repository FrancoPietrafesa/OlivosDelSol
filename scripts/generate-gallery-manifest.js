const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const HABITACIONES_DIR = path.join(ROOT, 'images', 'habitaciones');
const OUTPUT_DIR = path.join(ROOT, 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'galeria.manifest.json');

const SPECIAL_DIRS = new Set(['monoambientes', 'piletas', 'eventos']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function prettifyName(raw) {
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function encodeSegment(segment) {
  return encodeURIComponent(segment);
}

function encodePathSegments(relPath) {
  return relPath
    .split('/')
    .map((segment) => encodeSegment(segment))
    .join('/');
}

function listImages(dirPath, publicBase) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const images = files
    .filter((f) => f.isFile())
    .map((f) => f.name)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));

  return images.map((name) => `${publicBase}/${encodeSegment(name)}`);
}

function readMeta(dirPath) {
  const metaPath = path.join(dirPath, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;
  try {
    const raw = fs.readFileSync(metaPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Meta inválido en ${metaPath}: ${err.message}`);
    return null;
  }
}

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickFrom(list, seed) {
  if (!list.length) return null;
  return list[seed % list.length];
}

function buildFallbackDescription(rawName) {
  const options = [
    'Espacios amplios, luz natural y detalles pensados para descansar.',
    'Ambientes calidos con vistas abiertas y mobiliario confortable.',
    'Un refugio sereno con esencia local y comodidades esenciales.',
    'Disenado para desconectar, con calma y privacidad.',
    'Texturas nobles y un clima suave para una estadia relajada.'
  ];
  return pickFrom(options, hashString(rawName));
}

function buildFallbackAmenities(rawName) {
  const seed = hashString(rawName);
  const banos = (seed % 2) + 1;
  return {
    aireAcondicionado: seed % 3 !== 0,
    wifi: true,
    cocina: seed % 2 === 0,
    banos,
    piletaPrivada: seed % 4 === 0
  };
}

function buildFallbackCharacteristics(rawName, base) {
  const options = [
    'Solarium',
    'Reposeras',
    'Iluminacion nocturna',
    'Profundidad gradual',
    'Agua clara'
  ];
  const seed = hashString(rawName);
  const picks = [
    options[seed % options.length],
    options[(seed + 2) % options.length],
    options[(seed + 4) % options.length]
  ];
  const uniq = Array.from(new Set(picks));
  if (base) uniq.unshift(base);
  return uniq;
}

function buildItem({ type, rawName, basePath, meta, defaultDescription, defaultChips }) {
  const displayName = prettifyName(rawName);
  const slug = slugify(rawName);
  const relativeBase = path.relative(ROOT, basePath).split(path.sep).join('/');
  const publicBase = `${encodePathSegments(relativeBase)}`;
  const images = listImages(basePath, publicBase);
  const cover = meta?.cover
    ? `${publicBase}/${encodeSegment(meta.cover)}`
    : images[0] || null;

  const description = meta?.descripcionCorta || defaultDescription || buildFallbackDescription(rawName);

  let amenities = null;
  let characteristics = null;

  if (type === 'casa' || type === 'monoambiente') {
    amenities = meta?.amenities || buildFallbackAmenities(rawName);
  } else if (type === 'pileta') {
    characteristics =
      meta?.caracteristicas ||
      meta?.características ||
      defaultChips ||
      buildFallbackCharacteristics(rawName);
  } else if (type === 'evento') {
    characteristics = meta?.caracteristicas || meta?.características || null;
  }

  return {
    type,
    slug,
    rawName,
    displayName,
    description,
    amenities,
    characteristics,
    images,
    cover,
    order: typeof meta?.orden === 'number' ? meta.orden : null,
  };
}

function getSubDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function sortItems(items) {
  return items.sort((a, b) => {
    if (a.order !== null && b.order !== null) return a.order - b.order;
    if (a.order !== null) return -1;
    if (b.order !== null) return 1;
    return a.displayName.localeCompare(b.displayName, 'es', { numeric: true });
  });
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (!fs.existsSync(HABITACIONES_DIR)) {
    const emptyManifest = { generatedAt: new Date().toISOString(), items: [] };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(emptyManifest, null, 2));
    console.log('No existe carpeta habitaciones/. Manifest vacío generado.');
    return;
  }

  const topDirs = getSubDirs(HABITACIONES_DIR);
  const items = [];

  // Casas: directorios directos que no son especiales
  topDirs
    .filter((name) => !SPECIAL_DIRS.has(name))
    .forEach((name) => {
      const basePath = path.join(HABITACIONES_DIR, name);
      const meta = readMeta(basePath);
      items.push(
        buildItem({
          type: 'casa',
          rawName: name,
          basePath,
          meta,
          defaultDescription: null,
        })
      );
    });

  // Monoambientes
  const monosRoot = path.join(HABITACIONES_DIR, 'monoambientes');
  const monoSubDirs = getSubDirs(monosRoot);
  if (monoSubDirs.length > 0) {
    monoSubDirs.forEach((name) => {
      const basePath = path.join(monosRoot, name);
      const meta = readMeta(basePath);
      items.push(
        buildItem({
          type: 'monoambiente',
          rawName: name,
          basePath,
          meta,
          defaultDescription: null,
        })
      );
    });
  } else if (fs.existsSync(monosRoot)) {
    const meta = readMeta(monosRoot);
    const basePath = monosRoot;
    const images = listImages(basePath, `/${encodePathSegments(path.relative(ROOT, basePath).split(path.sep).join('/'))}`);
    if (images.length > 0 || meta) {
      items.push(
        buildItem({
          type: 'monoambiente',
          rawName: 'Monoambientes',
          basePath,
          meta,
          defaultDescription: null,
        })
      );
    }
  }

  // Piletas
  const piletasRoot = path.join(HABITACIONES_DIR, 'piletas');
  const piletaDirs = getSubDirs(piletasRoot);
  if (piletaDirs.length > 0) {
    piletaDirs.forEach((name) => {
      const basePath = path.join(piletasRoot, name);
      const meta = readMeta(basePath);
      const prettified = prettifyName(name).toLowerCase();
      const titleName = `Pileta ${prettified}`;
      items.push(
        buildItem({
          type: 'pileta',
          rawName: titleName,
          basePath,
          meta,
          defaultDescription: null,
          defaultChips: [prettifyName(name)],
        })
      );
    });
  } else {
    // fallback: carpetas top-level con "piscina" o "pileta"
    topDirs
      .filter((name) => /piscina|pileta/i.test(name))
      .forEach((name) => {
        const basePath = path.join(HABITACIONES_DIR, name);
        const meta = readMeta(basePath);
        const titleName = prettifyName(name).toLowerCase().startsWith('pileta')
          ? prettifyName(name)
          : `Pileta ${prettifyName(name).replace(/^piscina\s*/i, '')}`;
        items.push(
          buildItem({
            type: 'pileta',
            rawName: titleName,
            basePath,
            meta,
            defaultDescription: null,
            defaultChips: [prettifyName(name)],
          })
        );
      });
  }

  // Eventos
  const eventosRoot = path.join(HABITACIONES_DIR, 'eventos');
  const eventosSubDirs = getSubDirs(eventosRoot);
  if (eventosSubDirs.length > 0) {
    eventosSubDirs.forEach((name) => {
      const basePath = path.join(eventosRoot, name);
      const meta = readMeta(basePath);
      items.push(
        buildItem({
          type: 'evento',
          rawName: name,
          basePath,
          meta,
          defaultDescription: null,
        })
      );
    });
  } else {
    const meta = readMeta(eventosRoot);
    const basePath = eventosRoot;
    const relativeBase = path.relative(ROOT, basePath).split(path.sep).join('/');
    const images = listImages(basePath, `/${relativeBase}`);
    if (images.length > 0 || meta) {
      const built = buildItem({
        type: 'evento',
        rawName: 'Eventos',
        basePath,
        meta,
        defaultDescription: null,
      });
      items.push(built);
    }
  }

  // fallback: top-level "salon" treated as evento
  topDirs
    .filter((name) => /salon/i.test(name))
    .forEach((name) => {
      const basePath = path.join(HABITACIONES_DIR, name);
      const meta = readMeta(basePath);
      items.push(
        buildItem({
          type: 'evento',
          rawName: name,
          basePath,
          meta,
          defaultDescription: null,
        })
      );
    });

  const manifest = {
    generatedAt: new Date().toISOString(),
    items: sortItems(items),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Manifest generado: ${OUTPUT_FILE} (${manifest.items.length} items)`);
}

main();
