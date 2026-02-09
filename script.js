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
        nav: {home: 'Inicio', services: 'Servicios', gallery: 'Galería', experiences: 'Experiencias', recommendations: 'Recomendaciones', reservations: 'Reservas', guides: 'Excursiones', contact: 'Contacto'},
        header: {logo: 'Hotel Olivos del Sol'},
        home: {title: 'Bienvenidos a Hotel Olivos del Sol', subtitle: 'Un oasis de tranquilidad y confort en Pocito, San Juan.', description: 'Nuestro hotel ofrece habitaciones modernas, servicios de primera y una atención excepcional para que su estadía sea inolvidable.'},
        services: {title: 'Servicios', room: 'Habitaciones confortables', roomDesc: 'Amplias y luminosas habitaciones con todas las comodidades.', restaurant: 'Restaurante', restaurantDesc: 'Gastronomía regional e internacional de alta calidad.', pool: 'Piscina', poolDesc: 'Piscina al aire libre para relajarse y disfrutar del sol.', wifi: 'Wi‑Fi gratuito', wifiDesc: 'Acceso a internet de alta velocidad en todo el hotel.', parking: 'Estacionamiento', parkingDesc: 'Estacionamiento seguro para su vehículo.', spa: 'Spa & bienestar', spaDesc: 'Sesiones de masajes y tratamientos relajantes.'},
        gallery: {title: 'Galería'},
        experiences: {title: 'Experiencias', jose: '“Una estadía maravillosa. El personal nos hizo sentir como en casa y la piscina es espectacular.”', ana: '“Las habitaciones son amplias y cómodas. La comida en el restaurante fue deliciosa.”', luis: '“El hotel está cerca de muchas bodegas interesantes. ¡Sin duda volveré!”'},
        recommendations: {title: 'Recomendaciones Turísticas', lasMarianas: 'Ubicada en calle Nueva s/n entre Av. Aberastain y Vidart, La Rinconada, Pocito, San Juan. Es una bodega familiar tranquila donde puedes conocer su antigua cava subterránea y degustar vinos premiados.', segisa: 'Situada en Aberastain y calle 15, Pocito. Esta bodega con cavas subterráneas permite descubrir la historia y el proceso del vino, y ofrece almuerzos acompañados de platos típicos en un ambiente acogedor.', fabril: 'En Ruta Nacional 40 entre calles 13 y 14, Pocito. Esta bodega pionera en vinos orgánicos ofrece visitas guiadas, degustaciones y venta de sus vinos y espumantes certificados.', miguelMas: 'Ubicada en la RP 215, Villa Aberastain. Es una moderna champañera familiar donde se degustan espumantes orgánicos y se disfruta de un almuerzo participativo con pizzas al horno.'},
        reservations: {title: 'Reservas', searchTitle: 'Búsqueda inicial', checkin: 'Fecha de entrada:', checkout: 'Fecha de salida:', guests: 'Huéspedes:', rooms: 'Habitaciones:', next: 'Siguiente', back: 'Atrás', selectTitle: 'Selecciona tu habitación', standard: 'Habitación estándar', suite: 'Suite', premium: 'Premium', summaryTitle: 'Resumen de la reserva', guestTitle: 'Datos del huésped', name: 'Nombre completo:', email: 'Correo electrónico:', phone: 'Teléfono:', paymentTitle: 'Forma de pago', paymentInstructions: 'Selecciona tu método de pago preferido:', paymentCard: 'Tarjeta de Débito/Crédito', paymentCardDesc: 'Pago seguro con tarjeta', paymentMercadopago: 'MercadoPago', paymentMercadopagoDesc: 'Pago rápido y seguro con MercadoPago', paymentCash: 'Efectivo en el local', paymentCashDesc: 'Pagarás al llegar al hotel', confirmationTitle: 'Confirmación', confirmationMessage: '¡Gracias por reservar con nosotros! Tu reserva ha sido recibida.', whatsappMessage: 'Puedes enviar un mensaje por WhatsApp para confirmar tu estadía:', finish: 'Enviar', sending: 'Enviando...', sent: 'Enviado'},
        contact: {title: 'Contacto', addressLabel: 'Dirección:', phoneLabel: 'Teléfono:'}
    },
    en: {
        reservations: {title: 'Bookings', searchTitle: 'Initial search', checkin: 'Check‑in date:', checkout: 'Check‑out date:', guests: 'Guests:', rooms: 'Rooms:', next: 'Next', back: 'Back', selectTitle: 'Choose your room', standard: 'Standard room', suite: 'Suite', premium: 'Premium', summaryTitle: 'Booking summary', guestTitle: 'Guest details', name: 'Full name:', email: 'Email:', phone: 'Phone:', paymentTitle: 'Payment method', paymentInstructions: 'Select your preferred payment method:', paymentCard: 'Debit/Credit Card', paymentCardDesc: 'Secure card payment', paymentMercadopago: 'MercadoPago', paymentMercadopagoDesc: 'Quick and secure payment with MercadoPago', paymentCash: 'Cash at the hotel', paymentCashDesc: 'You will pay when you arrive at the hotel', confirmationTitle: 'Confirmation', confirmationMessage: 'Thank you for booking with us! Your booking has been received.', whatsappMessage: 'You can send a message via WhatsApp to confirm your stay:', finish: 'Send', sending: 'Sending...', sent: 'Sent'},
        nav: {home: 'Home', services: 'Services', gallery: 'Gallery', experiences: 'Experiences', recommendations: 'Attractions', reservations: 'Bookings', guides: 'Tours', contact: 'Contact'},
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


function initGalleryPage() {
    const container = document.getElementById('gallery-content');
    if (!container) return;

    const filterButtons = Array.from(document.querySelectorAll('.gallery-filter'));
    const modal = document.getElementById('galleryModal');
    const modalTitle = modal?.querySelector('#galleryModalTitle');
    const modalImage = modal?.querySelector('.gallery-modal__image');
    const modalThumbs = modal?.querySelector('.gallery-modal__thumbs');
    const modalPrev = modal?.querySelector('.gallery-modal__nav--prev');
    const modalNext = modal?.querySelector('.gallery-modal__nav--next');
    const modalThumbsPrev = modal?.querySelector('.gallery-modal__thumbs-nav--prev');
    const modalThumbsNext = modal?.querySelector('.gallery-modal__thumbs-nav--next');
    const modalCloseButtons = modal ? Array.from(modal.querySelectorAll('[data-close-modal]')) : [];

    const galleryItemMap = new Map();
    let modalState = {
        images: [],
        title: '',
        index: 0,
        lastFocused: null
    };

    function buildChip(text) {
        const chip = document.createElement('span');
        chip.className = 'gallery-chip';
        chip.textContent = text;
        return chip;
    }

    function buildAmenities(amenities) {
        const chips = document.createElement('div');
        chips.className = 'gallery-chips';
        if (!amenities || typeof amenities !== 'object') {
            chips.appendChild(buildChip('No especificado'));
            return chips;
        }

        const mapping = [
            { key: 'aireAcondicionado', label: 'Aire acondicionado' },
            { key: 'wifi', label: 'WiFi' },
            { key: 'cocina', label: 'Cocina' },
            { key: 'banos', label: 'Banos' },
            { key: 'piletaPrivada', label: 'Pileta privada' }
        ];

        let count = 0;
        mapping.forEach((item) => {
            const value = amenities[item.key];
            if (value === undefined || value === null || value === false) return;
            const label = item.key === 'banos' && typeof value === 'number'
                ? `${item.label}: ${value}`
                : item.label;
            chips.appendChild(buildChip(label));
            count += 1;
        });

        if (count === 0) {
            chips.appendChild(buildChip('No especificado'));
        }
        return chips;
    }

    function buildCharacteristics(list, fallback) {
        const chips = document.createElement('div');
        chips.className = 'gallery-chips';
        const items = Array.isArray(list) && list.length > 0 ? list : fallback;
        if (!items || items.length === 0) {
            chips.appendChild(buildChip('No especificado'));
            return chips;
        }
        items.forEach((item) => chips.appendChild(buildChip(item)));
        return chips;
    }

    function buildMiniGrid(images) {
        const grid = document.createElement('div');
        grid.className = 'gallery-mini-grid';
        images.slice(0, 5).forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Miniatura del evento';
            img.loading = 'lazy';
            grid.appendChild(img);
        });
        return grid;
    }

    function buildItem(item) {
        const article = document.createElement('article');
        article.className = 'gallery-item gallery-reveal';
        article.dataset.type = item.type;
        article.dataset.slug = item.slug;

        const media = document.createElement('div');
        media.className = 'gallery-item__media';
        const img = document.createElement('img');
        img.src = item.cover || (item.images[0] || '');
        img.alt = item.displayName || item.rawName || 'Galeria';
        img.loading = 'lazy';
        media.appendChild(img);

        const title = document.createElement('h3');
        title.className = 'gallery-item__title';
        title.textContent = item.displayName;
        title.title = item.displayName;
        media.appendChild(title);

        const content = document.createElement('div');
        content.className = 'gallery-item__content';

        const desc = document.createElement('p');
        desc.className = 'gallery-item__description';
        desc.textContent = item.description || 'Descripcion proximamente.';
        content.appendChild(desc);

        if (item.type === 'casa' || item.type === 'monoambiente') {
            content.appendChild(buildAmenities(item.amenities));
        } else if (item.type === 'pileta') {
            const fallback = [item.displayName.replace('Pileta ', '')];
            content.appendChild(buildCharacteristics(item.characteristics, fallback));
        } else if (item.type === 'evento') {
            content.appendChild(buildCharacteristics(item.characteristics, []));
            if (item.images && item.images.length > 0) {
                content.appendChild(buildMiniGrid(item.images));
            }
        }

        const cta = document.createElement('button');
        cta.className = 'pill-button gallery-item__cta';
        cta.type = 'button';
        cta.textContent = 'Ver todas las fotos';
        cta.dataset.galleryId = item.slug;
        content.appendChild(cta);

        article.appendChild(media);
        article.appendChild(content);
        return article;
    }

    function buildGroup(title, items) {
        if (!items || items.length === 0) return null;
        const group = document.createElement('div');
        group.className = 'gallery-group';

        const header = document.createElement('div');
        header.className = 'gallery-group__header';
        const h3 = document.createElement('h3');
        h3.textContent = title;
        header.appendChild(h3);
        group.appendChild(header);

        const list = document.createElement('div');
        list.className = 'gallery-items';
        items.forEach((item) => list.appendChild(buildItem(item)));
        group.appendChild(list);
        return group;
    }

    function applyFilters(type) {
        const items = Array.from(container.querySelectorAll('.gallery-item'));
        items.forEach((item) => {
            const shouldShow = type === 'all' || item.dataset.type === type;
            item.style.display = shouldShow ? '' : 'none';
        });
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
                applyFilters(btn.dataset.filter || 'all');
            });
        });
    }

    function setModalImage(index) {
        if (!modalImage) return;
        if (!modalState.images.length) return;
        const safeIndex = (index + modalState.images.length) % modalState.images.length;
        modalState.index = safeIndex;
        modalImage.src = modalState.images[safeIndex];
        modalImage.alt = `${modalState.title} foto ${safeIndex + 1}`;

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
        modalState.title = item.displayName || 'Galeria';
        modalState.index = 0;
        if (modalTitle) modalTitle.textContent = modalState.title;
        if (modalThumbs) {
            modalThumbs.innerHTML = '';
            modalState.images.forEach((src, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-label', `Ver foto ${idx + 1}`);
                const img = document.createElement('img');
                img.src = src;
                img.alt = `${modalState.title} miniatura ${idx + 1}`;
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
        closeBtn?.focus();
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
        modalPrev?.addEventListener('click', () => setModalImage(modalState.index - 1));
        modalNext?.addEventListener('click', () => setModalImage(modalState.index + 1));
        modalThumbsPrev?.addEventListener('click', () => {
            modalThumbs?.scrollBy({ left: -240, behavior: 'smooth' });
        });
        modalThumbsNext?.addEventListener('click', () => {
            modalThumbs?.scrollBy({ left: 240, behavior: 'smooth' });
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
            if (!item.slug) {
                item.slug = `item-${idx}`;
            }
            galleryItemMap.set(item.slug, item);
        });

        const groups = [
            { type: 'casa', title: 'Casas' },
            { type: 'monoambiente', title: 'Monoambientes' },
            { type: 'pileta', title: 'Piletas' },
            { type: 'evento', title: 'Eventos' }
        ];

        groups.forEach((group) => {
            const groupItems = items.filter((item) => item.type === group.type);
            const groupEl = buildGroup(group.title, groupItems);
            if (groupEl) {
                container.appendChild(groupEl);
            }
        });

        container.addEventListener('click', (event) => {
            const target = event.target.closest('.gallery-item__cta');
            if (!target) return;
            const id = target.dataset.galleryId;
            if (!id) return;
            const item = galleryItemMap.get(id);
            if (item) openModal(item);
        });

        initFilters();
        initModal();
        initReveal();
    }

    fetch(`data/galeria.manifest.json?ts=${Date.now()}`, { cache: 'no-store' })
        .then((resp) => {
            if (!resp.ok) throw new Error('manifest not found');
            return resp.json();
        })
        .then((data) => renderGallery(data.items || []))
        .catch(() => {
            container.innerHTML = '<p>No pudimos cargar la galeria en este momento.</p>';
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

// Delegación: cambio de idioma (desktop y móvil) — se configura en DOMContentLoaded

function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.reservation-step').forEach((div, index) => {
        div.style.display = (index + 1 === step) ? 'block' : 'none';
    });
    
    // Actualizar progress indicator
    updateStepIndicator(step);
    
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
        // On summary step show details
        const summaryDiv = document.getElementById('summary-details');
        if (summaryDiv) {
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
    }
    if (currentStep === 4) {
        reservationData.guestName = document.getElementById('guestName').value;
        reservationData.guestEmail = document.getElementById('guestEmail').value;
        reservationData.guestPhone = document.getElementById('guestPhone').value;
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
        btn.style.opacity = '';
        btn.style.filter = '';
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

    // Cambiar el texto del botón a "Enviando..." antes de deshabilitarlo
    if (finishButton) {
        finishButton.textContent = translations[currentLanguage].reservations.sending;
        finishButton.disabled = true;
    }
    
    try {
        const serverResult = await sendReservationToServer(reservationData);
        if (serverResult.ok) {
            confMsg.textContent = '¡Gracias! Tu reserva fue enviada. Te contactaremos para confirmar disponibilidad.';
            confMsg.style.color = '#4CAF50';
            // Cambiar el botón a "Enviado" y reducir contraste/brillo
            if (finishButton) {
                finishButton.textContent = translations[currentLanguage].reservations.sent;
                finishButton.style.opacity = '0.6';
                finishButton.style.filter = 'brightness(0.8)';
            }
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
                finishButton.textContent = translations[currentLanguage].reservations.finish;
                finishButton.style.opacity = '';
                finishButton.style.filter = '';
            }
        }
    } catch (err) {
        console.error('Error inesperado en finalizeReservation:', err);
        confMsg.textContent = 'Ocurrió un error inesperado al enviar la reserva. Por favor, contáctanos directamente por teléfono.';
        confMsg.style.color = '#f44336';
        // Rehabilitar el botón
        if (finishButton) {
            finishButton.disabled = false;
            finishButton.textContent = translations[currentLanguage].reservations.finish;
            finishButton.style.opacity = '';
            finishButton.style.filter = '';
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

// Initialize: i18n, pasos de reserva, galería, pagos y menú móvil
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

    // Delegación: un solo listener para cambio de idioma (desktop y móvil)
    document.body.addEventListener('change', function(e) {
        if (e.target.id === 'language-select' || e.target.id === 'mobile-language-select') {
            setLanguage(e.target.value);
            var otherId = e.target.id === 'language-select' ? 'mobile-language-select' : 'language-select';
            var other = document.getElementById(otherId);
            if (other) other.value = e.target.value;
        }
    });

    // Navbar "Más" dropdown (desktop)
    const more = document.querySelector('.nav-more');
    if (more) {
        const toggle = more.querySelector('.nav-more-toggle');
        toggle?.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = more.classList.contains('open');
            more.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', (!isOpen).toString());
        });

        document.addEventListener('click', (e) => {
            if (!more.contains(e.target)) {
                more.classList.remove('open');
                toggle?.setAttribute('aria-expanded', 'false');
            }
        });
    }

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
    initGalleryPage();
});

// Ocultar el preloader una vez que la página haya cargado completamente
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

// Evitar que el preloader se quede visible indefinidamente en caso de recursos lentos
// o errores en cargas parciales: ocultamos el preloader poco después de DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        // Ocultación segura corta para que no se quede la pantalla bloqueada
        setTimeout(() => {
            try {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            } catch (e) {
                // no hacer nada si el DOM cambió
            }
        }, 350);
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


// Menú móvil: se inicializa en DOMContentLoaded vía initMobileMenu().
