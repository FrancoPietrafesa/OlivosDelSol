let currentStep = 1;
let reservationData = {};
let currentLanguage = 'es';

// FunciÃ³n para manejar la transparencia del navbar al hacer scroll
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
        nav: {
            home: 'Inicio',
            services: 'Servicios',
            gallery: 'Galería',
            experiences: 'Experiencias',
            recommendations: 'Recomendaciones',
            reservations: 'Reservas',
            guides: 'Excursiones',
            contact: 'Contacto'
        },
        header: { logo: 'Hotel Olivos del Sol' },
        home: {
            title: 'Bienvenidos a Hotel Olivos del Sol',
            subtitle: 'Un oasis de tranquilidad y confort en Pocito, San Juan.',
            description: 'Nuestro hotel ofrece habitaciones modernas, servicios de primera y una atención excepcional para que tu estadía sea inolvidable.'
        },
        services: {
            title: 'Servicios',
            room: 'Habitaciones confortables',
            roomDesc: 'Amplias y luminosas habitaciones con todas las comodidades.',
            restaurant: 'Restaurante',
            restaurantDesc: 'Gastronomía regional e internacional de alta calidad.',
            pool: 'Piscina',
            poolDesc: 'Piscina al aire libre para relajarse y disfrutar del sol.',
            wifi: 'Wi-Fi gratuito',
            wifiDesc: 'Acceso a internet de alta velocidad en todo el hotel.',
            parking: 'Estacionamiento',
            parkingDesc: 'Estacionamiento seguro para tu vehículo.',
            spa: 'Spa & bienestar',
            spaDesc: 'Sesiones de masajes y tratamientos relajantes.'
        },
        gallery: { title: 'Galería' },
        recommendations: { title: 'Recomendaciones Turísticas' },
        reservations: {
            title: 'Reservas',
            searchTitle: 'Búsqueda inicial',
            checkin: 'Fecha de entrada:',
            checkout: 'Fecha de salida:',
            guests: 'Huéspedes:',
            rooms: 'Habitaciones:',
            next: 'Siguiente',
            back: 'Atrás',
            selectTitle: 'Selecciona tu habitación',
            standard: 'Habitación estándar',
            suite: 'Suite',
            premium: 'Premium',
            summaryTitle: 'Resumen de la reserva',
            guestTitle: 'Datos del huésped',
            name: 'Nombre completo:',
            email: 'Correo electrónico:',
            phone: 'Teléfono:',
            paymentTitle: 'Forma de pago',
            paymentInstructions: 'Selecciona tu método de pago preferido:',
            paymentCard: 'Tarjeta de Débito/Crédito',
            paymentCardDesc: 'Pago seguro con tarjeta',
            paymentMercadopago: 'MercadoPago',
            paymentMercadopagoDesc: 'Pago rápido y seguro con MercadoPago',
            paymentCash: 'Efectivo en el local',
            paymentCashDesc: 'Pagarás al llegar al hotel',
            confirmationTitle: 'Confirmación',
            confirmationMessage: '¡Gracias por reservar con nosotros! Tu reserva ha sido recibida.',
            whatsappMessage: 'Puedes enviar un mensaje por WhatsApp para confirmar tu estadía:',
            finish: 'Enviar',
            sending: 'Enviando...',
            sent: 'Enviado'
        },
        contact: { title: 'Contacto', addressLabel: 'Dirección:', phoneLabel: 'Teléfono:' }
    },
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            gallery: 'Gallery',
            experiences: 'Experiences',
            recommendations: 'Attractions',
            reservations: 'Bookings',
            guides: 'Tours',
            contact: 'Contact'
        },
        header: { logo: 'Hotel Olivos del Sol' },
        home: {
            title: 'Welcome to Hotel Olivos del Sol',
            subtitle: 'An oasis of tranquility and comfort in Pocito, San Juan.',
            description: 'Our hotel offers modern rooms, first-class services and exceptional attention to make your stay unforgettable.'
        },
        services: {
            title: 'Services',
            room: 'Comfortable Rooms',
            roomDesc: 'Spacious and bright rooms with every comfort.',
            restaurant: 'Restaurant',
            restaurantDesc: 'High-quality regional and international gastronomy.',
            pool: 'Pool',
            poolDesc: 'Outdoor pool to relax and enjoy the sun.',
            wifi: 'Free Wi-Fi',
            wifiDesc: 'High-speed internet access throughout the hotel.',
            parking: 'Parking',
            parkingDesc: 'Secure parking for your vehicle.',
            spa: 'Spa & Wellness',
            spaDesc: 'Massage sessions and relaxing treatments.'
        },
        gallery: { title: 'Gallery' },
        recommendations: { title: 'Tourist Recommendations' },
        reservations: {
            title: 'Bookings',
            searchTitle: 'Initial search',
            checkin: 'Check-in date:',
            checkout: 'Check-out date:',
            guests: 'Guests:',
            rooms: 'Rooms:',
            next: 'Next',
            back: 'Back',
            selectTitle: 'Choose your room',
            standard: 'Standard room',
            suite: 'Suite',
            premium: 'Premium',
            summaryTitle: 'Booking summary',
            guestTitle: 'Guest details',
            name: 'Full name:',
            email: 'Email:',
            phone: 'Phone:',
            paymentTitle: 'Payment method',
            paymentInstructions: 'Select your preferred payment method:',
            paymentCard: 'Debit/Credit Card',
            paymentCardDesc: 'Secure card payment',
            paymentMercadopago: 'MercadoPago',
            paymentMercadopagoDesc: 'Quick and secure payment with MercadoPago',
            paymentCash: 'Cash at the hotel',
            paymentCashDesc: 'You will pay when you arrive at the hotel',
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Thank you for booking with us! Your booking has been received.',
            whatsappMessage: 'You can send a message via WhatsApp to confirm your stay:',
            finish: 'Send',
            sending: 'Sending...',
            sent: 'Sent'
        },
        contact: { title: 'Contact', addressLabel: 'Address:', phoneLabel: 'Phone:' }
    }
};

function initGalleryPage() {
    const container = document.getElementById('gallery-content');
    if (!container) return;

    const filterButtons = Array.from(document.querySelectorAll('.gallery-filter'));
    const modal = document.getElementById('galleryModal');
    const modalTitle = modal.querySelector('#galleryModalTitle');
    const modalImage = modal.querySelector('.gallery-modal__image');
    const modalThumbs = modal.querySelector('.gallery-modal__thumbs');
    const modalPrev = modal.querySelector('.gallery-modal__nav--prev');
    const modalNext = modal.querySelector('.gallery-modal__nav--next');
    const modalThumbsPrev = modal.querySelector('.gallery-modal__thumbs-nav--prev');
    const modalThumbsNext = modal.querySelector('.gallery-modal__thumbs-nav--next');
    const modalCloseButtons = modal ? Array.from(modal.querySelectorAll('[data-close-modal]')) : [];

    const galleryItemMap = new Map();
    let modalState = {
        images: [],
        title: '',
        index: 0,
        lastFocused: null
    };

    function hashCode(value) {
        let hash = 0;
        for (let i = 0; i < value.length; i += 1) {
            hash = ((hash << 5) - hash) + value.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function mapItemToLabel(type) {
        if (type === 'casa' || type === 'monoambiente') return 'Habitaciones';
        if (type === 'pileta') return 'Naturaleza';
        return 'Instalaciones';
    }

    function matchesFilter(itemType, filter) {
        if (filter === 'all') return true;
        if (filter === 'casa' || filter === 'monoambiente' || filter === 'pileta' || filter === 'evento') {
            return itemType === filter;
        }
        if (filter === 'habitaciones') return itemType === 'casa' || itemType === 'monoambiente';
        if (filter === 'naturaleza') return itemType === 'pileta';
        if (filter === 'instalaciones') return itemType === 'evento';
        return false;
    }

    function buildItem(item) {
        const article = document.createElement('article');
        article.className = 'gallery-item gallery-reveal';
        article.dataset.type = item.type;
        article.dataset.slug = item.slug;
        article.dataset.galleryId = item.slug;
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'button');
        article.setAttribute('aria-label', ('Abrir galería ' + (item.displayName || item.rawName || '')).trim());

        const variantCycle = ['wide', 'tall', 'large', 'square', 'portrait', 'wide', 'square'];
        const variant = variantCycle[Math.abs(hashCode(item.slug || item.displayName || 'g')) % variantCycle.length];
        article.classList.add('gallery-item--' + variant);

        const media = document.createElement('div');
        media.className = 'gallery-item__media';

        const img = document.createElement('img');
        img.src = item.cover || (item.images[0] || '');
        img.alt = item.displayName || item.rawName || 'Galería';
        img.loading = 'lazy';
        media.appendChild(img);

        const title = document.createElement('h3');
        title.className = 'gallery-item__title';
        title.textContent = item.displayName;
        title.title = item.displayName;
        media.appendChild(title);

        const badge = document.createElement('span');
        badge.className = 'gallery-item__badge';
        badge.textContent = mapItemToLabel(item.type);
        media.appendChild(badge);

        article.appendChild(media);
        return article;
    }

    function applyFilters(type) {
        const items = Array.from(container.querySelectorAll('.gallery-item'));
        items.forEach((item) => {
            const shouldShow = matchesFilter(item.dataset.type, type);
            item.style.display = shouldShow ? '' : 'none';
        });
    }

    function scrollToFiltered() {
        const section = document.getElementById('gallery');
        if (!section) return;
        const firstVisible = Array.from(container.querySelectorAll('.gallery-item'))
            .find((item) => item.style.display !== 'none');
        const target = firstVisible || section;

        const navbar = document.querySelector('.navbar');
        const offset = (navbar.offsetHeight || 0) + 12;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    }

    function initFilters() {
        filterButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterButtons.forEach((b) => {
                    b.classList.remove('is-active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('is-active');
                btn.setAttribute('aria-selected', 'true');
                const filter = btn.dataset.filter || 'all';
                applyFilters(filter);
                scrollToFiltered();
            });
        });
    }

    function setModalImage(index) {
        if (!modalImage) return;
        if (!modalState.images.length) return;
        const safeIndex = (index + modalState.images.length) % modalState.images.length;
        modalState.index = safeIndex;
        modalImage.src = modalState.images[safeIndex];
        modalImage.alt = modalState.title + ' foto ' + (safeIndex + 1);

        if (modalThumbs) {
            const buttons = Array.from(modalThumbs.querySelectorAll('button'));
            buttons.forEach((btn, idx) => {
                btn.classList.toggle('is-active', idx === safeIndex);
            });
        }
    }

    function openModal(item) {
        if (!modal) return;
        modalState.images = item.images || [];
        modalState.title = item.displayName || 'Galería';
        modalState.index = 0;
        if (modalTitle) modalTitle.textContent = modalState.title;
        if (modalThumbs) {
            modalThumbs.innerHTML = '';
            modalState.images.forEach((src, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'gallery-thumb-button';
                btn.setAttribute('aria-label', 'Ver foto ' + (idx + 1));
                const img = document.createElement('img');
                img.src = src;
                img.alt = modalState.title + ' miniatura ' + (idx + 1);
                img.loading = 'lazy';
                btn.appendChild(img);
                btn.addEventListener('click', () => setModalImage(idx));
                modalThumbs.appendChild(btn);
            });
        }
        setModalImage(0);

        modalState.lastFocused = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeBtn = modal.querySelector('.gallery-modal__close');
        closeBtn.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (modalState.lastFocused) {
            modalState.lastFocused.focus();
        }
    }

    function initModal() {
        if (!modal) return;
        modalCloseButtons.forEach((btn) => btn.addEventListener('click', closeModal));
        modalPrev.addEventListener('click', () => setModalImage(modalState.index - 1));
        modalNext.addEventListener('click', () => setModalImage(modalState.index + 1));
        modalThumbsPrev.addEventListener('click', () => {
            modalThumbs.scrollBy({ left: -240, behavior: 'smooth' });
        });
        modalThumbsNext.addEventListener('click', () => {
            modalThumbs.scrollBy({ left: 240, behavior: 'smooth' });
        });

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('is-open')) return;
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                setModalImage(modalState.index - 1);
            } else if (e.key === 'ArrowRight') {
                setModalImage(modalState.index + 1);
            } else if (e.key === 'Tab') {
                const focusable = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    function initReveal() {
        const elements = Array.from(document.querySelectorAll('.gallery-reveal'));
        if (elements.length === 0) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        elements.forEach((el) => observer.observe(el));
    }

    function renderGallery(items) {
        container.innerHTML = '';
        if (!items || items.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'No hay contenido disponible por el momento.';
            container.appendChild(empty);
            return;
        }

        items.forEach((item, idx) => {
            if (!item.slug) item.slug = 'item-' + idx;
            galleryItemMap.set(item.slug, item);
        });

        const fragment = document.createDocumentFragment();
        items.forEach((item) => fragment.appendChild(buildItem(item)));
        container.appendChild(fragment);

        container.addEventListener('click', (event) => {
            const target = event.target.closest('.gallery-item');
            if (!target) return;
            const id = target.dataset.galleryId || target.dataset.slug;
            if (!id) return;
            const item = galleryItemMap.get(id);
            if (item) openModal(item);
        });

        container.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const target = event.target.closest('.gallery-item');
            if (!target) return;
            event.preventDefault();
            const id = target.dataset.galleryId || target.dataset.slug;
            if (!id) return;
            const item = galleryItemMap.get(id);
            if (item) openModal(item);
        });

        initFilters();
        initModal();
        initReveal();
    }

    fetch('data/galeria.manifest.json?ts=' + Date.now(), { cache: 'no-store' })
        .then((resp) => {
            if (!resp.ok) throw new Error('manifest not found');
            return resp.json();
        })
        .then((data) => renderGallery(data.items || []))
        .catch(() => {
            container.innerHTML = '<p>No pudimos cargar la galería en este momento.</p>';
        });
}

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

// Funcionalidad del visor de imÃ¡genes
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

// DelegaciÃ³n: cambio de idioma (desktop y mÃ³vil) â€” se configura en DOMContentLoaded

function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.reservation-step').forEach((div, index) => {
        div.style.display = (index + 1 === step) ? 'block' : 'none';
    });
    
    // Actualizar progress indicator
    updateStepIndicator(step);
    
    if (step === 5) {
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        if (selectedPayment && selectedPayment.closest('.payment-option')) {
            selectedPayment.closest('.payment-option').classList.add('selected');
        }
    }
    if (step === 6) {
        fillConfirmationSummary();
    }
}

function updateStepIndicator(currentStep) {
    document.querySelectorAll('.step').forEach((stepElement, index) => {
        const stepNumber = index + 1;
        stepElement.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            stepElement.classList.add('active');
        } else if (stepNumber < currentStep) {
            stepElement.classList.add('completed');
        }
    });
}

function validateField(input, regex) {
    // Limpiar validaciÃ³n previa
    input.classList.remove('error', 'valid');
    const errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.style.display = 'none';
    }

    // Si el campo estÃ¡ vacÃ­o o no cumple con el regex
    const isEmpty = input.value.trim() === '';
    const isValid = !isEmpty && (!regex || regex.test(input.value));

    // Solo mostrar error si estÃ¡ vacÃ­o al intentar validar
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

function getRoomTypeLabel(value) {
    const labels = { frantoio: 'Frantoio', pocitana: 'Pocitana', aromo_azul: 'Aromo Azul', lo_ciruelos: 'Lo Ciruelos', monoambiente: 'Monoambientes (hasta 3 personas)' };
    return labels[value] || value || '';
}

function getPaymentMethodLabel(value) {
    const labels = { card: 'Tarjeta de débito o crédito', mercadopago: 'MercadoPago', efectivo_hotel: 'Efectivo en el hotel', local: 'Efectivo en el hotel' };
    return labels[value] || value || '';
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
            const monoError = document.querySelector('.mono-guests-error');
            if (monoError) monoError.style.display = 'none';
            if (!roomType && errorSpan) {
                errorSpan.style.display = 'block';
                return false;
            }
            if (roomType && roomType.value === 'monoambiente') {
                const guests = parseInt(reservationData.guests, 10);
                if (!isNaN(guests) && guests > 3) {
                    if (monoError) { monoError.style.display = 'block'; }
                    if (errorSpan) errorSpan.style.display = 'none';
                    return false;
                }
            }
            if (errorSpan) errorSpan.style.display = 'none';
            return true;
        }
        case 4: {
            const guestName = document.getElementById('guestName');
            const guestLastName = document.getElementById('guestLastName');
            const guestEmail = document.getElementById('guestEmail');
            const guestPhone = document.getElementById('guestPhone');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[\d\s+\-()]{8,}$/;
            
            isValid = validateField(guestName) &&
                     validateField(guestLastName) &&
                     validateField(guestEmail, emailRegex) &&
                     validateField(guestPhone, phoneRegex);
            return isValid;
        }
        default:
            return true;
    }
}

// No se usa bot cliente; las notificaciones se envÃ­an por email server-side

function setAvailabilityFeedback(message, isError) {
    const el = document.getElementById('availability-feedback');
    if (!el) return;
    el.textContent = message || '';
    el.style.display = message ? 'block' : 'none';
    el.style.color = isError ? '#b12828' : '#2f6b2e';
}

function getApiBaseUrl() {
    if (typeof window !== 'undefined' && window.OLIVOS_API_BASE_URL) return window.OLIVOS_API_BASE_URL.replace(/\/$/, '');
    const isLocal = /(^localhost$|^127\.0\.0\.1$|^0\.0\.0\.0$)/.test(globalThis.location.hostname);
    return isLocal ? 'http://localhost:3000' : '';
}

async function checkAvailability(checkin, checkout) {
    const baseUrl = getApiBaseUrl();
    const apiUrl = `${baseUrl}/api/availability`;

    const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ checkin, checkout })
    });

    let data = null;
    try {
        data = await resp.json();
    } catch (_) {
        data = null;
    }

    if (!resp.ok) {
        throw new Error((data && data.error) || 'No se pudo verificar disponibilidad en este momento.');
    }

    return data;
}

async function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep === 1) {
        // collect search data
        reservationData.checkin = document.getElementById('checkin').value;
        reservationData.checkout = document.getElementById('checkout').value;
        reservationData.guests = document.getElementById('guests').value;
        reservationData.rooms = document.getElementById('rooms').value;

        try {
            setAvailabilityFeedback('Verificando disponibilidad...', false);
            const result = await checkAvailability(reservationData.checkin, reservationData.checkout);
            if (!result.available) {
                const firstConflict = Array.isArray(result.conflicts) && result.conflicts.length > 0
                    ? result.conflicts[0]
                    : null;
                const detail = firstConflict
                    ? ` Rango ocupado: ${firstConflict.checkin} a ${firstConflict.checkout}.`
                    : '';
                setAvailabilityFeedback(`No hay disponibilidad para esas fechas.${detail}`, true);
                return;
            }
            setAvailabilityFeedback('Hay disponibilidad para esas fechas. Puedes continuar con la reserva.', false);
        } catch (err) {
            const isConnectionError = /Failed to fetch|NetworkError|ECONNREFUSED|Network request failed|fetch/i.test(String(err && err.message));
            const msg = isConnectionError
                ? 'No se pudo conectar con el servicio de disponibilidad. Intenta nuevamente en unos segundos.'
                : (err.message || 'No se pudo verificar disponibilidad.');
            setAvailabilityFeedback(msg, true);
            return;
        }
    }
    if (currentStep === 2) {
        // get selected room type
        const roomType = document.querySelector('input[name="roomType"]:checked').value;
        reservationData.roomType = roomType;
    }
    if (currentStep === 3) {
        const summaryDiv = document.getElementById('summary-details');
        if (summaryDiv) {
            const lang = translations[currentLanguage];
            const roomLabel = getRoomTypeLabel(reservationData.roomType);
            summaryDiv.innerHTML = `<p><strong>${lang.reservations.checkin}</strong> ${reservationData.checkin}</p>` +
                                   `<p><strong>${lang.reservations.checkout}</strong> ${reservationData.checkout}</p>` +
                                   `<p><strong>${lang.reservations.guests}</strong> ${reservationData.guests}</p>` +
                                   `<p><strong>${lang.reservations.rooms}</strong> ${reservationData.rooms}</p>` +
                                   `<p><strong>Habitación:</strong> ${roomLabel}</p>`;
        }
    }
    if (currentStep === 4) {
        reservationData.guestName = document.getElementById('guestName').value;
        reservationData.guestLastName = document.getElementById('guestLastName').value;
        reservationData.guestEmail = document.getElementById('guestEmail').value;
        reservationData.guestPhone = document.getElementById('guestPhone').value;
    }
    if (currentStep === 5) {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (paymentMethod) {
            reservationData.paymentMethod = paymentMethod.value;
        }
        showStep(6);
        fillConfirmationSummary();
        return;
    }
    if (currentStep === 6) {
        return;
    }
    showStep(currentStep + 1);
}

function fillConfirmationSummary() {
    const el = document.getElementById('confirmation-summary');
    if (!el) return;
    const lang = translations[currentLanguage];
    const roomLabel = getRoomTypeLabel(reservationData.roomType);
    const paymentLabel = getPaymentMethodLabel(reservationData.paymentMethod);
    const fullName = [reservationData.guestName, reservationData.guestLastName].filter(Boolean).join(' ');
    el.innerHTML = '<p><strong>Resumen de tu reserva</strong></p>' +
        `<p><strong>${lang.reservations.checkin}</strong> ${reservationData.checkin}</p>` +
        `<p><strong>${lang.reservations.checkout}</strong> ${reservationData.checkout}</p>` +
        `<p><strong>${lang.reservations.guests}</strong> ${reservationData.guests} · <strong>Habitaciones:</strong> ${reservationData.rooms}</p>` +
        `<p><strong>Habitación:</strong> ${roomLabel}</p>` +
        `<p><strong>Nombre completo:</strong> ${fullName || '-'}</p>` +
        `<p><strong>Correo electrónico:</strong> ${reservationData.guestEmail || '-'}</p>` +
        `<p><strong>Teléfono:</strong> ${reservationData.guestPhone || '-'}</p>` +
        `<p><strong>Método de pago:</strong> ${paymentLabel}</p>`;
    const msg = document.getElementById('confirmation-message');
    if (msg && !msg.textContent) msg.textContent = 'Revisá que todo sea correcto y hacé clic en "Confirmar y enviar reserva" para enviar la reserva al hotel.';
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
        'guestName', 'guestLastName', 'guestEmail', 'guestPhone',
        'cardName', 'cardNumber', 'cardExpiry', 'cardCVC'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Solo resetear si es un input, textarea o select
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                el.value = '';
                // Limpiar clases de validaciÃ³n
                el.classList.remove('error', 'valid');
            }
        }
    });
    
    // Reiniciar los radio buttons de tipo de habitaciÃ³n
    const roomTypeRadios = document.querySelectorAll('input[name="roomType"]');
    if (roomTypeRadios.length > 0) {
        roomTypeRadios[0].checked = true; // Marcar el primero por defecto
    }
    
    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    if (paymentMethodRadios.length > 0) {
        const cardRadio = Array.from(paymentMethodRadios).find(r => r.value === 'card');
        if (cardRadio) cardRadio.checked = true;
        else paymentMethodRadios[0].checked = true;
    }
    const confSummary = document.getElementById('confirmation-summary');
    if (confSummary) confSummary.innerHTML = '';
    
    // Limpiar mensajes de error
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
    });
    
    // Limpiar mensaje de confirmaciÃ³n
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
        btn.style.opacity = '';
        btn.style.filter = '';
    });
}

// FunciÃ³n para formatear el nÃºmero de tarjeta
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g).join(' ') || value;
    input.value = formattedValue;
}

// FunciÃ³n para formatear la fecha de expiraciÃ³n
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// FunciÃ³n para manejar el cambio de mÃ©todo de pago
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
    
    if (paymentMethod === 'card') {
        cardForm.style.display = 'block';
        paymentButton.textContent = 'Confirmar y continuar';
    } else if (paymentMethod === 'mercadopago') {
        mercadopagoForm.style.display = 'block';
        paymentButton.textContent = 'Confirmar y continuar';
        initMercadoPagoCheckout();
    } else if (paymentMethod === 'efectivo_hotel' || paymentMethod === 'local') {
        localInfo.style.display = 'block';
        paymentButton.textContent = 'Confirmar y continuar';
    }
}

// FunciÃ³n para inicializar MercadoPago checkout
function initMercadoPagoCheckout() {
    const container = document.getElementById('mercadopago-container');
    container.innerHTML = '<p>Cargando MercadoPago...</p>';
    
    // AquÃ­ se inicializarÃ­a el checkout de MercadoPago
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

// FunciÃ³n para procesar el pago
async function processPayment() {
    // Ya no necesitamos procesar pagos, solo enviamos la reserva
    showStep(6);
}

// FunciÃ³n para simular procesamiento de pago
async function simulatePayment() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Pago procesado exitosamente (simulado)');
            resolve();
        }, 1000);
    });
}

// No se utiliza el envÃ­o por WhatsApp. El servidor enviarÃ¡ un correo automÃ¡ticamente.

// FunciÃ³n que se ejecuta al finalizar la reserva: envÃ­a los datos al servidor y reinicia el formulario
async function finalizeReservation() {
    const confMsg = document.getElementById('confirmation-message');
    const finishButton = document.querySelector('button[onclick="finalizeReservation()"]');

    // Cambiar el texto del botÃ³n a "Enviando..." antes de deshabilitarlo
    if (finishButton) {
        finishButton.textContent = translations[currentLanguage].reservations.sending;
        finishButton.disabled = true;
    }
    
    try {
        const serverResult = await sendReservationToServer(reservationData);
        if (serverResult.ok) {
            confMsg.textContent = '¡Gracias! Tu reserva fue enviada. Te contactaremos para confirmar disponibilidad.';
            confMsg.style.color = '#4CAF50';
            // Cambiar el botÃ³n a "Enviado" y reducir contraste/brillo
            if (finishButton) {
                finishButton.textContent = translations[currentLanguage].reservations.sent;
                finishButton.style.opacity = '0.6';
                finishButton.style.filter = 'brightness(0.8)';
            }
            // Reiniciar formulario despuÃ©s de un breve retraso solo si fue exitoso
            setTimeout(() => {
                resetForm();
            }, 3000);
        } else {
            const rawError = (serverResult.error || 'Error desconocido').toString().trim();
            const normalizedError = rawError.replace(/[.]+$/g, '');
            confMsg.textContent = `No se pudo enviar la reserva: ${normalizedError}. Inténtalo nuevamente o contáctanos por teléfono.`;
            confMsg.style.color = '#f44336';
            // Rehabilitar el botÃ³n para que puedan intentar de nuevo
            if (finishButton) {
                finishButton.disabled = false;
                finishButton.textContent = translations[currentLanguage].reservations.finish;
                finishButton.style.opacity = '';
                finishButton.style.filter = '';
            }
        }
    } catch (err) {
        console.error('Error inesperado en finalizeReservation:', err);
        confMsg.textContent = 'Ocurrió un error inesperado al enviar la reserva. Por favor, contáctanos directamente por teléfono.';
        confMsg.style.color = '#f44336';
        // Rehabilitar el botÃ³n
        if (finishButton) {
            finishButton.disabled = false;
            finishButton.textContent = translations[currentLanguage].reservations.finish;
            finishButton.style.opacity = '';
            finishButton.style.filter = '';
        }
    }
}

// Envia la reserva al servidor (si estÃ¡ disponible). Retorna {ok:true,data} o {ok:false,error}
async function sendReservationToServer(reservation) {
    const isLocal = /(^localhost$|^127\.0\.0\.1$|^0\.0\.0\.0$)/.test(globalThis.location.hostname);
    const baseUrl = getApiBaseUrl();
    const apiUrl = `${baseUrl}/api/reservations`;

    console.log('Enviando reserva al servidor:', reservation, '->', apiUrl);

    // Crear un AbortController para timeout (compatible con navegadores mÃ¡s antiguos)
    const controller = new AbortController();
    let timeoutId;
    
    try {
        timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
        
        // Intentamos enviar la reserva directamente. Si el servidor no estÃ¡ escuchando, el catch capturarÃ¡ la excepciÃ³n (ECONNREFUSED).
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
            // Mostrar mensaje mÃ¡s informativo segÃºn cÃ³digo
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
        // Manejo especÃ­fico para conexiÃ³n rehusada o timeout
        if (err.name === 'AbortError' || err.name === 'TimeoutError' || err.message.includes('aborted')) {
            return { ok: false, error: 'El servidor no respondió a tiempo. Por favor, verifica que el servidor esté corriendo e intenta de nuevo.' };
        }
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('ECONNREFUSED') || err.message.includes('NetworkError') || err.message.includes('Network request failed'))) {
            const errorMsg = isLocal
                ? 'No se pudo conectar con el servidor de reservas. Asegúrate de iniciar el servidor con `npm start` en la carpeta `server`.'
                : 'No se pudo conectar con el servidor de reservas. Por favor, verifica tu conexión a internet e intenta de nuevo. Si el problema persiste, contáctanos directamente.';
            return { ok: false, error: errorMsg };
        }
        return { ok: false, error: `Error de conexión: ${err.message || 'Error desconocido'}` };
    }
}

// Initialize: i18n, pasos de reserva, galerÃ­a, pagos y menÃº mÃ³vil
window.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
    showStep(1);

    // Inject mobile menu partial on pages that use the placeholder (e.g. index).
    const menuPlaceholder = document.getElementById('mobile-menu-placeholder');
    if (menuPlaceholder && !document.getElementById('mobileMenu')) {
        fetch('partials/mobile-menu.html')
            .then((resp) => resp.text())
            .then((html) => {
                menuPlaceholder.innerHTML = html;
                initMobileMenu();
            })
            .catch(() => {
                // If the partial fails to load, still try to init in case markup exists.
                initMobileMenu();
            });
    } else {
        initMobileMenu();
    }

    // DelegaciÃ³n: un solo listener para cambio de idioma (desktop y mÃ³vil)
    document.body.addEventListener('change', function(e) {
        if (e.target.id === 'language-select' || e.target.id === 'mobile-language-select') {
            setLanguage(e.target.value);
            var otherId = e.target.id === 'language-select' ? 'mobile-language-select' : 'language-select';
            var other = document.getElementById(otherId);
            if (other) other.value = e.target.value;
        }
    });

    // Navbar "MÃ¡s" dropdown (desktop)
    const more = document.querySelector('.nav-more');
    if (more) {
        const toggle = more.querySelector('.nav-more-toggle');
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = more.classList.contains('open');
            more.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', (!isOpen).toString());
        });

        document.addEventListener('click', (e) => {
            if (!more.contains(e.target)) {
                more.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Configurar la funcionalidad de lightbox para las imÃ¡genes de la galerÃ­a
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
    
    // Configurar listeners para mÃ©todos de pago
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Formatear nÃºmero de tarjeta
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));
    }
    
    // Formatear fecha de expiraciÃ³n
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', () => formatExpiry(cardExpiryInput));
    }
    
    // Inicializar mÃ©todo de pago por defecto
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
            // Agregar clase selected a la opciÃ³n seleccionada
            if (this.checked && this.closest('.payment-option')) {
                this.closest('.payment-option').classList.add('selected');
            }
        });
        // Marcar la opciÃ³n seleccionada inicialmente
        if (radio.checked) {
            radio.closest('.payment-option').classList.add('selected');
        }
    });

    // NotificaciÃ³n server-side: el envÃ­o se realiza automÃ¡ticamente por el servidor al pulsar Finalizar
    initSectionFixedArrows();
    initGalleryPage();
});

// Ocultar el preloader una vez que la pÃ¡gina haya cargado completamente
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

// Evitar que el preloader se quede visible indefinidamente en caso de recursos lentos
// o errores en cargas parciales: ocultamos el preloader poco despuÃ©s de DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        // OcultaciÃ³n segura corta para que no se quede la pantalla bloqueada
        setTimeout(() => {
            try {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            } catch (e) {
                // no hacer nada si el DOM cambiÃ³
            }
        }, 350);
    }
});

// =========================
// Carrusel de imÃ¡genes dinÃ¡mico en el hero
// =========================
(function() {
    const heroBackgrounds = document.querySelectorAll('.hero-background');
    if (heroBackgrounds.length === 0) return;
    
    let currentIndex = 0;
    const changeInterval = 30000; // 30 segundos
    
    function changeBackground() {
        // Remover la clase active de todas
        heroBackgrounds.forEach(bg => bg.classList.remove('active'));
        
        // Avanzar al siguiente Ã­ndice
        currentIndex = (currentIndex + 1) % heroBackgrounds.length;
        
        // Agregar la clase active a la siguiente imagen
        heroBackgrounds[currentIndex].classList.add('active');
    }
    
    // Cambiar la imagen cada 30 segundos
    setInterval(changeBackground, changeInterval);
})();

// Extracted mobile menu init to callable function so we can re-run after injecting partial
function initMobileMenu() {
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
        const first = sheet.querySelector(focusableSelector);
        if (first) first.focus();
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        sheet.removeAttribute('data-open');
        navToggle.setAttribute('aria-expanded','false');
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

    sheet.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a');
        if (a && a.getAttribute('href')) {
            setTimeout(() => closeMenu(), 60);
        }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sheet.getAttribute('data-open') === 'true') closeMenu();
        if (e.key === 'Tab' && sheet.getAttribute('data-open') === 'true') {
            const focusables = Array.from(sheet.querySelectorAll(focusableSelector)).filter(el => !el.hasAttribute('disabled'));
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
}


// MenÃº mÃ³vil: se inicializa en DOMContentLoaded vÃ­a initMobileMenu().

function initSectionFixedArrows() {
    if (!document.body.classList.contains('index-page')) return;

    const sectionIds = ['home', 'why-us', 'around-us', 'testimonios', 'visit-us', 'faq'];
    const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    if (sections.length < 2) return;

    const arrowEntries = [];

    sections.forEach((section, index) => {
        if (index === sections.length - 1) return;
        const nextSection = sections[index + 1];
        if (!nextSection) return;

        let arrow = section.querySelector('.scroll-down--section-fixed');
        if (!arrow) {
            arrow = document.createElement('a');
            arrow.className = 'scroll-down scroll-down--section-fixed scroll-down--gradient';
            arrow.innerHTML = '<span class="scroll-down__icon" aria-hidden="true">&#8595;</span>';
            section.appendChild(arrow);
        }

        const title = nextSection.querySelector('h2, h1').textContent.trim() || 'la siguiente sección';
        arrow.setAttribute('href', `#${nextSection.id}`);
        arrow.setAttribute('aria-label', `Bajar a ${title}`);

        arrowEntries.push({ section, arrow });
    });

    arrowEntries.forEach(({ arrow }) => {
        arrow.addEventListener('click', (event) => {
            event.preventDefault();
            const href = arrow.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            const navbar = document.querySelector('.navbar');
            const navbarOffset = navbar ? navbar.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navbarOffset - 8;

            window.scrollTo({
                top: Math.max(top, 0),
                behavior: 'smooth'
            });
        });
    });

    function getCurrentSectionIndex() {
        const referencePoint = window.innerHeight * 0.35;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - referencePoint);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    function updateActiveArrow() {
        const activeIndex = getCurrentSectionIndex();
        arrowEntries.forEach(({ section, arrow }) => {
            const isActive = section === sections[activeIndex] && activeIndex < sections.length - 1;
            arrow.classList.toggle('is-active', isActive);
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveArrow();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', updateActiveArrow, { passive: true });
    updateActiveArrow();
}
