let currentStep = 1;
let reservationData = {};
let currentLanguage = 'es';

// Función para manejar la transparencia del navbar al hacer scroll
function handleNavbarTransparency() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Agregar evento de scroll con throttling para mejor rendimiento
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleNavbarTransparency();
            ticking = false;
        });
        ticking = true;
    }
});

const translations = {
    es: {
        nav: {home: 'Inicio', services: 'Servicios', gallery: 'Galería', experiences: 'Experiencias', recommendations: 'Recomendaciones', reservations: 'Reservas', contact: 'Contacto'},
        header: {logo: 'Hotel Olivos del Sol'},
        home: {title: 'Bienvenidos a Hotel Olivos del Sol', subtitle: 'Un oasis de tranquilidad y confort en Pocito, San Juan.', description: 'Nuestro hotel ofrece habitaciones modernas, servicios de primera y una atención excepcional para que su estadía sea inolvidable.'},
        services: {title: 'Servicios', room: 'Habitaciones confortables', roomDesc: 'Amplias y luminosas habitaciones con todas las comodidades.', restaurant: 'Restaurante', restaurantDesc: 'Gastronomía regional e internacional de alta calidad.', pool: 'Piscina', poolDesc: 'Piscina al aire libre para relajarse y disfrutar del sol.', wifi: 'Wi‑Fi gratuito', wifiDesc: 'Acceso a internet de alta velocidad en todo el hotel.', parking: 'Estacionamiento', parkingDesc: 'Estacionamiento seguro para su vehículo.', spa: 'Spa & bienestar', spaDesc: 'Sesiones de masajes y tratamientos relajantes.'},
        gallery: {title: 'Galería'},
        experiences: {title: 'Experiencias', jose: '“Una estadía maravillosa. El personal nos hizo sentir como en casa y la piscina es espectacular.”', ana: '“Las habitaciones son amplias y cómodas. La comida en el restaurante fue deliciosa.”', luis: '“El hotel está cerca de muchas bodegas interesantes. ¡Sin duda volveré!”'},
        recommendations: {title: 'Recomendaciones Turísticas', lasMarianas: 'Ubicada en calle Nueva s/n entre Av. Aberastain y Vidart, La Rinconada, Pocito, San Juan. Es una bodega familiar tranquila donde puedes conocer su antigua cava subterránea y degustar vinos premiados.', segisa: 'Situada en Aberastain y calle 15, Pocito. Esta bodega con cavas subterráneas permite descubrir la historia y el proceso del vino, y ofrece almuerzos acompañados de platos típicos en un ambiente acogedor.', fabril: 'En Ruta Nacional 40 entre calles 13 y 14, Pocito. Esta bodega pionera en vinos orgánicos ofrece visitas guiadas, degustaciones y venta de sus vinos y espumantes certificados.', miguelMas: 'Ubicada en la RP 215, Villa Aberastain. Es una moderna champañera familiar donde se degustan espumantes orgánicos y se disfruta de un almuerzo participativo con pizzas al horno.'},
        reservations: {title: 'Reservas', searchTitle: 'Búsqueda inicial', checkin: 'Fecha de entrada:', checkout: 'Fecha de salida:', guests: 'Huéspedes:', rooms: 'Habitaciones:', next: 'Siguiente', back: 'Atrás', selectTitle: 'Selecciona tu habitación', standard: 'Habitación estándar', suite: 'Suite', premium: 'Premium', summaryTitle: 'Resumen de la reserva', guestTitle: 'Datos del huésped', name: 'Nombre completo:', email: 'Correo electrónico:', phone: 'Teléfono:', paymentTitle: 'Forma de pago', paymentInstructions: 'Selecciona tu método de pago preferido:', paymentCard: 'Tarjeta de Débito/Crédito', paymentCardDesc: 'Pago seguro con tarjeta', paymentMercadopago: 'MercadoPago', paymentMercadopagoDesc: 'Pago rápido y seguro con MercadoPago', paymentCash: 'Efectivo en el local', paymentCashDesc: 'Pagarás al llegar al hotel', confirmationTitle: 'Confirmación', confirmationMessage: '¡Gracias por reservar con nosotros! Tu reserva ha sido recibida.', whatsappMessage: 'Puedes enviar un mensaje por WhatsApp para confirmar tu estadía:', finish: 'Finalizar'},
        contact: {title: 'Contacto', addressLabel: 'Dirección:', phoneLabel: 'Teléfono:'}
    },
    en: {
        nav: {home: 'Home', services: 'Services', gallery: 'Gallery', experiences: 'Experiences', recommendations: 'Attractions', reservations: 'Bookings', contact: 'Contact'},
        header: {logo: 'Hotel Olivos del Sol'},
        home: {title: 'Welcome to Hotel Olivos del Sol', subtitle: 'An oasis of tranquility and comfort in Pocito, San Juan.', description: 'Our hotel offers modern rooms, first-class services and exceptional attention to make your stay unforgettable.'},
        services: {title: 'Services', room: 'Comfortable Rooms', roomDesc: 'Spacious and bright rooms with every comfort.', restaurant: 'Restaurant', restaurantDesc: 'High-quality regional and international gastronomy.', pool: 'Pool', poolDesc: 'Outdoor pool to relax and enjoy the sun.', wifi: 'Free Wi‑Fi', wifiDesc: 'High-speed internet access throughout the hotel.', parking: 'Parking', parkingDesc: 'Secure parking for your vehicle.', spa: 'Spa & Wellness', spaDesc: 'Massage sessions and relaxing treatments.'},
        gallery: {title: 'Gallery'},
        experiences: {title: 'Experiences', jose: '“A wonderful stay. The staff made us feel at home and the pool is spectacular.”', ana: '“The rooms are spacious and comfortable. The food in the restaurant was delicious.”', luis: '“The hotel is close to many interesting wineries. I will definitely return!”'},
        recommendations: {title: 'Tourist Recommendations', lasMarianas: 'Located on Calle Nueva between Av. Aberastain and Vidart, La Rinconada, Pocito. This family winery features an old underground cellar and award-winning wines.', segisa: 'Located at Aberastain and Calle 15, Pocito. This boutique winery lets visitors discover the history and winemaking process and offers lunches with local dishes in a cozy atmosphere.', fabril: 'On National Route 40 between streets 13 and 14, Pocito. This pioneer organic winery offers guided tours, tastings and sales of its certified wines and sparkling wines.', miguelMas: 'Located on RP 215, Villa Aberastain. This modern family sparkling wine house offers organic sparkling wine tastings and a participatory lunch with pizza baked in a wood oven.'},
        reservations: {title: 'Bookings', searchTitle: 'Initial search', checkin: 'Check‑in date:', checkout: 'Check‑out date:', guests: 'Guests:', rooms: 'Rooms:', next: 'Next', back: 'Back', selectTitle: 'Choose your room', standard: 'Standard room', suite: 'Suite', premium: 'Premium', summaryTitle: 'Booking summary', guestTitle: 'Guest details', name: 'Full name:', email: 'Email:', phone: 'Phone:', paymentTitle: 'Payment method', paymentInstructions: 'Select your preferred payment method:', paymentCard: 'Debit/Credit Card', paymentCardDesc: 'Secure card payment', paymentMercadopago: 'MercadoPago', paymentMercadopagoDesc: 'Quick and secure payment with MercadoPago', paymentCash: 'Cash at the hotel', paymentCashDesc: 'You will pay when you arrive at the hotel', confirmationTitle: 'Confirmation', confirmationMessage: 'Thank you for booking with us! Your booking has been received.', whatsappMessage: 'You can send a message via WhatsApp to confirm your stay:', finish: 'Finish'},
        contact: {title: 'Contact', addressLabel: 'Address:', phoneLabel: 'Phone:'}
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const keys = elem.getAttribute('data-i18n').split('.');
        let text = translations[currentLanguage];
        keys.forEach(k => {
            if (text) text = text[k];
        });
        if (text) {
            elem.textContent = text;
        }
    });
}

// Funcionalidad del visor de imágenes
let currentImageIndex = 0;
const imageViewer = document.querySelector('.image-viewer');
const viewerImage = imageViewer?.querySelector('img');
const closeBtn = imageViewer?.querySelector('.close-btn');
const prevBtn = imageViewer?.querySelector('.prev-btn');
const nextBtn = imageViewer?.querySelector('.next-btn');
const galleryImages = document.querySelectorAll('.gallery-grid img');

if (galleryImages.length > 0) {
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openImageViewer(img.src, img.alt);
        });
    });

    if (imageViewer) {
        closeBtn?.addEventListener('click', closeImageViewer);
        prevBtn?.addEventListener('click', showPreviousImage);
        nextBtn?.addEventListener('click', showNextImage);
        
        // Cerrar al hacer clic fuera de la imagen
        imageViewer.addEventListener('click', (e) => {
            if (e.target === imageViewer) {
                closeImageViewer();
            }
        });

        // Manejar teclas
        document.addEventListener('keydown', (e) => {
            if (!imageViewer.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    closeImageViewer();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
    }
}

function openImageViewer(src, alt) {
    if (!imageViewer || !viewerImage) return;
    viewerImage.src = src;
    viewerImage.alt = alt;
    imageViewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
    if (!imageViewer) return;
    imageViewer.classList.remove('active');
    document.body.style.overflow = '';
}

function showPreviousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateViewerImage();
    }
}

function showNextImage() {
    if (currentImageIndex < galleryImages.length - 1) {
        currentImageIndex++;
        updateViewerImage();
    }
}

function updateViewerImage() {
    if (!viewerImage) return;
    const currentImg = galleryImages[currentImageIndex];
    viewerImage.src = currentImg.src;
    viewerImage.alt = currentImg.alt;
}

document.getElementById('language-select').addEventListener('change', function(e) {
    setLanguage(e.target.value);
});

function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.reservation-step').forEach((div, index) => {
        div.style.display = (index + 1 === step) ? 'block' : 'none';
    });
    
    // Inicializar resaltado de opciones de pago cuando se muestra el paso 5
    if (step === 5) {
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        if (selectedPayment && selectedPayment.closest('.payment-option')) {
            selectedPayment.closest('.payment-option').classList.add('selected');
        }
    }
}

function validateField(input, regex) {
    // Limpiar validación previa
    input.classList.remove('error', 'valid');
    const errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.style.display = 'none';
    }

    // Si el campo está vacío o no cumple con el regex
    const isEmpty = input.value.trim() === '';
    const isValid = !isEmpty && (!regex || regex.test(input.value));

    // Solo mostrar error si está vacío al intentar validar
    if (isEmpty) {
        input.classList.add('error');
        if (errorSpan) {
            errorSpan.style.display = 'block';
        }
    } else if (isValid) {
        input.classList.add('valid');
    }

    return isValid;
}

function validateStep(step) {
    let isValid = true;
    switch(step) {
        case 1: {
            const fields = ['checkin', 'checkout', 'guests', 'rooms'];
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !validateField(field)) {
                    isValid = false;
                }
            });
            return isValid;
        }
        case 2: {
            const roomType = document.querySelector('input[name="roomType"]:checked');
            const errorSpan = document.querySelector('.room-type-error');
            if (!roomType && errorSpan) {
                errorSpan.style.display = 'block';
                isValid = false;
            }
            return isValid;
        }
        case 4: {
            const guestName = document.getElementById('guestName');
            const guestEmail = document.getElementById('guestEmail');
            const guestPhone = document.getElementById('guestPhone');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\+?[\d\s-]+$/;
            
            isValid = validateField(guestName) &&
                     validateField(guestEmail, emailRegex) &&
                     validateField(guestPhone, phoneRegex);
            return isValid;
        }
        default:
            return true;
    }
}

// No se usa bot cliente; las notificaciones se envían por email server-side

function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep === 1) {
        // collect search data
        reservationData.checkin = document.getElementById('checkin').value;
        reservationData.checkout = document.getElementById('checkout').value;
        reservationData.guests = document.getElementById('guests').value;
        reservationData.rooms = document.getElementById('rooms').value;
    }
    if (currentStep === 2) {
        // get selected room type
        const roomType = document.querySelector('input[name="roomType"]:checked').value;
        reservationData.roomType = roomType;
    }
    if (currentStep === 3) {
        // summary step collects nothing
    }
    if (currentStep === 4) {
        reservationData.guestName = document.getElementById('guestName').value;
        reservationData.guestEmail = document.getElementById('guestEmail').value;
        reservationData.guestPhone = document.getElementById('guestPhone').value;
    }
    if (currentStep === 3) {
        // On summary step show details
        const summaryDiv = document.getElementById('summary-details');
        const lang = translations[currentLanguage];
        let roomLabel = '';
        if (reservationData.roomType === 'standard') roomLabel = lang.reservations.standard;
        if (reservationData.roomType === 'suite') roomLabel = lang.reservations.suite;
        if (reservationData.roomType === 'premium') roomLabel = lang.reservations.premium;
        summaryDiv.innerHTML = `<p>${lang.reservations.checkin} ${reservationData.checkin}</p>` +
                               `<p>${lang.reservations.checkout} ${reservationData.checkout}</p>` +
                               `<p>${lang.reservations.guests} ${reservationData.guests}</p>` +
                               `<p>${lang.reservations.rooms} ${reservationData.rooms}</p>` +
                               `<p>Tipo de habitación: ${roomLabel}</p>`;
    }
    if (currentStep === 5) {
        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (paymentMethod) {
            reservationData.paymentMethod = paymentMethod.value;
        }
    }
    if (currentStep === 6) {
        // Confirmation step - don't proceed further
        return;
    }
    if (currentStep < 6) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function resetForm() {
    reservationData = {};
    // Limpiar todos los campos manualmente
    const fields = [
        'checkin', 'checkout', 'guests', 'rooms',
        'guestName', 'guestEmail', 'guestPhone',
        'cardName', 'cardNumber', 'cardExpiry', 'cardCVC'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Solo resetear si es un input, textarea o select
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                el.value = '';
                // Limpiar clases de validación
                el.classList.remove('error', 'valid');
            }
        }
    });
    
    // Reiniciar los radio buttons de tipo de habitación
    const roomTypeRadios = document.querySelectorAll('input[name="roomType"]');
    if (roomTypeRadios.length > 0) {
        roomTypeRadios[0].checked = true; // Marcar el primero por defecto
    }
    
    // Reiniciar el método de pago a tarjeta
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    if (paymentMethodRadios.length > 0) {
        const cardRadio = Array.from(paymentMethodRadios).find(r => r.value === 'card');
        if (cardRadio) {
            cardRadio.checked = true;
        } else {
            paymentMethodRadios[0].checked = true;
        }
    }
    
    // Limpiar mensajes de error
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
    });
    
    // Limpiar mensaje de confirmación
    const confMsg = document.getElementById('confirmation-message');
    if (confMsg) {
        confMsg.textContent = '';
        confMsg.style.color = '';
    }
    
    // Reiniciar el paso
    showStep(1);
    
    // Rehabilitar botones que puedan estar deshabilitados
    document.querySelectorAll('button[disabled]').forEach(btn => {
        btn.disabled = false;
    });
}

// Función para formatear el número de tarjeta
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Función para formatear la fecha de expiración
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Función para manejar el cambio de método de pago
function handlePaymentMethodChange() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const cardForm = document.getElementById('card-payment-form');
    const mercadopagoForm = document.getElementById('mercadopago-payment-form');
    const localInfo = document.getElementById('local-payment-info');
    const paymentButton = document.getElementById('payment-button');
    
    // Ocultar todos los formularios
    cardForm.style.display = 'none';
    mercadopagoForm.style.display = 'none';
    localInfo.style.display = 'none';
    
    // Mostrar el formulario correspondiente
    if (paymentMethod === 'card') {
        cardForm.style.display = 'block';
        paymentButton.textContent = 'Pagar con Tarjeta';
    } else if (paymentMethod === 'mercadopago') {
        mercadopagoForm.style.display = 'block';
        paymentButton.textContent = 'Pagar con MercadoPago';
        initMercadoPagoCheckout();
    } else if (paymentMethod === 'local') {
        localInfo.style.display = 'block';
        paymentButton.textContent = 'Confirmar Reserva';
    }
}

// Función para inicializar MercadoPago checkout
function initMercadoPagoCheckout() {
    const container = document.getElementById('mercadopago-container');
    container.innerHTML = '<p>Cargando MercadoPago...</p>';
    
    // Aquí se inicializaría el checkout de MercadoPago
    // Esto requiere las credenciales configuradas
    setTimeout(() => {
        container.innerHTML = `
            <div style="padding: 1rem; background: rgba(0, 168, 142, 0.1); border-radius: 8px; margin-top: 1rem;">
                <p><strong>MercadoPago</strong></p>
                <p>Serás redirigido a MercadoPago para completar el pago de forma segura.</p>
                <p style="font-size: 0.9rem; color: #b0b0b0;">Nota: Configura tus credenciales en config/mercadopago-config.js</p>
            </div>
        `;
    }, 500);
}

// Función para procesar el pago
async function processPayment() {
    // Ya no necesitamos procesar pagos, solo enviamos la reserva
    showStep(6);
}

// Función para simular procesamiento de pago
async function simulatePayment() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Pago procesado exitosamente (simulado)');
            resolve();
        }, 1000);
    });
}

// No se utiliza el envío por WhatsApp. El servidor enviará un correo automáticamente.

// Función que se ejecuta al finalizar la reserva: envía los datos al servidor y reinicia el formulario
async function finalizeReservation() {
    const confMsg = document.getElementById('confirmation-message');
    const finishButton = document.querySelector('button[onclick="finalizeReservation()"]');
    
    // Deshabilitar el botón mientras se procesa
    if (finishButton) {
        finishButton.disabled = true;
        finishButton.textContent = 'Enviando...';
    }
    
    try {
        const serverResult = await sendReservationToServer(reservationData);
        if (serverResult.ok) {
            confMsg.textContent = '¡Gracias! Tu reserva fue enviada. Te contactaremos para confirmar disponibilidad.';
            confMsg.style.color = '#4CAF50';
            // Reiniciar formulario después de un breve retraso solo si fue exitoso
            setTimeout(() => {
                resetForm();
            }, 3000);
        } else {
            confMsg.textContent = `Hubo un problema al enviar la reserva: ${serverResult.error || 'Error desconocido'}. Por favor, inténtalo de nuevo o contáctanos directamente por teléfono.`;
            confMsg.style.color = '#f44336';
            // Rehabilitar el botón para que puedan intentar de nuevo
            if (finishButton) {
                finishButton.disabled = false;
                finishButton.textContent = document.querySelector('[data-i18n="reservations.finish"]')?.textContent || 'Finalizar Reserva';
            }
        }
    } catch (err) {
        console.error('Error inesperado en finalizeReservation:', err);
        confMsg.textContent = 'Ocurrió un error inesperado al enviar la reserva. Por favor, contáctanos directamente por teléfono.';
        confMsg.style.color = '#f44336';
        // Rehabilitar el botón
        if (finishButton) {
            finishButton.disabled = false;
            finishButton.textContent = document.querySelector('[data-i18n="reservations.finish"]')?.textContent || 'Finalizar Reserva';
        }
    }
}

// Envia la reserva al servidor (si está disponible). Retorna {ok:true,data} o {ok:false,error}
async function sendReservationToServer(reservation) {
    // Determinar baseUrl: en desarrollo usamos localhost:3000, en producción (Vercel) usamos ruta relativa
    const isLocal = /(^localhost$|^127\.0\.0\.1$|^0\.0\.0\.0$)/.test(globalThis.location.hostname);
    // En producción, usar ruta relativa para que funcione con Vercel serverless functions
    const baseUrl = isLocal ? 'http://localhost:3000' : '';
    const apiUrl = `${baseUrl}/api/reservations`;

    console.log('Enviando reserva al servidor:', reservation, '->', apiUrl);

    // Crear un AbortController para timeout (compatible con navegadores más antiguos)
    const controller = new AbortController();
    let timeoutId;
    
    try {
        timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
        
        // Intentamos enviar la reserva directamente. Si el servidor no está escuchando, el catch capturará la excepción (ECONNREFUSED).
        const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(reservation),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        console.log('Respuesta del servidor:', resp.status);

        if (!resp.ok) {
            const text = await resp.text();
            console.error('Error del servidor:', text);
            // Mostrar mensaje más informativo según código
            if (resp.status === 403) {
                return { ok: false, error: 'Acceso denegado al servidor de reservas (403). Revisa CORS o autorización en el servidor.' };
            } else if (resp.status >= 500) {
                return { ok: false, error: 'El servidor tuvo un error al procesar la reserva. Por favor, intenta más tarde.' };
            } else {
                return { ok: false, error: `Error al procesar la reserva: ${text}` };
            }
        }

        const data = await resp.json();
        console.log('Datos recibidos:', data);
        return { ok: true, data };
    } catch (err) {
        // Asegurarse de limpiar el timeout en caso de error
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        console.error('Error enviando reserva:', err);
        // Manejo específico para conexión rehusada o timeout
        if (err?.name === 'AbortError' || err?.name === 'TimeoutError' || err?.message?.includes('aborted')) {
            return { ok: false, error: 'El servidor no respondió a tiempo. Por favor, verifica que el servidor esté corriendo e intenta de nuevo.' };
        }
        if (err?.message && (err.message.includes('Failed to fetch') || err.message.includes('ECONNREFUSED') || err.message.includes('NetworkError') || err.message.includes('Network request failed'))) {
            const errorMsg = isLocal 
                ? 'No se pudo conectar con el servidor de reservas. Asegúrate de iniciar el servidor con `npm start` en la carpeta `server`.'
                : 'No se pudo conectar con el servidor de reservas. Por favor, verifica tu conexión a internet e intenta de nuevo. Si el problema persiste, contáctanos directamente.';
            return { ok: false, error: errorMsg };
        }
        return { ok: false, error: `Error de conexión: ${err.message || 'Error desconocido'}` };
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
    showStep(1);

    // Configurar la funcionalidad de lightbox para las imágenes de la galería
    document.querySelectorAll('.gallery-grid img').forEach(img => {
        img.addEventListener('click', function() {
            // Crear overlay y mostrar imagen ampliada
            const overlay = document.createElement('div');
            overlay.classList.add('lightbox');
            const clonedImg = document.createElement('img');
            clonedImg.src = this.src;
            clonedImg.alt = this.alt;
            overlay.appendChild(clonedImg);
            // Al hacer click en el overlay se cierra
            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
            document.body.appendChild(overlay);
        });
    });
    
    // Configurar listeners para métodos de pago
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Formatear número de tarjeta
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));
    }
    
    // Formatear fecha de expiración
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', () => formatExpiry(cardExpiryInput));
    }
    
    // Inicializar método de pago por defecto
    if (document.getElementById('step5')) {
        handlePaymentMethodChange();
    }
    
    // Manejar resaltado de opciones de pago
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remover clase selected de todas las opciones
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            // Agregar clase selected a la opción seleccionada
            if (this.checked && this.closest('.payment-option')) {
                this.closest('.payment-option').classList.add('selected');
            }
        });
        // Marcar la opción seleccionada inicialmente
        if (radio.checked) {
            radio.closest('.payment-option')?.classList.add('selected');
        }
    });

    // Notificación server-side: el envío se realiza automáticamente por el servidor al pulsar Finalizar
});

// Ocultar el preloader una vez que la página haya cargado completamente
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

// =========================
// Carrusel de imágenes dinámico en el hero
// =========================
(function() {
    const heroBackgrounds = document.querySelectorAll('.hero-background');
    if (heroBackgrounds.length === 0) return;
    
    let currentIndex = 0;
    const changeInterval = 30000; // 30 segundos
    
    function changeBackground() {
        // Remover la clase active de todas
        heroBackgrounds.forEach(bg => bg.classList.remove('active'));
        
        // Avanzar al siguiente índice
        currentIndex = (currentIndex + 1) % heroBackgrounds.length;
        
        // Agregar la clase active a la siguiente imagen
        heroBackgrounds[currentIndex].classList.add('active');
    }
    
    // Cambiar la imagen cada 30 segundos
    setInterval(changeBackground, changeInterval);
})();


// =========================
// Mobile menu logic
// =========================
(function () {
    const navToggle = document.querySelector('.nav-toggle');
    const sheet = document.getElementById('mobileMenu');
    const backdrop = document.querySelector('.ios-menu-backdrop');
    const closeBtn = sheet ? sheet.querySelector('.ios-menu-close') : null;

    if (!navToggle || !sheet || !backdrop) return;

    const focusableSelector = 'a[href], button, select';
    let lastFocused = null;

    function openMenu() {
        lastFocused = document.activeElement;
        sheet.hidden = false;
        backdrop.hidden = false;
        sheet.setAttribute('data-open','true');
        navToggle.setAttribute('aria-expanded','true');
        // focus first item
        const first = sheet.querySelector(focusableSelector);
        if (first) first.focus();
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        sheet.removeAttribute('data-open');
        navToggle.setAttribute('aria-expanded','false');
        // small delay for transition then hide
        setTimeout(() => {
            sheet.hidden = true;
            backdrop.hidden = true;
            document.body.style.overflow = '';
            if (lastFocused) lastFocused.focus();
        }, 160);
    }

    navToggle.addEventListener('click', () => {
        const isOpen = sheet.getAttribute('data-open') === 'true';
        if (isOpen) { closeMenu(); } else { openMenu(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sheet.getAttribute('data-open') === 'true') closeMenu();
        if (e.key === 'Tab' && sheet.getAttribute('data-open') === 'true') {
            // trap focus
            const focusables = Array.from(sheet.querySelectorAll(focusableSelector)).filter(el => !el.hasAttribute('disabled'));
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
})();
