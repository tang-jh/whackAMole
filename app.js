const main = () => {
  // Methods
  const startGame = (players, difficulty) => {
    //(playerName, gameMode)
    // Init game data
    game.timeLeft = 10;
    game.gameMode = difficulty;
    game.lastSprint = 5;

    player1.name = $player1name.val() || "Player-1";
    player1.score = 0;
    player1.missed = 0;

    player2.name = $player2name.val() || "Player-2";
    player2.score = 0;
    player2.missed = 0;

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

    renderGameScreen(players);

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
      $tiles.on("mousedown", hammerClick(tileOccupancy, game.gameMode));
      $(document).on("keydown", hammerPress());
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

  const buttonSelection = (target, commonClass, addedClass) => {
    const $siblings = target.parent().children();
    if (target.attr("class") === commonClass) {
      for (let i = 0; i < $siblings.length; i++) {
        if ($siblings.eq(i) !== target.attr("id")) {
          $siblings.eq(i).removeClass(addedClass);
        }
        target.addClass(addedClass);
      }
    }
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

  const moleTrigger = (occupancy, difficulty) => {
    if (game.timeLeft > TRIGGERBUFFER) {
      console.log("moleTrigger called");
      let duration = randomMinMax(
        game.modeSetting[difficulty].duration.min,
        game.modeSetting[difficulty].duration.max
      );
      let delay = randomMinMax(
        game.modeSetting[difficulty].delay.min,
        game.modeSetting[difficulty].delay.max
      );
      setTimeout(() => {
        moleUp(duration, occupancy, difficulty);
      }, delay);
    } else if (game.timeLeft <= TRIGGERBUFFER) {
      return;
    }
  };

  const moleUp = (duration, occupancy, difficulty) => {
    console.log("moleup called");
    let tileId = randomTileId(occupancy);
    if (tileId === false) {
      return;
    }
    occupancy[tileId] = OCCUPIED;
    console.log(occupancy);
    renderGameBoard(tileId, UP); //refactor
    setTimeout(() => {
      moleDown(tileId, occupancy, difficulty);
    }, duration);

    console.log("-------------");
  };

  const moleDown = (tileId, occupancy, difficulty) => {
    console.log("moleDown called");
    occupancy[tileId] = FREE;
    console.log(occupancy);
    renderGameBoard(tileId, DOWN);
    moleTrigger(occupancy, difficulty);
    console.log("-------------");
  };

  const hammerClick = (occupancy, difficulty) => (e) => {
    console.log("hammerClick called");
    const $target = $(e.currentTarget);
    // if ($target.hasClass(UP)) {
    //   const tileId = $target.attr("id");
    //   if (provokeMole(game.modeSetting[mode].provokeChance)) {
    //     console.log("PROVOKED MOLE");
    //     moleTrigger(occupancy, mode);
    //   }
    //   renderGameBoard(tileId, HIT);
    //   setTimeout(() => {
    //     renderGameBoard(tileId, UNHIT);
    //     occupancy[tileId] = FREE;
    //   }, 500);
    //   game.score++;
    //   renderScore(game.score);
    // } else if (!$target.hasClass(HIT)) {
    //   game.missed++;
    // }
  };

  const hammerCheck = (target, player, occupancy, difficulty) => {
    if (target.hasClass(UP)) {
      const tileId = target.attr("id");
      if (provokeMole(game.modeSetting[difficulty].provokeChance)) {
        console.log("PROVOKED MOLE");
        moleTrigger(occupancy, difficulty);
      }
      renderGameBoard(tileId, HIT);
      setTimeout(() => {
        renderGameBoard(tileId, UNHIT);
        occupancy[tileId] = FREE;
      }, 500);
      game.score++;
      renderScore(game.score);
    } else if (!target.hasClass(HIT)) {
      game.missed++;
    }
  };

  // const hammerPress = (keymap) => (e) => {
  //   console.log(e.key);
  //   if (keymap[e.key]) {
  //   }
  // };

  // Rendering methods
  const renderNameInput = (playermode) => {
    if (playermode === SINGLEPLAYER) {
      $p1Input.addClass("on-screen").removeClass("off-screen");
      $p2Input.addClass("off-screen").removeClass("on-screen");
    } else if (playermode === TWOPLAYER) {
      $p1Input.addClass("on-screen").removeClass("off-screen");
      $p2Input.addClass("on-screen").removeClass("off-screen");
    }
  };

  const renderStartScreen = () => {
    $gameOver.toggleClass("on-screen off-screen");
    $startScreen.toggleClass("on-screen off-screen");
  };

  const renderOptionsNotSelected = (target) => {
    $(target).addClass(EMPTYOPTIONS);
    setTimeout(() => {
      $(target).removeClass(EMPTYOPTIONS);
    }, 100);
  };

  const renderGameScreen = (players) => {
    $startScreen.toggleClass("on-screen off-screen");
    $gameScreen.toggleClass("on-screen off-screen");
    if (players === SINGLEPLAYER) {
      console.log("Singleplayer");
      $p2HUD.removeClass("on-screen").addClass("off-screen");
      $p1NameDisplay.text(player1.name);
      $p1ScoreDisplay.text(player1.score);
    } else if (players === TWOPLAYER) {
      console.log("Twoplayers");
      $p2HUD.removeClass("off-screen").addClass("on-screen");
      $p1NameDisplay.text(player1.name);
      $p1ScoreDisplay.text(player1.score);
      $p2NameDisplay.text(player2.name);
      $p2ScoreDisplay.text(player2.score);
    }
    $timer.text(game.timeLeft);
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
    timeLeft: 60,
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

  const player1 = {
    name: "",
    score: 0,
    missed: 0,
  };

  const player2 = {
    name: "",
    score: 0,
    missed: 0,
  };
  // Enum values
  const OCCUPIED = 1;
  const FREE = 0;
  const TRIGGERBUFFER = 2;
  const UP = "up";
  const DOWN = "down";
  const HIT = "hit";
  const UNHIT = "unhit";
  const PLAYERMODEBUTTONS = "playermode";
  const PLAYERMODESELECT = "player-select";
  const SINGLEPLAYER = "btn-1p";
  const TWOPLAYER = "btn-2p";
  const DIFFICULTYBUTTONS = "difficulty";
  const DIFFICULTYSELECT = "pushed";
  const EMPTYOPTIONS = "absent";

  // Keymapping
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
    i: { player: "p2", tile: 0 },
    o: { player: "p2", tile: 1 },
    p: { player: "p2", tile: 2 },
    k: { player: "p2", tile: 3 },
    l: { player: "p2", tile: 4 },
    ";": { player: "p2", tile: 5 },
    ",": { player: "p2", tile: 6 },
    ".": { player: "p2", tile: 7 },
    "/": { player: "p2", tile: 8 },
  };

  //* Define element hooks
  // Start screen
  const $p1Input = $("#p1-input");
  const $p2Input = $("#p2-input");
  const $player1name = $("#input-player1name");
  const $player2name = $("#input-player2name");
  const $p1NameDisplay = $("#player1-name");
  const $p1ScoreDisplay = $("#player1-score");
  const $p2HUD = $("#player2HUD");
  const $p2NameDisplay = $("#player2-name");
  const $p2ScoreDisplay = $("#player2-score");
  const $playerModes = $(".playermode");
  const $difficulty = $(".difficulty");
  const $play = $("#btn-play");
  // Game screen
  const $tiles = $(".tile");
  const $timer = $("#timer");
  const $score = $("#score");
  const $startScreen = $("#start-screen");
  const $gameScreen = $("#game-screen");
  const $preCountdown = $("#pre-countdown");
  const $warmup = $("#warm-up");
  // Game over
  const $gameOver = $("#game-over");
  const $nameReport = $("#name-report");
  const $scoreReport = $("#score-report");
  const $accuracyReport = $("#accuracy-report");
  const $playAgain = $("#play-again");

  $playerModes.on("click", (e) => {
    const $target = $(e.currentTarget);
    buttonSelection($target, PLAYERMODEBUTTONS, PLAYERMODESELECT);
    renderNameInput($target.attr("id"));
  });

  $difficulty.on("click", (e) => {
    buttonSelection($(e.currentTarget), DIFFICULTYBUTTONS, DIFFICULTYSELECT);
  });

  $play.on("click", () => {
    const difficulty = $(".pushed").attr("id");
    const playermode = $(".player-select").attr("id");
    if (playermode === undefined) {
      renderOptionsNotSelected($(".playermode"));
      return;
    }
    if (difficulty === undefined) {
      renderOptionsNotSelected($(".difficulty"));
      return;
    }
    console.log(`player: ${playermode}, difficulty: ${difficulty}`);
    startGame(playermode, difficulty);
  });

  $playAgain.on("click", () => {
    renderStartScreen();
  });
};

$(main);
