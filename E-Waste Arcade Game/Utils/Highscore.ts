﻿module EWasteUtils {
    export class Highscore {
        static addScore(score: number)
        {
            let newScore = "";
            if (StorageControl.getStorage("highscore") != null)
            {
                let scoreStringArray = StorageControl.getStorage("highscore").split(',')

                let scoreIntArray = this.getSortedScore(scoreStringArray, score);
                let loopAmount = scoreIntArray.length;

                if (loopAmount > 5)
                {
                    loopAmount = 5;
                }

                newScore = scoreIntArray[0].toString()

                for (let i = 1; i < loopAmount; i++)
                {
                    let temp = ',' + scoreIntArray[i].toString();
                    newScore += temp;
                }
            }
            else
            {
                newScore = score.toString();
            }

            StorageControl.setStorage("highscore", newScore,);
        }

        static getSortedScore(scoreStringArray: string[], newScore: number)
        {
            let scoreIntArray = new Array<number>(scoreStringArray.length + 1);
            for (let i = 0; i < scoreIntArray.length - 1; i++) {
                scoreIntArray[i] = parseInt(scoreStringArray[i]);
            }
            scoreIntArray[scoreIntArray.length - 1] = newScore;

            scoreIntArray.sort(function(a, b) { return b - a });

            return scoreIntArray;
        }
    }
}