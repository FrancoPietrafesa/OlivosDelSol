# Configuración de MercadoPago

## Pasos para configurar MercadoPago

### 1. Obtener credenciales de MercadoPago

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta de MercadoPago
3. Ve a **Panel de Credenciales**
4. Copia tu **Public Key** (clave pública)

### 2. Configurar la clave pública

Edita el archivo `config/mercadopago-config.js` y reemplaza:

```javascript
publicKey: 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
```

Con tu Public Key real de MercadoPago.

### 3. Modo de prueba vs Producción

- **Prueba (TEST)**: Usa credenciales de prueba que empiezan con `TEST-`
- **Producción**: Usa credenciales de producción (sin el prefijo TEST)

### 4. Webhook (opcional pero recomendado)

Para recibir notificaciones de pagos, necesitarás:

1. Un servidor backend que maneje las notificaciones
2. Configurar la URL del webhook en MercadoPago
3. La URL debe ser accesible públicamente (no funcionará con localhost)

### 5. URLs de retorno

Las URLs de retorno están configuradas en `config/mercadopago-config.js`:
- `success`: Página de éxito
- `failure`: Página de error
- `pending`: Página de pago pendiente

Asegúrate de crear estas páginas HTML o ajustar las rutas según tu estructura.

### 6. Pruebas

Para probar en modo de prueba, puedes usar tarjetas de prueba:
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 7557 3453 0604

CVV: 123 | Fecha de expiración: cualquier fecha futura

## Notas importantes

- En modo de prueba, los pagos no se procesan realmente
- Para producción, necesitarás un certificado SSL (HTTPS)
- El webhook requiere un servidor backend para procesar las notificaciones
- Las credenciales de producción son diferentes a las de prueba

