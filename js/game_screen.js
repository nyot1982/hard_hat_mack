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
    gameXP = [];
    gameGround = [];
    modalGround = null;
    menuShip = null;
    gameBoss = null;
    menuShots = [];
    menuHits = [];
    gameShips = [];
    gameEnemies = [];
    gameShots = [];
    gameHits = [];
    gameItems = [];
    gameText = [];
    gameAlert = [];
    gameConfirm = [];
    idTypeAct = 0;
    gameModal = null;

    if (gameScreen == "game" && (screen == "menu" || screen == "game_over" || screen == "game_completed"))
    {
        ctx.translate (gameArea.centerPoint.x - canvasWidth / 2, gameArea.centerPoint.y - canvasHeight / 2);
        gameArea.centerPoint =
        {
            x: canvasWidth / 2,
            y: canvasHeight / 2,
        };
        if (gameMusic.active)
        {
            if (enemies == 0) gameMusic.musics.boss.stop ();
            else if (enemies > 0) gameMusic.musics.game.stop ();
        }
    }
    if (gameScreen == "menu" && screen == "intro" && gameMusic.active) gameMusic.musics.menu.stop ();
    gameScreen = screen;
    if (gameScreen == "start")
    {
        gameGround.push (new ground ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "svgs/title.svg", "", canvasWidth / 2, 100, 203, 92);
        gameText.push (new component ("text", "Welcome to Last Mission.", "white", canvasWidth / 2, 275, "center", 10));
        gameText.push (new component ("text", "Press any key to start...", "white", canvasWidth / 2, gameText [0].y + 30, "center", 10));
        gameText.push (new component ("text", "Remake by Marc Pinyot Gascón  1986-2024", "white", canvasWidth / 2, 445, "center", 10));
    }
    else if (gameScreen == "menu")
    {
        if (gameScreen == "menu" && gameMusic.active && !gameMusic.musics.menu.source) gameMusic.musics.menu.play ();
        gameGround.push (new ground ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "svgs/title.svg", "", canvasWidth / 2, 100, 203, 92);
        gameText.push (new component ("text", "Options:", "white", 310, gameTitle.y + 105, "left", 10));
        gameText.push (new component ("text", "One Player", "white", 575, gameText [0].y + 15, "left", 10));
        gameText.push (new component ("text", "Cooperative", "white", 575, gameText [1].y + 25, "left", 10));
        gameText.push (new component ("text", "Versus", "white", 575, gameText [2].y + 25, "left", 10));
        gameText.push (new component ("text", "Sound", "white", 575, gameText [3].y + 25, "left", 10));
        gameText.push (new component ("text", "Music", "white", 575, gameText [4].y + 25, "left", 10));
        gameText.push (new component ("text", "FPS Monitor", "white", 575, gameText [5].y + 25, "left", 10));
        gameText.push (new component ("text", "High Scores", "white", 575, gameText [6].y + 25, "left", 10));
        gameText.push (new component ("text", "Remake by Marc Pinyot Gascón  1986-2024", "white", canvasWidth / 2, 445, "center", 10));
        menuShip = new ship (null, 450, gameText [0].y + 15, 90);
        gameScreen = "menu";
    }
    else if (gameScreen == "high_scores")
    {
        gameGround.push (new ground ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "svgs/title.svg", "", canvasWidth / 2, 100, 203, 92);
        gameText.push (new component ("text", "High Scores:", "white", 310, gameTitle.y + 105, "left", 10));
        fetchLoad ("high_scores");
    }
    else if (gameScreen == "intro" || gameScreen == "game_over" || gameScreen == "game_completed")
    {
        gameGround.push (new ground ("menu", "black", 0, 0, canvasWidth, canvasHeight));
        var textMeasure = ctx.measureText (" ");

        if (gameScreen == "intro")
        {
            gameText.push (new component ("type", "YOU ARE AN OUTCAST ......", "white", 385, 150, "left", 10));
            gameText.push (new component ("type", "RESTORE YOUR HONOR ......", "white", 385, 210, "left", 10));
            gameText.push (new component ("type", "INVADE THE HOSTILE FORCES", "white", 385, 240, "left", 10));
            gameText.push (new component ("type", "WHO TORMENT YOUR PEOPLE .", "white", 385, 270, "left", 10));
            gameText.push (new component ("type", "YOUR QUEST FOR", "white", 385 + textMeasure.width, 330, "left", 10));
            gameText.push (new component ("type", "HONOR IS YOUR .....", "white", 385 + textMeasure.width * 6, 360, "left", 10));
            gameText.push (new component ("type", "LAST MISSION .", "white", 385 + textMeasure.width * 11, 390, "left", 10));
        }
        else if (gameScreen == "game_over")
        {
            gameText.push (new component ("type", "LAST MISSION", "white", canvasWidth / 2, 150, "center", 10));
            gameText.push (new component ("type", "HARD LUCK!", "white", canvasWidth / 2, 210, "center", 10));
            gameText.push (new component ("type", "YOUR MISSION HAS FAILED.", "white", canvasWidth / 2, 240, "center", 10));
        }
        else if (gameScreen == "game_completed")
        {
            gameText.push (new component ("type", "LAST MISSION", "white", canvasWidth / 2, 150, "center", 10));
            gameText.push (new component ("type", "WELL DONE!", "white", canvasWidth / 2, 210, "center", 10));
            gameText.push (new component ("type", "YOUR MISSION HAS", "white", canvasWidth / 2, 240, "center", 10));
            gameText.push (new component ("type", "SUCCEEDED.", "white", canvasWidth / 2, 270, "center", 10));
        }
        if (gameSound.active) gameSound.sounds ["type"].play ();
    }
    else if (gameScreen == "game")
    {
        if (gameModes.findIndex (mode => mode.active == true) == 0) generateGameMap ("level1");
        else generateGameMap ("mode" + gameModes.findIndex (mode => mode.active == true));
        for (var i = 0; i < gameShips.length; i++)
        {
            gameShips.push (new ship ("Player 1", startPoints [i].x, startPoints [i].y));
            startPoints [i].ship = "Player 1";
        }
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

function gameOpenModal (modal, text)
{
    menuShip = null;
    gameTitle = null;
    gameText = [];
    gameAlert = [];
    gameConfirm = [];
    startPoint =
    {
        x: gameArea.centerPoint.x - canvasWidth / 2,
        y: gameArea.centerPoint.y - canvasHeight / 2
    }
    if (gameModal == null) modalGround = new ground ("menu", "#000000DD", startPoint.x, startPoint.y, canvasWidth, canvasHeight);
    gameModal = modal;

    if (gameModal == "menu")
    {
        gameTitle = new component ("image", "svgs/title.svg", "", gameArea.centerPoint.x, startPoint.y + 100, 203, 92);
        gameText.push (new component ("text", "Options:", "white", startPoint.x + 310, gameTitle.y + 105, "left", 10));
        var startMenu = startPoint.y + 255;
        gameText.push (new component ("text", "Pause", "white", startPoint.x + 575, startMenu, "left", 10));
        startMenu += 25;
        gameText.push (new component ("text", "Sound", "white", startPoint.x + 575, startMenu, "left", 10));
        gameText.push (new component ("text", "Music", "white", startPoint.x + 575, gameText [gameText.length - 1].y + 25, "left", 10));
        gameText.push (new component ("text", "FPS Monitor", "white", startPoint.x + 575, gameText [gameText.length - 1].y + 25, "left", 10));
        gameText.push (new component ("text", "Exit", "white", startPoint.x + 575, gameText [gameText.length - 1].y + 25, "left", 10));
        gameText.push (new component ("text", "Remake by Marc Pinyot Gascón  1986-2024", "white", gameArea.centerPoint.x, startPoint.y + 445, "center", 10));
        menuShip = new ship (null, startPoint.x + 450, startPoint.y + 255, 90);
    }
    else
    {
        gameText.push (new component ("text", text, "white", gameArea.centerPoint.x, gameArea.centerPoint.y, "center", 32));
        gameText.push (new component ("text", "Press 'Esc' to " + gameModal + "...", "white", gameArea.centerPoint.x, gameText [0].y + 30, "center", 10));
    }
}

function gameCloseModal ()
{
    modalGround = null;
    gameTitle = null;
    gameText = [];
    menuShip = null;
    menuShots = [];
    menuHits = [];
    gameModal = null;
}

function generateGameMap (map)
{
    enemies = 270;
    if (map == "mode1" || map == "mode2")
    {
        startPoints =
        [
            {
                ship: null,
                x: 510,
                y: 250
            },
            {
                ship: null,
                x: 510,
                y: 210
            },
            {
                ship: null,
                x: 546,
                y: 210
            },
            {
                ship: null,
                x: 546,
                y: 250
            },
            {
                ship: null,
                x: 510,
                y: 345
            },
            {
                ship: null,
                x: 510,
                y: 305
            },
            {
                ship: null,
                x: 546,
                y: 305
            },
            {
                ship: null,
                x: 546,
                y: 345
            }
        ];
    }
    else
    {
        startPoints =
        [
            {
                ship: null,
                x: 510,
                y: 250
            },
            {
                ship: null,
                x: 510,
                y: 210
            },
            {
                ship: null,
                x: 546,
                y: 210
            },
            {
                ship: null,
                x: 546,
                y: 250
            },
            {
                ship: null,
                x: 3570,
                y: 1750
            },
            {
                ship: null,
                x: 3570,
                y: 1710
            },
            {
                ship: null,
                x: 3606,
                y: 1710
            },
            {
                ship: null,
                x: 3606,
                y: 1750
            }
        ];
    }
    switch (map)
    {
        case "level1":
            gameMap =
            {
                name: map,
                width: 4080,
                height: 2000
            };
            gameGround.push (new ground ("water", "#292C9C", 0, 0, gameMap.width, gameMap.height));
            gameEnemies.push (new enemy (3, 150, 100, 0));
            gameEnemies.push (new enemy (3, 900, 200, 0));
            gameEnemies.push (new enemy (3, 200, 400, 0));
            gameEnemies.push (new enemy (4, 800, 400, 0));
            gameEnemies.push (new enemy (5, 1300, 350, 0));
            gameEnemies.push (new enemy (4, 1700, 250, 0));
            gameEnemies.push (new enemy (6, 2500, 250, 0));
            gameEnemies.push (new enemy (5, 3500, 150, 0));
            gameEnemies.push (new enemy (3, 3850, 350, 0));
            gameEnemies.push (new enemy (6, 2500, 650, 0));
            gameEnemies.push (new enemy (6, 2700, 750, 0));
            gameEnemies.push (new enemy (6, 2500, 1200, 0));
            gameEnemies.push (new enemy (6, 3400, 1200, 0));
            gameEnemies.push (new enemy (5, 400, 1800, 0));
            gameEnemies.push (new enemy (5, 1500, 1600, 0));
            gameEnemies.push (new enemy (5, 2300, 1700, 0));
            gameEnemies.push (new enemy (5, 3900, 1900, 0));
            for (var y = 195; y < 2000; y += 410)
            {
                for (var x = 195; x < 4080; x += 410)
                {
                    gameEnemies.push (new enemy (Math.floor (Math.random () * 3), x, y, Math.floor (Math.random () * 720) - 360));
                }
            }
        break;
        case "mode1":
            gameMap =
            {
                name: map,
                width: 1020,
                height: 500
            };
            gameGround.push (new ground ("water", "#292C9C", 0, 0, gameMap.width, gameMap.height));
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
        case "mode2":
            gameMap =
            {
                name: map,
                width: 1020,
                height: 500
            };
            gameGround.push (new ground ("water", "#292C9C", 0, 0, gameMap.width, gameMap.height));
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