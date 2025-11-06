require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*', // En producción, cambia esto por tu dominio real
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// SMTP / email configuration via env
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'francopietra01@gmail.com';

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn('Advertencia: faltan variables SMTP en .env (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS). Ver server/.env.example');
}

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
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

app.post('/api/reservations', async (req, res) => {
  console.log('Recibida nueva reserva:', req.body);
  const reservation = req.body || {};

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error('Error de configuración:', { SMTP_HOST, SMTP_PORT, SMTP_USER: !!SMTP_USER, SMTP_PASS: !!SMTP_PASS });
    return res.status(500).json({ error: 'Servidor no configurado. Faltan variables SMTP en .env.' });
  }

  const text = buildEmailText(reservation);
  console.log('Contenido del email:', text);

  const mailOptions = {
    from: `"Reservas Olivos del Sol" <${FROM_EMAIL}>`,
    to: OWNER_EMAIL,
    subject: 'Nueva Reserva - Olivos del Sol',
    text,
    html: text.replace(/\n/g, '<br>')
  };

  console.log('Enviando email con opciones:', { ...mailOptions, pass: '******' });

  try {
    // Verificar conexión SMTP
    console.log('Verificando conexión SMTP...');
    await transporter.verify();
    console.log('Conexión SMTP verificada correctamente');

    // Enviar email
    console.log('Enviando email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', info);
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
});

// Health check endpoint (useful para comprobaciones desde el cliente o despliegues)
app.get('/api/health', (req, res) => {
  return res.json({ ok: true, time: Date.now() });
});

app.get('/', (req, res) => {
  res.send('Olivo email server listo. Usa POST /api/reservations con el JSON de la reserva.');
});

app.listen(PORT, () => {
  console.log(`Olivo email server listening on port ${PORT}`);
});
