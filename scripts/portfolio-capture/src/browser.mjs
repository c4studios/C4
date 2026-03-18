import { chromium, devices } from 'playwright';

export async function createBrowser(config) {
  return chromium.launch({ headless: config.headless });
}

export async function createContexts(browser, config) {
  const contexts = [];

  if (config.desktop) {
    const context = await browser.newContext({
      viewport: { width: config.desktopWidth, height: config.desktopHeight },
      deviceScaleFactor: config.deviceScaleFactor,
      javaScriptEnabled: true,
      colorScheme: 'light',
      locale: 'en-AU',
      reducedMotion: 'reduce',
    });
    contexts.push({
      kind: 'desktop',
      context,
      page: await context.newPage(),
      viewport: { width: config.desktopWidth, height: config.desktopHeight },
    });
  }

  if (config.mobile) {
    const iphone = devices['iPhone 14 Pro'] || {};
    const context = await browser.newContext({
      ...iphone,
      viewport: { width: config.mobileWidth, height: config.mobileHeight },
      screen: { width: config.mobileWidth, height: config.mobileHeight },
      deviceScaleFactor: config.deviceScaleFactor,
      isMobile: true,
      hasTouch: true,
      javaScriptEnabled: true,
      colorScheme: 'light',
      locale: 'en-AU',
      reducedMotion: 'reduce',
    });
    contexts.push({
      kind: 'mobile',
      context,
      page: await context.newPage(),
      viewport: { width: config.mobileWidth, height: config.mobileHeight },
    });
  }

  return contexts;
}

export async function closeBrowser(browser) {
  await browser.close();
}
