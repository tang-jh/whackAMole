const main = () => {
  // Methods
  const startGame = () => {
    //(playerName, gameMode)
    moleTrigger();
  };

  const endGame = () => {};

  const randomMinMax = (min, max) => {
    // Generates a random value between defined min, max
    return Math.ceil(Math.random() * (max - min)) + min;
  };

  const moleTrigger = () => {
    console.log("moleTrigger called");
    //set random duration between 0.5-2.0s
    let duration = randomMinMax(500, 2000);
    //set delay in 0.1s divisions between 0.3-2.0s
    let delay = randomMinMax(300, 2000);
    setTimeout(moleUp(duration), delay);
  };

  const moleUp = (duration) => () => {
    console.log("moleup called");
    const tileId = Math.floor(Math.random() * 9); //gridsize variable
    // $tiles.eq(tileId).addClass("up");
    renderGameBoard(tileId, "up");
    setTimeout(moleDown(tileId), duration);
    console.log("-------------");
  };

  const moleDown = (tileId) => () => {
    console.log("moleDown called");
    // $tiles.eq(tileId).removeClass("up");
    renderGameBoard(tileId, "down");
    moleTrigger();
    console.log("-------------");
  };

  const hammerPress = (e) => {
    console.log("hammerPress called");
    if ($(e.currentTarget).hasClass("up")) {
      // $(e.currentTarget).addClass("hit").removeClass("up");
      const tileId = $(e.currentTarget).attr("id");
      renderGameBoard(tileId, "hit");
      setTimeout(() => {
        $(e.currentTarget).removeClass("hit");
      }, 200);
      score++;
      renderScore(score);
    } else if (!$(e.currentTarget).hasClass("hit")) {
      missed++;
      console.log(randomMinMax(500, 2000));
    }
    console.log(`Score: ${score} \r Missed: ${missed}`); //* __remove__
  };

  // Rendering methods
  const renderStartScreen = () => {};
  const renderGameScreen = (gameMode, player) => {};
  const renderScore = (score) => {
    $score.text(score);
  };
  const renderGameBoard = (id, state) => {
    if (state === "up") {
      $(`#${id}`).addClass("up");
      console.log("renderGameboard up");
    } else if (state === "down") {
      $(`#${id}`).removeClass("up");
      console.log("renderGameboard down");
    } else if (state === "hit") {
      $(`#${id}`).addClass("hit").removeClass("up");
      console.log("renderGameboard hit");
    } else if (state === "hit") {
      $(`#${id}`).removeClass("unhit");
      console.log("renderGameboard unhit");
    }
  };
  const renderTimer = () => {};
  const renderGameOver = () => {};

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
  const $tiles = $(".tile");
  const $score = $("#score");

  startGame();

  $tiles.on("mousedown", hammerPress);
};

$(main);
