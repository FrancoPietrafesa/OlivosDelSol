
let currentStep = 1;
let reservationData = {};
let currentLanguage = 'es';

const translations = {
    es: {
        nav: {home: 'Inicio', services: 'Servicios', gallery: 'Galería', experiences: 'Experiencias', recommendations: 'Recomendaciones', reservations: 'Reservas', contact: 'Contacto'},
        header: {logo: 'Hotel Olivos del Sol'},
        home: {title: 'Bienvenidos a Hotel Olivos del Sol', subtitle: 'Un oasis de tranquilidad y confort en Pocito, San Juan.', description: 'Nuestro hotel ofrece habitaciones modernas, servicios de primera y una atención excepcional para que su estadía sea inolvidable.'},
        services: {title: 'Servicios', room: 'Habitaciones confortables', roomDesc: 'Amplias y luminosas habitaciones con todas las comodidades.', restaurant: 'Restaurante', restaurantDesc: 'Gastronomía regional e internacional de alta calidad.', pool: 'Piscina', poolDesc: 'Piscina al aire libre para relajarse y disfrutar del sol.', wifi: 'Wi‑Fi gratuito', wifiDesc: 'Acceso a internet de alta velocidad en todo el hotel.', parking: 'Estacionamiento', parkingDesc: 'Estacionamiento seguro para su vehículo.', spa: 'Spa & bienestar', spaDesc: 'Sesiones de masajes y tratamientos relajantes.'},
        gallery: {title: 'Galería'},
        experiences: {title: 'Experiencias', jose: '“Una estadía maravillosa. El personal nos hizo sentir como en casa y la piscina es espectacular.”', ana: '“Las habitaciones son amplias y cómodas. La comida en el restaurante fue deliciosa.”', luis: '“El hotel está cerca de muchas bodegas interesantes. ¡Sin duda volveré!”'},
        recommendations: {title: 'Recomendaciones Turísticas', lasMarianas: 'Ubicada en calle Nueva s/n entre Av. Aberastain y Vidart, La Rinconada, Pocito, San Juan. Es una bodega familiar tranquila donde puedes conocer su antigua cava subterránea y degustar vinos premiados.', segisa: 'Situada en Aberastain y calle 15, Pocito. Esta bodega con cavas subterráneas permite descubrir la historia y el proceso del vino, y ofrece almuerzos acompañados de platos típicos en un ambiente acogedor.', fabril: 'En Ruta Nacional 40 entre calles 13 y 14, Pocito. Esta bodega pionera en vinos orgánicos ofrece visitas guiadas, degustaciones y venta de sus vinos y espumantes certificados.', miguelMas: 'Ubicada en la RP 215, Villa Aberastain. Es una moderna champañera familiar donde se degustan espumantes orgánicos y se disfruta de un almuerzo participativo con pizzas al horno.'},
        reservations: {title: 'Reservas', searchTitle: 'Búsqueda inicial', checkin: 'Fecha de entrada:', checkout: 'Fecha de salida:', guests: 'Huéspedes:', rooms: 'Habitaciones:', next: 'Siguiente', back: 'Atrás', selectTitle: 'Selecciona tu habitación', standard: 'Habitación estándar', suite: 'Suite', premium: 'Premium', summaryTitle: 'Resumen de la reserva', guestTitle: 'Datos del huésped', name: 'Nombre completo:', email: 'Correo electrónico:', phone: 'Teléfono:', paymentTitle: 'Pago', paymentInstructions: 'Para completar tu reserva, ingresa los detalles de pago o utiliza la pasarela de pago integrada. Este sitio utiliza Stripe para procesar pagos de forma segura.', cardName: 'Nombre en la tarjeta:', cardNumber: 'Número de tarjeta:', cardExpiry: 'Fecha de expiración:', cardCVC: 'CVC:', confirmationTitle: 'Confirmación', confirmationMessage: '¡Gracias por reservar con nosotros! Tu reserva ha sido recibida.', whatsappMessage: 'Puedes enviar un mensaje por WhatsApp para confirmar tu estadía:', finish: 'Finalizar'},
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
        reservations: {title: 'Bookings', searchTitle: 'Initial search', checkin: 'Check‑in date:', checkout: 'Check‑out date:', guests: 'Guests:', rooms: 'Rooms:', next: 'Next', back: 'Back', selectTitle: 'Choose your room', standard: 'Standard room', suite: 'Suite', premium: 'Premium', summaryTitle: 'Booking summary', guestTitle: 'Guest details', name: 'Full name:', email: 'Email:', phone: 'Phone:', paymentTitle: 'Payment', paymentInstructions: 'To complete your booking, enter the payment details or use the integrated payment gateway. This site uses Stripe to process payments securely.', cardName: 'Name on card:', cardNumber: 'Card number:', cardExpiry: 'Expiry date:', cardCVC: 'CVC:', confirmationTitle: 'Confirmation', confirmationMessage: 'Thank you for booking with us! Your booking has been received.', whatsappMessage: 'You can send a message via WhatsApp to confirm your stay:', finish: 'Finish'},
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

document.getElementById('language-select').addEventListener('change', function(e) {
    setLanguage(e.target.value);
});

function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.reservation-step').forEach((div, index) => {
        div.style.display = (index + 1 === step) ? 'block' : 'none';
    });
}

function nextStep() {
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
        // Payment step - just proceed to confirmation
    }
    if (currentStep === 6) {
        // Confirmation: set WhatsApp link
        const number = '5492644444000'; // Argentinian phone number with country code
        const text = encodeURIComponent(`He reservado desde ${reservationData.checkin} hasta ${reservationData.checkout} en Hotel Olivos del Sol.`);
        document.getElementById('whatsapp-link').href = `https://api.whatsapp.com/send?phone=${number}&text=${text}`;
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
    document.getElementById('reservation-form').reset();
    showStep(1);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
    showStep(1);
});
