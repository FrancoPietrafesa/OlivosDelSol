// Configuración de MercadoPago
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales de MercadoPago
// Puedes obtenerlas en: https://www.mercadopago.com.ar/developers/panel/credentials

const MercadoPagoConfig = {
    // Clave pública de MercadoPago (Public Key)
    // Para producción, usa tu Public Key de producción
    // Para pruebas, puedes usar una Public Key de prueba
    publicKey: 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    
    // ID de preferencia (opcional, se puede crear dinámicamente)
    preferenceId: null,
    
    // Configuración de la preferencia
    preference: {
        items: [],
        back_urls: {
            success: window.location.origin + '/reservation-success.html',
            failure: window.location.origin + '/reservation-failure.html',
            pending: window.location.origin + '/reservation-pending.html'
        },
        auto_return: 'approved',
        notification_url: window.location.origin + '/api/mercadopago/webhook'
    }
};

// Función para inicializar MercadoPago
function initMercadoPago() {
    if (typeof MercadoPago === 'undefined') {
        console.error('MercadoPago SDK no está cargado');
        return false;
    }
    
    const mp = new MercadoPago(MercadoPagoConfig.publicKey, {
        locale: 'es-AR'
    });
    
    return mp;
}

// Función para crear una preferencia de pago
async function createPaymentPreference(reservationData) {
    const mp = initMercadoPago();
    if (!mp) return null;
    
    // Calcular el monto según el tipo de habitación
    const roomPrices = {
        'standard': 80,
        'suite': 120,
        'premium': 200
    };
    
    const pricePerNight = roomPrices[reservationData.roomType] || 80;
    const checkin = new Date(reservationData.checkin);
    const checkout = new Date(reservationData.checkout);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const totalAmount = pricePerNight * nights * reservationData.rooms;
    
    const preference = {
        items: [
            {
                title: `Reserva Hotel Olivos del Sol - ${reservationData.roomType}`,
                description: `Reserva desde ${reservationData.checkin} hasta ${reservationData.checkout}`,
                quantity: 1,
                unit_price: totalAmount
            }
        ],
        payer: {
            name: reservationData.guestName,
            email: reservationData.guestEmail,
            phone: {
                number: reservationData.guestPhone
            }
        },
        back_urls: MercadoPagoConfig.preference.back_urls,
        auto_return: 'approved',
        notification_url: MercadoPagoConfig.preference.notification_url
    };
    
    try {
        const response = await mp.preferences.create(preference);
        return response.body.init_point;
    } catch (error) {
        console.error('Error al crear preferencia de MercadoPago:', error);
        return null;
    }
}

