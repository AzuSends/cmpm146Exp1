/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Grand Central Terminal",
      assetUrl: "https://64.media.tumblr.com/92dab45e04a35688a669e876c47b0add/a9099dc34dc80b8c-ce/s1280x1920/eeee08201a7bc76178af05851dd99bb8ab35cb96.jpg",
      credit: "Alfred Stieglitz, Grand Central Terminal, 1930"
    },
    {
      name: "Earthrise",
      assetUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/NASA-Apollo8-Dec24-Earthrise.jpg/960px-NASA-Apollo8-Dec24-Earthrise.jpg",
      credit: " William Anders, Apollo 8 Moon Landing Site, 1968"
    },
    {
      name: "Tank Man",
      assetUrl: "https://cdn.cnn.com/cnn/interactive/2019/05/world/tiananmen-square-tank-man-cnnphotos/media/01.jpg",
      credit: "Jeff Widener, Beijing, 1989"
    },
    {
      name: "Chicken Jockey",
      assetUrl: "https://static01.nyt.com/images/2025/04/12/multimedia/10cul-chicken-jockey-vqlf/10cul-chicken-jockey-vqlf-googleFourByThree.jpg",
      credit: "Minecraft Movie, 2025"
    },
  ];
}

function initDesign(inspiration) {

  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  let design = {
    bg: 128,
    fg: []
  }

  for (let i = 0; i < 2000; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      diam: random((width + height) / 16),
      fill: random(255),
      opacity: random(255)
    })
  }
  return design;
}

function renderDesign(design, inspiration, buffer, type) {
  if (type == 0) {
    buffer.noStroke();
    buffer.background(design.bg);
    for (let circle of design.fg) {
      buffer.fill(circle.fill, circle.opacity)
      buffer.ellipse(circle.x, circle.y, circle.diam, circle.diam, 5);
    }
  }
  else {
    noStroke();
    background(design.bg);
    for (let circle of design.fg) {
      fill(circle.fill, circle.opacity)
      ellipse(circle.x, circle.y, circle.diam, circle.diam, 5);
    }
  }

}

function mutateDesign(design, inspiration, rate, vals, type) {
  if (vals == 0) { design.bg = mut(design.bg, 0, 255, rate, 2); }
  else {
    let rand = Math.floor(random(1, 4))
    let iter = 0;
    if (rand == 1) {
      iter += 1
      rand = 2;
    }
    for (let circle of design.fg) {
      iter += 1;
      if (iter % rand != 0) {
        continue;
      }
      if (vals == 1) { circle.x = mut(circle.x, 0, width, rate, type); }
      else if (vals == 2) { circle.y = mut(circle.y, 0, height, rate, type); }
      else if (vals == 3) { circle.diam = mut(circle.diam, 0, (width + height) / 16, rate, type); }
      else if (vals == 4) { circle.fill = mut(circle.fill, 0, 255, rate, type); }
      else if (vals == 5) { circle.opacity = mut(circle.opacity, 0, 255, rate, type); }
    }
  }
}

function mut(num, min, max, rate, type) {
  if (type < .15) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, num + (num / 2));
  }
  else if (type > .85) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), num - (num / 2), max);
  }
  else {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
  }
}

function isPrime(rangeMin, rangeMax, num) {
  for (let i = rangeMin; i < rangeMax; i++) {
    if (num % i == 0) {
      return false;
    }
  }
  return true;
}