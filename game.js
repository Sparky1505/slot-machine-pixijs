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

symbolNames.forEach(name => {
  const fileName = name === 'spin_button'
    ? 'spin_button.png'
    : `${name}_symbol.png`;
  PIXI.Assets.add(name, `assets/symbols/${fileName}`);
});

let displayProgress = 0;
let actualProgress = 0;

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
    }, 500);
  }
});

function showGameScreen() {
  const title = new PIXI.Text('Game Ready!', {
    fill: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold'
  });
  title.anchor.set(0.5);
  title.x = app.screen.width / 2;
  title.y = app.screen.height / 2;
  app.stage.addChild(title);
}
