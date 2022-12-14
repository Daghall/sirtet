# Sirtet

Sirtet is Tetris backwards.


## Try it

Go to https://daghall.github.io/sirtet/


## Rules

- Punch (remove) light gray bricks
- Green bricks are removed without penalty
- Red bricks are punished with an extra line at the end, per red brick
- After a swap, a new swap cannot be performed until the current shape has been punched
- The die is automatically punched when the timer (circle on the right) is up
  - Swaps and punches reset the timer
  - Every level up decreases the timer by 0.2 seconds
- A new level is reached every ten cleared lines


### Scoring

Completely cleared _rows_ score points, 100 points per line, plus a bonus:

| Rows | Points | Bonus |
| ---- | ------ | ----- |
|    1 |    100 |       |
|    2 |    250 |    50 |
|    3 |    400 |   100 |
|    4 |    550 |   150 |

#### Full clear

If the board is cleared (all gray blocks are removed twithout any penalty rows, _1000_ points is instantly scored, and four new rows are inserted.


## Controls

All action keys are located on the home row: `A` `S` `D` `F` –  `H` `J` `K` `L`  

| Key | Alt. |  Action   |
| --- | ---- |  -------- |
|  A  |      |  Rotate ⟲ |
|  S  |      |  Swap     |
|  D  |      |  Punch    |
|  F  |      |  Rotate ⟳ |
|  H  | ⬅    |  Left     |
|  J  | ⬇    |  Down     |
|  K  | ⬆    |  Up       |
|  L  | ➡    |  Right    |


# TODO / Roadmap / Ideas

- Dynamic size of `<canvas>`
- Scoring
  - More score for more time left on current shape?
- Stats
  - Penalties
- Death improvements:
  - Result screen
- Add new bricks from the bottom at regular intervals
  - Timer?
  - Per X punch shapes?
    - Penalties speeds up addition?
    - Random singles if total miss?
- Alternate game mode: filled to the top, only valid punches are accepted?
- Rendering
  - Event log?
  - Menu
    - New game
    - Quit/restart
    - Show controls
    - Control schemes
      - WASD
      - HJKL
    - Accessibility
  - Pause
- Music?
- Heartbeat sound effect as the bricks get cloaser to the top
- Mouse support?
