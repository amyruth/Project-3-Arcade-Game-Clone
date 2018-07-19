// UDACITY FEND NANODEGREE PROJECT 3 - FROGGER CLONE
// by Amy Rutherford, completed July 10 2018

/* eslint-disable indent*/

let score = 0;
const scoreArea = document.getElementById('score');
const lives = document.getElementById('lives');
const gameOver = document.querySelector('.gameOver');
const winModal = document.querySelector('.winScreen');

const players = [
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];

//used for random speed and random character choice
function randomizer(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//randomly places enemies on the stone block rows
const randomRow = function () {
	return [60, 140, 225][Math.floor(Math.random() * [60, 140, 225].length)];
};

//used whenever game ends, win or lose
//resets player properties and gameboard
function gameReset() {
	player.playerReset();
	player.sprite = players[randomizer(0, 4)];
	player.lives = 3;
	score = 0;
	scoreArea.textContent = 0;
	lives.textContent = 3;
}

function keepScore() {
	score += 20;
	scoreArea.textContent = score;
}

//out of lives/game over modal
function endGame() {
	gameOver.classList.remove('modal-hide');
}

// Enemies our player must avoid
let Enemy = function () {
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.x = -100;
	this.y = randomRow();
	this.speed = randomizer(2, 7);
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
	// which will ensure the game runs at the same speed for all computers.

	// checks for collision with player,
	// then resets enemy position when the road is crossed
	this.checkCollisions();

	//point where enemy goes off screen right
	this.endOfRowX = this.x > 501;

	if (this.endOfRowX) {
		this.x = -100;
		this.y = randomRow();
		this.speed = randomizer(2, 7);
	} else {
		this.x += this.speed + dt;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollisions = function () {
	if (player.x + 40 > this.x - 40 &&
		player.x - 40 < this.x + 40 &&
		player.y + 40 > this.y - 40 &&
		player.y - 40 < this.y + 40) {
		player.livesLeft();
		player.playerReset();
	}
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function (x, y) {
	this.sprite = players[randomizer(0, 4)];
	this.x = x;
	this.y = y;
	this.lives = 3;
};

Player.prototype.update = function () {
	if (this.y === -10) {
		//win round and reset position
		keepScore();
		this.playerReset();
	}
};

Player.prototype.livesLeft = function () {
	this.lives--;
	lives.textContent = this.lives;
};

//returns player to starting position
Player.prototype.playerReset = function () {
	this.x = 200;
	this.y = 400;
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
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//starting coordiantes (200,400) is bottom center block; block to block movement is +/- 100 units
let player = new Player(200, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
	const allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

//Win/Lose modal handlers
gameOver.addEventListener('click', function () {
	gameReset();
	gameOver.classList.add('modal-hide');
});

winModal.addEventListener('click', function () {
	gameReset();
	winModal.classList.add('modal-hide');
});
