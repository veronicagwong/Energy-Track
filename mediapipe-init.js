/**
 * MediaPipe Face Detector loader.
 * Exposes window.getFaceDetector() which returns a Promise<FaceDetector>.
 * Use runningMode VIDEO for webcam; detects 1 or 2 faces (model-dependent).
 */
import {
  FaceDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

let cached = null;

window.getFaceDetector = async function () {
  if (cached) return cached;
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );
  cached = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
    },
    runningMode: "VIDEO",
    minDetectionConfidence: 0.5,
  });
  return cached;
};
