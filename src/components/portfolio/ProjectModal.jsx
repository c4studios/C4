import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const categoryLabels = {
  web_design: 'Website Design',
  web_app: 'Web Application',
  brand_platform: 'Brand Platform',
  rebuild: 'Rebuild',
};

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const images = project.images?.length
    ? project.images
    : project.thumbnail_url
    ? [project.thumbnail_url]
    : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop&q=85'];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
        style={{ backgroundColor: 'var(--c4-lightbox-bg)' }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.5, ease }}
          className="relative w-full max-w-[920px] mx-4 my-16 md:my-20 rounded-[3px] overflow-hidden"
          style={{ backgroundColor: 'var(--c4-bg)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'color-mix(in srgb, var(--c4-card-bg) 80%, transparent)' }}
          >
            <X size={16} strokeWidth={2} style={{ color: 'var(--c4-text)' }} />
          </button>

          <div className="aspect-[16/9] overflow-hidden">
            <img src={images[0]} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="px-6 md:px-10 py-8 md:py-10">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] font-medium mb-4" style={{ color: 'var(--c4-text-subtle)' }}>
              <span>{categoryLabels[project.category] || project.category}</span>
              {project.year && (
                <>
                  <span className="w-px h-2.5" style={{ backgroundColor: 'var(--c4-border)' }} />
                  <span>{project.year}</span>
                </>
              )}
              {project.client && (
                <>
                  <span className="w-px h-2.5" style={{ backgroundColor: 'var(--c4-border)' }} />
                  <span>{project.client}</span>
                </>
              )}
            </div>

            <h2 className="text-[1.5rem] md:text-[2rem] font-semibold tracking-[-0.03em] leading-[1.1]" style={{ color: 'var(--c4-text)' }}>
              {project.title}
            </h2>

            {project.description && (
              <p className="mt-4 text-[14px] leading-[1.7] max-w-[600px]" style={{ color: 'var(--c4-text-muted)' }}>
                {project.description}
              </p>
            )}

            {project.long_description && (
              <p className="mt-3 text-[13px] leading-[1.7] max-w-[600px]" style={{ color: 'var(--c4-text-muted)' }}>
                {project.long_description}
              </p>
            )}

            {project.technologies?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-medium rounded-[2px] tracking-[0.01em]"
                    style={{ backgroundColor: 'var(--c4-tag-bg)', color: 'var(--c4-text-muted)' }}
                  >
                    <div className="w-[3px] h-[3px] rounded-full" style={{ backgroundColor: 'var(--c4-text)' }} />
                    {t}
                  </span>
                ))}
              </div>
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.13em] px-5 py-[8px] font-medium transition-colors duration-300"
                style={{ backgroundColor: 'var(--c4-text)', color: 'var(--c4-bg)' }}
              >
                Visit Project
                <ExternalLink size={12} strokeWidth={2} />
              </a>
            )}

            {images.length > 1 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                {images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-[16/10] overflow-hidden rounded-[2px]">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}