const nodemailer = require('nodemailer');

// SMTP / email configuration via env
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'francopietra01@gmail.com';

function buildEmailText(reservation) {
  const nights = (() => {
    const a = new Date(reservation.checkin || '');
    const b = new Date(reservation.checkout || '');
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
    return Number.isNaN(diff) ? '-' : diff;
  })();

  return `Nueva reserva en Olivos del Sol\n\n` +
    `Nombre: ${reservation.guestName || '-'}\n` +
    `Email: ${reservation.guestEmail || '-'}\n` +
    `Teléfono: ${reservation.guestPhone || '-'}\n` +
    `Check-in: ${reservation.checkin || '-'}\n` +
    `Check-out: ${reservation.checkout || '-'}\n` +
    `Noches: ${nights}\n` +
    `Huéspedes: ${reservation.guests || '-'}\n` +
    `Habitaciones: ${reservation.rooms || '-'}\n` +
    `Tipo: ${reservation.roomType || '-'}\n` +
    `Método de pago: ${reservation.paymentMethod || '-'}\n\n` +
    `Enviado: ${new Date().toLocaleString()}`;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo procesar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const reservation = req.body || {};

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('Error de configuración:', { SMTP_HOST, SMTP_PORT, SMTP_USER: !!SMTP_USER, SMTP_PASS: !!SMTP_PASS });
    return res.status(500).json({ error: 'Servidor no configurado. Faltan variables SMTP.' });
  }

  const text = buildEmailText(reservation);

  const mailOptions = {
    from: `"Reservas Olivos del Sol" <${FROM_EMAIL}>`,
    to: OWNER_EMAIL,
    subject: 'Nueva Reserva - Olivos del Sol',
    text,
    html: text.replace(/\n/g, '<br>')
  };

  try {
    // Verificar conexión SMTP
    await transporter.verify();
    
    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    return res.json({ ok: true, info });
  } catch (err) {
    console.error('Error detallado al enviar email:', err);
    if (err.code === 'EAUTH') {
      return res.status(502).json({ 
        ok: false, 
        error: 'Error de autenticación con Gmail. Verifica tu contraseña de aplicación.' 
      });
    }
    return res.status(502).json({ 
      ok: false, 
      error: err.message || 'Error al enviar el email',
      details: err.response || err
    });
  }
};