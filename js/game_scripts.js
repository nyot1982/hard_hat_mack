var canvasWidth = 1024,
    canvasHeight = 740,
    gravity = 0.1,
    gravitySpeed = 0,
    blackScreen = false,
    gameScreen = null,
    gameTitle = null,
    gameMap =
    {
        name: null,
        width: canvasWidth,
        height: canvasHeight
    },
    gameControls =
    {
        99: "keyboard"
    },
    pressed =
    {
        keys:
        {
            99: []
        },
        buttons: [],
        axes: []
    },
    mouse =
    {
        x: 0,
        y: 0,
        wheelX: 0,
        wheelY: 0,
        wheelZ: 0,
        pressed: []
    },
    gameObjects = [],
    gameBack = [],
    players = [],
    gameEnemies = [],
    gameText = [],
    highScores = [],
    highScoreSave = [],
    userActions =
    [
        {
            screen: ["game"],
            action: "move_up",
            title: "Move up",
            editable: true,
            keyboard:
            {
                keys: [38] // Up
            },
            gamepad:
            {
                buttons: [7], // RT
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: [1]
            }
        },
        {
            screen: ["game"],
            action: "move_down",
            title: "Move down",
            editable: true,
            keyboard:
            {
                keys: [40] // Down
            },
            gamepad:
            {
                buttons: [6], // LT
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: [1]
            }
        },
        {
            screen: ["game"],
            action: "move_left",
            title: "Move left",
            editable: true,
            keyboard:
            {
                keys: [37] // Left
            },
            gamepad:
            {
                buttons: [7], // RT
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: [1]
            }
        },
        {
            screen: ["game"],
            action: "move_right",
            title: "Move right",
            editable: true,
            keyboard:
            {
                keys: [39] // Right
            },
            gamepad:
            {
                buttons: [6], // LT
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: [1]
            }
        },
        {
            screen: ["game"],
            action: "jump",
            title: "Jump",
            editable: true,
            keyboard:
            {
                keys: [32] // Space
            },
            gamepad:
            {
                buttons: [0], // A
                axes: []
            },
            joystick:
            {
                buttons: [0],
                axes: []
            }
        },
        {
            screen: ["game"],
            action: "drop_drill",
            title: "Drop drill",
            editable: true,
            keyboard:
            {
                keys: [13] // Enter
            },
            gamepad:
            {
                buttons: [3], // Y
                axes: []
            },
            joystick:
            {
                buttons: [1],
                axes: []
            }
        }
    ],
    gameSound =
    {
        active: true,
        sounds: []
    },
    gameMusic =
    {
        active: true,
        musics: []
    },
    gameArea =
    {
        canvas: document.createElement ("canvas"),
        start: function ()
        {
            this.canvas.id = "hardHatMack";
            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            this.canvas.innerText = "Este navegador no soporta la etiqueta de canvas.";
            this.ctx = this.canvas.getContext ("2d");
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = "high";
            document.getElementsByTagName ("article")[0].insertBefore (this.canvas, document.getElementsByTagName ("article")[0].childNodes [0]);
            this.canvas.setAttribute ("onmousemove", "javascript: mouseMove (event);");
            this.canvas.setAttribute ("onmousedown", "javascript: mouseDown (event);");
            this.canvas.setAttribute ("onmouseup", "javascript: mouseUp (event);");
            document.addEventListener
            (
                "wheel",
                function (e)
                {
                    mouseWheel (e);
                },
                {
                    passive: true
                }
            );
            this.frame = 0;
            this.time = 0;
            this.centerPoint = 
            {
                x: canvasWidth / 2,
                y: canvasHeight / 2,
            };
            this.play ();
        },
        play: function ()
        {
            if (gameScreen == "game" && gameMusic.active) gameMusic.musics.game.play ();
            this.animation = window.requestAnimationFrame (updateGameArea);
        },
        pause: function ()
        {
            if (gameScreen == "game" && gameMusic.active) gameMusic.musics.game.pause ();
            window.cancelAnimationFrame (this.animation);
        },
        stop: function ()
        {
            stopUserInteractions ();
            window.cancelAnimationFrame (this.animation);
            this.frame = null;
            this.ctx = null;
            this.canvas = null;
        },
        clear: function ()
        {
            this.ctx.clearRect (0, 0, this.canvas.width, this.canvas.height);
        }
    };

$(document).ready (function ()
{
    $("preloader").fadeOut (1000);
    gameLoadScreen ("start");
    gameArea.start ();
});

function updateGameArea ()
{
    controls ();
    gameArea.clear ();
    for (var back in gameBack) gameBack [back].update ();
    if (gameScreen == "start")
    {
        if (Object.keys (gameSound.sounds).length > 0 && Object.keys (gameMusic.musics).length > 0)
        {
            var loadedAudio = 0;
            for (var sound in gameSound.sounds) if (gameSound.sounds [sound].duration > 0) loadedAudio++;
            for (var music in gameMusic.musics) if (gameMusic.musics [music].duration > 0) loadedAudio++;
            gameText [1].src = "Loading audio: " + loadedAudio + "/" + (Object.keys (gameSound.sounds).length + Object.keys (gameMusic.musics).length) + " Files.";
            gameText [1].color = "#0C0";
            if (loadedAudio == Object.keys (gameSound.sounds).length + Object.keys (gameMusic.musics).length)
            {
                $("#blackScreen").fadeIn (1000);
                setTimeout
                (
                    () =>
                    {
                        gameLoadScreen ("menu");
                    },
                    1000
                );
            }
        }
    }
    else if (gameScreen == "game")
    {
        gameEnemies = gameEnemies.filter (enemy => enemy.life > 0);
        gameObjects = gameEnemies.concat (players);
        for (var object in gameObjects)
        {
            gameObjects [object].newPos ();
            gameObjects [object].update (object);
        }
    }
    gameArea.frame++;
    gameArea.animation = window.requestAnimationFrame (updateGameArea);
}