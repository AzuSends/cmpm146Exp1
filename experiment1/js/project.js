// project.js - A simple fantasy combat generator
// Author: Ben Silver
// Date: 4/8/25


const fillers = {
  weapon: [
    "Greatsword",
    "Rapier",
    "Longsword",
    "Dagger",
    "Mace",
    "Hammer",
    "Scimitar",
    "Scythe",
    "Shardblade",
  ],
  action: [
    "rush",
    "fall",
    "crash",
    "walk",
  ],
  enemy: [
    "Dragon",
    "Giant",
    "Thunderclast",
    "Great Beast",
  ],
  attack: [
    "striking out",
    "lashing out",
    "cleaving your foe",
  ],
  
  defeat: [
    "collapses under it's own weight and begins to fade to dust",
    "falls, bleeding out, and looks at you defiantly as the light fades from it's eyes",
    "smiles, the darkness finally leaving it's eyes before closing for the last time",
  ],
  
  victory: [
    "feel unsatisfied and begin your long journey out of the beast's lair",
    "somberly pay your respects to the beast, then smile",
    "let out a shout filled with vigor",
    "look around at the corpses of your greatests allies, you fall to your knees, ",
    "smile as cheers erupt from your companions,",
  ],
    
  
};

const template = `You $action towards the $enemy $attack with $weapon in hand! You strike true, dealing a lethal blow.

Your foe $defeat. You $victory blood running down your body.
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
