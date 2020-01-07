(function (window, undefined){
var canvas = null,
    ctx = null;
    lastPressed = null,
    pause=false,
    gameOver=false,

    iBody = new Image(),
    iFood = new Image(),

    body = new Array(),
    wall = new Array(),
    
    
    FPS = 0,
    lastUpdate = 0,
    frames = 0,
    acumDelta = 0;
    
    score = 0,
    dir=0,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    PAUSE_KEY = 27;

function paint(ctx) {
    //background print
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //snake print
    for (i = 0, l = body.length; i < l; i += 1) {
        body[i].drawImage(ctx, iBody);
    }

    //food print
    food.drawImage(ctx, iFood);

    //score print
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 0, 10);

    //print walls
    ctx.fillStyle = '#999';
    for (i = 0, l = wall.length; i < l; i += 1) {
        wall[i].fill(ctx);
    }

    //print fps
    ctx.fillText('FPS: ' + FPS, 225, 10);

    if(pause){  //pause text
        ctx.fillStyle = '#fff';
        if (gameOver) {
            ctx.fillText('GAME OVER', 150, 75);
        } 
        else {
            ctx.fillText('PAUSE', 150, 75);
        }
        ctx.textAlign = 'left';
    }
}

document.addEventListener('keydown', function(evt){
    lastPressed = evt.which;
}, false);

function repaint() {
    window.requestAnimationFrame(repaint);
    paint(ctx);
}

function run() {
    window.requestAnimationFrame(run);

    var now = Date.now(),
        deltaTime = (now - lastUpdate) / 1000;
    
    if (deltaTime > 1) {
        deltaTime = 0;
    }
    
    lastUpdate = now;
    frames += 1;
    acumDelta += deltaTime;
    
    if (acumDelta > 1) {
        FPS = frames;
        frames = 0;
        acumDelta -= 1;
    }

    act(deltaTime);
}

function act(deltaTime) {

    if(!pause){

        if(gameOver){
            reset();
        }

        //direction change
        if(lastPressed == KEY_UP && dir !== 2){
            dir=0;
        }
        if(lastPressed == KEY_RIGHT && dir !== 3){
            dir=1;
        }
        if(lastPressed == KEY_DOWN && dir !== 0){
            dir=2;
        }
        if(lastPressed == KEY_LEFT && dir !== 1){
            dir=3;
        }

        //movement in diferent directions
        if(dir === 0){
            body[0].y -= 120 * deltaTime;
        }
        if(dir === 1){
            body[0].x += 120 * deltaTime;
        }
        if(dir === 2){
            body[0].y += 120 * deltaTime;
        }
        if(dir === 3){
            body[0].x-= 120 * deltaTime;
        }

        //if outscreened resets from the other side
        if(body[0].x > canvas.width){
            body[0].x=0;
        }
        if(body[0].y > canvas.height){
            body[0].y=0;
        }
        if(body[0].x < 0){
            body[0].x=canvas.width;
        }
        if(body[0].y < 0){
            body[0].y=canvas.height;
        }
    }

    //reposition of food and score augment
    if (body[0].intersects(food)) {
        score += 1;
        body.push(new Rectangle(0, 0, 10, 10));
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
    }

    for (i = 0, l = wall.length; i < l; i += 1) {
        if (food.intersects(wall[i])) {
            food.x = random(canvas.width / 10 - 1) * 10;
            food.y = random(canvas.height / 10 - 1) * 10;
        }
        if (body[0].intersects(wall[i])) {
            pause = true;
            gameOver = true;
        }
    }    

    for (i = 13, l = body.length; i < l; i += 1) {
        if (body[0].intersects(body[i])) {
            gameover = true;
            pause = true;
        }
    }

    //move body
    for (i = body.length - 1; i > 0; i -= 1) {
        body[i].y = body[i - 1].y;
        body[i].x = body[i - 1].x; 
    }

    //pause button
    if(lastPressed == PAUSE_KEY){
        pause = !pause;
        lastPressed = null;
    }

}

function reset(){
    score = 0;
    dir = 1;
    body.length = 0;
    body.push(new Rectangle(40, 40, 10, 10));
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    gameOver = false;

}

function Rectangle(x, y, width, height){
    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
    this.width = (width === undefined) ? 0 : width;
    this.height = (height === undefined) ? this.width : height;
}

Rectangle.prototype = {
    constructor: Rectangle,
    
    intersects : function(rect){
        
        if(rect === undefined){
            window.console.warn('Missing parameters');
        } 
        
        else{
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    },

    fill : function (ctx) {
        
        if (ctx === undefined) {
            window.console.warn('Missing parameters on function fill');
        } 
        
        else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },

    drawImage : function (ctx, img) {
        if (img === undefined) {
            window.console.warn('Missing parameters on function drawImage');
        } else {
            if (img.width) {
                ctx.drawImage(img, this.x, this.y);
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
    }

}

function init() {
    gameOver = false;
    speed = 25;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    body[0] = new Rectangle(40, 40, 10, 10);
    iBody.src = 'assets/body.png';
    
    iFood.src = 'assets/fruit.png';
    food = new Rectangle(random(canvas.width / 10 - 1) * 10, random(canvas.height / 10 - 1) * 10, 10, 10);
   
    wall.push(new Rectangle(100, 50, 10, 10));
    wall.push(new Rectangle(100, 100, 10, 10));
    wall.push(new Rectangle(200, 50, 10, 10));
    wall.push(new Rectangle(200, 100, 10, 10));

    run();
    repaint();
}

window.addEventListener('load', init, false);

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 17); 
    };
}());

function random(max){
    return Math.floor(Math.random() * max);
}
} (window));