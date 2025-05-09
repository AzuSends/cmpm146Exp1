/* exported preload, setup, draw , evaluate*/
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;
let imgElement = document.getElementById('img');

let graphicsBuffer;


function preload() {


  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0, 0, width, height);
  filter(GRAY);
  loadPixels();
  currentInspirationPixels = pixels;
  imgElement.src = currentInspiration.assetUrl;
  imgElement.width = width
  imgElement.height = height


  graphicsBuffer = createGraphics(width, height);
  renderDesign(currentDesign, currentInspiration, graphicsBuffer, 1);
}

function evaluate() {
  graphicsBuffer.loadPixels();

  let error = 0;
  let n = graphicsBuffer.pixels.length;

  for (let i = 0; i < n; i += 8) {
    error += sq(graphicsBuffer.pixels[i] - currentInspirationPixels[i]) * 8;
  }
  return 1 / (1 + error / n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

function draw() {

  if (!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value / 100.0, Math.floor(random(0, 6)), Math.floor(random(0, 3)));

  randomSeed(0);
  renderDesign(currentDesign, currentInspiration, graphicsBuffer, 0);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
    renderDesign(currentDesign, currentInspiration, graphicsBuffer, 1);
  }

  fpsCounter.innerHTML = Math.round(frameRate());
}
