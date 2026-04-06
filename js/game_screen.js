function gameHighScores (max_high_scores, high_scores)
{
    gameText.pop ();
    if (!high_scores) gameText.push (new component ("text", "No results.", "red", 400, 255, "left", 10));
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
        gameText.push (new component ("text", pos + high_scores [i].name, "white", 400, 255 + i * 20, "left", 10));
        gameText.push (new component ("text", pre + high_scores [i].score, "white", 400 + ((max_high_scores + 8) * 10), 255 + i * 20, "left", 10));
        if (highScoreSave.indexOf (high_scores [i].id) > -1) gameText.push (new component ("text", ">>> New high score!", "#0C0", 400 + ((max_high_scores + 17) * 10), 255 + i * 20, "left", 10));
    }
    highScoreSave = [];
}

function gameLoadScreen (screen)
{
    gameTitle = null;
    gameBack = [];
    gamePlayers = [];
    gameEnemies = [];
    gameText = [];

    if (gameScreen == "game" && screen == "menu")
    {
        ctx.translate (gameArea.centerPoint.x - canvasWidth / 2, gameArea.centerPoint.y - canvasHeight / 2);
        gameArea.centerPoint =
        {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
        };
        if (gameMusic.active) gameMusic.musics.game.stop ();
    }
    else if (gameScreen == "menu" && screen == "game" && gameMusic.active) gameMusic.musics.menu.stop ();
    gameScreen = screen;
    if (gameScreen == "start")
    {
        gameBack.push (new back ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "svgs/title.svg", "", canvasWidth / 2, 100, 203, 92);
        gameText.push (new component ("text", "Welcome to Hard Hat Mack.", "white", canvasWidth / 2, 275, "center", 10));
        gameText.push (new component ("text", "Press any key to start...", "white", canvasWidth / 2, gameText [0].y + 30, "center", 10));
        gameText.push (new component ("text", "Remake by Marc Pinyot Gascón  1983-2026", "white", canvasWidth / 2, 445, "center", 10));
    }
    else if (gameScreen == "menu")
    {
        if (gameMusic.active /*&& !gameMusic.musics.menu.source*/) gameMusic.musics.menu.play ();
        gameBack.push (new back ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "svgs/title.svg", "", canvasWidth / 2, 100, 203, 92);
        gameText.push (new component ("text", "Options:", "white", 310, gameTitle.y + 105, "left", 10));
        gameText.push (new component ("text", "One Player", "white", 575, gameText [0].y + 15, "left", 10));
        gameText.push (new component ("text", "High Scores", "white", 575, gameText [1].y + 25, "left", 10));
        gameText.push (new component ("text", "Remake by Marc Pinyot Gascón  1983-2026", "white", canvasWidth / 2, 445, "center", 10));
    }
    else if (gameScreen == "high_scores")
    {
        gameBack.push (new back ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "svgs/title.svg", "", canvasWidth / 2, 100, 203, 92);
        gameText.push (new component ("text", "High Scores:", "white", 310, gameTitle.y + 105, "left", 10));
    }
    else if (gameScreen == "game")
    {
        generateGameMap ("level1");
        gamePlayers.push (new player (0, "Player 1", "red", 0, 0, 50, 50));
        if (gameMusic.active)
        {
            gameMusic.musics.menu.stop ();
            gameMusic.musics.game.play ();
        }
    }
    if (document.getElementById ("blackScreen").style.display == 'block')
    {
        $("#blackScreen").fadeOut (1000);
        setTimeout
        (
            () =>
            {
                blackScreen = false;
            },
            1000
        );
    }
}

function generateGameMap (map)
{
    switch (map)
    {
        case "level1":
            gameMap =
            {
                name: map,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("game", "#292C9C", 0, 0, gameMap.width, gameMap.height));
        break;
        case "level2":
            gameMap =
            {
                name: map,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("game", "#292C9C", 0, 0, gameMap.width, gameMap.height));
            gameEnemies.push (new enemy (3, 200, 100, 0));
            gameEnemies.push (new enemy (4, 400, 100, 0));
            gameEnemies.push (new enemy (5, 600, 100, 0));
            gameEnemies.push (new enemy (6, 200, 250, 0));
            gameEnemies.push (new enemy (3, 400, 250, 0));
            gameEnemies.push (new enemy (4, 600, 250, 0));
            gameEnemies.push (new enemy (5, 200, 400, 0));
            gameEnemies.push (new enemy (6, 400, 400, 0));
            gameEnemies.push (new enemy (3, 600, 400, 0));
        break;
        case "level3":
            gameMap =
            {
                name: map,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("game", "#292C9C", 0, 0, gameMap.width, gameMap.height));
            gameEnemies.push (new enemy (7, 110, 100, 0));
            gameEnemies.push (new enemy (7, 310, 100, 0));
            gameEnemies.push (new enemy (7, 510, 100, 0));
            gameEnemies.push (new enemy (7, 710, 100, 0));
            gameEnemies.push (new enemy (7, 910, 100, 0));
            gameEnemies.push (new enemy (7, 110, 250, 0));
            gameEnemies.push (new enemy (7, 310, 250, 0));
            gameEnemies.push (new enemy (7, 710, 250, 0));
            gameEnemies.push (new enemy (7, 910, 250, 0));
            gameEnemies.push (new enemy (7, 110, 400, 0));
            gameEnemies.push (new enemy (7, 310, 400, 0));
            gameEnemies.push (new enemy (7, 510, 400, 0));
            gameEnemies.push (new enemy (7, 710, 400, 0));
            gameEnemies.push (new enemy (7, 910, 400, 0));
        break;
    }
}

function toggleFullScreen ()
{
    const element = document.getElementsByTagName ("article")[0];
    element.requestFullscreen ();
}