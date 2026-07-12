function gameHighScores (max_high_scores, high_scores)
{
    gameText.pop ();
    if (!high_scores) gameText.push (new component ("text", "No results.", "red", 400, 255));
    else for (var i = 0; i < high_scores.length; i++)
    {
        if (i == 9) var pos = "10   ";
        else var pos = " " + (i + 1) + "   ";
        if (high_scores [i].score < 10) var pre = "00000";
        else if (high_scores [i].score < 100) var pre = "0000";
        else if (high_scores [i].score < 1000) var pre = "000";
        else if (high_scores [i].score < 10000) var pre = "00";
        else if (high_scores [i].score < 100000) var pre = "0";
        else var pre = "";
        gameText.push (new component ("text", pos + high_scores [i].name, "white", 400, 255 + i * 20));
        gameText.push (new component ("text", pre + high_scores [i].score, "white", 400 + ((max_high_scores + 8) * 10), 255 + i * 20));
        if (highScoreSave.indexOf (high_scores [i].id) > -1) gameText.push (new component ("text", ">>> New high score!", "#0C0", 400 + ((max_high_scores + 17) * 10), 255 + i * 20));
    }
    highScoreSave = [];
}

function gameLoadScreen (screen)
{
    if (loadScreen == null)
    {
        loadScreen = screen;
        if (screen == "start")
        {
            gameBack.push (new back ("black", 0, 0, canvasWidth, canvasHeight));
            gameText.push (new component ("text", "Welcome to Hard Hat Mack.", "white", 345, canvasHeight / 2 - 15));
            gameText.push (new component ("text", "Press any key to start...", "white", 350, gameText [0].y + 30));
            gameArea.start ();
            gameScreen = screen;
            $("preloader").fadeOut (1000);
            setTimeout
            (
                () =>
                {
                    loadScreen = null;
                },
                1000
            );
        }
        else
        {
            $("#blackScreen").fadeIn (1000);
            setTimeout
            (
                () =>
                {
                    gameTitle = null;
                    gameBack = [];
                    gameFront = [];
                    gamePlayers = [];
                    gameEnemies = [];
                    gameText = [];

                    if (gameScreen == "game" && screen == "menu" && gameMusic.active) gameMusic.musics.game.stop ();
                    else if (gameScreen == "menu" && screen == "game" && gameMusic.active) gameMusic.musics.menu.stop ();
                    gameScreen = screen;
                    if (gameScreen == "menu")
                    {
                        if (gameMusic.active/* && !gameMusic.musics.menu.source*/) gameMusic.musics.menu.play ();
                        gameBack.push (new back ("black", 0, 0, canvasWidth, canvasHeight));
                        gameTitle = new component ("image", "img/title.png", "", canvasWidth / 2, 150, 362, 40);
                        gameText.push (new component ("text", "IBM version by Dana How & Kevin Gilmore, through TMQ Software, inc.", "white", 56, gameTitle.y + 105));
                        gameText.push (new component ("text", "An original game design by Michael Abbot & Matthew Alexander.", "white", 90, gameText [0].y + 25));
                        gameText.push (new component ("text", "Web version developed by Marc Pinyot Gascón using JavaScript + Canvas.", "white", 27, gameText [1].y + 25));
                        gameText.push (new component ("text", "Vandal", "white", canvasWidth / 2 - 241, gameText [2].y + 83));
                        gameText.push (new component ("text", "Mack", "white", canvasWidth / 2 - 27, gameText [3].y));
                        gameText.push (new component ("text", "Osha", "white", canvasWidth / 2 + 173, gameText [4].y));
                        gameText.push (new enemy (0, 0, canvasWidth / 2 - 214, gameText [5].y + 23));
                        gameText.push (new player (0, "Mack", canvasWidth / 2 - 13, gameText [5].y + 25));
                        gameText.push (new enemy (1, 0, canvasWidth / 2 + 186, gameText [5].y + 23));
                        gameText.push (new beam_h ("#FF55FF", "#55FFFF", canvasWidth / 2 - 256, gameText [5].y + 55, 512));
                        gameText.push (new component ("image", "img/electronic_arts.png", "", 124, 577, 192, 66));
                        gameText.push (new component ("text", "(C)1984 The Duplicators - 2026 nYoT", "white", canvasWidth / 2, 596));
                    }
                    else if (gameScreen == "high_scores")
                    {
                        gameBack.push (new back ("black", 0, 0, canvasWidth, canvasHeight));
                        gameTitle = new component ("image", "img/title.png", "", canvasWidth / 2, 100, 362, 40);
                        gameText.push (new component ("text", "High Scores:", "white", 310, gameTitle.y + 105));
                    }
                    else if (gameScreen == "game")
                    {
                        if (gameMusic.active) gameMusic.musics.game.play ();
                        generateGameMap ("level1");
                    }
                    $("#blackScreen").fadeOut (1000);
                    setTimeout
                    (
                        () =>
                        {
                            loadScreen = null;
                        },
                        1000
                    );
                },
                1000
            );
        }
    }
}

function generateGameMap (map)
{
    gameText.push (new component ("text", "Bonus:", "white", gameMap.width / 2 - 251, gameMap.height - 398));
    gameText.push (new component ("text", "04700", "white", gameMap.width / 2 - 161, gameMap.height - 398));
    gameText.push (new component ("text", "Score:", "white", gameMap.width / 2 - 69, gameMap.height - 398));
    gameText.push (new component ("text", "00000", "white", gameMap.width / 2 + 21, gameMap.height - 398));
    gameText.push (new component ("text", "Hi-score:", "white", gameMap.width / 2 + 113, gameMap.height - 398));
    gameText.push (new component ("text", "03150", "white", gameMap.width / 2 + 245, gameMap.height - 398));
    gameText.push (new component ("text", "Level", "white", gameMap.width - 217, gameMap.height - 268, true));
    gameText.push (new component ("text", "01", "white", gameMap.width - 231, gameMap.height - 172));
    gameText.push (new component ("text", "Mack", "white", gameMap.width - 217, gameMap.height - 108, true));
    gameText.push (new component ("text", "3", "white", gameMap.width - 217, gameMap.height - 28));
    switch (map)
    {
        case "level1":
            gameMap =
            {
                name: map,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("black", 0, 0, gameMap.width, gameMap.height));
            gameBack.push (new beam_v ("#FFFFFF", "#55FFFF", gameMap.width / 2 - 139, 438, 240));
            gameBack.push (new beam_v ("#FFFFFF", "#55FFFF", gameMap.width / 2 + 117, 438, 240));
            gameBack.push (new chain ("#55FFFF", gameMap.width / 2 - 186, gameMap.height - 110, 4));
            gameBack.push (new chain ("#55FFFF", gameMap.width / 2 + 178, gameMap.height - 174, 4));
            gameBack.push (new chain ("#55FFFF", gameMap.width / 2 - 186, gameMap.height - 238, 4));
            gameBack.push (new chain ("#55FFFF", gameMap.width / 2 + 60, gameMap.height - 302, 4));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", gameMap.width / 2 - 159, gameMap.height - 46));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", gameMap.width / 2 - 59, gameMap.height - 46));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", gameMap.width / 2 + 41, gameMap.height - 46));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", gameMap.width / 2 + 141, gameMap.height - 46));
            gameFront.push (new floor ("white", gameMap.width / 2 - 267, gameMap.height -20, 534, 6));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", gameMap.width / 2 - 195, gameMap.height - 62, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", gameMap.width / 2 - 195, gameMap.height - 126, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", gameMap.width / 2 - 195, gameMap.height - 190, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", gameMap.width / 2 - 195, gameMap.height - 254, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", gameMap.width / 2 - 195, gameMap.height - 318, 390));
            gameFront.push (new bouncy ("#FFFFFF", "#FF55FF", "#55FFFF", gameMap.width / 2 + 233, gameMap.height - 44))
            gameEnemies.push (new enemy (Math.floor (Math.random () * 2), 0, gameMap.width / 2 - 194, gameMap.height - 158));
            gamePlayers.push (new player (0, "Mack", gameMap.width / 2 + 160, gameMap.height - 92, -1));
        break;
        case "level2":
            gameMap =
            {
                name: map,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("black", 0, 0, gameMap.width, gameMap.height));
            gameEnemies.push (new enemy (3, 200, 100, 0));
            gameEnemies.push (new enemy (4, 400, 100, 0));
            gameEnemies.push (new enemy (5, 600, 100, 0));
        break;
        case "level3":
            gameMap =
            {
                name: map,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("black", 0, 0, gameMap.width, gameMap.height));
            gameEnemies.push (new enemy (7, 110, 100, 0));
            gameEnemies.push (new enemy (7, 310, 100, 0));
            gameEnemies.push (new enemy (7, 510, 100, 0));
        break;
    }
}

function toggleFullScreen ()
{
    const element = document.getElementsByTagName ("article")[0];
    element.requestFullscreen ();
}