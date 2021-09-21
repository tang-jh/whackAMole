const keymap = {
  q: { player: "p1", tile: 0 },
  w: { player: "p1", tile: 1 },
  e: { player: "p1", tile: 2 },
  a: { player: "p1", tile: 3 },
  s: { player: "p1", tile: 4 },
  d: { player: "p1", tile: 5 },
  z: { player: "p1", tile: 6 },
  x: { player: "p1", tile: 7 },
  c: { player: "p1", tile: 8 },
  i: { player: "p1", tile: 0 },
  o: { player: "p1", tile: 1 },
  p: { player: "p1", tile: 2 },
  k: { player: "p1", tile: 3 },
  l: { player: "p1", tile: 4 },
  ";": { player: "p1", tile: 5 },
  ",": { player: "p1", tile: 6 },
  ".": { player: "p1", tile: 7 },
  "/": { player: "p1", tile: 8 },
};

let q = "g";

console.log(keymap[q] ? keymap[q] : "Wrong key");
