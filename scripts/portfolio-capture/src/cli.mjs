const KNOWN_FLAGS = new Set([
  '--urls', '--out', '--desktop', '--mobile', '--max-per-device',
  '--include', '--exclude', '--device-scale-factor', '--desktop-width',
  '--desktop-height', '--mobile-width', '--mobile-height', '--settle-ms',
  '--browser-timeout', '--full-page-fallback', '--headless', '--help',
  '--verbose', '--dry-run',
]);

function readValue(args, index) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${args[index]}`);
  }
  return value;
}

function parseBool(value, fallback = false) {
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'y', 'on'].includes(String(value).toLowerCase());
}

function parseNum(value, fallback) {
  if (value == null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseCsv(value) {
  if (!value) return [];
  return String(value).split(',').map(x => x.trim()).filter(Boolean);
}

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function printHelp() {
  console.log(`
portfolio-capture — local portfolio screenshot tool

Usage:
  node scripts/portfolio-capture/capture.mjs --urls <url...> [options]

Required:
  --urls <url...>          One or more URLs to capture (space-separated)

Options:
  --out <dir>              Output directory (default: ./captures)
  --desktop <bool>         Capture desktop viewport (default: true)
  --mobile <bool>          Capture mobile viewport (default: true)
  --max-per-device <n>     Max screenshots per device (default: 5)
  --include <csv>          Only capture sections matching these keywords
  --exclude <csv>          Skip sections matching these keywords
  --device-scale-factor <n> Device pixel ratio (default: 1)
  --desktop-width <n>      Desktop viewport width (default: 1440)
  --desktop-height <n>     Desktop viewport height (default: 2200)
  --mobile-width <n>       Mobile viewport width (default: 430)
  --mobile-height <n>      Mobile viewport height (default: 932)
  --settle-ms <n>          Wait after scroll/load before capture (default: 1400)
  --browser-timeout <n>    Navigation timeout in ms (default: 45000)
  --full-page-fallback <b> Fall back to viewport screenshot on clip failure (default: true)
  --headless <bool>        Run browser headless (default: true)
  --verbose                Enable verbose logging
  --dry-run                Parse and validate without launching browser
  --help                   Show this help message
`);
}

export function parseCli(argv) {
  const config = {
    urls: [],
    out: './captures',
    desktop: true,
    mobile: true,
    maxPerDevice: 5,
    include: [],
    exclude: [],
    deviceScaleFactor: 1,
    desktopWidth: 1440,
    desktopHeight: 2200,
    mobileWidth: 430,
    mobileHeight: 932,
    settleMs: 1400,
    browserTimeout: 45000,
    fullPageFallback: true,
    headless: true,
    verbose: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help') {
      printHelp();
      process.exit(0);
    }

    // Warn on unknown flags
    if (arg.startsWith('--') && !KNOWN_FLAGS.has(arg)) {
      console.warn(`[capture] Warning: unknown flag "${arg}" — ignored`);
      continue;
    }

    if (arg === '--urls') {
      i += 1;
      while (i < argv.length && !argv[i].startsWith('--')) {
        config.urls.push(argv[i]);
        i += 1;
      }
      i -= 1;
    } else if (arg === '--out')                  { config.out = readValue(argv, i); i += 1; }
      else if (arg === '--desktop')              { config.desktop = parseBool(readValue(argv, i), true); i += 1; }
      else if (arg === '--mobile')               { config.mobile = parseBool(readValue(argv, i), true); i += 1; }
      else if (arg === '--max-per-device')        { config.maxPerDevice = parseNum(readValue(argv, i), 5); i += 1; }
      else if (arg === '--include')              { config.include = parseCsv(readValue(argv, i)); i += 1; }
      else if (arg === '--exclude')              { config.exclude = parseCsv(readValue(argv, i)); i += 1; }
      else if (arg === '--device-scale-factor')  { config.deviceScaleFactor = parseNum(readValue(argv, i), 1); i += 1; }
      else if (arg === '--desktop-width')        { config.desktopWidth = parseNum(readValue(argv, i), 1440); i += 1; }
      else if (arg === '--desktop-height')       { config.desktopHeight = parseNum(readValue(argv, i), 2200); i += 1; }
      else if (arg === '--mobile-width')         { config.mobileWidth = parseNum(readValue(argv, i), 430); i += 1; }
      else if (arg === '--mobile-height')        { config.mobileHeight = parseNum(readValue(argv, i), 932); i += 1; }
      else if (arg === '--settle-ms')            { config.settleMs = parseNum(readValue(argv, i), 1400); i += 1; }
      else if (arg === '--browser-timeout')      { config.browserTimeout = parseNum(readValue(argv, i), 45000); i += 1; }
      else if (arg === '--full-page-fallback')   { config.fullPageFallback = parseBool(readValue(argv, i), true); i += 1; }
      else if (arg === '--headless')             { config.headless = parseBool(readValue(argv, i), true); i += 1; }
      else if (arg === '--verbose')              { config.verbose = true; }
      else if (arg === '--dry-run')              { config.dryRun = true; }
  }

  if (!config.urls.length) {
    throw new Error('No URLs provided. Use --urls https://example.com  or --help for usage.');
  }

  // Validate each URL
  for (const url of config.urls) {
    if (!isValidUrl(url)) {
      throw new Error(`Invalid URL: "${url}" — must start with http:// or https://`);
    }
  }

  return config;
}
