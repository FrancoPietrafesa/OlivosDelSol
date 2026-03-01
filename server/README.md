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

Despliegue 24/7 (reservas siempre disponibles)
---------------------------------------------
Para que el proceso quede funcionando 24/7 y la web pueda enviar reservas en cualquier momento:

1. **Railway** (recomendado, gratis para bajo tráfico):
   - Conectá el repo o subí la carpeta `server`.
   - Variables de entorno: `SMTP_*`, `OWNER_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, opcionalmente `GOOGLE_SHEET_ID` y `GOOGLE_SHEET_RANGE`.
   - Railway asigna una URL pública (ej. `https://tu-app.up.railway.app`). En el frontend, configurá esa URL como base para las llamadas a `/api/reservations` y `/api/availability` (o usá un proxy en tu hosting del sitio).

2. **Render** (plan free con “spin down” tras inactividad):
   - Creá un Web Service, repo = tu proyecto, comando `node server.js` (o `npm start`) en la carpeta `server`.
   - Mismas variables de entorno que arriba. La URL será tipo `https://tu-servicio.onrender.com`.

3. **VPS** (DigitalOcean, Vultr, etc.):
   - Instalá Node.js, cloná el repo, `cd server && npm install`, configurá `.env`.
   - Ejecutá con `pm2 start server.js` (o systemd) para que se reinicie solo y quede corriendo 24/7.

En todos los casos: asegurate de que la **web pública** apunte al backend desplegado. Si el sitio está en Vercel/Netlify y el backend en Railway, en la página de reservas (o en `index.html` si es global) agregá antes de cargar `script.js`:

```html
<script>window.OLIVOS_API_BASE_URL = 'https://tu-backend.up.railway.app';</script>
```

Así las llamadas a `/api/availability` y `/api/reservations` irán a ese servidor 24/7.

Siguientes pasos opcionales
--------------------------
- Persistir reservas en una base de datos
- Añadir autenticación y rate-limiting al endpoint
- Agregar notificaciones adicionales (SMS, Telegram)
