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
  // REMOVED: test-olivo.js removed — WhatsApp-based test harness retired in favor of server-side email notifications.
  // Simular window con open que devuelve un objeto (evita fallback DOM)
