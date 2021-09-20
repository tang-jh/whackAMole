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
    const tileOccupancy = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    // Set duration and delay min and max value based on difficulty
    if (game.gameMode === "btn-easy") {
      game.duration.min = 500;
      game.duration.max = 2000;
      game.delay.min = 500;
      game.delay.max = 2000;
    } else if (game.gameMode === "btn-normal") {
      game.duration.min = 400;
      game.duration.max = 1000;
      game.delay.min = 300;
      game.delay.max = 1000;
    } else if (game.gameMode === "btn-hard") {
      game.duration.min = 200;
      game.duration.max = 600;
      game.delay.min = 100;
      game.delay.max = 600;
    }

    renderGameScreen();

    console.log(`playername = ${game.playerName}`);
    console.log(`gamemode = ${mode}`);

    // Set time limit and start game engine
    moleTrigger(tileOccupancy);
    $tiles.on("mousedown", hammerPress(tileOccupancy));
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
        renderGameOver();
        clearInterval(countdownRef);
      }
    }, 1000);
  };

  const randomMinMax = (min, max) => {
    // Generates a random value between defined min, max
    return Math.ceil(Math.random() * (max - min)) + min;
  };

  const randomTileId = (occupancy) => {
    if (
      Object.values(occupancy).every((item) => {
        item === 1;
      })
    ) {
      return false;
    }
    let vacant = Object.keys(occupancy);
    const tileId = vacant[Math.floor(Math.random() * vacant.length)];
    return tileId;
  };

  const moleTrigger = (occupancy) => {
    if (game.timeLeft > 2) {
      console.log("moleTrigger called");
      let duration = randomMinMax(game.duration.min, game.duration.max);
      let delay = randomMinMax(game.delay.min, game.delay.max);
      setTimeout(() => {
        moleUp(duration, occupancy);
      }, delay);
    } else if (game.timeLeft <= 2) {
      return;
    }
  };

  const moleUp = (duration, occupancy) => {
    console.log("moleup called");
    let tileId = randomTileId(occupancy);
    occupancy[tileId] = 1;
    console.log(occupancy);
    renderGameBoard(tileId, "up");
    setTimeout(() => {
      moleDown(tileId, occupancy);
    }, duration);

    console.log("-------------");
  };

  const moleDown = (tileId, occupancy) => {
    console.log("moleDown called");
    occupancy[tileId] = 0;
    console.log(occupancy);
    renderGameBoard(tileId, "down");
    moleTrigger(occupancy);
    console.log("-------------");
  };

  const hammerPress = (occupancy) => (e) => {
    console.log("hammerPress called");
    if ($(e.currentTarget).hasClass("up")) {
      const tileId = $(e.currentTarget).attr("id");
      if (Math.ceil(Math.random() * 10) > 8) {
        moleTrigger(occupancy);
      }
      renderGameBoard(tileId, "hit");
      setTimeout(() => {
        renderGameBoard(tileId, "unhit");
        occupancy[tileId] = 0;
      }, 500);
      game.score++;
      renderScore(game.score);
    } else if (!$(e.currentTarget).hasClass("hit")) {
      game.missed++;
    }
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
      $(`#${id}`).addClass("up").removeClass("retreat");
      // console.log("renderGameboard up");
    } else if (state === "down") {
      $(`#${id}`).removeClass("up").addClass("retreat");
      // console.log("renderGameboard down");
    } else if (state === "hit") {
      $(`#${id}`).addClass("hit").removeClass("up");
      // console.log("renderGameboard hit");
    } else if (state === "unhit") {
      $(`#${id}`).removeClass("hit");
      // console.log("renderGameboard unhit");
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
