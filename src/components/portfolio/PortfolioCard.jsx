import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const categoryLabels = {
  web_design: 'Website Design',
  web_app: 'Web Application',
  brand_platform: 'Brand Platform',
  rebuild: 'Rebuild',
};

export default function PortfolioCard({ project, index, onSelect }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.02]);
  const imgY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  const image = project.thumbnail_url || project.images?.[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=900&fit=crop&q=85';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
    >
      <button
        className="group block w-full text-left"
        onClick={() => onSelect(project)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[16/10] md:aspect-[16/9] rounded-[2px]" style={{ backgroundColor: 'var(--c4-bg-alt)' }}>
          <motion.img
            src={image}
            alt={project.title}
            style={{ scale: imgScale, y: imgY }}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
          />
          <motion.div
            className="absolute bottom-4 right-4 md:bottom-5 md:right-5 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--c4-text)' }}
            initial={false}
            animate={{
              scale: hovered ? 1 : 0.6,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease }}
          >
            <ArrowUpRight size={15} strokeWidth={2} style={{ color: 'var(--c4-bg)' }} />
          </motion.div>
        </div>

        <div className="mt-4 md:mt-5 flex flex-col md:flex-row md:items-baseline md:justify-between gap-1.5">
          <div>
            <h3 className="text-[1rem] md:text-[1.15rem] font-semibold tracking-[-0.015em]" style={{ color: 'var(--c4-text)' }}>
              {project.title}
            </h3>
            {project.client && (
              <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--c4-text-subtle)' }}>{project.client}</p>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-[10.5px] uppercase tracking-[0.16em] font-medium" style={{ color: 'var(--c4-text-faint)' }}>
            <span>{categoryLabels[project.category] || project.category}</span>
            {project.year && (
              <>
                <span className="w-px h-2.5" style={{ backgroundColor: 'var(--c4-border)' }} />
                <span>{project.year}</span>
              </>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}