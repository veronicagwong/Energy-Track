let faceLandmarker = null;
let video;
let lastResult = null;

const PREVIEW_W = 250;
const PREVIEW_H = (250 * 4) / 3; // 3:4
const PREVIEW_PAD = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  video = createCapture(VIDEO);
  video.size(256, 192); // smaller = faster inference
  video.hide();

  window.getFaceLandmarker().then(function (landmarker) {
    faceLandmarker = landmarker;
  });
}

function getExpression(blendshapes) {
  if (!blendshapes || blendshapes.length === 0) return null;
  const getScore = (name) => {
    const c = blendshapes.find((x) => x.categoryName === name);
    return c ? c.score : 0;
  };
  const smile = (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
  const frown = (getScore("mouthFrownLeft") + getScore("mouthFrownRight")) / 2;
  if (smile > 0.08 && smile > frown) return "Smiling";
  if (frown > 0.08 && frown > smile) return "Frowning";
  return "Neutral";
}

function draw() {
  if (video.loadedmetadata && video.elt.readyState >= 2) {
    if (faceLandmarker) {
      try {
        const timestamp = performance.now();
        lastResult = faceLandmarker.detectForVideo(video.elt, timestamp);
      } catch (e) {
        lastResult = null;
      }
    }
  }

  const hasFace = lastResult && lastResult.faceLandmarks && lastResult.faceLandmarks.length > 0;
  const blendshapes = hasFace && lastResult.faceBlendshapes ? lastResult.faceBlendshapes[0] : null;
  const expression = hasFace ? getExpression(blendshapes ? blendshapes.categories : null) : null;

  // Background by expression: neutral=grey, smiling=yellow, frowning=blue
  if (expression === "Smiling") background(255, 235, 59);
  else if (expression === "Frowning") background(33, 150, 243);
  else background(120);

  if (video.loadedmetadata && video.elt.readyState >= 2) {
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

  textAlign(LEFT, TOP);
  textSize(24);
  fill(255);
  noStroke();
  const pad = 20;
  if (!faceLandmarker) {
    text("MediaPipe loading...", pad, pad);
  } else if (!hasFace) {
    text("MediaPipe ready — no face detected", pad, pad);
  } else {
    text("MediaPipe ready — face detected", pad, pad);
    textSize(32);
    fill(expression === "Smiling" ? "#4ade80" : expression === "Frowning" ? "#f87171" : "#94a3b8");
    text(expression, pad, pad + 36);
  }

  // 1 circle in center when 1 face
  const cx = width / 2;
  const cy = height / 2;
  const circleRadius = 80;
  noStroke();
  fill(255, 255, 255, hasFace ? 180 : 60);
  if (hasFace) {
    circle(cx, cy, circleRadius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
