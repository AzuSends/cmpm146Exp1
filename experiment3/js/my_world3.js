
/* global XXH */
/* exported --
    p6_preload
    p6_setup
    p6_worldKeyChanged
    p6_tileWidth
    p6_tileHeight
    p6_tileClicked
    p6_drawBefore
    p6_drawTile
    p6_drawSelectedTile
    p6_drawAfter
*/

function p6_preload() { }

function p6_setup() {
  oreColor3 = 255;
}

let worldSeed3;
let oreColor3;

function p6_worldKeyChanged(key) {
  worldSeed3 = XXH.h32(key, 0);
  noiseSeed(worldSeed3);
  randomSeed(worldSeed3);
  [tw3, th3] = [p6_tileWidth(), p6_tileHeight()];
  clickNum = 1;
}

function p6_tileWidth() {
  return 32;
}
function p6_tileHeight() {
  return 16;
}

let [tw3, th3] = [p6_tileWidth(), p6_tileHeight()];

let clicks3 = {};
let clickNum = 1;

function p6_tileClicked(i, j) {
  clickNum += .0000001;
  let key = [i, j];
  clicks3[key] = 1 + (clicks3[key] | 0);
}

function p6_drawBefore() {

}

function p6_drawTile(i, j) {
  tw3 *= clickNum
  th3 *= clickNum
  let blocki = Math.floor(i / 7)
  let blockj = Math.floor(j / 7)
  let offset = Math.floor((Math.abs(blocki) + Math.abs(blockj)) / 20)
  oreColor3 = noise(worldSeed3 + offset) * 255;
  let darkness = offset * 10


  if (XXH.h32("tile:" + [blocki, blockj], worldSeed3) % (48 - offset * 4) == 0) {
    if (XXH.h32("tile:" + [i, j], worldSeed3) % 16 == 0) {
      stroke(255, 255, 255);
      fill(((oreColor3 * 4) % 255), ((oreColor3 * 2) % 255), (oreColor3));
    } else if (XXH.h32("tile:" + [i, j], worldSeed3) % 4 == 0) {
      noStroke();
      fill(((oreColor3 * 7) % 255), (oreColor3), (((oreColor3 * 4) % 255)));
    } else {
      noStroke();
      fill(0, 255)
    }

  } else {
    noStroke();
    if (XXH.h32("tile:" + [i, j], worldSeed3) % 4 == 0) {
      fill(((oreColor3 * 7) % 255), (oreColor3), (((oreColor3 * 4) % 255)));
    } else {
      fill(0, 255)
    }
  }

  push();
  beginShape();

  vertex(-(random() * tw3 / 10), 0);
  vertex(0, random() * th3 / 10);
  vertex(random() * tw3 / 10, 0);
  vertex(0, -(random() * th3 / 10));


  endShape(CLOSE);


  pop();
}

function p6_drawSelectedTile(i, j) {
  noFill();
  noStroke();
  beginShape();
  vertex(-tw3, 0);
  vertex(0, th3);
  vertex(tw3, 0);
  vertex(0, -th3);
  endShape(CLOSE);

  noStroke();
  fill(120, 120, 120);
  text("tile " + [i, j], 0, 0);
}

function p6_drawAfter() { }
