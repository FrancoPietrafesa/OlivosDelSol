
# Hotel Olivos del Sol - Sistema de Reservas

Sistema simple de reservas que envía notificaciones por email al propietario del hotel.

## Estructura

- `index.html`: Página principal con todas las secciones
- `style.css`: Estilos del sitio
- `script.js`: Lógica del formulario y envío de reservas
- `server/`: Servidor Node.js que procesa las reservas y envía emails
  - `server.js`: API para recibir reservas y enviar emails
  - `.env`: Configuración del servidor (SMTP, emails)

## Configuración del Servidor de Email

1. Instalar dependencias:
```bash
cd server
npm install
```

2. Configurar email en Gmail:
   - Ve a la configuración de tu cuenta Google
   - Activa la verificación en dos pasos
   - Ve a "Contraseñas de aplicación"
   - Genera una nueva contraseña y úsala en el siguiente paso

3. Crear archivo `server/.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
FROM_EMAIL=tu-correo@gmail.com
OWNER_EMAIL=francopietra01@gmail.com
```

## Ejecutar el Sistema

1. Iniciar el servidor:
```bash
cd server
npm start
```

2. Abrir `index.html` en el navegador

El formulario enviará las reservas automáticamente por email a francopietra01@gmail.com

## Flujo de Reserva

1. El usuario llena el formulario con:
   - Fecha de entrada/salida
   - Número de huéspedes/habitaciones 
   - Tipo de habitación
   - Datos de contacto

2. Al finalizar, el sistema:
   - Envía un email al propietario con los detalles
   - Muestra confirmación al usuario
   - Reinicia el formulario

## Traducción ES/EN

El sitio incluye traducción español/inglés mediante selector de idioma.

El selector de idiomas en la esquina superior derecha permite alternar entre español e inglés. Si deseas añadir más idiomas, edita el objeto `translations` en `script.js` agregando las traducciones correspondientes y actualiza las opciones en el selector.


## Móvil y menú estilo iOS
- Se añadió un menú móvil tipo *action sheet* (estilo iOS). El botón hamburguesa abre un panel con enlaces y selector de idioma.  
- Accesible con teclado (Escape para cerrar, foco atrapado).
- Estilos en `style.css` y lógica en `script.js`.
