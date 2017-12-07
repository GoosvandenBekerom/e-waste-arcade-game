﻿module EwasteGameObjects {
    export enum PlayerState { IDLE, RUNNING, JUMPING }
    export enum WasteType { WASTE_1, WASTE_2, WASTE_3 }

    export class Player extends Phaser.Sprite {
        game: Phaser.Game;
        playerState: PlayerState;
        bin: Bin;
        backgroundWidth: number;

        // inputs
        joystick: EWasteUtils.JoystickInput;
        
        // camera follow variables
        middleOfScreen: number;
        horizontalOffset: number;

        // move variables
        verticalMoveOffset: number;
        speed = 50;
        speedIncrease = 0.05;
        animationSpeed = 20;
        topBounds: number;
        botBounds: number;
        jumpTimer = 0;
        floor: Phaser.Sprite;

        constructor(game: Phaser.Game, x: number, y: number, backgroundWidth: number, floor: Phaser.Sprite) {
            super(game, x, y, "CHAR_RUNNING", 0);
            this.game = game;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;
            this.body.bounce.y = 0;
            this.body.gravity.y = 500;

            this.backgroundWidth = backgroundWidth;

            this.middleOfScreen = this.game.height / 2;
            this.horizontalOffset = this.game.width / 2 - this.x;

            this.verticalMoveOffset = 5;
            this.topBounds = this.height;
            this.botBounds = this.game.height;

            this.joystick = new EWasteUtils.JoystickInput(
                this.game,
                Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
                Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.Z, Phaser.Keyboard.X
            );

            this.bin = new Bin(this.game, 125 , -120);
            this.addChild(this.bin);
            this.joystick.YELLOW.onDown.add(Bin.prototype.changeCollectorBin, this.bin);

            this.anchor.set(0.0, 1.0);

            this.floor = floor;
            this.game.physics.enable(this.floor, Phaser.Physics.ARCADE);
            this.floor.scale.x = this.game.width;
            this.floor.height = 1;
            this.floor.body.allowGravity = false;

            this.startRunning();
        }

        update() {
            // increase speed
            this.speed += this.speedIncrease;

            // move forward
            this.body.velocity.x = this.speed * (60 / this.game.time.elapsedMS);
            this.floor.x = this.x;

            // move up or down
            var move = 0;
            if (this.joystick.UP.isDown) {
                this.body.velocity.y = -600;
                this.jumpTimer = this.game.time.now + 750;
            }
            if (this.joystick.DOWN.isDown) {
                //TODO: crouch/duck
            }

            if (this.game.physics.arcade.collide(this, this.floor)) {
                console.log("coll");
            }
            
            // update camera
            this.game.camera.focusOnXY(this.x + this.horizontalOffset, this.middleOfScreen);
        }

        private clampVerticleMove(move: number) {
            return (move < this.topBounds)
                ? this.topBounds
                : ((move > this.botBounds) ? this.botBounds : move);
        }
        
        private startRunning() {
            this.playerState = PlayerState.RUNNING;
            this.loadTexture("CHAR_RUNNING", 0);
            this.animations.add("running");
            this.animations.play("running", this.animationSpeed, true);
        }
    }
}