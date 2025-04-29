
/* global XXH */
/* exported --
    p4_preload
    p4_setup
    p4_worldKeyChanged
    p4_tileWidth
    p4_tileHeight
    p4_tileClicked
    p4_drawBefore
    p4_drawTile
    p4_drawSelectedTile
    p4_drawAfter
*/

function p4_preload() { }

function p4_setup() {
  oreColor2 = 255;
}

let worldSeed2;
let oreColor2;

function p4_worldKeyChanged(key) {
  worldSeed2 = XXH.h32(key, 0);
  noiseSeed(worldSeed2);
  randomSeed(worldSeed2);
}

function p4_tileWidth() {
  return 32;
}
function p4_tileHeight() {
  return 16;
}

let [tw2, th2] = [p4_tileWidth(), p4_tileHeight()];

let clicks2 = {};

function p4_tileClicked(i, j) {
  let key = [i, j];
  clicks2[key] = 1 + (clicks2[key] | 0);
}

function p4_drawBefore() {

}

function p4_drawTile(i, j) {
  let blocki = Math.floor(i / 7)
  let blockj = Math.floor(j / 7)
  let offset = Math.floor((Math.abs(blocki) + Math.abs(blockj)) / 20)
  oreColor2 = noise(worldSeed2 + offset) * 255;
  let darkness = offset * 10
  let isCrystal = 0;


  if (XXH.h32("tile:" + [blocki, blockj], worldSeed2) % (48 - offset * 4) == 0) {
    if (XXH.h32("tile:" + [i, j], worldSeed2) % 16 == 0) {
      stroke(255, 255, 255);
      fill(((oreColor2 * 4) % 255) - darkness, ((oreColor2 * 2) % 255) - darkness, (oreColor2) - darkness);
      th2 = 64;
      tw2 = 32;
      isCrystal = 1
    } else if (XXH.h32("tile:" + [i, j], worldSeed2) % 4 == 0) {
      noStroke();
      fill(200 - darkness, 255);
    } else {
      noStroke();
      fill(0, 255)
    }

  } else {
    noStroke();
    if (XXH.h32("tile:" + [i, j], worldSeed2) % 4 == 0) {
      fill(200 - darkness, 255);
    } else {
      fill(0, 255)
    }
  }

  push();
  beginShape();

  vertex(-(random() * tw2 / 10), 0);
  vertex(0, random() * th2 / 10);
  vertex(random() * tw2 / 10, 0);
  vertex(0, -(random() * th2 / 10));


  endShape(CLOSE);
  th2 = 16
  tw2 = 32

  let n = clicks2[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }

  pop();
}

function p4_drawSelectedTile(i, j) {
  noFill();
  noStroke();
  beginShape();
  vertex(-tw2, 0);
  vertex(0, th2);
  vertex(tw2, 0);
  vertex(0, -th2);
  endShape(CLOSE);

  noStroke();
  fill(120, 120, 120);
  text("tile " + [i, j], 0, 0);
}

function p4_drawAfter() { }
