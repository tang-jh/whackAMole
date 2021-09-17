const main = () => {
  // Init data
  const grid = {
    id: "",
    state: "",
    duration: "",
  };
  let playerName = "";
  let timer = 60;
  let score = 0;
  let missed = 0;
  let gameMode = "";

  //   Define element hooks
  const $playername = $("#input-playername");
  const $easy = $("#btn-easy");
  const $normal = $("#btn-normal");
  const $hard = $("#btn-hard");
  const $play = $("#btn-play");
  let $tiles = $(".tile");

  // Methods
  const startGame = () => {
    //(playerName, gameMode)
    moleTrigger();
  };

  const endGame = () => {};

  const moleTrigger = () => {
    console.log("moleTrigger called");
    //set random duration between 0.5-2.0s
    let duration = Math.ceil(Math.random() * 15) * 100 + 500;
    //set delay in 0.1s divisions between 0.3-3.0s
    let delay = Math.ceil(Math.random() * 30) * 100;
    setTimeout(moleUp(duration), delay);
  };

  const moleUp = (duration) => () => {
    console.log("moleup called");
    const tileId = Math.floor(Math.random() * 3); //gridsize variable
    console.log(tileId);
    $tiles.eq(tileId).addClass("up");
    renderGameScreen();
    setTimeout(moleDown(tileId), duration);
    console.log("-------------");
  };

  const moleDown = (tileId) => () => {
    console.log("moleDown called");
    $tiles.eq(tileId).removeClass("up");
    moleTrigger();
    console.log("-------------");
  };

  const hammerPress = () => {
    console.log("hammerPress called");
    if ($(e.currentTarget).hasClass("up")) {
      $(e.currentTarget).addClass("hit");
      setTimeout(() => {
        $(e.currentTarget).removeClass("hit");
      }, 100);
      score++;
      renderScore();
    } else if (!$(e.currentTarget).hasClass("hit")) {
      missed++;
    }
  };

  // Rendering methods
  const renderStartScreen = () => {};
  const renderGameScreen = (gameMode, player) => {};
  const renderGameBoard = (id, state) => {
    if (state === "up") {
      $tiles.eq[id].addClass("up");
    } else if (state === "down") {
      $tiles.eq[id].removeClass("up");
    } else if (state === "hit") {
      $tiles.eq[id].addClass("hit");
    }
  };
  const renderTimer = () => {};
  const renderGameOver = () => {};

  startGame();
};

$(main);
