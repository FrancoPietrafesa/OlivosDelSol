
# Hotel Olivos del Sol – Instrucciones de despliegue y pagos

Este paquete contiene la página web completa del Hotel Olivos del Sol lista para ser desplegada en Vercel. A continuación se detallan los pasos para desplegar el sitio y para integrar el sistema de pagos.

## Estructura de archivos

- `index.html`: Página principal con todas las secciones (Home, Servicios, Galería, Experiencias, Recomendaciones, Reservas y Contacto).
- `style.css`: Hojas de estilo para el diseño y aspecto del sitio.
- `script.js`: Lógica de interacción, traducción (ES/EN) y el flujo de reservas.
- `README.md`: Este archivo con las instrucciones.

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/) si no la tienes.
2. Descarga el archivo ZIP y descomprímelo en tu máquina local.
3. Abre una terminal, navega hasta la carpeta que contiene estos archivos y ejecuta `vercel` para iniciar el proceso de despliegue. Si es la primera vez que utilizas Vercel en tu computadora, te pedirá que instales la CLI de Vercel (`npm install -g vercel`) y que inicies sesión.
4. Durante el despliegue, Vercel detectará automáticamente que se trata de un proyecto estático. Simplemente confirma los valores predeterminados. Cuando el proceso termine, recibirás una URL pública para tu sitio.

## Integración de pagos (Stripe)

El flujo de reservas incluye un paso de pago con campos de tarjeta. Para procesar pagos reales se recomienda utilizar **Stripe**, un proveedor de pagos seguro y ampliamente utilizado. A continuación, se describe cómo generar las claves y conectar Stripe al formulario:

1. **Crear una cuenta en Stripe**: 
   - Ve a [stripe.com](https://stripe.com/) y crea una cuenta gratuita.
   - Completa la configuración básica y verifica tus datos.

2. **Obtener las claves API**:
   - Dentro del Panel de Stripe, navega a **Desarrolladores → Claves de API**.
   - Copia la **clave pública (publishable key)** y la **clave secreta (secret key)**. Para pruebas puedes usar las claves en modo *Test*.

3. **Agregar Stripe a tu proyecto**:
   - En tu `index.html`, antes de cerrar la etiqueta `<body>`, incluye el script de Stripe Checkout:

     ```html
     <script src="https://js.stripe.com/v3/"></script>
     <script src="stripe-checkout.js"></script>
     ```

   - Crea un archivo `stripe-checkout.js` donde inicialices Stripe con tu clave pública y definas la función para crear una sesión de pago. Por ejemplo:

     ```javascript
     const stripe = Stripe('TU_CLAVE_PUBLICA_AQUI');

     async function handlePayment(amount) {
       const response = await fetch('/create-checkout-session', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ amount: amount })
       });
       const session = await response.json();
       const result = await stripe.redirectToCheckout({ sessionId: session.id });
       if (result.error) {
         console.error(result.error.message);
       }
     }
     ```

4. **Crear un endpoint para la sesión de pago**:
   - Para procesar pagos necesitas un backend (puede ser una función serverless en Vercel). Crea un archivo (por ejemplo `api/create-checkout-session.js`) que utilice la clave secreta para crear una sesión de pago:

     ```javascript
     const Stripe = require('stripe');
     const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

     module.exports = async (req, res) => {
       const { amount } = req.body;
       const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: [
           {
             price_data: {
               currency: 'usd',
               product_data: { name: 'Reserva Hotel' },
               unit_amount: amount * 100,
             },
             quantity: 1,
           },
         ],
         mode: 'payment',
         success_url: 'https://tu-dominio.vercel.app/success',
         cancel_url: 'https://tu-dominio.vercel.app/cancel',
       });
       res.status(200).json({ id: session.id });
     };
     ```

   - Debes definir la variable de entorno `STRIPE_SECRET_KEY` con tu clave secreta en Vercel (en **Settings → Environment Variables**).

5. **Conectar el flujo de reservas**:
   - En tu `script.js`, reemplaza la acción del botón "Pagar" con una llamada a `handlePayment()` pasando el monto total calculado de la reserva.

Estas instrucciones permiten añadir pagos reales de forma segura. Si no deseas procesar pagos en línea, puedes mantener el formulario actual como un registro interno y cobrar físicamente en el hotel.

## Confirmación por correo

Al finalizar la reserva, el sitio envía automáticamente un correo electrónico con los detalles al propietario configurado (por defecto `francopietra01@gmail.com`).
Si prefieres usar WhatsApp en el futuro, podemos añadir una integración server-side con las APIs oficiales o un enlace manual en la confirmación.

## Traducción ES/EN

El selector de idiomas en la esquina superior derecha permite alternar entre español e inglés. Si deseas añadir más idiomas, edita el objeto `translations` en `script.js` agregando las traducciones correspondientes y actualiza las opciones en el selector.


## Móvil y menú estilo iOS
- Se añadió un menú móvil tipo *action sheet* (estilo iOS). El botón hamburguesa abre un panel con enlaces y selector de idioma.  
- Accesible con teclado (Escape para cerrar, foco atrapado).
- Estilos en `style.css` y lógica en `script.js`.
