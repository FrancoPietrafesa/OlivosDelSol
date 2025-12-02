# Hotel Olivos del Sol - Guía de Deployment

Este documento explica cómo configurar y desplegar correctamente la página web del Hotel Olivos del Sol en Vercel.

## ✅ Correcciones Implementadas

### 1. Problema de imagen solucionado
- **Problema**: Referencia incorrecta a la imagen `san-juan-argentina(1).jpg` 
- **Solución**: Corregido a `san-juan-argentina (1).jpg` (con espacio)

### 2. Configuración de Vercel
- **Problema**: Faltaba configuración para API routes
- **Solución**: Creado archivo `vercel.json` con la configuración correcta

### 3. Funcionalidad JavaScript mejorada
- **Problema**: Lógica duplicada en el flujo de reservas (paso 3)
- **Solución**: Corregida la función `nextStep()` para manejar correctamente cada paso

### 4. Variables de entorno documentadas
- **Problema**: Falta de documentación sobre configuración SMTP
- **Solución**: Creado `server/.env.example` con instrucciones

## 🚀 Pasos para Deployment en Vercel

### Paso 1: Configurar variables de entorno
1. Crear un archivo `.env` en la carpeta `server/`
2. Usar las variables del archivo `server/.env.example`
3. **IMPORTANTE**: Para Gmail, usar una contraseña de aplicación:
   - Ve a tu cuenta de Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicación
   - Genera una contraseña específica para esta aplicación

### Paso 2: Desplegar en Vercel
1. Conectar tu repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto con Node.js
3. Las API routes se configurarán automáticamente gracias al `vercel.json`

### Paso 3: Verificar funcionamiento
- Probar el formulario de reservas
- Verificar que se reciben emails en la dirección configurada
- Comprobar que todas las páginas cargan correctamente

## 📁 Estructura del proyecto

```
├── index.html              # Página principal
├── services.html           # Página de servicios
├── gallery.html           # Página de galería
├── experiences.html       # Página de experiencias
├── style.css              # Estilos principales
├── script.js              # JavaScript principal
├── config/
│   └── mercadopago-config.js  # Configuración de MercadoPago
├── api/
│   └── reservations.js    # API para reservas
├── images/                # Imágenes del sitio
└── vercel.json           # Configuración de Vercel
```

## 🔧 Funcionalidades corregidas

### ✅ Formulario de reservas
- Flujo de 6 pasos funcionando correctamente
- Validación de campos mejorada
- Envío de emails via SMTP configurado

### ✅ Navegación
- Menú móvil iOS-style funcionando
- Selectores de idioma sincronizados
- Smooth scrolling entre secciones

### ✅ Galería de imágenes
- Lightbox funcionando correctamente
- Navegación con teclado
- Responsive en todos los dispositivos

### ✅ Efectos visuales
- Carrusel de imágenes en hero
- Animaciones CSS optimizadas
- Loading states implementados

## 🐛 Solución de problemas

### Si el formulario de reservas no envía emails:
1. Verificar variables SMTP en `.env`
2. Usar contraseña de aplicación (no contraseña normal)
3. Revisar logs en Vercel → Functions → reservations

### Si las imágenes no cargan:
1. Verificar que todos los archivos estén en la carpeta `images/`
2. Confirmar nombres de archivos (respetar espacios)

### Si el menú móvil no funciona:
1. Verificar que `script.js` se carga correctamente
2. Comprobar console del navegador para errores JavaScript

## 📞 Soporte

Para problemas técnicos, revisar:
1. Console del navegador (F12)
2. Logs de Vercel Functions
3. Configuración de variables de entorno

---
*Proyecto replicado y corregido para coincidir exactamente con la versión deployada en Vercel*