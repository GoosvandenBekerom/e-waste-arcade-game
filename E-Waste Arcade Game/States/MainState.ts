﻿module EWasteGameStates {

    export class MainState extends Phaser.State {
        game: Phaser.Game;
        music: Phaser.Sound;
        player: EwasteGameObjects.Player;
        scene: EwasteGameObjects.Scene;
        pickupManager: EwasteGameObjects.PickupManager;
        obstacleManager: EwasteGameObjects.ObstacleManager;
        canvas: EwasteGameObjects.GUI;

        ESC: Phaser.Key;

        startOffset = 100;
        amountOfBackgroundRepeats = 10000;
        
        create() {
            var widthBounds = this.game.width * this.amountOfBackgroundRepeats;
            this.scene = new EwasteGameObjects.Scene(this.game, 0, 0, widthBounds);
            this.player = new EwasteGameObjects.Player(
                this.game, this.startOffset, this.game.height / 2, widthBounds);
            this.pickupManager = new EwasteGameObjects.PickupManager(this.game, this, this.player);
            this.obstacleManager = new EwasteGameObjects.ObstacleManager(this.game, this, this.player);
            this.canvas = new EwasteGameObjects.GUI(this.game, this.player);

            this.game.add.existing(this.scene);
            this.game.add.existing(this.player);
            this.game.add.existing(this.pickupManager);
            this.game.add.existing(this.obstacleManager);
            this.game.add.existing(this.canvas);

            this.game.world.setBounds(0, 0, widthBounds, this.scene.height);

            this.ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
            this.ESC.onDown.add(EWasteGameStates.MainState.prototype.GameOver, this);

            this.music = this.game.add.audio("BackgoundLoop");
            this.music.volume = 0.1;
            this.music.loop = true;
            //this.music.play();

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.enable(this.player);

            this.obstacleManager.enableBody = true;
            this.obstacleManager.physicsBodyType = Phaser.Physics.ARCADE;
        }

        update() {
            this.game.physics.arcade.overlap(this.player, this.obstacleManager, this.Collision, null, this);

            this.game.debug.body(this.player, 'rgba(255,0,0,0.5)');
        }

        private Collision(player, obstacle) {
            console.log("obstacle collision");  
        }

        GameOver() {
            this.music.stop();
            this.game.state.start("GameOverState");
        }
    }
}