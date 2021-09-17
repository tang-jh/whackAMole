# Whack-a-mole!

## Objective

To build a browser game of Whack-a-mole.

<p style="font-size: 0.9rem;font-style: italic;"><img style="display: block;" src="https://live.staticflickr.com/4048/4461381945_ff6bb8ff17_b.jpg" alt="topo"><a href="https://www.flickr.com/photos/35464489@N05/4461381945">"topo"</a><span> by <a href="https://www.flickr.com/photos/35464489@N05">ChunFlai</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=ccsearch&atype=html" style="margin-right: 5px;">CC BY-NC-SA 2.0</a><a href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=ccsearch&atype=html" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;"><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc_icon.svg?image_id=89e37507-62ff-4819-9eb6-537019851482" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-by_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-sa_icon.svg" /></a></p>

## User story

1. Data needed:

   - grid: object array
     - tile: object
       - id: string
       - state: string ["up", "hit"]
   - game: object
     - playerName: string
     - timer: number
     - score: number
     - missed: number
     - gridSize: number

1. Logic needed:

   - startGame(gameMode): button

     - ==> getPlayerName
     - ==> set game data (playerName=name, timer=60, score=0)
     - ==> call renderGameScreen()
     - ==> set gameTimer === setInterval

       - every second game engine method runs

       ```js
       //Game init
       game.playerName = playername ?? "Player01";
       game.timer = 60;
       game.score = 0;

       // Render gamescreen
       renderGameScreen();

       // Run game
       let gameTimer = setInterval(countdown, 1000);
       ```

   - gameMode(): button
   - countdown(): method
     - decrement game time
     - check if timer === 0; then end game
     - call renderTimer()
   - gameTimer(): function variable for setInterval

     ```js
     let gameTimer = setInterval(countdown, 1000);
     ```

- moleTrigger(): method
  - set random duration between 0.1 to 2.0s
  - call moleUp with setTimeout by a random delay between 0.1 to 3.0s
  ```js
  let duration = Math.ceil(Math.random() * 15) * 100 + 500; //duration in between 0.5-2.0s
  let delay = Math.ceil(Math.random() * 30) * 100; //duration in 0.1s divisions between 0.3-3.0s
  setTimeout(moleUp(duration), delay);
  ```
- moleUp(duration) => (): method

  - random tileId
  - make appear
  - random duration ==> (random btn 2 sec)
  - setTimeout(change state, duration)

  ```js
  const moleUp = (duration, gridsize) => () => {
    const tileId = Math.floor(Math.random() * gridsize);
    //$tiles.eq[tileId].addClass("up");
    renderGameBoard(tileId, "up");
    setTimeout(moleDown(tileId), duration);
  };
  ```

- moleDown(tileId) => (): method

  - toggle class
  - call moleTrigger()

  ```js
  $square.eq[tileId].removeClass("up");
  moleTrigger();
  ```

- hammerPress(): method

  - check class available on square clicked
  - if up, then register hit
  - if down, register miss
  - if hit, do nothing
  - call moleTrigger()

  ```js
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
  ```

- endGame(): method
  - renderGameOver()
- scoreTracker(): method

1. Render method:

   - renderStartScreen()
   - renderGameScreen(gameMode, player)
   - renderGameBoard($parent, tilesArr)

     - get status of tiles from array
     - append list of tiles to parent

     ```js
     const renderGameBoard = (id, state) => {
       let $current;
       if (state === "up") {
         $tiles.eq[id].addClass("up");
       } else if (state === "down") {
         $tiles.eq[id].removeClass("up");
       } else if (state === "hit") {
         $tiles.eq[id].addClass("hit");
       }
     };
     ```

   - renderTimer();
   - renderGameOver()

## Wireframes

![](/wireframe/startpage.jpg)
Start page

![](/wireframe/gamepage.jpg)
Game page

![](/wireframe/gameover.jpg)
Game over

![](/wireframe/leaderboard.jpg)
Leaderboard _Not included in MVP_

## Technology

- HTML5
- jQuery
- [NES.css](https://nostalgic-css.github.io/NES.css/) - for styling

## Workplan

### MVP

#### Requirement

1. Able to store and retrieve user data
1. Able to select **one** game mode
1. Game runs for set period of time
1. Mole appearing method
   - random hole
   - random time
   - random duration
   - more than one mole cannot appear at the same time in the same hole
1. Game ends and report scores
1. Able to restart game

###

## References
