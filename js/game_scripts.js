var canvasWidth = 1024,
    canvasHeight = 740,
    gravity = 0.1,
    gravitySpeed = 0,
    blackScreen = false,
    gameScreen = null,
    gameModal = null,
    gameTitle = null,
    gameMap =
    {
        name: null,
        width: canvasWidth,
        height: canvasHeight
    },
    modalBack = null,
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
    menuShots = [],
    menuHits = [],
    gameObjects = [],
    gameBack = [],
    gameChars = [],
    gameEnemies = [],
    gameText = [],
    gameAlert = [],
    gameConfirm = [],
    gameShots = [],
    gameHits = [],
    highScores = [],
    highScoreSave = [],
    userActions =
    [
        {
            screen: ["modal_continue"],
            action: "close_continue",
            keyboard:
            {
                keys: [27] // Escape
            },
            gamepad:
            {
                buttons: [9, 16], // Start, Home
                axes: []
            },
            joystick:
            {
                buttons: [7],
                axes: []
            }
        },
        {
            screen: ["modal_exit"],
            action: "close_exit",
            keyboard:
            {
                keys: [27] // Escape
            },
            gamepad:
            {
                buttons: [9, 16], // Start, Home
                axes: []
            },
            joystick:
            {
                buttons: [7],
                axes: []
            }
        },
        {
            screen: ["modal_menu"],
            action: "close_modal",
            keyboard:
            {
                keys: [27] // Escape
            },
            gamepad:
            {
                buttons: [9, 16], // Start, Home
                axes: []
            },
            joystick:
            {
                buttons: [7],
                axes: []
            }
        },
        {
            screen: ["confirm"],
            action: "confirm_yes",
            keyboard:
            {
                keys: [89] // Y
            },
            gamepad:
            {
                buttons: [9], // Start
                axes: []
            },
            joystick:
            {
                buttons: [1],
                axes: []
            }
        },
        {
            screen: ["confirm"],
            action: "confirm_no",
            keyboard:
            {
                keys: [78] // N
            },
            gamepad:
            {
                buttons: [8], // Select
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
            action: "move_front",
            title: "Move forward",
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
            action: "move_back",
            title: "Move backward",
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
            action: "fire",
            title: "Fire",
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
            action: "open_modal",
            title: "Menu",
            editable: false,
            keyboard:
            {
                keys: [27] // Escape
            },
            gamepad:
            {
                buttons: [9, 16], // Start, Home
                axes: []
            },
            joystick:
            {
                buttons: [7],
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
        active: false,
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
            if (gameScreen == "game" /*&& gameMusic.active*/) gameMusic.musics.game.play ();
            this.animation = window.requestAnimationFrame (updateGameArea);
        },
        pause: function ()
        {
            if (gameScreen == "game" /*&& gameMusic.active*/) gameMusic.musics.game.pause ();
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
    gameLoadScreen ("menu");
    gameArea.start ();
});

function updateGameArea ()
{
    controls ();
    gameArea.clear ();
    for (var back in gameBack) gameBack [back].update ();
    if (gameScreen == "game")
    {
        gameEnemies = gameEnemies.filter (enemy => enemy.life > 0);
        gameObjects = gameEnemies.concat (gameChars);
        for (var object in gameObjects)
        {
            gameObjects [object].newPos ();
            gameObjects [object].update (object);
        }
    }
    if (gameModal != null || gameScreen != "game")
    {
        if (modalBack) modalBack.update ();
        if (gameTitle) gameTitle.update ();
        for (var text in gameText) if (gameText [text]) gameText [text].update (text);
        for (var confirm in gameConfirm) gameConfirm [confirm].update ();
        for (var alert in gameAlert) gameAlert [alert].update ();
        if (gameScreen != "game") for (var char in gameChars) gameChars [char].update (char);
    }
    gameArea.frame++;
    gameArea.animation = window.requestAnimationFrame (updateGameArea);
}