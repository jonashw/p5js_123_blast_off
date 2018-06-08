var rocket;
var flame;

function setup() { 
  colorMode(HSL, 255);
  let canvas = createCanvas(windowWidth, windowHeight);
  let w = 125;
  let h = 266;
  rocket = createSprite(w, h, (windowWidth-w)/2, (windowHeight-h)/2);
  rocket.addAnimation("normal","assets/rocket.png");
  flame = createSprite(w, h, (windowWidth-w)/2, (windowHeight-h)/2);
  flame.addAnimation("flickering","assets/flame-01.png","assets/flame-06.png");
  rocket.position.x = flame.position.x = (windowWidth-w)/2;
  rocket.position.y = flame.position.y = (windowHeight-h)/2;
} 

function touchStarted(){
  return false; // This is to prevent pinch-zooming on touch devices.
}

function keyPressed(){
}

function draw() { 
  background(138,174,152);
  drawSprites();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}