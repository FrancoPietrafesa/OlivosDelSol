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

// REMOVED: Olivo WhatsApp client has been retired. File archived for history.
// See server/ for the email-based notification implementation.
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