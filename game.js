console.log("Script test run check");
let positionText;
let winText;

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x009bb5,
  resizeTo: window
});

document.body.appendChild(app.view);

const loadingText = new PIXI.Text('Loading... 0%', {
  fill: '#ffffff',
  fontSize: 36,
  fontWeight: 'bold',
});
loadingText.anchor.set(0.5);
loadingText.x = app.screen.width / 2;
loadingText.y = app.screen.height / 2;
app.stage.addChild(loadingText);

const symbolNames = [
  'hv1', 'hv2', 'hv3', 'hv4',
  'lv1', 'lv2', 'lv3', 'lv4',
  'spin_button'
];

const reelset = [
  ["hv2", "lv3", "hv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
  ["hv1", "lv2", "hv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
  ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
  ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
  ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"]
];

symbolNames.forEach(name => {
  const fileName = name === 'spin_button'
    ? 'spin_button.png'
    : `${name}_symbol.png`;
  PIXI.Assets.add(name, `assets/symbols/${fileName}`);
});

let currentPositions = [0, 0, 0, 0, 0];
let symbolGrid = [];

let actualProgress = 0;
let displayProgress = 0;

PIXI.Assets.load(symbolNames, (progress) => {
  actualProgress = Math.floor(progress * 100);
}).then(() => {
  actualProgress = 100;
});

app.ticker.add(() => {
  if (displayProgress < actualProgress) {
    displayProgress += 4;
    loadingText.text = `Loading... ${displayProgress}%`;
  }

  if (displayProgress === 100 && app.stage.children.includes(loadingText)) {
    setTimeout(() => {
      app.stage.removeChild(loadingText);
      showGameScreen();
    }, 300);
  }
});

function showGameScreen() {
  const gridRows = 3;
  const gridCols = 5;
  const symbolSize = 100;
  const spacing = 10;

  const totalWidth = gridCols * (symbolSize + spacing) - spacing;
  const totalHeight = gridRows * (symbolSize + spacing) - spacing;
  const startX = (app.screen.width - totalWidth) / 2;
  const startY = (app.screen.height - totalHeight) / 2;

  symbolGrid.flat().forEach(container => app.stage.removeChild(container));
  symbolGrid = [];

  for (let row = 0; row < gridRows; row++) {
    const rowContainers = [];
    for (let col = 0; col < gridCols; col++) {
      const band = reelset[col];
      const basePos = currentPositions[col];
      const symbolIndex = (basePos + row) % band.length;
      const symbolName = band[symbolIndex];
      const texture = PIXI.Assets.get(symbolName);

      const container = new PIXI.Container();
      const sprite = new PIXI.Sprite(texture);
      sprite.symbolName = symbolName;

      const border = new PIXI.Graphics();
      sprite.width = symbolSize;
      sprite.height = symbolSize;
      border.lineStyle(3, 0x000000).drawRect(0, 0, symbolSize, symbolSize);

      container.addChild(sprite);
      container.addChild(border);
      container.x = startX + col * (symbolSize + spacing);
      container.y = startY + row * (symbolSize + spacing);
      container.width = symbolSize;
      container.height = symbolSize;

      container.border = border;
      app.stage.addChild(container);
      rowContainers.push(container);
    }
    symbolGrid.push(rowContainers);
  }

  showSpinButton(startX + totalWidth / 2, startY + totalHeight + 80);

  if (!positionText) {
    positionText = new PIXI.Text('', {
      fill: '#ffffff',
      fontSize: 20,
      fontFamily: 'Arial',
      fontWeight: 'bold'
    });
    positionText.anchor.set(0.5, 0);
    app.stage.addChild(positionText);
  }
  positionText.text = `Positions: [${currentPositions.join(', ')}]`;
  positionText.x = app.screen.width / 2;
  positionText.y = startY - 40;
  app.stage.setChildIndex(positionText, app.stage.children.length - 1);

  if (!winText) {
    winText = new PIXI.Text('', {
      fill: '#ffffff',
      fontSize: 18,
      fontFamily: 'Arial',
      wordWrap: true,
      wordWrapWidth: app.screen.width - 100
    });
    winText.anchor.set(0.5, 0);
    app.stage.addChild(winText);
  }
  winText.x = app.screen.width / 2;
  winText.y = app.screen.height - 100;

  evaluateScreen();
  evaluateWins();
}

const paytable = {
  'hv1_symbol': [20, 50, 100],
  'hv2_symbol': [18, 45, 90],
  'hv3_symbol': [16, 40, 80],
  'hv4_symbol': [14, 35, 70],
  'lv1_symbol': [10, 25, 50],
  'lv2_symbol': [8, 20, 40],
  'lv3_symbol': [6, 15, 30],
  'lv4_symbol': [4, 10, 20]
};

const paylines = [
  [[0,0], [0,1], [0,2], [0,3], [0,4]], 
  [[1,0], [1,1], [1,2], [1,3], [1,4]], 
  [[2,0], [2,1], [2,2], [2,3], [2,4]], 
  [[0,0], [1,1], [2,2], [1,3], [0,4]], 
  [[2,0], [1,1], [0,2], [1,3], [2,4]]
];

function evaluateWins() {
  let total = 0;
  let results = [];

  for (let i = 0; i < paylines.length; i++) {
    const line = paylines[i];
    const symbols = line.map(([r, c]) => symbolGrid[r][c].children[0].symbolName);

    const firstSymbol = symbols[0];
    let count = 1;
    for (let j = 1; j < symbols.length; j++) {
      if (symbols[j] === firstSymbol) {
        count++;
      } else {
        break;
      }
    }

    const payoutKey = firstSymbol + '_symbol';
    if (count >= 3 && paytable[payoutKey]) {
      const payout = paytable[payoutKey][count - 3];
      total += payout;
      results.push(`- payline ${i + 1}, ${payoutKey} x${count}, ${payout}`);
    }
  }

  if (winText) {
    winText.text = total > 0
      ? `Total wins: ${results.length}\n` + results.join('\n')
      : `Total wins: 0`;
  }
}

function showSpinButton(x, y) {
  const existing = app.stage.getChildByName("spinBtn");
  if (existing) app.stage.removeChild(existing);

  const graphics = new PIXI.Container();
  graphics.name = "spinBtn";
  graphics.x = x;
  graphics.y = y;
  graphics.eventMode = 'static';
  graphics.cursor = 'pointer';

  const outerRing = new PIXI.Graphics();
  outerRing.beginFill(0x000000);
  outerRing.drawCircle(0, 0, 61);
  outerRing.endFill();
  graphics.addChild(outerRing);

  const middleRing = new PIXI.Graphics();
  middleRing.beginFill(0xFFD700);
  middleRing.drawCircle(0, 0, 57);
  middleRing.endFill();
  graphics.addChild(middleRing);

  const innerCircle = new PIXI.Graphics();
  innerCircle.beginFill(0x000000);
  innerCircle.drawCircle(0, 0, 50);
  innerCircle.endFill();
  graphics.addChild(innerCircle);

  const spinText = new PIXI.Text('SPIN', {
    fill: ['#FFD700', '#FFA500'],
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Arial'
  });
  spinText.anchor.set(0.5);
  graphics.addChild(spinText);

  graphics.on('pointertap', () => spinReels());
  app.stage.addChild(graphics);
}

function spinReels() {
  for (let i = 0; i < currentPositions.length; i++) {
    currentPositions[i] = Math.floor(Math.random() * reelset[i].length);
  }
  showGameScreen();
}

function evaluateScreen() {
  for (const row of symbolGrid) {
    for (const container of row) {
      container.border.clear();
      container.border.lineStyle(3, 0x000000);
      container.border.drawRect(0, 0, container.width, container.height);
    }
  }

  for (let row = 0; row < 3; row++) {
    const symbols = symbolGrid[row].map(container => container.children[0].symbolName);
    const allSame = symbols.every(sym => sym === symbols[0]);
    if (allSame) {
      for (const container of symbolGrid[row]) {
        container.border.clear();
        container.border.lineStyle(4, 0xff0000);
        container.border.drawRect(0, 0, container.width, container.height);
      }
    }
  }
}
