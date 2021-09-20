const provokeMole = (percent) => {
  // set chance of provoking a new mole
  if (Math.ceil(Math.random() * 100) < percent) {
    return true;
  } else {
    return false;
  }
};

let total = 0;
for (let i = 0; i < 100; i++) {
  if (provokeMole(50)) {
    total++;
  }
}

console.log(total);
