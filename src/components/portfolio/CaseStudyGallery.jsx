import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Monitor, Smartphone } from 'lucide-react';
import GallerySkeleton from './GallerySkeleton';
import PortfolioMedia from './PortfolioMedia';

const ease = [0.22, 1, 0.36, 1];

function GalleryTile({ shot, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04, ease }}
      onClick={onClick}
      className="group relative aspect-[16/10] overflow-hidden rounded-[3px]"
      style={{ backgroundColor: 'var(--c4-bg-alt)' }}
    >
      <PortfolioMedia
        src={shot.url}
        alt={shot.caption || `Screenshot ${index + 1}`}
        title={`Screenshot ${String(index + 1).padStart(2, '0')}`}
        message="Screenshot pending upload"
        compact
        imageClassName="transition-transform duration-700 group-hover:scale-[1.025]"
      >
        {shot.caption && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 px-3 py-2.5 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            style={{ background: 'linear-gradient(to top, var(--c4-caption-from), var(--c4-caption-via), transparent)' }}
          >
            <span className="text-[11px] font-medium" style={{ color: 'var(--c4-caption-text)' }}>
              {shot.caption}
            </span>
          </div>
        )}
      </PortfolioMedia>
    </motion.button>
  );
}

function Lightbox({ screenshots, activeIndex, onClose, onPrev, onNext }) {
  const shot = screenshots[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg"
      style={{ backgroundColor: 'var(--c4-lightbox-bg)' }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: 'var(--c4-lightbox-control)' }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = 'var(--c4-lightbox-control-hover)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = 'var(--c4-lightbox-control)';
        }}
      >
        <X size={16} style={{ color: 'var(--c4-lightbox-text)' }} />
      </button>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors md:left-8"
            style={{ backgroundColor: 'var(--c4-lightbox-control)' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--c4-lightbox-control-hover)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--c4-lightbox-control)';
            }}
          >
            <ChevronLeft size={16} style={{ color: 'var(--c4-lightbox-text)' }} />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors md:right-8"
            style={{ backgroundColor: 'var(--c4-lightbox-control)' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--c4-lightbox-control-hover)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--c4-lightbox-control)';
            }}
          >
            <ChevronRight size={16} style={{ color: 'var(--c4-lightbox-text)' }} />
          </button>
        </>
      )}

      <div className="mx-4 w-full max-w-[1000px] md:mx-8" onClick={(event) => event.stopPropagation()}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease }}
        >
          <PortfolioMedia
            src={shot.url}
            alt={shot.caption || `Screenshot ${activeIndex + 1}`}
            title={`Screenshot ${String(activeIndex + 1).padStart(2, '0')}`}
            message="Screenshot pending upload"
            className="aspect-[16/10] rounded-[3px]"
          />
        </motion.div>
        <p className="mt-3 text-center text-[11px]" style={{ color: 'var(--c4-lightbox-text-dim)' }}>
          {activeIndex + 1} / {screenshots.length}
          {shot.caption && (
            <span style={{ color: 'var(--c4-lightbox-text-accent)' }}> - {shot.caption}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

function DeviceToggle({ device, onChange, hasDesktop, hasMobile }) {
  if (!hasDesktop || !hasMobile) return null;

  return (
    <div className="mb-4 flex items-center gap-1.5">
      <button
        onClick={() => onChange('desktop')}
        className="flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors"
        style={{
          backgroundColor: device === 'desktop' ? 'var(--c4-accent)' : 'var(--c4-bg-alt)',
          color: device === 'desktop' ? 'white' : 'var(--c4-text-muted)',
          border: `1px solid ${device === 'desktop' ? 'var(--c4-accent)' : 'var(--c4-border)'}`,
        }}
      >
        <Monitor size={13} /> Desktop
      </button>
      <button
        onClick={() => onChange('mobile')}
        className="flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors"
        style={{
          backgroundColor: device === 'mobile' ? 'var(--c4-accent)' : 'var(--c4-bg-alt)',
          color: device === 'mobile' ? 'white' : 'var(--c4-text-muted)',
          border: `1px solid ${device === 'mobile' ? 'var(--c4-accent)' : 'var(--c4-border)'}`,
        }}
      >
        <Smartphone size={13} /> Mobile
      </button>
    </div>
  );
}

export default function CaseStudyGallery({ screenshots, desktopScreenshots, mobileScreenshots }) {
  const hasDesktop = desktopScreenshots?.length > 0;
  const hasMobile = mobileScreenshots?.length > 0;
  const hasDeviceSets = hasDesktop || hasMobile;

  const [device, setDevice] = useState('desktop');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeoutId);
  }, []);

  // Determine which screenshots to show
  const activeScreenshots = hasDeviceSets
    ? (device === 'mobile' && hasMobile ? mobileScreenshots : (hasDesktop ? desktopScreenshots : mobileScreenshots))
    : screenshots;

  if (!activeScreenshots || activeScreenshots.length === 0) {
    return null;
  }

  if (loading) {
    return <GallerySkeleton count={activeScreenshots.length} />;
  }

  return (
    <>
      {hasDeviceSets && (
        <DeviceToggle
          device={device}
          onChange={(d) => { setDevice(d); setLightboxIndex(null); }}
          hasDesktop={hasDesktop}
          hasMobile={hasMobile}
        />
      )}

      <div className={`grid gap-2.5 ${device === 'mobile' && hasDeviceSets ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
        {activeScreenshots.map((shot, index) => (
          <GalleryTile
            key={`${device}-${shot.url}-${index}`}
            shot={shot}
            index={index}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            screenshots={activeScreenshots}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((index) => (index === 0 ? activeScreenshots.length - 1 : index - 1))}
            onNext={() => setLightboxIndex((index) => (index === activeScreenshots.length - 1 ? 0 : index + 1))}
          />
        )}
      </AnimatePresence>
    </>
  );
}
