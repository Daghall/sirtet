# Sirtet

Sirtet is Tetris backwards.


## Try it

Go to https://daghall.github.io/sirtet/


## Rules

- Punch (remove) gray bricks
- Green bricks are removed without penalty
- Red bricks are punished with an extra line at the end, per red brick
- After a swap, a new swap cannot be performed until the current shape has been punched

### Scoring

Completely cleared _rows_ score points, 100 points per line, plus a bonus:

| Rows | Points | Bonus |
| ---- | ------ | ----- |
|    1 |    100 |       |
|    2 |    250 |    50 |
|    3 |    400 |   100 |
|    4 |    550 |   150 |

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


# TODO / Roadmap

- Dynamic size of `<canvas>`
- Scoring
  - Clearing the board (adds four new lines at the bottom)
  - More score for more time left on current shape?
- Stats
  - Penalties
  - Level
  - Time?
- Death improvements:
  - Result screen
  - High score
- Timer for auto-punch
  - Increase speed of timer when punching red brick?
- Add new bricks from the bottom at regular intervals
  - Timer?
  - Per X punch shapes?
    - Penalties speeds up addition?
    - Random singles if total miss?
- Alternate game mode: filled to the top, only valid punches are accepted?
- Rendering
  - Board border
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
- Mouse support?
