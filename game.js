console.log("Script test run check");

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
  resizeTo: window
});

document.body.appendChild(app.view);

const welcomeText = new PIXI.Text('Slot Machine Game', {
  fill: '#ffffff',
  fontSize: 36,
  fontWeight: 'bold'
});

welcomeText.anchor.set(0.5);
welcomeText.x = app.screen.width / 2;
welcomeText.y = app.screen.height / 2;

app.stage.addChild(welcomeText);
