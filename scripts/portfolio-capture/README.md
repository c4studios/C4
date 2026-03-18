# Portfolio Capture Tool

A local Playwright-based utility for capturing portfolio-ready desktop and mobile screenshots.

**This tool runs offline and locally.** It is never included in the production site bundle.

## Install

From the repo root:

```bash
npm install playwright --save-dev
npx playwright install chromium
```

## Run

```bash
node scripts/portfolio-capture/capture.mjs \
  --urls https://transformhakea.com https://transformfreo.com \
  --out public/captures \
  --desktop true \
  --mobile true \
  --max-per-device 5
```

## Flags

```
--urls <url...>          URLs to capture (required)
--out <dir>              Output directory (default: ./captures)
--desktop <bool>         Capture desktop (default: true)
--mobile <bool>          Capture mobile (default: true)
--max-per-device <n>     Max screenshots per device (default: 5)
--include <csv>          Only sections matching keywords
--exclude <csv>          Skip sections matching keywords
--settle-ms <n>          Settle delay in ms (default: 1400)
--browser-timeout <n>    Navigation timeout in ms (default: 45000)
--full-page-fallback     Fall back to viewport shot on clip failure
--headless <bool>        Headless browser (default: true)
--verbose                Verbose logging
--dry-run                Validate config without launching browser
--help                   Show help
```

## Output

```
public/captures/
  transformhakea-com/
    desktop/
      01-hero.png
      02-services.png
    mobile/
      01-hero.png
      02-services.png
    manifest.json
    contact-sheet.html
```

## Review

After running, open `contact-sheet.html` to visually inspect all captures.
Check `manifest.json` for warnings before importing into the portfolio.

## Integration

Generated images are consumed by the C4 site from `public/captures/...`.
The capture tool itself is **not** bundled with the site — it exists only under `scripts/`.
