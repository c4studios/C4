import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

// Home page
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'C:/Users/belac/AppData/Local/Temp/home-loaded.png', fullPage: false });

// Hover over Services to trigger dropdown
await page.hover('text=SERVICES');
await page.waitForTimeout(600);
await page.screenshot({ path: 'C:/Users/belac/AppData/Local/Temp/dropdown.png', fullPage: false });

// ServiceWeb page
await page.goto('http://localhost:5173/ServiceWeb', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: 'C:/Users/belac/AppData/Local/Temp/service-web.png', fullPage: false });

await browser.close();
