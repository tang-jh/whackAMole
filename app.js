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
    game.lastSprint = 5;

    const tileOccupancy = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };

    // Set duration and delay min and max value based on difficulty
    // if (game.gameMode === "btn-easy") {
    //   game.duration.min = 500;
    //   game.duration.max = 2000;
    //   game.delay.min = 500;
    //   game.delay.max = 2000;
    //   game.provokeChance = 10;
    // } else if (game.gameMode === "btn-normal") {
    //   game.duration.min = 400;
    //   game.duration.max = 1000;
    //   game.delay.min = 400;
    //   game.delay.max = 1000;
    //   game.provokeChance = 20;
    // } else if (game.gameMode === "btn-hard") {
    //   game.duration.min = 300;
    //   game.duration.max = 600;
    //   game.delay.min = 300;
    //   game.delay.max = 600;
    //   game.provokeChance = 50;
    // }

    renderGameScreen();

    let preTime = 3;
    let preCounter = setInterval(() => {
      if (preTime > 0) {
        renderPreCountdown(preTime);
        preTime--;
      } else if (preTime === 0) {
        renderPreCountdown(preTime);
        gameRun();
        clearInterval(preCounter);
      }
    }, 1000);

    const gameRun = () => {
      // Set time limit and start game engine
      moleTrigger(tileOccupancy, game.gameMode);
      $tiles.on("mousedown", hammerPress(tileOccupancy, game.gameMode));
      // let countdownRef;
      let countdownRef = setInterval(() => {
        console.log(`timeTrack called. Time: ${game.timeLeft}`);
        if (game.timeLeft > game.lastSprint) {
          game.timeLeft--;
          renderTimer("normal");
        } else if (game.timeLeft > 0 && game.timeLeft <= game.lastSprint) {
          game.timeLeft--;
          renderTimer("hurry");
        } else if (game.timeLeft === 0) {
          renderGameOver();
          clearInterval(countdownRef);
        }
      }, 1000);
    };
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

  const provokeMole = (percent) => {
    // set chance of provoking a new mole
    return Math.ceil(Math.random() * 100) < percent;
  };

  const moleTrigger = (occupancy, mode) => {
    if (game.timeLeft > TRIGGERBUFFER) {
      console.log("moleTrigger called");
      let duration = randomMinMax(
        game.modeSetting[mode].duration.min,
        game.modeSetting[mode].duration.max
      );
      let delay = randomMinMax(
        game.modeSetting[mode].delay.min,
        game.modeSetting[mode].delay.max
      );
      setTimeout(() => {
        moleUp(duration, occupancy, mode);
      }, delay);
    } else if (game.timeLeft <= TRIGGERBUFFER) {
      return;
    }
  };

  const moleUp = (duration, occupancy, mode) => {
    console.log("moleup called");
    let tileId = randomTileId(occupancy);
    if (tileId === false) {
      return;
    }
    occupancy[tileId] = OCCUPIED;
    console.log(occupancy);
    renderGameBoard(tileId, UP); //refactor
    setTimeout(() => {
      moleDown(tileId, occupancy, mode);
    }, duration);

    console.log("-------------");
  };

  const moleDown = (tileId, occupancy, mode) => {
    console.log("moleDown called");
    occupancy[tileId] = FREE;
    console.log(occupancy);
    renderGameBoard(tileId, DOWN);
    moleTrigger(occupancy, mode);
    console.log("-------------");
  };

  const hammerPress = (occupancy, mode) => (e) => {
    console.log("hammerPress called");
    const $target = $(e.currentTarget);
    if ($target.hasClass(UP)) {
      const tileId = $target.attr("id");
      if (provokeMole(game.modeSetting[mode].provokeChance)) {
        console.log("PROVOKED MOLE");
        moleTrigger(occupancy, mode);
      }
      renderGameBoard(tileId, HIT);
      setTimeout(() => {
        renderGameBoard(tileId, UNHIT);
        occupancy[tileId] = FREE;
      }, 500);
      game.score++;
      renderScore(game.score);
    } else if (!$target.hasClass(HIT)) {
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

  const renderPreCountdown = (secs) => {
    const displayTime = 1;
    if (secs > displayTime) {
      $warmup.removeClass("off-screen");
      $preCountdown.text(secs - displayTime);
    } else if (secs === displayTime) {
      $warmup.removeClass("off-screen");
      $preCountdown.text("Go!");
    } else if (secs === 0) {
      $warmup.addClass("off-screen");
    }
  };

  const renderScore = (score) => {
    $score.text(score);
  };
  const renderGameBoard = (id, state) => {
    if (state === UP) {
      $(`#${id}`).addClass(UP);
      console.log("renderGameboard up");
    } else if (state === DOWN) {
      $(`#${id}`).removeClass(UP);
      console.log("renderGameboard down");
    } else if (state === HIT) {
      $(`#${id}`).addClass(HIT).removeClass(UP);
      console.log("renderGameboard hit");
    } else if (state === UNHIT) {
      $(`#${id}`).removeClass(HIT);
      console.log("renderGameboard unhit");
    }
  };
  const renderTimer = (state) => {
    $timer.attr("class", state).text(game.timeLeft);
  };
  const renderGameOver = () => {
    const accuracy =
      game.score === 0 && game.missed === 0
        ? 0
        : (game.score / (game.score + game.missed)) * 100;
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
    modeSetting: {
      "btn-easy": {
        duration: {
          min: 500,
          max: 2000,
        },
        delay: {
          min: 500,
          max: 2000,
        },
        provokeChance: 10,
      },
      "btn-normal": {
        duration: {
          min: 400,
          max: 1000,
        },
        delay: {
          min: 400,
          max: 1000,
        },
        provokeChance: 20,
      },
      "btn-hard": {
        duration: {
          min: 300,
          max: 600,
        },
        delay: {
          min: 300,
          max: 600,
        },
        provokeChance: 50,
      },
    },
    lastSprint: 5,
  };
  // Enum values
  const OCCUPIED = 1;
  const FREE = 0;
  const TRIGGERBUFFER = 2;
  const UP = "up";
  const DOWN = "down";
  const HIT = "hit";
  const UNHIT = "unhit";

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
  const $preCountdown = $("#pre-countdown");
  const $warmup = $("#warm-up");
  const $gameOver = $("#game-over");
  const $nameReport = $("#name-report");
  const $scoreReport = $("#score-report");
  const $accuracyReport = $("#accuracy-report");
  const $playAgain = $("#play-again");

  $modes.on("click", (e) => {
    const $target = $(e.currentTarget);
    const $siblings = $target.parent().children();
    if ($target.attr("class") === "mode") {
      for (let i = 0; i < $siblings.length; i++) {
        if ($siblings.eq(i) !== $target.attr("id")) {
          $siblings.eq(i).removeClass("pushed");
        }
        $target.addClass("pushed");
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
