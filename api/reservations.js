const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'francopietra01@gmail.com';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '1mNE_mwwrE35XjSizJbxcIb1gx2gn7PbGLGUA8vtqykc';
const GOOGLE_SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'A:P';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

const PAYMENT_LABELS = {
  card: 'Tarjeta de debito o credito',
  mercadopago: 'MercadoPago',
  efectivo_hotel: 'Efectivo en el hotel',
  local: 'Efectivo en el hotel'
};

function normalizeHeader(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ');
}

function calculateNights(checkin, checkout) {
  const a = new Date(checkin || '');
  const b = new Date(checkout || '');
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Number.isNaN(diff) ? 0 : diff;
}

function getPaymentLabel(paymentMethod) {
  return PAYMENT_LABELS[paymentMethod] || paymentMethod || '';
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
    email: reservation.guestEmail || '',
    metodo_pago: getPaymentLabel(reservation.paymentMethod)
  };
}

function buildEmailText(row, reservation) {
  const paymentLabel = getPaymentLabel(reservation.paymentMethod) || '-';
  const roomLabel = (row.tipo || '-').replace(/_/g, ' ');
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
    `Tipo habitacion: ${roomLabel}\n` +
    `Metodo de pago: ${paymentLabel}\n` +
    `Mensaje original: ${row.mensaje_original}\n` +
    `ID reserva: ${row.id_reserva}\n\n` +
    `Enviado: ${new Date().toLocaleString()}`;
}

function findHeaderIndex(headers, candidates) {
  for (let i = 0; i < headers.length; i += 1) {
    const h = headers[i];
    if (candidates.some((candidate) => h.includes(candidate))) return i;
  }
  return -1;
}

function pickHeaderIndexes(rawHeaders) {
  const headers = rawHeaders.map(normalizeHeader);

  return {
    created_at: findHeaderIndex(headers, ['created at', 'fecha', 'timestamp']),
    estado: findHeaderIndex(headers, ['estado', 'status']),
    tipo: findHeaderIndex(headers, ['tipo', 'suite', 'habitacion']),
    check_in: findHeaderIndex(headers, ['check in', 'checkin', 'entrada']),
    check_out: findHeaderIndex(headers, ['check out', 'checkout', 'salida']),
    noches: findHeaderIndex(headers, ['noches', 'nights']),
    personas: findHeaderIndex(headers, ['personas', 'huespedes', 'guests']),
    nombre: findHeaderIndex(headers, ['nombre', 'name']),
    apellido: findHeaderIndex(headers, ['apellido', 'last name']),
    telefono: findHeaderIndex(headers, ['telefono', 'phone']),
    mensaje_original: findHeaderIndex(headers, ['mensaje original', 'mensaje']),
    id_reserva: findHeaderIndex(headers, ['id reserva', 'reservation id']),
    email: findHeaderIndex(headers, ['email', 'correo']),
    metodo_pago: findHeaderIndex(headers, ['metodo de pago', 'forma de pago', 'payment method'])
  };
}

function buildValuesFromHeaders(rawHeaders, row) {
  const values = new Array(Math.max(rawHeaders.length, 16)).fill('');
  const indexMap = pickHeaderIndexes(rawHeaders);

  Object.entries(indexMap).forEach(([key, index]) => {
    if (index >= 0) values[index] = row[key] || '';
  });

  return [values];
}

function buildFallbackValues(row) {
  return [[
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
    row.metodo_pago,
    '',
    ''
  ]];
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

  const tabName = GOOGLE_SHEET_RANGE.includes('!') ? GOOGLE_SHEET_RANGE.split('!')[0] : null;
  const headerRange = tabName ? `${tabName}!1:1` : '1:1';

  let values = buildFallbackValues(row);

  try {
    const headerResp = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: headerRange
    });
    const headerRow = (headerResp.data && headerResp.data.values && headerResp.data.values[0]) || [];
    if (headerRow.length > 0) {
      values = buildValuesFromHeaders(headerRow, row);
    }
  } catch (err) {
    // Si falla lectura de headers, usamos fallback por posicion y continuamos.
  }

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
  tls: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const reservation = req.body || {};
  const row = normalizeReservation(reservation);

  if (!row.check_in || !row.check_out || !row.personas || !row.nombre || !row.apellido || !row.telefono || !row.email) {
    return res.status(400).json({
      ok: false,
      error: 'Faltan datos obligatorios: check_in, check_out, personas, nombre, apellido, telefono, email.'
    });
  }

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return res.status(500).json({ ok: false, error: 'Servidor no configurado. Faltan variables SMTP.' });
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
};