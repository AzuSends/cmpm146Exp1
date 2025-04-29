
/* exported preload, setup, draw, mouseClicked */

// Project base code provided by {amsmith,ikarth}@ucsc.edu


let tile_width_step_main3; // A width step is half a tile's width
let tile_height_step_main3; // A height step is half a tile's height

// Global variables. These will mostly be overwritten in setup().
let tile_rows3, tile_columns3;
let camera_offset3;
let camera_velocity3;

/////////////////////////////
// Transforms between coordinate systems
// These are actually slightly weirder than in full 3d...
/////////////////////////////
function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main3;
  let j = (world_x + world_y) * tile_height_step_main3;
  return [i + camera_x, j + camera_y];
}

function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
  let i = (world_x - world_y) * tile_width_step_main3;
  let j = (world_x + world_y) * tile_height_step_main3;
  return [i, j];
}

function tileRenderingOrder(offset) {
  return [offset[1] - offset[0], offset[0] + offset[1]];
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x -= camera_x;
  screen_y -= camera_y;
  screen_x /= tile_width_step_main3 * 2;
  screen_y /= tile_height_step_main3 * 2;
  screen_y += 0.5;
  return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width_step_main3 * 2);
  let world_y = camera_y / (tile_height_step_main3 * 2);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function worldOffsetToCamera([world_x, world_y]) {
  let camera_x = world_x * (tile_width_step_main3 * 2);
  let camera_y = world_y * (tile_height_step_main3 * 2);
  return new p5.Vector(camera_x, camera_y);
}

function preload() {
  if (window.p6_preload) {
    window.p6_preload();
  }
}

function setup() {
  let canvas = createCanvas(1600, 800);
  canvas.parent("container3");

  camera_offset3 = new p5.Vector(-width / 2, height / 2);
  camera_velocity3 = new p5.Vector(0, 0);

  if (window.p6_setup) {
    window.p6_setup();
  }

  let label = createP();

  label.html("World key: ");
  label.parent("container3");

  let input = createInput("xyzzy");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Arrow keys scroll. Clicking accelerates the destruction of the universe.").parent("container3");

  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p6_worldKeyChanged) {
    window.p6_worldKeyChanged(key);
  }
  tile_width_step_main3 = window.p6_tileWidth ? window.p6_tileWidth() : 32;
  tile_height_step_main3 = window.p6_tileHeight ? window.p6_tileHeight() : 14.5;
  tile_columns3 = Math.ceil(width / (tile_width_step_main3 * 2));
  tile_rows3 = Math.ceil(height / (tile_height_step_main3 * 2));
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset3.x, camera_offset3.y]
  );

  if (window.p6_tileClicked) {
    window.p6_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}
function draw() {
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity3.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity3.x += 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    camera_velocity3.y -= 1;
  }
  if (keyIsDown(UP_ARROW)) {
    camera_velocity3.y += 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity3.add(camera_delta);
  camera_offset3.add(camera_velocity3);
  camera_velocity3.mult(0.95); // cheap easing
  if (camera_velocity3.mag() < 0.01) {
    camera_velocity3.setMag(0);
  }

  let world_pos = screenToWorld(
    [0 - mouseX, mouseY],
    [camera_offset3.x, camera_offset3.y]
  );
  let world_offset = cameraToWorldOffset([camera_offset3.x, camera_offset3.y]);


  background(0);




  if (window.p6_drawBefore) {
    window.p6_drawBefore();
  }

  let overdraw = 0.1;

  let y0 = Math.floor((0 - overdraw) * tile_rows3);
  let y1 = Math.floor((1 + overdraw) * tile_rows3);
  let x0 = Math.floor((0 - overdraw) * tile_columns3);
  let x1 = Math.floor((1 + overdraw) * tile_columns3);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
        camera_offset3.x,
        camera_offset3.y
      ]); // odd row
    }
    for (let x = x0; x < x1; x++) {
      drawTile(
        tileRenderingOrder([
          x + 0.5 + world_offset.x,
          y + 0.5 - world_offset.y
        ]),
        [camera_offset3.x, camera_offset3.y]
      ); // even rows are offset horizontally
    }
  }

  describeMouseTile(world_pos, [camera_offset3.x, camera_offset3.y]);

  if (window.p6_drawAfter) {
    window.p6_drawAfter();
  }
}

// Display a discription of the tile at world_x, world_y.
function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p6_drawSelectedTile) {
    window.p6_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y]) {
  let [screen_x, screen_y] = worldToScreen(
    [world_x, world_y],
    [camera_x, camera_y]
  );
  push();
  translate(0 - screen_x, screen_y);
  if (window.p6_drawTile) {
    window.p6_drawTile(world_x, world_y, -screen_x, screen_y);
  }
  pop();
}
