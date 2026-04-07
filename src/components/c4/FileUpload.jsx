import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, X, FileText, Image, Loader2, AlertCircle } from 'lucide-react';
import { fetchRuntimeCapabilities, uploadFile } from '@/api/submissions';

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp';
const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

export default function FileUpload({ files = [], onChange, onUploadingChange, maxFiles = 5 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadsEnabled, setUploadsEnabled] = useState(true);
  const [capabilityChecked, setCapabilityChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCapabilities() {
      try {
        const { uploadsEnabled: enabled } = await fetchRuntimeCapabilities();
        if (!cancelled) {
          setUploadsEnabled(enabled);
        }
      } catch {
        if (!cancelled) {
          setUploadsEnabled(true);
        }
      } finally {
        if (!cancelled) {
          setCapabilityChecked(true);
        }
      }
    }

    loadCapabilities();

    return () => {
      cancelled = true;
    };
  }, []);

  const processFiles = useCallback(async (fileList) => {
    if (!uploadsEnabled) {
      setErrors(['Attachments are currently unavailable for this deployment. Please include a share link in your message instead.']);
      return;
    }

    const remaining = maxFiles - files.length;
    if (remaining <= 0) return;

    const candidates = Array.from(fileList).slice(0, remaining);
    if (!candidates.length) return;

    setErrors([]);
    setUploading(true);
    onUploadingChange?.(true);
    const uploaded = [];
    const newErrors = [];

    for (const file of candidates) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.push(`"${file.name}" — file type not allowed.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        newErrors.push(`"${file.name}" — exceeds ${MAX_SIZE_MB}MB limit.`);
        continue;
      }
      try {
        const { file_url } = await uploadFile(file);
        uploaded.push({ name: file.name, url: file_url, type: file.type });
      } catch (err) {
        newErrors.push(`"${file.name}" — ${err.message || 'upload failed.'}`);
      }
    }

    if (uploaded.length) onChange([...files, ...uploaded]);
    if (newErrors.length) setErrors(newErrors);
    setUploading(false);
    onUploadingChange?.(false);
    if (inputRef.current) inputRef.current.value = '';
  }, [files, maxFiles, onChange, uploadsEnabled]);

  const remove = (index) => {
    setErrors([]);
    onChange(files.filter((_, i) => i !== index));
  };

  const isImage = (type) => type?.startsWith('image/');

  /* ─── Drag-and-drop ─── */
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (!uploading && files.length < maxFiles && e.dataTransfer?.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const atLimit = files.length >= maxFiles;
  const uploadUnavailable = capabilityChecked && !uploadsEnabled;
  const disabled = uploading || atLimit || uploadUnavailable;

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-dashed rounded-sm text-[12.5px] transition-colors duration-300 ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        }`}
        style={{
          borderColor: dragOver && !disabled ? 'var(--c4-accent)' : 'var(--c4-border)',
          color: 'var(--c4-text-subtle)',
          backgroundColor: 'var(--c4-card-bg)',
        }}
      >
        {!capabilityChecked ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Checking attachments…
          </>
        ) : uploadUnavailable ? (
          <>
            <AlertCircle size={14} />
            Attachments unavailable on this deployment
          </>
        ) : uploading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload size={14} />
            {atLimit ? `Max ${maxFiles} files` : 'Attach files — drag & drop or click to browse'}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => processFiles(e.target.files)}
      />

      {/* Validation / upload errors */}
      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px]" style={{ color: '#dc2626' }}>
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 border rounded-sm px-3 py-2" style={{ backgroundColor: 'var(--c4-card-bg)', borderColor: 'var(--c4-border-light)' }}>
              {isImage(f.type) ? (
                <Image size={13} className="shrink-0" style={{ color: 'var(--c4-text-subtle)' }} />
              ) : (
                <FileText size={13} className="shrink-0" style={{ color: 'var(--c4-text-subtle)' }} />
              )}
              <span className="text-[12px] truncate flex-1" style={{ color: 'var(--c4-text-muted)' }}>{f.name}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="transition-colors duration-200 shrink-0"
                style={{ color: 'var(--c4-text-faint)' }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-1.5 text-[10px]" style={{ color: 'var(--c4-text-faint)' }}>
        {uploadUnavailable
          ? 'Attachments are disabled because file storage is not configured for this deployment.'
          : `PDF, PNG, JPG, WEBP · Max ${MAX_SIZE_MB}MB per file · ${maxFiles} files max`}
      </p>
    </div>
  );
}