/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() { }

function p3_setup() {
  oreColor = 255;
}

let worldSeed;
let oreColor;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {

}

function p3_drawTile(i, j) {
  let blocki = Math.floor(i / 7)
  let blockj = Math.floor(j / 7)
  let offset = Math.floor((Math.abs(blocki) + Math.abs(blockj)) / 20)
  oreColor = noise(worldSeed + offset) * 255;
  let darkness = offset * 10
  let isCrystal = 0;


  if (XXH.h32("tile:" + [blocki, blockj], worldSeed) % (48 - offset * 4) == 0) {
    if (XXH.h32("tile:" + [i, j], worldSeed) % 16 == 0) {
      stroke(255, 255, 255);
      fill(((oreColor * 4) % 255) - darkness, ((oreColor * 2) % 255) - darkness, (oreColor) - darkness);
      th = 64;
      tw = 32;
      isCrystal = 1
    } else if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
      noStroke();
      fill(200 - darkness, 255);
    } else {
      noStroke();
      fill(0, 255)
    }

  } else {
    noStroke();
    if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
      fill(200 - darkness, 255);
    } else {
      fill(0, 255)
    }
  }

  push();
  beginShape();
  if ([i, j] in clicks) {
    if (isCrystal == 1) {
      vertex(-tw, 0);
      vertex(0, -th);
      vertex(tw, 0);
    } else {
      vertex(-tw, 0);
      vertex(0, th);
      vertex(tw, 0);
      vertex(0, -th);
    }

  } else {
    vertex(-(random() * tw), 0);
    vertex(0, random() * th);
    vertex(random() * tw, 0);
    vertex(0, -(random() * th));
  }

  endShape(CLOSE);
  th = 16
  tw = 32

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  noStroke();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(120, 120, 120);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() { }
