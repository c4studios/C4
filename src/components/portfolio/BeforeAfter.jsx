/*
 * Before and after (Caleb, 2 Oct 2026): the client's earlier site, as the
 * Wayback Machine archived it, against the C4 build, with a seam to drag
 * between them. Only for sites with a genuine archived earlier version, and
 * only once Caleb has approved showing it (`approved` in the manifest),
 * because it puts a client's old site on show.
 *
 * The seam is a native range input stretched over the frame, so a drag, a
 * tap and the arrow keys all move it, and a screen reader hears a slider.
 */
import { useState } from 'react';
import { shortDate } from './portfolioMotion';
import './motion.css';

export default function BeforeAfter({ study, before, capturedOn }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="ba">
      <div className="ba-frame" style={{ '--pos': `${pos}%` }}>
        <img
          className="ba-after"
          src={before.after}
          width={before.w}
          height={before.h}
          alt={`${study.name}'s site now, as C4 built it`}
          loading="lazy"
          decoding="async"
        />
        <img
          className="ba-before"
          src={before.src}
          width={before.w}
          height={before.h}
          alt={`${study.name}'s earlier site, as archived on ${shortDate(before.archivedOn)}`}
          loading="lazy"
          decoding="async"
        />
        <span className="ba-tag ba-tag--before" aria-hidden="true">Before</span>
        <span className="ba-tag ba-tag--after" aria-hidden="true">After</span>
        <input
          className="ba-range"
          type="range"
          min="0"
          max="100"
          step="1"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Drag between ${study.name}'s earlier site and the C4 build`}
          aria-valuetext={`${pos}% earlier site, ${100 - pos}% C4 build`}
        />
        <span className="ba-seam" aria-hidden="true"><span className="ba-grip" /></span>
      </div>
      <figcaption className="ba-cap">
        <span>
          Before: archived on{' '}
          <a href={before.archiveUrl} target="_blank" rel="noopener noreferrer">{shortDate(before.archivedOn)}</a>
          {' '}by the Wayback Machine
        </span>
        <span>After: the C4 build, captured {shortDate(capturedOn)}</span>
      </figcaption>
    </figure>
  );
}
