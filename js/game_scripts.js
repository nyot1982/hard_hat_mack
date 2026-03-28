var canvasWidth = 1024,
    canvasHeight = 740,
    idTypeAct = 0,
    blackScreen = false,
    gameScreen = null,
    gameModal = null,
    gameTitle = null,
    gameXP = [],
    gameMap =
    {
        name: null,
        width: canvasWidth,
        height: canvasHeight
    },
    modalGround = null,
    gameControls =
    {
        99: "keyboard"
    },
    menuControl = 99,
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
    gameGround = [],
    gameChars = [],
    gameEnemies = [],
    gameItems = [],
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
            screen: ["modal_menu"],
            action: "strafe_up",
            keyboard:
            {
                keys: [40] // Up
            },
            gamepad:
            {
                buttons: [13], // Up
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: [1]
            }
        },
        {
            screen: ["modal_menu"],
            action: "strafe_down",
            keyboard:
            {
                keys: [38] // Down
            },
            gamepad:
            {
                buttons: [12], // Down
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: [1]
            }
        },
        {
            screen: ["modal_menu"],
            action: "fire_menu",
            keyboard:
            {
                keys: [13, 32] // Enter, Space
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
            action: "turn_left",
            title: "Turn left",
            editable: true,
            keyboard:
            {
                keys: [37] // Left
            },
            gamepad:
            {
                buttons: [],
                axes: [0, 2] // LS, RS
            },
            joystick:
            {
                buttons: [],
                axes: [0]
            }
        },
        {
            screen: ["game"],
            action: "turn_right",
            title: "Turn right",
            editable: true,
            keyboard:
            {
                keys: [39] // Right
            },
            gamepad:
            {
                buttons: [],
                axes: [0, 2] // LS, RS
            },
            joystick:
            {
                buttons: [],
                axes: [0]
            }
        },
        {
            screen: ["game"],
            action: "strafe_left",
            title: "Strafe left",
            editable: true,
            keyboard:
            {
                keys: [90] // Z
            },
            gamepad:
            {
                buttons: [4], // LB
                axes: []
            },
            joystick:
            {
                buttons: [2],
                axes: []
            }
        },
        {
            screen: ["game"],
            action: "strafe_right",
            title: "Strafe right",
            editable: true,
            keyboard:
            {
                keys: [88] // X
            },
            gamepad:
            {
                buttons: [5], // RB
                axes: []
            },
            joystick:
            {
                buttons: [3],
                axes: []
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

function fetchLoad (cont, param)
{
    if (cont == "player")
    {
        gameText.push (new component ("text", cont == "player" ? "Loading..." : "Saving...", "yellow", 745, 395, "left", 10));
        param = 'id=' + gameChars [0].id + '&' + param;
    }
  
    var cadParam = "fetch_call=fetch_origin";
    if (param) cadParam += "&" + param;

    const options =
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: cadParam
    };

    const isResponseOk = response =>
    {
        if (!response.ok) throw new Error (response.status);
        return response.json ();
    }
      
    fetch ("fetch/" + cont + ".php", options)
    .then (response => isResponseOk (response))
    .then
    (
        responseJSON =>
        {
            if (responseJSON ["error"])
            {
                if (cont == "player")
                {
                    gameText.pop ();
                    gameAlert.push (new component ("text", responseJSON ["error"], "red", 745, 395, "left", 10));
                }
                else console.error ("Error! ", responseJSON ["error"]);
            }
            else document.getElementById (cont).innerHTML += responseJSON [cont];
        }
    )
    .catch (error => console.error ("Error! ", error.message));
}

function updateGameArea ()
{
    controls ();
    gameArea.clear ();
    for (var ground in gameGround) gameGround [ground].update ();
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
        gameItems = gameItems.filter (item => !item.taken);
        gameShots = gameShots.filter (shot => !shot.hit && shot.x > 0 && shot.x < gameMap.width && shot.y > 0 && shot.y < gameMap.height);
        gameHits = gameHits.filter (hit => !hit.reverse || hit.r > 0);
        gameEnemies = gameEnemies.filter (enemy => enemy.life > 0);
        gameObjects = gameItems.concat (gameEnemies).concat (gameChars).concat (gameShots);
        for (var object in gameObjects)
        {
            gameObjects [object].newPos ();
            gameObjects [object].update ();
            if (gameHits.findIndex (hit => hit.name == gameObjects [object].name) > -1) for (var hit in gameHits.filter (hit => hit.name == gameObjects [object].name)) gameHits [hit].update ();
        }
        for (var hit in gameHits.filter (hit => hit.name == "hit0")) gameHits [hit].update ();
    }
    if (gameModal != null || gameScreen != "game")
    {
        if (modalGround) modalGround.update ();
        menuShots = menuShots.filter (shot => !shot.hit && shot.x > 0 && shot.x < gameMap.width && shot.y > 0 && shot.y < gameMap.height);
        for (var shot in menuShots) menuShots [shot].update ();
        menuHits = menuHits.filter (hit => !hit.reverse || hit.r > 0);
        if (gameTitle) gameTitle.update ();
        for (var xp in gameXP) gameXP [xp].update ();
        for (var text in gameText)
        {
            if (gameText [text]) gameText [text].update (text);
            if (menuHits.findIndex (hit => hit.name == gameText [text].src) > -1) for (var hit in menuHits.filter (hit => hit.name == gameText [text].src)) menuHits [hit].update ();
        }
        for (var confirm in gameConfirm) gameConfirm [confirm].update ();
        for (var alert in gameAlert) gameAlert [alert].update ();
        if (gameScreen != "game") for (var char in gameChars) gameChars [char].update ();
    }
    gameArea.frame++;
    gameArea.animation = window.requestAnimationFrame (updateGameArea);
}