const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const port = 3001;

// Simple static server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.setHeader('Content-Type', mime + '; charset=utf-8');
    res.end(data);
  });
});

(async () => {
  server.listen(port);
  console.log('Static server running on http://localhost:' + port);

  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  try {
    await page.goto('http://localhost:' + port + '/index.html');

    // Wait for nav toggle
    await page.waitForSelector('.nav-toggle');

    // Ensure aria-expanded initially false
    const initial = await page.$eval('.nav-toggle', el => el.getAttribute('aria-expanded'));
    console.log('initial aria-expanded:', initial);

    // Click toggle
    await page.click('.nav-toggle');

    // Wait for attribute change
    await page.waitForFunction(() => document.querySelector('.nav-toggle').getAttribute('aria-expanded') === 'true');
    const afterOpen = await page.$eval('.nav-toggle', el => el.getAttribute('aria-expanded'));
    console.log('after open aria-expanded:', afterOpen);

    // Check mobileMenu visible
    const menuVisible = await page.evaluate(() => {
      const sheet = document.getElementById('mobileMenu');
      const backdrop = document.querySelector('.ios-menu-backdrop');
      return sheet && backdrop && !sheet.hidden && !backdrop.hidden && sheet.getAttribute('data-open') === 'true';
    });
    console.log('menuVisible:', menuVisible);

    if (!menuVisible) throw new Error('Menu did not open correctly');

    // Close the menu by clicking backdrop
    await page.click('.ios-menu-backdrop');
    await page.waitForFunction(() => document.querySelector('.nav-toggle').getAttribute('aria-expanded') === 'false');
    const afterClose = await page.$eval('.nav-toggle', el => el.getAttribute('aria-expanded'));
    console.log('after close aria-expanded:', afterClose);

    console.log('MENU TEST: SUCCESS');

    await browser.close();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('MENU TEST: FAILED', err);
    await browser.close();
    server.close();
    process.exit(1);
  }
})();
