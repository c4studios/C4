/**
 * The motion section of /Lens (8 Oct 2026): films made in each client's own
 * colours and type. It sits straight after the painted word, so the page's
 * line about capturing a brand's character meets its proof, and the nav's
 * "Our Work" lands here.
 *
 * The heading and lede use the page's own .lr reveal, which Lens.jsx resolves
 * to the finished state for the prerenderer and reduced motion. The films
 * reveal nothing: posters, strips, slates and each film's on-screen words are
 * in the static HTML as they stand. Films and their copy live in motionFilms.js.
 */
import React from 'react';
import MotionFilm from './MotionFilm';
import { MOTION_FILMS } from './motionFilms';

export default function LensMotion() {
  return (
    <section className="slab dark motion" id="motion" aria-labelledby="motion-title">
      <div className="mo-inner">
        <header className="mo-head">
          <h2 id="motion-title" className="lr" style={{ '--lr-delay': '80ms' }}>
            MOTION IN<br /><em>their colours.</em>
          </h2>
          <p className="mo-lede lr" style={{ '--lr-delay': '160ms' }}>
            Two films we made in 2026, each built from the client&rsquo;s own colours and type.
            The music is generated from the same timeline as the picture, so the cuts land on the beat.
          </p>
        </header>
        {MOTION_FILMS.map((film) => (
          <MotionFilm
            key={film.id}
            film={film}
            layout={film.cuts.some((c) => c.width > c.height) ? 'wide' : 'tall'}
          />
        ))}
      </div>
    </section>
  );
}
