import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function PortfolioMedia({
  src,
  alt,
  title,
  message,
  meta = [],
  className = '',
  imageClassName = '',
  placeholderClassName = '',
  compact = false,
  children,
  ...imgProps
}) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      {!failed ? (
        <img
          {...imgProps}
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${imageClassName}`.trim()}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`h-full w-full ${compact ? 'px-4 py-4' : 'px-5 py-5 md:px-7 md:py-7'} ${placeholderClassName}`.trim()}
          style={{ backgroundColor: 'var(--c4-bg-alt)' }}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {meta.map((item) => (
                <span
                  key={item}
                  className={`rounded-[2px] px-2.5 py-[3px] ${compact ? 'text-[8.5px]' : 'text-[9px]'} uppercase tracking-[0.14em] font-medium`}
                  style={{
                    color: 'var(--c4-text-faint)',
                    backgroundColor: 'var(--c4-card-bg)',
                    border: '1px solid var(--c4-border-light)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div
                className={`mb-4 flex items-center justify-center rounded-full ${compact ? 'h-11 w-11' : 'h-12 w-12'}`}
                style={{
                  backgroundColor: 'var(--c4-card-bg)',
                  border: '1px solid var(--c4-border)',
                }}
              >
                <ImageIcon
                  size={compact ? 18 : 22}
                  strokeWidth={1.25}
                  style={{ color: 'var(--c4-text-subtle)' }}
                />
              </div>

              {title && (
                <span
                  className={`${compact ? 'text-[10px]' : 'text-[11px]'} uppercase tracking-[0.18em] font-medium`}
                  style={{ color: 'var(--c4-text)' }}
                >
                  {title}
                </span>
              )}

              {message && (
                <span
                  className={`mt-2 ${compact ? 'text-[10px]' : 'text-[11px]'} leading-[1.5]`}
                  style={{ color: 'var(--c4-text-subtle)' }}
                >
                  {message}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
