const main = () => {
  // Methods
  const startGame = (name, mode) => {
    //(playerName, gameMode)
    // Init game data
    game.playerName = name || "Player 1";
    game.timeLeft = 10;
    game.score = 0;
    game.missed = 0;
    game.gameMode = mode;

    // Set duration and delay min and max value based on difficulty
    if (game.gameMode === "btn-easy") {
      console.log(`set easy`);
      game.duration.min = 500;
      game.duration.max = 2000;
      game.delay.min = 500;
      game.delay.max = 2000;
    } else if (game.gameMode === "btn-normal") {
      console.log(`set normal`);
      game.duration.min = 200;
      game.duration.max = 1000;
      game.delay.min = 300;
      game.delay.max = 1000;
    } else if (game.gameMode === "btn-hard") {
      console.log(`set hard`);
      game.duration.min = 150;
      game.duration.max = 600;
      game.delay.min = 100;
      game.delay.max = 600;
    }

    renderGameScreen();

    console.log(`playername = ${game.playerName}`);
    console.log(`gamemode = ${mode}`);

    // Set time limit and start game engine
    moleTrigger();
    $tiles.on("mousedown", hammerPress);
    // let countdownRef;
    let countdownRef = setInterval(() => {
      console.log(`timeTrack called. Time: ${game.timeLeft}`);
      if (game.timeLeft > 6) {
        game.timeLeft--;
        renderTimer("normal");
      } else if (game.timeLeft > 0 && game.timeLeft <= 6) {
        game.timeLeft--;
        renderTimer("hurry");
      } else if (game.timeLeft === 0) {
        console.log(`timeTrack end. timeLeft = ${game.timeLeft}`);
        renderGameOver();
        clearInterval(countdownRef);
      }
    }, 1000);
  };

  const randomMinMax = (min, max) => {
    // Generates a random value between defined min, max
    return Math.ceil(Math.random() * (max - min)) + min;
  };

  const moleTrigger = () => {
    if (game.timeLeft > 2) {
      console.log("moleTrigger called");
      let duration = randomMinMax(game.duration.min, game.duration.max);
      let delay = randomMinMax(game.delay.min, game.delay.max);
      setTimeout(moleUp(duration), delay);
    } else if (game.timeLeft <= 2) {
      return;
    }
  };

  const moleUp = (duration) => () => {
    console.log("moleup called");
    const tileId = Math.floor(Math.random() * 9);
    renderGameBoard(tileId, "up");
    setTimeout(moleDown(tileId), duration);
    console.log("-------------");
  };

  const moleDown = (tileId) => () => {
    console.log("moleDown called");
    renderGameBoard(tileId, "down");
    moleTrigger();
    console.log("-------------");
  };

  const hammerPress = (e) => {
    console.log("hammerPress called");
    if ($(e.currentTarget).hasClass("up")) {
      const tileId = $(e.currentTarget).attr("id");
      if (Math.ceil(Math.random() * 10) > 8) {
        moleTrigger();
      }
      renderGameBoard(tileId, "hit");
      setTimeout(() => {
        $(e.currentTarget).removeClass("hit");
      }, 200);
      game.score++;
      renderScore(game.score);
    } else if (!$(e.currentTarget).hasClass("hit")) {
      game.missed++;
    }
    console.log(`Score: ${game.score} \r Missed: ${game.missed}`); //* __remove__
  };

  // Rendering methods
  const renderStartScreen = () => {
    $gameOver.toggleClass("on-screen off-screen");
    $startScreen.toggleClass("on-screen off-screen");
  };
  const renderGameScreen = () => {
    $startScreen.toggleClass("on-screen off-screen");
    $gameScreen.toggleClass("on-screen off-screen");
    $timer.text(game.timeLeft);
    $score.text(game.score);
  };
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
  const renderTimer = (state) => {
    $timer.attr("class", state).text(game.timeLeft);
  };
  const renderGameOver = () => {
    const accuracy = (game.score / (game.score + game.missed)) * 100;
    $nameReport.text(game.playerName);
    $scoreReport.text(game.score);
    $accuracyReport.text(accuracy.toFixed(1));
    $gameScreen.toggleClass("on-screen off-screen");
    $gameOver.toggleClass("on-screen off-screen");
  };

  // Game data
  const game = {
    playerName: "",
    timeLeft: 60,
    score: 0,
    missed: 0,
    gameMode: "",
    duration: {
      min: 500,
      max: 2000,
    },
    delay: {
      min: 500,
      max: 2000,
    },
  };

  //   Define element hooks
  const $playername = $("#input-playername");
  const $modes = $(".mode");
  // const $easy = $("#btn-easy");
  // const $normal = $("#btn-normal");
  // const $hard = $("#btn-hard");
  const $play = $("#btn-play");
  const $tiles = $(".tile");
  const $timer = $("#timer");
  const $score = $("#score");
  const $startScreen = $("#start-screen");
  const $gameScreen = $("#game-screen");
  const $gameOver = $("#game-over");
  const $nameReport = $("#name-report");
  const $scoreReport = $("#score-report");
  const $accuracyReport = $("#accuracy-report");
  const $playAgain = $("#play-again");

  $modes.on("click", (e) => {
    if ($(e.currentTarget).attr("class") === "mode") {
      for (let i = 0; i < $(e.currentTarget).parent().children().length; i++) {
        if (
          $(e.currentTarget).parent().children().eq(i) !==
          $(e.currentTarget).attr("id")
        ) {
          $(e.currentTarget).parent().children().eq(i).removeClass("pushed");
        }
        $(e.currentTarget).addClass("pushed");
      }
    }
  });

  $play.on("click", () => {
    const mode = $(".pushed").attr("id");
    startGame($playername.val(), mode);
  });

  $playAgain.on("click", () => {
    renderStartScreen();
  });
};

$(main);
