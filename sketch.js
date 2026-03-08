let faceDetector = null;
let video;
let lastDetections = [];

const PREVIEW_W = 250;
const PREVIEW_H = (250 * 4) / 3; // 3:4
const PREVIEW_PAD = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480); // fixed size for detection
  video.hide();

  window.getFaceDetector().then(function (detector) {
    faceDetector = detector;
  });
}

function draw() {
  background(30);

  if (video.loadedmetadata && video.elt.readyState >= 2) {
    if (faceDetector) {
      try {
        const timestamp = performance.now() / 1000;
        const result = faceDetector.detectForVideo(video.elt, timestamp);
        lastDetections = (result && result.detections) ? result.detections : [];
      } catch (e) {
        lastDetections = [];
      }
    }

    // Camera preview: top right, 3:4 box, 250px width
    const previewX = width - PREVIEW_W - PREVIEW_PAD;
    const previewY = PREVIEW_PAD;
    push();
    stroke(80);
    strokeWeight(2);
    noFill();
    rect(previewX, previewY, PREVIEW_W, PREVIEW_H);
    pop();
    image(video, previewX, previewY, PREVIEW_W, PREVIEW_H);
  }

  // 1 or 2 circles in the center depending on face count
  const numFaces = Math.min(2, lastDetections.length);
  const cx = width / 2;
  const cy = height / 2;
  const circleRadius = 80;
  const circleGap = 120;

  noStroke();
  fill(255, 255, 255, numFaces > 0 ? 180 : 60);

  if (numFaces === 1) {
    circle(cx, cy, circleRadius * 2);
  } else if (numFaces === 2) {
    circle(cx - circleGap / 2, cy, circleRadius * 2);
    circle(cx + circleGap / 2, cy, circleRadius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
