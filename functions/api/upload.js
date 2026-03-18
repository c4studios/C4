/**
 * POST /api/upload
 *
 * Handles file uploads to Cloudflare R2.
 * Accepts multipart/form-data with a single "file" field.
 * Returns the public URL of the uploaded file.
 *
 * Required env vars / bindings:
 *   UPLOADS_BUCKET   – R2 bucket binding (configured in Pages dashboard)
 *   PUBLIC_BUCKET_URL – Public URL prefix for the R2 bucket
 *                       (e.g. https://uploads.c4studios.com)
 *
 * Optional env vars:
 *   ALLOWED_ORIGIN   – CORS origin (defaults to https://c4studios.com)
 */

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env?.ALLOWED_ORIGIN || 'https://c4studios.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];

// Magic-byte signatures — validated before upload to prevent disguised files.
const MAGIC_BYTES = {
  'application/pdf': [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }],
  'image/png':       [{ offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],
  'image/jpeg':      [{ offset: 0, bytes: [0xFF, 0xD8, 0xFF] }],
  'image/webp': [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
  ],
};

/** Verify that the file's leading bytes match the expected magic signature. */
function verifyMagicBytes(header, mimeType) {
  const sigs = MAGIC_BYTES[mimeType];
  if (!sigs) return false;
  for (const { offset, bytes } of sigs) {
    for (let i = 0; i < bytes.length; i++) {
      if (header[offset + i] !== bytes[i]) return false;
    }
  }
  return true;
}

/** Sanitise a filename for safe storage in R2 metadata. */
function sanitiseFilename(name) {
  return String(name)
    .replace(/[\\/]/g, '_')
    .replace(/\0/g, '')
    .replace(/[<>"'`]/g, '_')
    .slice(0, 200);
}

export async function onRequestOptions({ env }) {
  return new Response(null, { status: 204, headers: corsHeaders(env) });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const cors = corsHeaders(env);
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...cors },
    });

  try {
    // --- Content-Length pre-check (reject before buffering the body) ---
    const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (contentLength > MAX_SIZE + 8192) {
      return json({ success: false, errors: ['Request too large.'] }, 413);
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return json({ success: false, errors: ['No file provided.'] }, 400);
    }

    // --- Validate MIME type ---
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json(
        { success: false, errors: [`File type "${file.type}" is not allowed. Accepted: PDF, PNG, JPG, WEBP.`] },
        400
      );
    }

    // --- Validate size ---
    if (file.size > MAX_SIZE) {
      return json(
        { success: false, errors: [`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 10MB.`] },
        400
      );
    }

    // --- Validate extension ---
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return json(
        { success: false, errors: [`File extension ".${ext}" is not allowed.`] },
        400
      );
    }

    // --- Read file into memory for magic-byte verification ---
    const arrayBuffer = await file.arrayBuffer();
    const header = new Uint8Array(arrayBuffer, 0, Math.min(16, arrayBuffer.byteLength));

    if (!verifyMagicBytes(header, file.type)) {
      return json(
        { success: false, errors: ['File content does not match its declared type.'] },
        400
      );
    }

    // --- Generate unique key (UUID avoids collisions) ---
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const key = `uploads/${timestamp}-${uuid}.${ext}`;

    // --- Upload to R2 ---
    if (env.UPLOADS_BUCKET) {
      const safeName = sanitiseFilename(file.name);

      await env.UPLOADS_BUCKET.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
          contentDisposition: `attachment; filename="${safeName}"`,
        },
        customMetadata: {
          originalName: safeName,
          uploadedAt: new Date().toISOString(),
        },
      });

      const publicUrl = env.PUBLIC_BUCKET_URL
        ? `${env.PUBLIC_BUCKET_URL}/${key}`
        : key;

      return json({ success: true, file_url: publicUrl });
    }

    // No R2 bucket configured — reject the upload
    console.error('UPLOADS_BUCKET is not configured');
    return json({ success: false, errors: ['File storage is not configured.'] }, 503);
  } catch (err) {
    console.error('Upload handler error:', err);
    return json({ success: false, errors: ['Upload failed. Please try again.'] }, 500);
  }
}


