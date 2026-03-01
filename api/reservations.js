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

const PAYMENT_LABELS = {
  card: 'Tarjeta de débito o crédito',
  mercadopago: 'MercadoPago',
  efectivo_hotel: 'Efectivo en el hotel',
  local: 'Efectivo en el hotel'
};

function buildEmailText(row, reservation) {
  const paymentLabel = PAYMENT_LABELS[reservation.paymentMethod] || reservation.paymentMethod || '-';
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
    `Tipo habitación: ${roomLabel}\n` +
    `Método de pago: ${paymentLabel}\n` +
    `Mensaje original: ${row.mensaje_original}\n` +
    `ID reserva: ${row.id_reserva}\n\n` +
    `Enviado: ${new Date().toLocaleString()}`;
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
