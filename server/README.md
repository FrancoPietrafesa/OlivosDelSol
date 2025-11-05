Servidor de ejemplo para enviar reservas por WhatsApp (WhatsApp Cloud API)

Resumen
-------
Este pequeño servidor Node/Express expone un endpoint POST /api/reservations que, al recibir un JSON con los datos de la reserva, envía un mensaje al número del propietario usando la WhatsApp Cloud API de Meta.

Requisitos previos
Servidor de ejemplo para enviar reservas por correo electrónico (SMTP)

Resumen
-------
Este pequeño servidor Node/Express expone un endpoint POST /api/reservations que, al recibir un JSON con los datos de la reserva, envía un email al propietario (por defecto `francopietra01@gmail.com`).

Requisitos previos
------------------
- Node.js (>= 16)
- Credenciales SMTP: host, puerto, usuario y contraseña. Para cuentas Gmail personales recomendamos crear una App Password (requiere 2FA) y usarla como `SMTP_PASS`.

Pasos rápidos
------------
1. Copia el ejemplo de variables de entorno:

```bash
cp server/.env.example server/.env
```

2. Edita `server/.env` y pega tus credenciales SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). Asegúrate que `OWNER_EMAIL` esté configurado (por defecto apunta a francopietra01@gmail.com).

3. Instala dependencias e inicia el servidor:

```bash
cd server
npm install
npm start
```

4. Prueba con curl (ejemplo):

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"guestName":"Prueba","guestEmail":"test@example.com","guestPhone":"+5491155511222","checkin":"2025-12-20","checkout":"2025-12-25","guests":2,"rooms":1,"roomType":"suite","paymentMethod":"local" }'
```

Notas importantes
-----------------
- Si usas Gmail: activa 2FA en la cuenta y genera una App Password (Mail) para `SMTP_PASS`.
- Alternativas: cualquier proveedor SMTP (SendGrid, Mailgun, SparkPost, etc.). Muchos ofrecen niveles gratuitos para pruebas.

Seguridad
--------
Nunca compartas tus credenciales SMTP públicamente. Guarda `.env` fuera del control de versiones o usa secretos en tu hosting.

Siguientes pasos opcionales
--------------------------
- Persistir reservas en una base de datos
- Añadir autenticación y rate-limiting al endpoint
- Agregar notificaciones adicionales (SMS, Telegram)
