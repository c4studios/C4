# Lens Morph Frame Sequence

Place your AI-generated morph frames here.

## Naming Convention
- `frame-001.png` through `frame-090.png` (or however many frames)
- Sequential numbering, zero-padded to 3 digits

## Recommended Resolution
- 1920×1080 or 2560×1440 (landscape)
- PNG format for best quality
- Dark/black background to match the page

## How to Generate

### Option 1: Runway Gen-3 (Best quality)
1. Go to runwayml.com
2. Use Gen-3 Alpha with prompt:
   "Smooth cinematic morph transition from a camera lens to eyeglasses to a human eye, centered, dark background, studio lighting, photorealistic, 4K"
3. Generate a 4-second video
4. Export as PNG frame sequence (24fps = ~96 frames)

### Option 2: Kling AI (Free)
1. Go to klingai.com
2. Similar prompt as above
3. Download video, extract frames with ffmpeg:
   `ffmpeg -i video.mp4 -vf "fps=24" frame-%03d.png`

### Option 3: Manual Keyframes
1. Generate 3 hero images in Midjourney:
   - Camera lens (front-on, dark bg, studio lit)
   - Eyeglasses (front-on, dark bg, studio lit)
   - Human eye (close-up, dark bg, dramatic lighting)
2. Use Runway interpolation to create smooth transitions between them
3. Export as frame sequence

## Integration
Once frames are placed here, update `ImageSequenceCanvas` in Lens.jsx:
```jsx
<ImageSequenceCanvas 
  scrollContainerRef={heroRef} 
  frameCount={90}           // number of frames
  framePath="/lens-frames/frame-"  // prefix path
/>
```
