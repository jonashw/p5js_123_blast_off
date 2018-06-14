var rocket;
var platform;
var yMin;
var yMax;
var playing = true;
var debug = false;
var cloudA, cloudB;
var stars;
var numberSounds;
var rocketSound;
var blastOffSound;
var numbers;
var spriteScale = 0.5;
var rocketMode = false;
var rocketOn = false;
var blastOffSign;
var byeBye;
var bonk;
var lastRocketY;

var scenery;

function preload(){
  rocketSound = loadSound("assets/rocket-burning.mp3");
  blastOffSound = loadSound("assets/blast-off-1.mp3");
  numberSounds = new NumberSounds(
    loadSound("assets/numbers-man-1.mp3"),
    loadSound("assets/numbers-man-2.mp3"),
    loadSound("assets/numbers-man-3.mp3"),
    loadSound("assets/numbers-man-4.mp3"),
    loadSound("assets/numbers-man-5.mp3"));
  bonk = loadSound("assets/bonk.mp3");
  byeBye = loadSound("assets/byebye.mp3");
}

function destroyNumbers(){
  if(!numbers){
    return;
  }
  numbers.forEach(n => n.remove());
  numbers = [];
}

function setupNumbers(nMax){
  numbers = [];
  for(var n=1; n<=nMax; n++){
    let n_s = createSprite(n*windowWidth/(nMax+1), windowHeight/5, 200/spriteScale,200/spriteScale);
    n_s.addAnimation("normal", "assets/number-" + n + "-normal.png");
    n_s.addAnimation("dancing",
      "assets/number-" + n + "-1.png", "assets/number-" + n + "-2.png",
      "assets/number-" + n + "-3.png", "assets/number-" + n + "-4.png",
      "assets/number-" + n + "-5.png", "assets/number-" + n + "-6.png",
      "assets/number-" + n + "-7.png", "assets/number-" + n + "-8.png"
    );
    n_s.id = n;
    numbers.push(n_s);
    /* We have to make the collider box larger and offset below the image due to an apparent bug in `overlapsPoint`. */
    n_s.setCollider('rectangle',0,100,200/spriteScale,200/spriteScale + 100 );
    n_s.scale = spriteScale;
  }
}

function setup() { 
  colorMode(HSL, 255);
  let canvas = createCanvas(windowWidth, windowHeight);
  let w = 125;
  let h = 266;

  rocketSound.loop();

  stars = (() => {
    var arr = [];
    for(var i=0; i<50; i++){
      let s = createSprite(
        random(0,windowWidth),
        random(0,windowHeight - 50) - 4*windowHeight, 50/spriteScale, 50/spriteScale);
      let a = s.addAnimation("twinkle","assets/star-01.png", "assets/star-04.png");
      s.scale = spriteScale;
      a.changeFrame(i % a.images.length);
      arr.push(s);
    }
    return arr;
  })();

  setupNumbers(3);
  blastOffSign = createSprite(windowWidth/2, -windowHeight/4, 200,200);
  blastOffSign.addAnimation("normal","assets/blast-off.png");

  cloudA = loadImage('assets/cloud-a.png');
  cloudB = loadImage('assets/cloud-b.png');
  platform = createSprite((windowWidth-215)/2, yMax - 72, 215, 72);
  platform.position.y = windowHeight - h/2;
  platform.position.x = windowWidth/2;
  platform.addAnimation("normal","assets/platform.png");
  platform.setCollider("rectangle", 0, 0, 215, 72);

  let rocketScale = 0.5;
  rocket = createSprite((windowWidth-w)/2, (windowHeight-h)/2, w/rocketScale, h/rocketScale);
  rocket.scale = rocketScale;
  rocket.addAnimation("normal","assets/rocket-normal.png");
  rocket.addAnimation("burning","assets/rocket-burning-01.png","assets/rocket-burning-06.png");
  rocket.position.x = windowWidth/2;
  rocket.position.y = lastRocketY = windowHeight/2;
  rocket.changeAnimation('burning');
  rocket.setCollider("rectangle", 0, -60*rocketScale, w/rocketScale, (h - 80)/rocketScale);
  yMax = windowHeight - rocket.height/2;

  var gradient = [
    color(138,174,74),
    color(138,174,102),
    color(138,174,127),
  ];
  scenery = [
    new SceneryBand(2*-windowHeight, () => {
      image(cloudA,10, 100);
      image(cloudA,800, 300);
      image(cloudA,1000, 700);
      image(cloudA,200, 600);
      image(cloudB,500, 500);
      image(cloudB,100, 400);
      image(cloudB,900, 20);
    }),
    new SceneryBand(3*-windowHeight, () => {
      let yIncrement = windowHeight/gradient.length;
      for(var i=0; i<gradient.length; i++){
        let y = i * yIncrement;
        stroke(gradient[i]);
        fill(gradient[i]);
        rect(0,y,windowWidth, yIncrement);
      }
    }),
    new SceneryBand(4*-windowHeight, () => {
      noStroke();
      fill(138,174,46);
      rect(0,0,windowWidth,windowHeight);
    }),
    new SceneryBand(5*-windowHeight, () => {
      noStroke();
      fill(138,174,46);
      rect(0,0,windowWidth,windowHeight);
    })
  ];
  yMin = -1 * windowHeight * (scenery.length);
  yMax = windowHeight;
  //toggleDebug();
} 

function touchStarted(){
  for(var ti=0; ti<touches.length; ti++){
    let t = touches[ti];
    handlePointAction(t.x,t.y);
  }
  return false; // This is to prevent pinch-zooming on touch devices.
}

function mousePressed(){
  handlePointAction(mouseX,mouseY);
}

function handlePointAction(x,y){
  for(var i=0; i<numbers.length; i++){
    let n = numbers[i];
    if(n.overlapPoint(x,y)){
      let previousNumbers = numbers.slice(0, n.id-1);
      if(previousNumbers.length == 0 || previousNumbers.every(pn => pn.touched)){
        n.changeAnimation("dancing");
        numberSounds[n.id].play();
        n.touched = true;
        if(n.id == numbers.length){
          // Let's give some time for the final number sound to play before blast .
          setTimeout(() => {
            rocketMode = true;
            rocketOn = true;
          }, 500);
        }
      }
    }
  }
  if(rocketMode){
    rocketOn = !rocketOn;
  }
}

function reset(){
  numbers.forEach(n => {
    n.touched = false;
    n.changeAnimation("normal");
  });
  rocketOn = false;
  rocketMode = false;
  rocketSound.stop();
  rocketSound.setVolume(1);
}

function keyPressed(){
  if(key == 'D'){
    toggleDebug();
  }
  if(key == 'B'){
    blastOffSound.play();
  }
  if(key == 'R'){
    reset();
  }
  let n = parseInt(key);
  if(n && 1 <= n && n <= 5){
    destroyNumbers();
    setupNumbers(n);
    numberSounds[key].play();
  }
  if(keyCode == ESCAPE){
    playing = !playing;
    if(playing){
      loop();
    } else {
      noLoop();
    }
  }
}

function toggleDebug(){
    debug = !debug;
    for(var i=0;i<allSprites.length;i++){
      allSprites[i].debug = debug;
    }
}

function draw() { 
  background(138,174,152);
  for(var i=0; i<scenery.length; i++){
    var s = scenery[i];
    //console.log(s.yOffset, camera.position.y);
    if(s.yOffset + windowHeight >= camera.position.y - windowHeight/2
    && s.yOffset <= camera.position.y + windowHeight/2){
      //console.log('draw ' + i);
      push();
      translate(0,s.yOffset);
      if(debug){
        line(0,windowHeight, windowWidth, windowHeight);
      }
      s.draw();
      pop();
    }
  }
  if(rocket.position.y <= windowHeight - rocket.height/2){
    rocket.velocity.y += 0.3;
  }
  if(rocketMode && rocketOn/*&& (keyIsDown(UP_ARROW) || keyIsDown(32) || mouseIsPressed)*/){
    rocket.changeAnimation("burning");
    rocket.velocity.y -= 0.5;
    if(!rocketSound.isPlaying()){
      rocketSound.play();
    }
  } else {
    rocket.changeAnimation("normal");
    rocketSound.stop();
  }
  //rocket.position.y = min(rocket.position.y, yMax);
  camera.position.y = 
    min(
      windowHeight/2-100,
      max(rocket.position.y, yMin));

  if(rocket.position.y < yMin){
    let v = max(
      0,
      (windowHeight - abs(rocket.position.y - yMin))/windowHeight);
    rocketSound.setVolume(v);
    if(v == 0){
      if(rocketMode){
        byeBye.play();
      }
      reset();
    }
  }

  rocket.limitSpeed(10);

  rocket.collide(platform, function(){
    if(rocket.position.y - lastRocketY > 0){
      bonk.play();
    }
  });
  lastRocketY = rocket.position.y;
  rocket.overlap(blastOffSign, () => {
    if(blastOffSound.isPlaying() || !rocketOn){
      return;
    }
    blastOffSound.play();
  })

  push();
  drawSprites();
  pop();
  if(debug){
    for(var y=yMin; y<yMax; y+=50){
      push();
      stroke(0);
      strokeWeight(1);
      line(10,y-5,30,y-5);
      pop();
      text(y,50,y);
      //text(yMax-y,150,y);
    }
  }
  if(debug){
    ellipse(camera.position.x, camera.position.y, 5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function SceneryBand(yOffset, draw){
  this.yOffset = yOffset;
  this.draw = draw;
}

function NumberSounds(_1,_2,_3,_4,_5){
  this[1] = _1;
  this[2] = _2;
  this[3] = _3;
  this[4] = _4;
  this[5] = _5;
}