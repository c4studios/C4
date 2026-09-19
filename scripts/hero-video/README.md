# The C4Site hero as a video

The hero on `/Foresight` (`src/components/sight-arm/mosaicEngine.js`) is driven
by one seekable timeline, so the same engine that plays live can be rendered
frame by frame.

Start the dev server, then:

    node scripts/hero-video/camera-check.mjs   # samples the camera at 60fps; halts and jumps must both be empty
    node scripts/hero-video/record.mjs         # 1920x1080@60 and 1080x1920@30 into ./hero-video-out

`record.mjs` opens `/Foresight?mosaic=record`, which exposes the engine as
`window.__siteMosaic`. Each output frame is the average of several renders
spread across a 180 degree shutter, which is real motion blur. The engine also
lists its own events (`cues`: landings, rings, camera moves); `audio.mjs` turns
that list into a WAV with nothing but noise, sines and filters, and ffmpeg
muxes the two. Film grain makes the raw encode very large, so re-encode the
silent master at about crf 25 for sharing.

Needs ffmpeg on PATH and Chrome installed (`channel: 'chrome'`). Set `C4_BASE`,
`OUT`, `JOBS` (for example `1920x1080@60`) and `SUB` (sub-frames) to override.
