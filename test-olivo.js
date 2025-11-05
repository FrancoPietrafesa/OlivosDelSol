const fs = require('fs');
const path = require('path');
const vm = require('vm');

const filePath = path.join(__dirname, 'js', 'olivo-bot.js');
const code = fs.readFileSync(filePath, 'utf8');

// Sandbox: mock window.open to capture URLs and avoid DOM usage
const logs = [];
const sandbox = {
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  // Simular window con open que devuelve un objeto (evita fallback DOM)
  window: {
    open: (url, target) => {
      console.log('MOCK window.open ->', url);
      logs.push(url);
      return {}; // objeto no-null para indicar que no fue bloqueado
    }
  },
  document: {
    getElementById: () => null,
    createElement: () => ({ style: {}, appendChild: () => {}, setAttribute: () => {} }),
    body: { appendChild: () => {} }
  }
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox);
// Asegurarnos de exponer la clase en el sandbox (en caso de que no se asigne automáticamente)
vm.runInContext('this.OlivoBot = typeof OlivoBot !== "undefined" ? OlivoBot : undefined;', sandbox);

// Obtener la clase definida en el sandbox
const OlivoBot = sandbox.OlivoBot;
if (!OlivoBot) {
  console.error('No se encontró OlivoBot en el sandbox. Asegúrate de que js/olivo-bot.js define la clase OlivoBot en global.');
  process.exit(1);
}

const bot = new OlivoBot();

const sampleReservation = {
  checkin: '2025-12-20',
  checkout: '2025-12-25',
  guestName: 'Test Usuario',
  guestEmail: 'test@example.com',
  guestPhone: '+5491155511222',
  guests: 2,
  rooms: 1,
  roomType: 'suite',
  paymentMethod: 'local'
};

(async () => {
  console.log('Lanzando prueba de OlivoBot.sendReservationDetails...');
  try {
    await bot.sendReservationDetails(sampleReservation);
    console.log('Prueba completada. URLs capturadas:');
    logs.forEach((u, i) => console.log(`${i + 1}: ${u}`));
    process.exit(0);
  } catch (err) {
    console.error('Error durante la prueba:', err);
    process.exit(2);
  }
})();
