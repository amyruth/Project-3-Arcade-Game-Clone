/* eslint-disable indent*/
function randomSpeed(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomRow = function () {
	return [60, 140, 225][Math.floor(Math.random() * [60, 140, 225].length)];
};

let score = 0;
const scoreArea = document.getElementById('score');
const lives = document.getElementById('lives');
const gameOver = document.querySelector('.gameOver');
const redoButton = document.querySelector('#redo');

function gameReset() {
	scoreArea.textContent = 0;
	player.lives = 3;
	lives.textContent = 3;
}
function keepScore () {
	score+= 10;
	scoreArea.textContent = score;
}

function endGame () {
	gameOver.classList.remove('modal-hide');
}

// Enemies our player must avoid
let Enemy = function () {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.x = -100;
	this.y = randomRow();
	this.speed = randomSpeed(2, 7);
};

const allEnemies = [];

let enemy1 = new Enemy();
let enemy2 = new Enemy();
let enemy3 = new Enemy();

allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.checkCollisions();
	//point where enemy goes off screen right
	this.endOfRowX = this.x > 501;
	
	if (this.endOfRowX) {
		this.x = -100;
		this.y = randomRow();
		this.speed = randomSpeed(2, 7);
	} else {
		this.x += this.speed + dt;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollisions = function () {
		if (player.x + 25 > this.x - 25 &&
			player.x - 25 < this.x + 25 &&
			player.y + 25 > this.y - 25 &&
			player.y - 25 < this.y + 25) {
				player.livesLeft();
				player.playerReset();
			}
	};
	// Now write your own player class
	// This class requires an update(), render() and
	// a handleInput() method.

let Player = function (x, y) {
	this.sprite = 'images/char-cat-girl.png';
	this.x = x;
	this.y = y;
	this.lives = 3;
};

Player.prototype.update = function () {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	if (this.y === -10) {
		//win and reset position
		keepScore();
		this.playerReset();
	}

	if(this.lives === 0) {
		endGame();
	}
};

Player.prototype.livesLeft = function () {
	this.lives--;
	lives.textContent = this.lives;
};

Player.prototype.playerReset = function () {
	player.x = 200;
	player.y = 400;
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyCode) {

	switch (keyCode) {
		case 'left':
			this.x -= 101;
			break;
		case 'up':
			this.y -= 82;
			break;
		case 'right':
			this.x += 101;
			break;
		case 'down':
			this.y += 82;
			break;
		default:
			break;
	}

	// Keeps player sprite from going off the board
	if (player.x < -2) {
		player.x = -2;
	} else if (player.x > 402) {
		player.x = 402;
	}

	if (player.y > 400) {
		player.y = 400;
	}

	console.table(player);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//starting coordiantes (200,400) is bottom center block; block to block movement is +/- 100
let player = new Player(200, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	player.handleInput(allowedKeys[e.keyCode]);
});

gameOver.addEventListener('click', function() {
	console.log("clicked");
	gameReset();
	gameOver.classList.add('modal-hide');
});

redoButton.addEventListener('click', gameReset, false);