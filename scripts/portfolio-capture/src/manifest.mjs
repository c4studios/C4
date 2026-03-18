import fs from 'node:fs/promises';
import path from 'node:path';

const MANIFEST_VERSION = 2;

/**
 * Write the capture manifest JSON.
 * Includes a version field for future schema migrations.
 */
export async function writeManifest(rootOut, manifest) {
  const output = { version: MANIFEST_VERSION, ...manifest };
  await fs.writeFile(
    path.join(rootOut, 'manifest.json'),
    JSON.stringify(output, null, 2),
    'utf8',
  );
}
