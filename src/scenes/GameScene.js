import Phaser from "phaser";
import PaddelRef from "../assets/images/Paddel.png";
import BallRef from "../assets/images/Ball.png";
import BrickRef from "../assets/images/Brick.png";
import BrickSpecialRef from "../assets/images/SpecialBrick.png";
import BrickWeakRef from "../assets/images/WeakBrick.png";

let player, ball, WeakBricks, SpecialBricks, NormalBricks, cursors;
let gameStarted = false;
let openingText, gameOverText, playerWonText;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    preload() {
        this.load.image('paddel', PaddelRef);
        this.load.image('ball', BallRef);
        this.load.image('brick', BrickRef);
        this.load.image('brick_special', BrickSpecialRef);
        this.load.image('brick_weak', BrickWeakRef);
    }
    create() {
        player = this.physics.add.sprite(400, 600, 'paddel');
        ball = this.physics.add.sprite(400, 565, 'ball');
        WeakBricks = this.physics.add.group({
            key: 'brick_weak',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 80,
                y: 140,
                stepX: 70
            }
        });
        SpecialBricks = this.physics.add.group({
            key: 'brick_special',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 80,
                y: 90,
                stepX: 70
            }
        });
        NormalBricks = this.physics.add.group({
            key: 'brick',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 80,
                y: 40,
                stepX: 70
            }
        });

        player.setCollideWorldBounds(true);
        ball.setCollideWorldBounds(true);
        ball.body.setBounce(1, 1);

        player.setImmovable(true);

        this.physics.world.checkCollision.down = false;

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(ball, WeakBricks, hitBrick, null, this);
        this.physics.add.collider(ball, SpecialBricks, hitBrick, null, this);
        this.physics.add.collider(ball, NormalBricks, hitBrick, null, this);
		this.physics.add.collider(ball, player, hitPlayer, null, this);

		//TEXTS
		openingText = this.add.text(
			this.physics.world.bounds.width / 2,
			this.physics.world.bounds.height / 2,
			'Press SPACE to Start',
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '50px',
				fill: '#000'
			}
			);
		openingText.setOrigin(0.5);
		gameOverText = this.add.text(
			this.physics.world.bounds.width / 2,
			this.physics.world.bounds.height / 2,
			'Game Over',
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '50px',
				fill: '#000'
			}
			);
		gameOverText.setOrigin(0.5);
		gameOverText.setVisible(false);

			playerWonText = this.add.text(
			this.physics.world.bounds.width / 2,
			this.physics.world.bounds.height / 2,
			'You Won!',
			{
				fontFamily: 'Monaco, Courier, monospace',
				fontSize: '50px',
				fill: '#000'
			}
			);
		playerWonText.setOrigin(0.5);
		playerWonText.setVisible(false);
    }
    update(delta) {
        if (isGameOver(this.physics.world)) {
            gameOverText.setVisible(true);
  			ball.disableBody(true, true);
  			player.body.setVelocityX(0);
        } else if (isWon()) {
            playerWonText.setVisible(true);
  			ball.disableBody(true, true);
  			player.body.setVelocityX(0);
        } else {
            if (!gameStarted) {
                ball.setX(player.x);
                if (cursors.space.isDown) {
                    gameStarted = true;
                    ball.setVelocityY(-200);
                    openingText.setVisible(false);
                }
            }
            //Run The Game Logic
            player.body.setVelocityX(0);

            if (cursors.left.isDown) {
                player.body.setVelocityX(-350);
            } else if (cursors.right.isDown) {
                player.body.setVelocityX(350);
            }
        }
    }
}

export default GameScene;


//FUNCTIONS
function isGameOver(world) {
    return ball.body.y > world.bounds.height;
}

function isWon() {
    return WeakBricks.countActive() + SpecialBricks.countActive() + NormalBricks.countActive() === 0;
}

function hitBrick(ball, brick) {
    brick.disableBody(true, true);
    let randNum = Math.random();
    if (ball.body.velocity.x === 0) {
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
        	ball.body.setVelocityX(-150);
        }
    }
}
function hitPlayer(ball,player){
	ball.setVelocityY(ball.body.velocity.y - 5);

	let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
	if(ball.x < player.x){
		ball.setVelocityX(-newXVelocity);
	}else{
		ball.setVelocityX(newXVelocity);
	}
}