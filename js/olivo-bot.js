class OlivoBot {
    constructor() {
        this.phoneNumbers = ["542645302354", "5491136692718"];
        this.welcomeMessage = "Hola, mi nombre es Olivo y soy tu bot informativo de reservas";
        this.avatar = "images/olivo-bot-avatar.png";
    }

    async sendReservationDetails(reservationData) {
        const message = this.formatReservationMessage(reservationData);
        for (const phoneNumber of this.phoneNumbers) {
            await this.sendWhatsAppMessage(message, phoneNumber);
        }
    }

    formatReservationMessage(data) {
        const checkInDate = new Date(data.checkin);
        const checkOutDate = new Date(data.checkout);
        const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        return `
${this.welcomeMessage}
🏨 *Nueva Reserva en Olivos del Sol*

📅 *Detalles de la estadía:*
▸ Check-in: ${data.checkin}
▸ Check-out: ${data.checkout}
▸ Noches totales: ${nights}

👤 *Datos del huésped:*
▸ Nombre: ${data.guestName}
▸ Email: ${data.guestEmail}
▸ Teléfono: ${data.guestPhone}

🛎️ *Detalles de la reserva:*
▸ Cantidad de huéspedes: ${data.guests}
▸ Habitaciones: ${data.rooms}
▸ Tipo de habitación: ${data.roomType}

💳 *Método de pago:*
▸ ${data.paymentMethod}

¡Gracias por elegir Olivos del Sol! 🌟
        `.trim();
    }

    async sendWhatsAppMessage(message, phoneNumber) {
        const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    }
}