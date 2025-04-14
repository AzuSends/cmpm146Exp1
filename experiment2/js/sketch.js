// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

/* exported setup, draw */

let seed;

const grassColor = "#345d25";
const flowerColor = "#7c77de"
const skyColor = "#ffe7bf";
const skyHueColor = "#feb8ac";
const landscapeColor = "#3f3f36";
const greenLandscapeColor = "#565b31";
const mountainColor = "#495363" //opaque color from difuse light
const cloudLightColor = "#a2788c"
const cloudDarkColor = "#3b4f6a"
let cloudOrigin;

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  seed = random()
  let button = createButton("reimagine").mousePressed(() => initScreen());
  button.position(50, height + 80)
  initScreen()



}
//allows repeated calls without duplicating the canvas and a set seed 
function initScreen() {

  seed = random()
  cloudOrigin = seed * 400
}

function draw() {
  noStroke();
  background(skyColor);




  fill(mountainColor);
  beginShape();
  let y = height / 4 + 15;
  vertex(0, y);
  for (let x = 0; x < width; x += 5) {
    if (noise(seed * (x * .5)) >= .5) {
      y += 1.5
    } else {
      y -= 1.5
    }
    if (x < width / 2) {
      vertex(x + 10, y)
    } else {
      vertex(x, y)
    }
  }
  vertex(width, y)
  vertex(width, height)
  vertex(0, height)
  endShape(CLOSE)





  fill(landscapeColor);
  triangle(0, height / 8 + seed * height / 16, 0, height, width / 3 + seed * width / 2, height);
  fill(greenLandscapeColor)
  triangle(width, height / 8 + seed * height / 16, width, height, width / 3 - seed * (width / 8 * 3), height)
  fill(grassColor)
  rect(0, height / 2 + height / 8, width, height / 2)

  fill(skyHueColor)
  ellipse(cloudOrigin, 5, width / 4 * 7, height / 5 + height / 10)
  fill(cloudLightColor)
  ellipse(cloudOrigin, 5, width / 4 * 7, height / 5 + height / 20)
  fill(cloudDarkColor)
  ellipse(cloudOrigin, 0, width / 4 * 7, height / 5)
  cloudOrigin += width / 1600;
  if (cloudOrigin >= width * 1.75) {
    cloudOrigin = -width
  }
  fill(flowerColor)
  for (let x = 0; x < width; x++) {
    for (let y = height / 2 + height / 8; y < height - 20; y += .5) {
      if (noise(seed * (x) * (y)) > 0.81) {
        ellipse(x, y, 1 + (y / height) ** 3 * 10, 1 + (y / height) ** 3 * 10)
      }
    }

  }

  loadPixels()

  for (let y = 0; y < height / 4 + 25; y += 1) {
    for (let x = 0; x < width; x++) {
      let index = (y * width + x) * 4; //y * width gets us our row + x for column then * 4 since the pixel array contains RGB and an Alpha value
      let red = pixels[index] //73
      let green = pixels[index + 1] //83
      let blue = pixels[index + 2] //99
      if (red == 73 && green == 83 && blue == 99 && y < height / 4 + 25 * noise(seed * (x * .05)) ** 3) {
        pixels[index] = 255
        pixels[index + 1] = 255
        pixels[index + 2] = 255
      }

    }

  }
  updatePixels()





}
