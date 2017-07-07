/*
 * author: Adam Lasak
 * website: www.adam-lasak.xf.cz
 * email: lasak.ad@gmail.com
 * copyright 2016
 */

var keys = [], gameOver = false;
var plusX = false, minusX = true, plusY = true, minusY = false;

var ballSpeed = 2.6, level = 1;

var rectComponents = {

    "customRectangle": {},
    "enemyRectangle": {},
    "lineRectangle": {},
    "ballRectangle": {}

};


function startGame(){

    GameArea.start();
    rectComponents.customRectangle = new rectComponent(8, 65, "green", 7, GameArea.canvas.height / 2 - 32 );
    rectComponents.enemyRectangle  = new rectComponent(8, 65, "green", GameArea.canvas.width - 17, GameArea.canvas.height / 2 - 32 );
    rectComponents.lineRectangle   = new rectComponent(2, GameArea.canvas.height, "lightgray", GameArea.canvas.width /2, 0 );
    rectComponents.ballRectangle   = new rectComponent(8, 8, "black", 400, 150 );

}

var GameArea = {

    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    gameOver : function(){
        ctx.font = "50px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText("GAME OVER", 80, this.canvas.height / 2);
    },
    win : function(){
        ctx.font = "50px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText("YOU WIN!", 127, this.canvas.height / 2);
    },
    score : function(leftScore, rightScore){
        ctx.font = "30px Arial";
        ctx.fillStyle = "gray";
        if (leftScore < 10)
            ctx.fillText(leftScore + "   " + rightScore, this.canvas.width / 2 - 28, 30);
        else if (leftScore < 100)
            ctx.fillText(leftScore + "   " + rightScore, this.canvas.width / 2 - 44, 30);
        else
            ctx.fillText(leftScore + "   " + rightScore, this.canvas.width / 2 - 61, 30);
    },
    stop : function() {
        clearInterval(this.interval);
    }

};

function rectComponent(width, height, color, x, y) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0.0;
    this.speedY = 0.0;
    this.scoreNo = 0;
    this.update = function(){
        ctx = GameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.x += this.speedX;
        this.y += this.speedY;

        if (rectComponents.customRectangle.y < 0){
            this.y = 0;
            this.speedY = 0.0;
        }
        if (rectComponents.customRectangle.y > GameArea.canvas.height - 65){
            this.y = GameArea.canvas.height - 65;
            this.speedY = 0.0;
        }
        

        if (rectComponents.ballRectangle.y < 0){
            this.y = 0;
            this.speedY = 0.0;
            plusY = true;
            minusY = false;
        }
        if (rectComponents.ballRectangle.y > GameArea.canvas.height - 8){
            this.y = GameArea.canvas.height - 8;
            this.speedY = 0.0;
            minusY = true;
            plusY = false;
        }
        if (rectComponents.ballRectangle.x < 0){
            this.x = 0;
            this.speedX = 0.0;
            plusX = true;
            minusX = false;
            rectComponents.enemyRectangle.scoreNo++;
        }
        if (rectComponents.ballRectangle.x > GameArea.canvas.width - 8){
            this.speedX = 0.0;
            this.x = GameArea.canvas.width - 8;
            minusX = true;
            plusX = false;
            rectComponents.customRectangle.scoreNo++;
        }   


    }
    this.crashWith = function(otherObj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherObj.x;
        var otherright = otherObj.x + (otherObj.width);
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + (otherObj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }

}

function updateGameArea(){

    if (rectComponents.enemyRectangle.scoreNo - rectComponents.customRectangle.scoreNo == 3){
        gameOver = true;
        GameArea.stop();
        GameArea.gameOver();
        return;
    } else if (rectComponents.customRectangle.scoreNo - rectComponents.enemyRectangle.scoreNo == 3){
        gameOver = true;
        GameArea.stop();
        GameArea.win();
        return;
    }

    GameArea.clear();

    if (plusX){
        if (rectComponents.ballRectangle.speedX < ballSpeed)
            rectComponents.ballRectangle.speedX += ballSpeed;
    }
    if (minusX){
        if (rectComponents.ballRectangle.speedX > -ballSpeed)
            rectComponents.ballRectangle.speedX -= ballSpeed;
    }
    if (plusY){
        if (rectComponents.ballRectangle.speedY < ballSpeed)
            rectComponents.ballRectangle.speedY += ballSpeed;
    }
    if (minusY){
        if (rectComponents.ballRectangle.speedY > -ballSpeed)
            rectComponents.ballRectangle.speedY -= ballSpeed;
    }

    if (rectComponents.customRectangle.crashWith(rectComponents.ballRectangle)){
        plusX = true;
        minusX = false;
    }
    if (rectComponents.enemyRectangle.crashWith(rectComponents.ballRectangle)){
        minusX = true;
        plusX = false;
    }

    rectComponents.enemyRectangle.y = rectComponents.ballRectangle.y - 30;
    
    rectComponents.customRectangle.update();
    rectComponents.enemyRectangle.update();
    rectComponents.lineRectangle.update();
    rectComponents.ballRectangle.update();

    GameArea.score(rectComponents.customRectangle.scoreNo, rectComponents.enemyRectangle.scoreNo);

}

function keyDown(e){

    keys[e.keyCode] = true;

    if (keys[38]){ // up
        if (rectComponents.customRectangle.speedY > -4.0)
            rectComponents.customRectangle.speedY -= 4.0;
    }

    if (keys[40]){ // down
        if (rectComponents.customRectangle.speedY < 4.0)
        rectComponents.customRectangle.speedY += 4.0;
    }

    if (keys[27]){ // ESC - restart game

        document.getElementById("level").innerHTML = "Level: " + level;
        if (gameOver){

            rectComponents = {
                "customRectangle": {},
                "enemyRectangle": {},
                "lineRectangle": {},
                "ballRectangle": {}
            };

            startGame();
        }

        gameOver = false;

    }
    
}

function keyUp(e){

    keys[e.keyCode] = false;
    rectComponents.customRectangle.speedY = 0.0;

}

window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);