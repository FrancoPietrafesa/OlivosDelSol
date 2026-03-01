const DEFAULT_SHEET_ID = '1mNE_mwwrE35XjSizJbxcIb1gx2gn7PbGLGUA8vtqykc';
const DEFAULT_GID = '0';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ');
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function parseDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  let m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    return new Date(Date.UTC(y, mo - 1, d));
  }

  m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    return new Date(Date.UTC(y, mo - 1, d));
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

async function loadSheetRows() {
  const sheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  const gid = process.env.GOOGLE_SHEET_GID || DEFAULT_GID;
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`No se pudo leer Google Sheets (${response.status})`);
  }

  const csv = await response.text();
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const checkinIndex = headers.findIndex((h) =>
    h.includes('check in') || h.includes('checkin') || h.includes('entrada')
  );
  const checkoutIndex = headers.findIndex((h) =>
    h.includes('check out') || h.includes('checkout') || h.includes('salida')
  );

  if (checkinIndex === -1 || checkoutIndex === -1) {
    throw new Error('No se encontraron columnas check-in/check-out en la hoja');
  }

  return rows.slice(1).map((r) => ({
    checkinRaw: r[checkinIndex],
    checkoutRaw: r[checkoutIndex],
    checkin: parseDate(r[checkinIndex]),
    checkout: parseDate(r[checkoutIndex])
  })).filter((r) => r.checkin && r.checkout && r.checkout > r.checkin);
}

module.exports = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const payload = req.method === 'GET' ? req.query : (req.body || {});
  const checkin = parseDate(payload.checkin);
  const checkout = parseDate(payload.checkout);

  if (!checkin || !checkout || checkout <= checkin) {
    return res.status(400).json({
      ok: false,
      error: 'Fechas invalidas. Debes enviar checkin y checkout validos.'
    });
  }

  try {
    const reservations = await loadSheetRows();
    const conflicts = reservations.filter((r) =>
      intervalsOverlap(checkin, checkout, r.checkin, r.checkout)
    );

    return res.json({
      ok: true,
      available: conflicts.length === 0,
      requested: {
        checkin: toIsoDate(checkin),
        checkout: toIsoDate(checkout)
      },
      conflicts: conflicts.slice(0, 20).map((c) => ({
        checkin: toIsoDate(c.checkin),
        checkout: toIsoDate(c.checkout)
      }))
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error.message || 'No fue posible verificar disponibilidad'
    });
  }
};
