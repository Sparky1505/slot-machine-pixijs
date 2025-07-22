console.log("Script test run check");

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
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
  ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
  ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
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

let displayProgress = 0;
let actualProgress = 0;
let currentPositions = [0, 0, 0, 0, 0];
let symbolGrid = [];

PIXI.Assets.load(symbolNames, (progress) => {
  actualProgress = Math.floor(progress * 100);
}).then(() => {
  actualProgress = 100;
});

app.ticker.add(() => {
  if (displayProgress < actualProgress) {
    displayProgress += 4;
    if (displayProgress > actualProgress) displayProgress = actualProgress;
    loadingText.text = `Loading... ${displayProgress}%`;
  }

  if (displayProgress === 100 && app.stage.children.includes(loadingText)) {
    setTimeout(() => {
      app.stage.removeChild(loadingText);
      console.log("Calling showGameScreen...");
    showGameScreen();

    //  showGameScreen();
    }, 500);
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

  symbolGrid = [];

  for (let row = 0; row < gridRows; row++) {
    const rowSprites = [];
    for (let col = 0; col < gridCols; col++) {
      const band = reelset[col];
      const basePos = currentPositions[col];
      const symbolIndex = (basePos + row) % band.length;
      const symbolName = band[symbolIndex];
      const texture = PIXI.Assets.get(symbolName);
      console.log(`Symbol: ${symbolName}, Texture found:`, !!texture);

     // const texture = PIXI.Assets.get(symbolName);

      if (!texture) {
        console.warn(`Missing texture for symbol: ${symbolName}`);
        continue;
      }

      const sprite = new PIXI.Sprite(texture);
      sprite.width = symbolSize;
      sprite.height = symbolSize;
      sprite.x = startX + col * (symbolSize + spacing);
      sprite.y = startY + row * (symbolSize + spacing);

      app.stage.addChild(sprite);
      rowSprites.push(sprite);
    }
    symbolGrid.push(rowSprites);
  }
}
