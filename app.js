const main = () => {
  // Methods
  const startGame = (players, difficulty) => {
    //(playerName, gameMode)
    // Init game data
    game.timeLeft = 30;
    game.difficulty = difficulty;
    game.lastSprint = 5;

    player1.playername = $player1name.val() || "Player-1";
    player1.score = 0;
    player1.missed = 0;

    player2.playername = $player2name.val() || "Player-2";
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

    let preTime = 4;
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
      moleTrigger(tileOccupancy, game.difficulty);
      $tiles.on("mousedown", hammerClick(tileOccupancy, game.difficulty));
      $(document).on(
        "keydown",
        hammerPress(keymap, tileOccupancy, game.difficulty)
      );
      let countdownRef = setInterval(() => {
        console.log(`timeTrack called. Time: ${game.timeLeft}`);
        if (game.timeLeft > game.lastSprint) {
          game.timeLeft--;
          renderTimer();
        } else if (game.timeLeft > 0 && game.timeLeft <= game.lastSprint) {
          game.timeLeft--;
          renderTimer("hurry");
        } else if (game.timeLeft === 0) {
          renderGameOver(players);
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

  const randomTileId = (occupancy, limit) => {
    let filled = 0;
    for (let i = 0; i < 9; i++) {
      if (occupancy[i] === 1) {
        filled++;
      }
    }

    if (filled < limit) {
      let vacant = Object.keys(occupancy);
      const tileId = vacant[Math.floor(Math.random() * vacant.length)];
      return tileId;
    }
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
      const limit = game.modeSetting[difficulty].limit;
      console.log(`moleTrigger limit = ${limit}`);
      setTimeout(() => {
        moleUp(duration, occupancy, difficulty, limit);
      }, delay);
    } else if (game.timeLeft <= TRIGGERBUFFER) {
      return;
    }
  };

  const moleUp = (duration, occupancy, difficulty, limit) => {
    console.log("moleup called");
    // Check occupancy
    let tileId = randomTileId(occupancy, limit);
    console.log(`Checking occupancy. tileId: ${tileId}`);
    if (tileId === false) {
      return;
    }

    // Invoke mole
    occupancy[tileId] = OCCUPIED;
    console.log(occupancy);
    renderGameBoard(tileId, UP);
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
    hammerCheck($target, player1, occupancy, difficulty);
  };

  const hammerPress = (keymap, occupancy, difficulty) => (e) => {
    console.log(`hammerPress called`);
    let player;
    let tile;
    if (keymap[e.key]) {
      if (keymap[e.key].player === P1) {
        player = player1;
      } else if (keymap[e.key].player === P2) {
        player = player2;
      }
      tile = $tiles.eq(keymap[e.key].tile);
      console.log(`hammerPress player ${player}, tile ${tile}`);
    } else {
      return;
    }
    hammerCheck(tile, player, occupancy, difficulty);
  };

  const hammerCheck = (target, player, occupancy, difficulty) => {
    console.log("hammerCheck called");
    if (target.hasClass(UP)) {
      const tileId = target.attr("id");
      if (provokeMole(game.modeSetting[difficulty].provokeChance)) {
        console.log("PROVOKED MOLE");
        moleTrigger(occupancy, difficulty);
      }
      renderGameBoard(tileId, HIT, player.id);
      setTimeout(() => {
        renderGameBoard(tileId, UNHIT);
        occupancy[tileId] = FREE;
      }, 500);
      player.score++;
      console.log(`${player}: ${player.score}`);
      renderScore(player, player.score);
    } else if (!target.hasClass(HIT)) {
      player.missed++;
    }
  };

  // Rendering methods
  const renderHelpScreen = (state) => {
    if (state === OPEN) {
      $helpScreen.addClass(ONSCREEN).removeClass(OFFSCREEN);
    } else if (state === CLOSE) {
      $helpScreen.removeClass(ONSCREEN).addClass(OFFSCREEN);
    }
  };

  const renderNameInput = (playermode) => {
    if (playermode === SINGLEPLAYER) {
      $p1Input.addClass(ONSCREEN).removeClass(OFFSCREEN);
      $p2Input.addClass(OFFSCREEN).removeClass(ONSCREEN);
    } else if (playermode === TWOPLAYER) {
      $p1Input.addClass(ONSCREEN).removeClass(OFFSCREEN);
      $p2Input.addClass(ONSCREEN).removeClass(OFFSCREEN);
    }
  };

  const renderStartScreen = () => {
    $gameOver.toggleClass(`${ONSCREEN} ${OFFSCREEN}`);
    $startScreen.toggleClass(`${ONSCREEN} ${OFFSCREEN}`);
  };

  const renderItemFlash = (target) => {
    $(target).addClass(FLASHCLASS);
    setTimeout(() => {
      $(target).removeClass(FLASHCLASS);
    }, 100);
  };

  const renderGameScreen = (players) => {
    $startScreen.toggleClass("on-screen off-screen");
    $gameScreen.toggleClass("on-screen off-screen");
    if (players === SINGLEPLAYER) {
      console.log("Singleplayer");
      $p2HUD.removeClass(ONSCREEN).addClass(OFFSCREEN);
      $p1NameHUD.text(player1.playername);
      $p1ScoreHUD.text(player1.score);
    } else if (players === TWOPLAYER) {
      console.log("Twoplayers");
      $p2HUD.removeClass(OFFSCREEN).addClass(ONSCREEN);
      $p1NameHUD.text(player1.playername);
      $p1ScoreHUD.text(player1.score);
      $p2NameHUD.text(player2.playername);
      $p2ScoreHUD.text(player2.score);
    }
    $timer.text(game.timeLeft);
  };

  const renderPreCountdown = (secs) => {
    const displayTime = 1;
    if (secs > displayTime) {
      $warmup.removeClass(OFFSCREEN);
      $preCountdown.text(secs - displayTime);
      renderItemFlash($preCountdown);
    } else if (secs === displayTime) {
      $warmup.removeClass(OFFSCREEN);
      $preCountdown.text("Go!");
      renderItemFlash($preCountdown);
    } else if (secs === 0) {
      $warmup.addClass(OFFSCREEN);
    }
  };

  const renderScore = (player, score) => {
    console.log(`renderScore player: ${player}, score ${score}`);
    let $target;
    if (player.id === P1) {
      $target = $p1ScoreHUD;
    } else if (player.id === P2) {
      $target = $p2ScoreHUD;
    }
    console.log($target);
    $target.text(score);
  };

  const renderGameBoard = (id, state, playerId) => {
    if (state === UP) {
      $(`#${id}`).addClass(UP);
      console.log("renderGameboard up");
    }
    if (state === DOWN) {
      $(`#${id}`).removeClass(UP);
      console.log("renderGameboard down");
    }
    if (state === HIT) {
      if (playerId === P1) {
        $(`#${id}`).addClass(`${HIT} ${P1HIT}`).removeClass(UP);
        console.log("renderGameboard P1 hit");
      } else if (playerId === P2) {
        $(`#${id}`).addClass(`${HIT} ${P2HIT}`).removeClass(UP);
        console.log("renderGameboard P2 hit");
      }
    }
    if (state === UNHIT) {
      $(`#${id}`).removeClass(`${HIT} ${P1HIT} ${P2HIT}`);
      console.log("renderGameboard unhit");
    }
  };

  const renderTimer = (state) => {
    if (state === HURRY) {
      $timeDisplay.addClass(HURRY);
      $timer.text(game.timeLeft);
      renderItemFlash($timeDisplay);
    } else {
      $timer.text(game.timeLeft);
    }

    if (game.timeLeft === 0) {
      $timeDisplay.removeClass(HURRY);
    }
  };

  const renderGameOver = (players) => {
    const getAccuracy = (score, missed) => {
      return score === 0 && missed === 0
        ? 0
        : ((score / (score + missed)) * 100).toFixed(1);
    };
    const getPerformance = (score, accuracy) => {
      return ((score * accuracy) / 100).toFixed(1);
    };
    const getWinner = (p1result, p2result) => {
      if (p1result === p2result) {
        return DRAW;
      } else if (p1result > p2result) {
        return P1;
      } else {
        return P2;
      }
    };
    if (players === SINGLEPLAYER) {
      const p1Accuracy = getAccuracy(player1.score, player1.missed);
      const p1Performance = getPerformance(player1.score, p1Accuracy);
      $p1NameReport.text(player1.playername);
      $p1ScoreReport.text(player1.score);
      $p1AccuracyReport.text(p1Accuracy);
      $p1PerformanceReport.text(p1Performance);
      $p2ReportContainer.addClass(OFFSCREEN);
    } else if (players === TWOPLAYER) {
      const p1Accuracy = getAccuracy(player1.score, player1.missed);
      const p1Performance = getPerformance(player1.score, p1Accuracy);
      const p2Accuracy = getAccuracy(player2.score, player2.missed);
      const p2Performance = getPerformance(player2.score, p2Accuracy);
      const winner = getWinner(p1Performance, p2Performance);

      if (winner === DRAW) {
        $p1Win
          .removeClass(`${WINNER} ${OFFSCREEN}`)
          .addClass(`${DRAW} ${ONSCREEN}`)
          .text("DRAW");
        $p2Win
          .removeClass(`${WINNER} ${OFFSCREEN}`)
          .addClass(`${DRAW} ${ONSCREEN}`)
          .text("DRAW");
      } else if (winner === P1) {
        $p1Win
          .removeClass(`${DRAW} ${OFFSCREEN}`)
          .addClass(`${WINNER} ${ONSCREEN}`)
          .text("WINNER!");
        $p2Win.attr("class", "").text("");
      } else if (winner === P2) {
        $p2Win
          .removeClass(`${DRAW} ${OFFSCREEN}`)
          .addClass(`${WINNER} ${ONSCREEN}`)
          .text("WINNER!");
        $p1Win.attr("class", "").text("");
      }

      console.log(`winner ${winner}`);

      $p1NameReport.text(player1.playername);
      $p1ScoreReport.text(player1.score);
      $p1AccuracyReport.text(p1Accuracy);
      $p1PerformanceReport.text(p1Performance);
      $p2NameReport.text(player2.playername);
      $p2ScoreReport.text(player2.score);
      $p2AccuracyReport.text(getAccuracy(player2.score, player2.missed));
      $p2PerformanceReport.text(p2Performance);
      $p2ReportContainer.removeClass(OFFSCREEN);
    }

    $gameScreen.toggleClass(`${ONSCREEN} ${OFFSCREEN}`);
    $gameOver.toggleClass(`${ONSCREEN} ${OFFSCREEN}`);
  };

  //* DATA
  // Enum values
  const ONSCREEN = "on-screen";
  const OFFSCREEN = "off-screen";
  const OPEN = "open";
  const CLOSE = "close";
  const OCCUPIED = 1;
  const FREE = 0;
  const TRIGGERBUFFER = 1;
  const UP = "up";
  const DOWN = "down";
  const HIT = "hit";
  const P1HIT = "p1-hit";
  const P2HIT = "p2-hit";
  const UNHIT = "unhit";
  const PLAYERMODEBUTTONS = "playermode";
  const PLAYERMODESELECT = "player-select";
  const SINGLEPLAYER = "btn-1p";
  const TWOPLAYER = "btn-2p";
  const DIFFICULTYBUTTONS = "difficulty";
  const DIFFICULTYSELECT = "pushed";
  const FLASHCLASS = "flash";
  const P1 = "player1";
  const P2 = "player2";
  const HURRY = "hurry";
  const DRAW = "draw";
  const WINNER = "winner";

  // Game data
  const game = {
    timeLeft: 60,
    difficulty: "",
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
        limit: 3,
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
        provokeChance: 30,
        limit: 3,
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
        limit: 4,
      },
    },
    lastSprint: 5,
  };

  const player1 = {
    id: P1,
    playername: "",
    score: 0,
    missed: 0,
  };

  const player2 = {
    id: P2,
    playername: "",
    score: 0,
    missed: 0,
  };

  // Keymapping
  const keymap = {
    q: { player: P1, tile: 0 },
    w: { player: P1, tile: 1 },
    e: { player: P1, tile: 2 },
    a: { player: P1, tile: 3 },
    s: { player: P1, tile: 4 },
    d: { player: P1, tile: 5 },
    z: { player: P1, tile: 6 },
    x: { player: P1, tile: 7 },
    c: { player: P1, tile: 8 },
    p: { player: P2, tile: 0 },
    "[": { player: P2, tile: 1 },
    "]": { player: P2, tile: 2 },
    l: { player: P2, tile: 3 },
    ";": { player: P2, tile: 4 },
    "'": { player: P2, tile: 5 },
    ",": { player: P2, tile: 6 },
    ".": { player: P2, tile: 7 },
    "/": { player: P2, tile: 8 },
  };

  //* Define element hooks
  // Start screen
  const $p1Input = $("#p1-input");
  const $p2Input = $("#p2-input");
  const $player1name = $("#input-player1name");
  const $player2name = $("#input-player2name");
  const $playerModes = $(".playermode");
  const $helpScreen = $("#user-help");
  const $btnHelp = $("#btn-help");
  const $closeHelp = $("#btn-close");
  const $difficulty = $(".difficulty");
  const $play = $("#btn-play");

  // Game screen
  const $tiles = $(".tile");
  const $timer = $("#timer");
  const $p1ScoreHUD = $("#player1-score");
  const $p1NameHUD = $("#player1-name");
  const $p2HUD = $("#player2HUD");
  const $p2ScoreHUD = $("#player2-score");
  const $p2NameHUD = $("#player2-name");
  const $startScreen = $("#start-screen");
  const $gameScreen = $("#game-screen");
  const $preCountdown = $("#pre-countdown");
  const $warmup = $("#warm-up");
  const $timeDisplay = $("#time-display");
  // Game over
  const $gameOver = $("#game-over");
  const $p1NameReport = $("#p1-name-report");
  const $p2NameReport = $("#p2-name-report");
  const $p1ScoreReport = $("#p1-score-report");
  const $p2ReportContainer = $("#p2-report");
  const $p2ScoreReport = $("#p2-score-report");
  const $p1AccuracyReport = $("#p1-accuracy-report");
  const $p2AccuracyReport = $("#p2-accuracy-report");
  const $p1PerformanceReport = $("#p1-performance-report");
  const $p2PerformanceReport = $("#p2-performance-report");
  const $p1Win = $("#p1-win");
  const $p2Win = $("#p2-win");
  const $playAgain = $("#play-again");

  $closeHelp.on("click", () => {
    renderHelpScreen(CLOSE);
  });

  $btnHelp.on("click", () => {
    renderHelpScreen(OPEN);
  });

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
      renderItemFlash($(".playermode"));
      return;
    }
    if (difficulty === undefined) {
      renderItemFlash($(".difficulty"));
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
