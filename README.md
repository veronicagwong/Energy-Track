# p5.js + MediaPipe Face Detection

Detects 1 or 2 faces from your webcam using [MediaPipe Face Detector](https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector) and draws bounding boxes in a p5.js sketch.

## Project files

- **index.html** – Loads p5.js, MediaPipe init script, and the sketch.
- **style.css** – Full-window layout for the canvas.
- **mediapipe-init.js** – ES module that loads the MediaPipe Face Detector (VIDEO mode) and exposes `window.getFaceDetector()`.
- **sketch.js** – p5.js sketch: webcam capture, face detection, and drawing up to 2 face boxes.

## Run locally

Camera and MediaPipe WASM usually need a real origin (not `file://`). Use a local server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the URL (e.g. `http://localhost:3000` or `http://localhost:8000`) and allow camera access. You should see the video with green rectangles around detected faces (up to 2).
