﻿module EwasteGameObjects {
    export class UIText extends Phaser.BitmapText {
        game: Phaser.Game;

        constructor(game: Phaser.Game, text: string, x: number, y: number, size: number)
        {
            super(game, x, y, 'desyrel', text, size);
            this.game = game;
        }

        updateUIText(text: string)
        {
            this.text = text;
        }
    }
}