

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const para=document.querySelector('p');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
var count=25;


function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}




function Shape(x,y,velX,velY,exists){
    this.x=x;
    this.y=y;
    this.velX=velX;
    this.velY=velY;
    this.exists=exists;
}
function Ball(x, y, velX, velY,exists, color, size) {
   Shape.call(this,x,y,velX,velY,exists)
  this.color = color;
  this.size = size;
}

Ball.prototype=Object.create(Shape.prototype);
Ball.prototype.constructor=Ball;

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};



Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};



Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])&&balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};
function evilCircle(x,y,exists){
    Shape.call(this,x,y,exists);
    this.color="white";
    this.size=10;
    this.velX=20;
    this.velY=20;
}
evilCircle.prototype=Object.create(Shape.prototype);
evilCircle.prototype.constructor=evilCircle;

evilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};
evilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};
evilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if (e.keyCode === 37) { //left
      _this.x -= _this.velX;
    } else if (e.keyCode === 39) { //right
      _this.x += _this.velX;
    } else if (e.keyCode === 38) { //up
      _this.y -= _this.velY;
    } else if (e.keyCode === 40) { //down
      _this.y += _this.velY;
    }
    else if(e.keyCode===77){
        _this.size+=10;
    }
    
    else if(e.keyCode===78){
        if(_this.size>20)
        _this.size-=10;
    }
  };
}
evilCircle.prototype.collisionDetect=function(){
    for(let j=0;j<balls.length;j++){
        if(balls[j].exists){
            var dx=this.x-balls[j].x;
            var dy=this.y-balls[j].y;
            var distance=Math.sqrt(dx * dx + dy * dy);
            if(distance<this.size+balls[j].size){
                balls[j].exists=false;
                count--;
                para.textContent="Ball Count: "+ count;
            }
        }
    }
}
// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}

// define loop that keeps drawing the scene constantly
let evil=new evilCircle(60,60,true);
  evil.setControls();
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  
  for(let i = 0; i < balls.length; i++) {
      if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
      
      }
    
  }
evil.draw();
      evil.checkBounds();
      evil.collisionDetect();
  requestAnimationFrame(loop);
}

loop();