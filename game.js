var canvas = null,
    ctx = null;
    lastPressed = null,
    pause=false,
    gameOver=false,

    body = new Array(),
    wall = new Array(),
    
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
    ctx.fillStyle = '#0f0';
    for (i = 0, l = body.length; i < l; i += 1) {
        body[i].fill(ctx);
    }


    //food print
    ctx.fillStyle = '#f00';
    food.fill(ctx);

    //score print
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 0, 10);

    //print walls
    ctx.fillStyle = '#999';
    for (i = 0, l = wall.length; i < l; i += 1) {
        wall[i].fill(ctx);
    }

    if(pause){  //pause text
        ctx.fillStyle = '#fff';
        if (gameOver) {
            ctx.fillText('GAME OVER', 300, 150);
        } 
        else {
            ctx.fillText('PAUSE', 300, 150);
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
    setTimeout(run, 25);
    act();
}

function act() {

    var lastPos = body.length - 1;

    if(!pause){

        if(gameOver){
            reset();
        }

        //direction change
        if(lastPressed == KEY_UP && dir != 2){
            dir=0;
        }
        if(lastPressed == KEY_RIGHT && dir != 3){
            dir=1;
        }
        if(lastPressed == KEY_DOWN && dir != 0){
            dir=2;
        }
        if(lastPressed == KEY_LEFT && dir != 1){
            dir=3;
        }

        //movement in diferent directions
        if(dir == 0){
            body[0].y -= 2.5;
        }
        if(dir == 1){
            body[0].x += 2.5;
        }
        if(dir == 2){
            body[0].y += 2.5;
        }
        if(dir == 3){
            body[0].x-= 2.5;
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
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;

    this.intersects = function(rect){
        
        if(rect == null){
            window.console.warn('Missing parameters');
        } 
        
        else{
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    };

    this.fill = function (ctx) {
        
        if (ctx == null) {
            window.console.warn('Missing parameters on function fill');
        } 
        
        else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

}

function init() {
    gameOver = false;
    speed = 25;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    body[0] = new Rectangle(80, 80, 10, 10);
    food = new Rectangle(random(canvas.width / 10 - 1) * 10, random(canvas.height / 10 - 1) * 10, 10, 10);
    wall.push(new Rectangle(200, 100, 10, 10));
    wall.push(new Rectangle(200, 200, 10, 10));
    wall.push(new Rectangle(400, 100, 10, 10));
    wall.push(new Rectangle(400, 200, 10, 10));

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