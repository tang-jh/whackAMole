# Whack-a-mole!

## Objective

To build a browser game of Whack-a-mole.

<p style="font-size: 0.9rem;font-style: italic;"><img style="display: block;" src="https://live.staticflickr.com/4048/4461381945_ff6bb8ff17_b.jpg" alt="topo"><a href="https://www.flickr.com/photos/35464489@N05/4461381945">"topo"</a><span> by <a href="https://www.flickr.com/photos/35464489@N05">ChunFlai</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=ccsearch&atype=html" style="margin-right: 5px;">CC BY-NC-SA 2.0</a><a href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=ccsearch&atype=html" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;"><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc_icon.svg?image_id=89e37507-62ff-4819-9eb6-537019851482" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-by_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-sa_icon.svg" /></a></p>

## User story

1. Data needed:

   - grid: object array
     - cell: object
       - id: string
       - state: string ["hidden", "surfaced", "hit"]
       - duration:
   - game: object
     - playerName: string
     - timer: number
     - score: number

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
     - call renderTimer()
   - gameTimer(): function variable for setInterval

     ```js
     let gameTimer = setInterval(countdown, 1000);
     ```

- moleAppear(): method
  - random hole
  - random time
  - random duration
- hammerHit(): method
- hammerMiss(): method
- scoreTracker(): method

1. Render method:
   - renderStartScreen()
   - renderGameScreen(gameMode, player)
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
