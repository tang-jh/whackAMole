const arr = ["down", "down", "down"];

const moleTrigger = () => {
  let duration = Math.ceil(Math.random() * 15) * 100 + 500; //duration in between 0.5-2.0s
  let delay = Math.ceil(Math.random() * 17) * 100 + 300; //duration in 0.1s divisions between 0.3-2.0s
  setTimeout(moleUp(duration), delay);
};

const moleUp = (duration) => () => {
  const tileId = Math.floor(Math.random() * 3);
  arr[tileId] = "up";
  console.log(arr);
  setTimeout(moleDown(tileId), duration);
};

const moleDown = (tileId) => () => {
  arr[tileId] = "down";
  console.log(arr);
  moleTrigger();
};

moleTrigger();
