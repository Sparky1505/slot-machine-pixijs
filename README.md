# 🎰 Slot Machine Game using Pixi.js

A visually engaging 5x3 slot machine game built with [Pixi.js](https://pixijs.com/), featuring an animated loading screen, spinning reels with blur effect, dynamic symbol rendering from reelset bands, win evaluation based on paylines, and highlight animations.

---

## 🧩 Features

- ✅ **Preloader Screen**  
  Animated loading percentage shown before all assets load.

- 🎮 **Spin Button**  
  Interactive and stylized circular spin button using PIXI graphics.

- 🌀 **Spinning Animation**  
  Reels animate with blur effect during spins, with randomized reel positions.

- 🧮 **Reelset Bands**  
  Symbols for each reel are dynamically positioned using band data.

- 💰 **Payline Evaluation**  
  Multiple paylines checked for wins; winning lines highlighted in red.

- 🪄 **Win Highlights**  
  Matching symbols blink briefly when part of a winning payline.

- 📊 **Current Reel Position Display**  
  Reel positions shown above the slot grid.

- 🧾 **Winnings Text Display**  
  Text shows total wins and details per payline.

- 📱 **Responsive Design**  
  Scales dynamically to fit various screen sizes.

---

## 📁 File Structure

```
/assets/
  /symbols/
    hv1_symbol.png
    lv2_symbol.png
    ...
    spin_button.png

index.html
game.js
README.md
```

---

## 🎮 How to Play

1. Click the **SPIN** button.
2. Reels will blur and stop at random positions.
3. Winning paylines (if any) will be displayed and animated.
4. Spin again to test your luck!

---

## 🏆 Paylines & Payouts

The game includes 5 paylines (3 horizontal, 2 diagonal).  
Payouts vary by symbol and number of matches:

| Symbol      | 3 Matches | 4 Matches | 5 Matches |
|-------------|-----------|-----------|-----------|
| `hv1`       | 20        | 50        | 100       |
| `hv2`       | 18        | 45        | 90        |
| `hv3`       | 16        | 40        | 80        |
| `hv4`       | 14        | 35        | 70        |
| `lv1`       | 10        | 25        | 50        |
| `lv2`       | 8         | 20        | 40        |
| `lv3`       | 6         | 15        | 30        |
| `lv4`       | 4         | 10        | 20        |

---

## 🔧 How to Run Locally

1. Clone the repo:

```bash
git clone https://github.com/Sparky1505/slot-machine-pixijs.git
cd slot-machine-pixijs
```

2. Install a simple static server (if needed):

```bash
npm install -g serve
```

3. Start the server:

```bash
serve .
```


---

## 🚀Demo

👉 **Play the game here**:https://sparky1505.github.io/slot-machine-pixijs/

---

## 🛠️ Built With

- [PixiJS v7+](https://pixijs.com/) — WebGL 2D rendering engine
- Vanilla JavaScript (ES6)
- HTML5 + CSS3

---

