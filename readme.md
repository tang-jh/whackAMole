# Whack-a-mole!

## Objective

To build a browser game of Whack-a-mole.

<p style="font-size: 0.9rem;font-style: italic;"><img style="display: block;" src="https://live.staticflickr.com/4048/4461381945_ff6bb8ff17_b.jpg" alt="topo"><a href="https://www.flickr.com/photos/35464489@N05/4461381945">"topo"</a><span> by <a href="https://www.flickr.com/photos/35464489@N05">ChunFlai</a></span> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=ccsearch&atype=html" style="margin-right: 5px;">CC BY-NC-SA 2.0</a><a href="https://creativecommons.org/licenses/by-nc-sa/2.0/?ref=ccsearch&atype=html" target="_blank" rel="noopener noreferrer" style="display: inline-block;white-space: none;margin-top: 2px;margin-left: 3px;height: 22px !important;"><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc_icon.svg?image_id=89e37507-62ff-4819-9eb6-537019851482" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-by_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-nc_icon.svg" /><img style="height: inherit;margin-right: 3px;display: inline-block;" src="https://search.creativecommons.org/static/img/cc-sa_icon.svg" /></a></p>

## User story

### Data needed:

| data    | type   | object attr                                       |
| ------- | ------ | ------------------------------------------------- |
| game    | object | timeLeft(str), modeSetting(obj), lastSprint(num)  |
| player1 | object | id(str), playername(str), score(num), missed(num) |
| player2 | object | id(str), playername(str), score(num), missed(num) |
| keymap  | object | characters(keys), object(player(str), tile(str))  |

### Logic needed:

#### Game engine

- `startGame(players, difficulty)`: button method

  - set/reset current game's parameters
  - render game screen
  - start the game engine

- `moleTrigger(occupancy, difficulty)`: method

  - method to set a delay and duration value for subsequent mole to be called
  - time range is based on difficulty setting

- `moleUp(duration, occupancy, difficulty, limit)`: method

  - render game board with the appearing mole if number of occupied tiles is less than the defined limit
  - update the occupancy matrix
  - set timed call of retrieving `this` mole

- `moleDown(tileId, occupancy, difficulty)`: method

  - method called within `moleUp()` to retrieve the exposed mole
  - once called, `moleTrigger()` is called again to queue the next mole

- `hammerClick(occupancy, difficulty)`: click method

  - action for mouse clicks to hit mole
  - mouse click is assigned to player 1 only

- `hammerPress(keymap, occupancy, difficulty)`: keypress method

  - action for keypresses
  - reads from pre-defined keymap table for players 1 and 2

- `hammerCheck(target, player, occupancy, difficulty)`: method
  - method to check if an occupied tile is hit, and by which player
  - updates score and renders game board

#### Rendering methods

- `renderHelpScreen()`: method

  - opens and closes game tutorial

- `renderNameInput(playermode)`: method

  - UI element to toggle name input for player 1 or player 2 based on user selection

- `renderItemFlash(target)`: method

  - UI element for visual feedback to various event

- `renderStartScreen()`: method

  - renders the game start screen

- `renderGameScreen(players)`: method

  - renders the game screen (player HUD and game board)

- `renderPreCountdown(secs)`: method

  - renders the warm up timer before starting the game

- `renderScore(player, score)`: method

  - updates player's score on HUD

- `renderGameBoard(id, state)`: method

  - refreshes game board with appearing and disappearing moles

- `renderTimer(state)`: method

  - renders the game countdown timer
  - visual feedback when time is running out

- `renderGameOver(players)`: method
  - renders the game over screen
  - shows game results

#### General purpose functions

- `randomMinMax(min, max)`: method

  - method to generate a random range

- `invokeChance(percent)`: method

  - method to invoke a function based on declared chance (%)

- `randomTileId(occupancy)`: method
  - method to check for vacant tile and return a random tile id for calling a mole

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

1. Able to store and retrieve single user data
1. Able to select **one** game mode
1. Game stops after time is up
1. Mole appearance engine
   - random hole
   - random time
   - random duration
   - more than one mole cannot appear at the same time in the same hole
1. Game ends and report scores
1. Able to restart game

### Future features

1. More game difficulty settings
1. Leaderboard
1. Better graphics and animations
1. Local 2-player pvp
1. Custom keymapping

### Progress

| Task                                                                          |    Not started     |    In-progress     |     Completed      |
| ----------------------------------------------------------------------------- | :----------------: | :----------------: | :----------------: |
| Single user data                                                              |                    |                    | :heavy_check_mark: |
| Able to select one gamemode                                                   |                    |                    | :heavy_check_mark: |
| Game stops after time is up                                                   |                    |                    | :heavy_check_mark: |
| Mole appearance engine (procedural method)                                    |                    |                    | :heavy_check_mark: |
| Hole collision avoidance                                                      |                    |                    | :heavy_check_mark: |
| Game ends and report scores                                                   |                    |                    | :heavy_check_mark: |
| Able to restart game                                                          |                    |                    | :heavy_check_mark: |
| More game difficulty settings (difficulty varies in mole frequency and speed) |                    |                    | :heavy_check_mark: |
| Leaderboard                                                                   | :heavy_check_mark: |                    |                    |
| Better graphics and animations                                                |                    | :heavy_check_mark: |                    |
| Gamestart warmup countdown                                                    |                    |                    | :heavy_check_mark: |
| Game ending warning counter                                                   |                    |                    | :heavy_check_mark: |
| Keymapping to enable keyboard input                                           |                    |                    | :heavy_check_mark: |
| Local 2-player pvp mode (keyboard)                                            |                    |                    | :heavy_check_mark: |
| User tutorial on start page                                                   |                    |                    | :heavy_check_mark: |
| Custom keymapping                                                             | :heavy_check_mark: |                    |                    |
