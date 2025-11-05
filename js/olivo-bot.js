class OlivoBot {
    constructor() {
        // Enviar solo al número solicitado por el usuario: +54 9 11 3669-2718
        this.phoneNumbers = ["5491136692718"];
        this.welcomeMessage = "Hola, mi nombre es Olivo y soy tu bot informativo de reservas";
        this.avatar = "images/olivo-bot-avatar.svg";
    }

    async sendReservationDetails(reservationData) {
        console.log('OlivoBot: sendReservationDetails called', reservationData);
        const message = this.formatReservationMessage(reservationData);

        // Abrir cada enlace con un pequeño retardo para reducir bloqueo de pop-ups.
        // Retorna una promesa que se resuelve cuando los enlaces son abiertos.
        const promises = [];
        for (const [idx, phone] of this.phoneNumbers.entries()) {
            const delay = idx * 600; // 600ms entre cada apertura
            promises.push(new Promise((resolve) => {
                setTimeout(() => {
                    this.sendWhatsAppMessage(message, phone).then(resolve).catch((err) => {
                        console.error('OlivoBot: error sending to', phone, err);
                        resolve();
                    });
                }, delay);
            }));
        }

        return Promise.all(promises);
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
        console.log(`OlivoBot: opening WhatsApp link for ${phoneNumber}:`, whatsappLink);

        // Intentamos abrir en nueva pestaña. Algunos navegadores bloquean ventanas
        // abiertas en código no iniciado por click. Para minimizar el bloqueo, la
        // función se llama después de un click (preferible) o con pequeños delays.
        try {
            const win = (typeof window !== 'undefined' && window.open) ? window.open(whatsappLink, '_blank') : { opened: true };
            if (!win) {
                console.warn('OlivoBot: window.open fue bloqueado por el navegador');
                // Devolver fallback: mostrar un enlace para que el usuario lo abra manualmente
                this._showManualLink(whatsappLink, phoneNumber);
            }
        } catch (err) {
            console.error('OlivoBot: excepción al abrir ventana', err);
            this._showManualLink(whatsappLink, phoneNumber);
        }
        return;
    }

    _showManualLink(url, phone) {
        // Crea temporalmente un aviso en la página con link para abrir manualmente
        try {
            const containerId = 'olivo-manual-links';
            let container = (typeof document !== 'undefined') ? document.getElementById(containerId) : null;
            if (!container && typeof document !== 'undefined') {
                container = document.createElement('div');
                container.id = containerId;
                container.style.position = 'fixed';
                container.style.right = '20px';
                container.style.bottom = '20px';
                container.style.zIndex = '11000';
                container.style.background = 'rgba(0,0,0,0.7)';
                container.style.color = '#fff';
                container.style.padding = '10px 12px';
                container.style.borderRadius = '10px';
                container.style.fontSize = '14px';
                document.body.appendChild(container);
            }
            if (container) {
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.textContent = `Abrir WhatsApp ( ${phone} )`;
                a.style.display = 'block';
                a.style.color = '#fff';
                a.style.marginBottom = '6px';
                container.appendChild(a);
            }
        } catch (e) {
            console.error('OlivoBot: no se pudo mostrar link manual', e);
        }
    }
}