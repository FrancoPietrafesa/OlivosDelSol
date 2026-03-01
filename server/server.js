require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors({ origin: '*', methods: ['POST', 'GET'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'francopietra01@gmail.com';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '1mNE_mwwrE35XjSizJbxcIb1gx2gn7PbGLGUA8vtqykc';
const GOOGLE_SHEET_GID = process.env.GOOGLE_SHEET_GID || '0';
const GOOGLE_SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'A:P';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn('Advertencia: faltan variables SMTP en .env (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS).');
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
  if (m) return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));

  m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));

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

function calculateNights(checkin, checkout) {
  const a = new Date(checkin || '');
  const b = new Date(checkout || '');
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Number.isNaN(diff) ? 0 : diff;
}

function normalizeReservation(reservation) {
  return {
    created_at: new Date().toISOString(),
    estado: 'confirmada',
    tipo: reservation.roomType || '',
    check_in: reservation.checkin || '',
    check_out: reservation.checkout || '',
    noches: String(calculateNights(reservation.checkin, reservation.checkout)),
    personas: String(reservation.guests || ''),
    nombre: reservation.guestName || '',
    apellido: reservation.guestLastName || '',
    telefono: reservation.guestPhone || '',
    mensaje_original: 'Reservado por la web',
    id_reserva: `web-${Date.now()}`,
    email: reservation.guestEmail || ''
  };
}

function buildEmailText(row, reservation) {
  return `Nueva reserva en Olivos del Sol\n\n` +
    `Nombre: ${row.nombre || '-'}\n` +
    `Apellido: ${row.apellido || '-'}\n` +
    `Email: ${row.email || '-'}\n` +
    `Telefono: ${row.telefono || '-'}\n` +
    `Check-in: ${row.check_in || '-'}\n` +
    `Check-out: ${row.check_out || '-'}\n` +
    `Noches: ${row.noches || '-'}\n` +
    `Personas: ${row.personas || '-'}\n` +
    `Habitaciones: ${reservation.rooms || '-'}\n` +
    `Tipo: ${row.tipo || '-'}\n` +
    `Metodo de pago: ${reservation.paymentMethod || '-'}\n` +
    `Mensaje original: ${row.mensaje_original}\n` +
    `ID reserva: ${row.id_reserva}\n\n` +
    `Enviado: ${new Date().toLocaleString()}`;
}

async function loadSheetReservations() {
  const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GOOGLE_SHEET_GID}`;
  const response = await fetch(csvUrl);
  if (!response.ok) throw new Error(`No se pudo leer Google Sheets (${response.status})`);

  const rows = parseCsv(await response.text());
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const checkinIndex = headers.findIndex((h) => h.includes('check in') || h.includes('checkin') || h.includes('entrada'));
  const checkoutIndex = headers.findIndex((h) => h.includes('check out') || h.includes('checkout') || h.includes('salida'));

  if (checkinIndex === -1 || checkoutIndex === -1) {
    throw new Error('No se encontraron columnas check-in/check-out en la hoja');
  }

  return rows
    .slice(1)
    .map((r) => ({ checkin: parseDate(r[checkinIndex]), checkout: parseDate(r[checkoutIndex]) }))
    .filter((r) => r.checkin && r.checkout && r.checkout > r.checkin);
}

async function appendReservationToSheet(row) {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Falta configurar GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY');
  }

  const auth = new google.auth.JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const values = [[
    row.created_at,
    row.estado,
    row.tipo,
    row.check_in,
    row.check_out,
    row.noches,
    row.personas,
    row.nombre,
    row.apellido,
    row.telefono,
    row.mensaje_original,
    row.id_reserva,
    row.email,
    '',
    '',
    ''
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: GOOGLE_SHEET_RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values }
  });
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: { rejectUnauthorized: false },
  debug: true,
  logger: true
});

app.post('/api/reservations', async (req, res) => {
  const reservation = req.body || {};
  const row = normalizeReservation(reservation);

  if (!row.check_in || !row.check_out || !row.personas || !row.nombre || !row.apellido || !row.telefono || !row.email) {
    return res.status(400).json({
      ok: false,
      error: 'Faltan datos obligatorios: check_in, check_out, personas, nombre, apellido, telefono, email.'
    });
  }

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return res.status(500).json({ ok: false, error: 'Servidor no configurado. Faltan variables SMTP en .env.' });
  }

  try {
    await appendReservationToSheet(row);

    const text = buildEmailText(row, reservation);
    await transporter.verify();
    const info = await transporter.sendMail({
      from: `"Reservas Olivos del Sol" <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: 'Nueva Reserva - Olivos del Sol',
      text,
      html: text.replace(/\n/g, '<br>')
    });

    return res.json({ ok: true, info, reservationId: row.id_reserva });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: err.message || 'Error al registrar o enviar la reserva',
      details: err.response || err
    });
  }
});

app.get('/api/availability', async (req, res) => {
  const checkin = parseDate(req.query.checkin);
  const checkout = parseDate(req.query.checkout);
  if (!checkin || !checkout || checkout <= checkin) {
    return res.status(400).json({ ok: false, error: 'Fechas invalidas' });
  }

  try {
    const reservations = await loadSheetReservations();
    const conflicts = reservations.filter((r) => intervalsOverlap(checkin, checkout, r.checkin, r.checkout));
    return res.json({
      ok: true,
      available: conflicts.length === 0,
      conflicts: conflicts.slice(0, 20).map((c) => ({ checkin: toIsoDate(c.checkin), checkout: toIsoDate(c.checkout) }))
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: err.message || 'No fue posible verificar disponibilidad' });
  }
});

app.post('/api/availability', async (req, res) => {
  const checkin = parseDate(req.body && req.body.checkin);
  const checkout = parseDate(req.body && req.body.checkout);
  if (!checkin || !checkout || checkout <= checkin) {
    return res.status(400).json({ ok: false, error: 'Fechas invalidas' });
  }

  try {
    const reservations = await loadSheetReservations();
    const conflicts = reservations.filter((r) => intervalsOverlap(checkin, checkout, r.checkin, r.checkout));
    return res.json({
      ok: true,
      available: conflicts.length === 0,
      conflicts: conflicts.slice(0, 20).map((c) => ({ checkin: toIsoDate(c.checkin), checkout: toIsoDate(c.checkout) }))
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: err.message || 'No fue posible verificar disponibilidad' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));
app.get('/', (req, res) => res.send('Olivo server listo.'));

app.listen(PORT, () => {
  console.log(`Olivo server listening on port ${PORT}`);
});
