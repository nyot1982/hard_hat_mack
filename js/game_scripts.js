var fpsMonitor =
    {
        time: 0,
        frame: 0,
        fps: 0,
        ms: 0
    },
    canvasWidth = 1020,
    canvasHeight = 500,
    enemies = 0,
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
    menuShip = null,
    gameBoss = null,
    gameTab = "menu",
    controlTab = "keyboard",
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
    gameShips = [],
    gameEnemies = [],
    gameItems = [],
    gameText = [],
    gameAlert = [],
    gameConfirm = [],
    gameShots = [],
    gameHits = [],
    highScores = [],
    highScoreSave = [],
    playerId = null,
    players = [],
    storedPlayers = [],
    playerColors = ["#A5FF9A", "#FF9AA5", "#9AA5FF", "#FFFF9A", "#9AFFFF", "#9A9A9A", "#FF9AFF", "#FFFFFF"],
    changingButton = null,
    userActions =
    [
        {
            screen: ["menu", "modal_menu"],
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
            screen: ["menu", "modal_menu"],
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
            screen: ["menu", "modal_menu"],
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
            screen: ["input"],
            action: "input_change",
            keyboard:
            {
                keys: [9] // Tabulator
            },
            gamepad:
            {
                buttons: [],
                axes: []
            },
            joystick:
            {
                buttons: [],
                axes: []
            }
        },
        {
            screen: ["input"],
            action: "input_exit",
            keyboard:
            {
                keys: [27] // Escape
            },
            gamepad:
            {
                buttons: [2, 8], // X, Select
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
            action: "change_weapon",
            title: "Fire mode",
            editable: true,
            keyboard:
            {
                keys: [9] // Tabulator
            },
            gamepad:
            {
                buttons: [3, 8], // Y, Select
                axes: []
            },
            joystick:
            {
                buttons: [1],
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
            action: "moveZ",
            title: "Take off / Land",
            editable: true,
            keyboard:
            {
                keys: [17] // Control
            },
            gamepad:
            {
                buttons: [1, 2], // B, X
                axes: []
            },
            joystick:
            {
                buttons: [6],
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
    startPoints = [],
    gameModes =
    [
        {
            title: "One Player",
            icon: "user",
            active: false
        },
        {
            title: "Local Multiplayer (Cooperative)",
            icon: "user-group",
            active: false
        },
        {
            title: "Local Mltiplayer (Versus)",
            icon: "regular fa-user-group",
            active: false
        },
        {
            title: "Online Multiplayer",
            icon: "users",
            active: false
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
    if (typeof (Storage) === "undefined") alert ("This browser does not support local web storage.");
    else
    {
        if (typeof (localStorage.gameSound) !== "undefined" && localStorage.gameSound != "")
        {
            gameSound.active = localStorage.gameSound == 1 ? true : false;
            document.getElementById ("sound").innerHTML = gameSound.active ? "On" : "Off";
        }
        if (typeof (localStorage.gameMusic) !== "undefined" && localStorage.gameMusic != "")
        {
            gameMusic.active = localStorage.gameMusic == 1 ? true : false;
            document.getElementById ("music").innerHTML = gameMusic.active ? "On" : "Off";
        }
        if (typeof (localStorage.fpsMonitor) !== "undefined" && localStorage.fpsMonitor == 1) fpsHud ("toggle");
        if (typeof (localStorage.userActions) !== "undefined" && localStorage.userActions != "") userActions = JSON.parse (localStorage.userActions);
    }
    showControls ("keyboard", "keys");
    showControls ("gamepad", "buttons");
    showControls ("joystick", "buttons");
    gameLoadScreen ("start");
    gameArea.start ();
});

function fetchLoad (cont, param)
{
    if (cont == "high_score_hud") document.getElementById ("highScoreHud").innerHTML = '<preloader><div class="spinner"></div></preloader>';
    else if (cont == "high_scores") gameText.push (new component ("text", "Loading...", "yellow", 400, 255, "left", 10));
    else if (cont == "sign_in" || cont == "sign_up")
    {
        if (cont != "sign_up") gameText.push (new component ("text", "Loading...", "yellow", 745, 345, "left", 10));
        if (cont != "sign_in")
        {
            param += '&client_id=686557513597-2vmk1vfsjgre9fabt7r450kms0es58cb.apps.googleusercontent.com&client_secret=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';
            if (cont == "sign_up") param += '&user_name=marcpinyot@gmail.com&game_music=' + (gameMusic.active ? '1' : '0') + '&game_sound=' + (gameSound.active ? '1' : '0') + '&fps_monitor=' + ($("#fps_monitor").hasClass ("active") ? '1' : '0') + '&user_actions=' + JSON.stringify (userActions);
        }
    }
    else if (cont == "player" || cont == "config_save")
    {
        gameText.push (new component ("text", cont == "player" ? "Loading..." : "Saving...", "yellow", 745, 395, "left", 10));
        if (cont == "config_save") param = 'game_music=' + (gameMusic.active ? '1' : '0') + '&game_sound=' + (gameSound.active ? '1' : '0') + '&fps_monitor=' + ($("#fps_monitor").hasClass ("active") ? '1' : '0') + '&user_actions=' + JSON.stringify (userActions);
        param = 'id=' + players [0].id + '&' + param;
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
                if (cont == "sign_in" || cont == "sign_up")
                {
                    gameText.pop ();
                    var form = document.getElementById ("sign");
                    if (responseJSON ["error"] == "email_ko")
                    {
                        form.email.setCustomValidity ("Wrong e.mail.");
                        form.email.reportValidity ();
                    }
                    else if (responseJSON ["error"] == "password_ko")
                    {
                        form.password.setCustomValidity ("Wrong Password.");
                        form.password.reportValidity ();
                    }
                    else if (responseJSON ["error"] == "email_exists")
                    {
                        form.email.setCustomValidity ("E.mail already exists.");
                        form.email.reportValidity ();
                    }
                    else if (responseJSON ["error"] == "email_not_validated")
                    {
                        form.email.setCustomValidity ("E.mail not validated.");
                        form.email.reportValidity ();
                    }
                    else
                    {
                        gameAlert.push (new component ("text", responseJSON ["error"], "red", 745, 345, "left", 10));
                        changeTab ("alert");
                    }
                }
                else if (cont == "player" || cont == "config_save")
                {
                    gameText.pop ();
                    var form = document.getElementById ("player");
                    if (responseJSON ["error"] == "name_exists")
                    {
                        form.name.setCustomValidity ("Name already exists.");
                        form.name.reportValidity ();
                    }
                    else if (responseJSON ["error"] == "password_ko")
                    {
                        form.password.setCustomValidity ("Wrong Password.");
                        form.password.reportValidity ();
                    }
                    else
                    {
                        gameAlert.push (new component ("text", responseJSON ["error"], "red", 745, 395, "left", 10));
                        changeTab ("alert");
                    }
                }
                else console.error ("Error! ", responseJSON ["error"]);
            }
            else if (cont == "high_score_hud")
            {
                document.getElementById ("highScoreHud").innerHTML = "High Score: " + responseJSON [cont];
                if (gameModes.findIndex (mode => mode.active == true) == 3)
                {
                    document.getElementById ("highScoreHud").innerHTML = '';
                    document.getElementById ("highScoreHud").style.height = '0px';
                }
            }
            else if (cont == "high_scores") gameHighScores (responseJSON ["max_high_scores"], responseJSON ["high_scores"]);
            else if (cont == "high_score_save")
            {
                if (responseJSON ["high_score_save"] > 0) highScoreSave.push (responseJSON ["high_score_save"]);
            }
            else if (cont == "sign_in")
            {
                gameText.pop ();
                players [0] = responseJSON ["player"];
                players [0].xp = players [0].xp * 1;
                gameSound.active = players [0].game_sound == 1 ? true : false;
                document.getElementById ("sound").innerHTML = gameSound.active ? "On" : "Off";
                gameMusic.active = players [0].game_music == 1 ? true : false;
                document.getElementById ("music").innerHTML = gameMusic.active ? "On" : "Off";
                if (players [0].fps_monitor == 1 && !$("#fps_monitor").hasClass ("active") || players [0].fps_monitor == 0 && $("#fps_monitor").hasClass ("active")) fpsHud ("toggle");
                if (players [0].user_actions) userActions = JSON.parse (players [0].user_actions);
                const json =
                {
                    action: "connect",
                    player_id: playerId
                };
                wss.send (JSON.stringify (json));       
            }
            else if (cont == "player")
            {
                gameText.pop ();
                players [0].name = responseJSON ["player"].name;
                players [0].color = responseJSON ["player"].color;
                const data =
                {
                    action: "ship",
                    player_id: playerId,
                    name: players [0].name,
                    color: players [0].color,
                    xp: players [0].xp
                };
                wss.send (JSON.stringify (data));       
            }
            else if (cont == "sign_up")
            {
                gameText.pop ();
                gameAlert.push (new component ("text", ">>> " + responseJSON ["ok"], "#0C0", 705, 345, "left", 10));
                if (responseJSON ["email"]["error"]) gameAlert.push (new component ("text", responseJSON ["email"]["error"], "red", 745, 370, "left", 10));
                else if (responseJSON ["email"]["ok"]) gameAlert.push (new component ("text", responseJSON ["email"]["ok"], "#0C0", 745, 370, "left", 10));
                changeTab ("alert");
            }
            else if (cont == "config_save")
            {
                gameText.pop ();
                gameAlert.push (new component ("text", ">>> " + responseJSON ["ok"], "#0C0", 705, 395, "left", 10));
                changeTab ("alert");
            }
            else if (cont != "xp_save") document.getElementById (cont).innerHTML += responseJSON [cont];
        }
    )
    .catch (error => console.error ("Error! ", error.message));
}

function submitForm (form)
{

    if ((gameModes.findIndex (mode => mode.active == true) == 1 || gameModes.findIndex (mode => mode.active == true) == 2) && form.length < 3)
    {
        gameAlert.push (new component ("text", "Connect other controllers", "red", 745, 300, "left", 10));
        gameAlert.push (new component ("text", "to add more players.", "red", 745, 325, "left", 10));
        changeTab ("alert");
    }
    else
    {
        players = [];
        gameAlert = [];
        for (var i = 0; i < form.length; i++)
        {
            if (form.elements [i].type == "text")
            {
                for (var j = i + 1; j < form.length; j++)
                {
                    if (form.elements [j].type == "text" && form.elements [i].value == form.elements [j].value)
                    {
                        players = [];
                        gameAlert.push (new component ("text", "All names must be diferent.", "red", 745, 255 + (form.length * 25), "left", 10));
                        changeTab ("alert");
                        return;
                    }
                }
                players [i] =
                {
                    name: form.elements [i].value || "Player" + (i > 0 ? (" " + (i * 1 + 1)) : ""),
                    color: playerColors [i],
                    control: (gameModes.findIndex (mode => mode.active == true) != 1 && gameModes.findIndex (mode => mode.active == true) != 2 ? menuControl : form.elements [i].id)
                };
            }
        }
        if (!blackScreen)
        {
            blackScreen = true;
            $("#blackScreen").fadeIn (1000);
            setTimeout
            (
                () =>
                {
                    if (wss != null && wss.readyState === 1) wss.close (3000);
                    if (gameModes.findIndex (mode => mode.active == true) == 2) gameLoadScreen ("game");
                    else gameLoadScreen ("intro");
                },
                1000
            );
        }
    }
}

function changeColor (color)
{
    menuShip.changeColor (color);
    gameXP [0].backColor = menuShip.colors.negative;
    gameXP [0].color = menuShip.colors.shipFill;
    gameXP [1].backColor = menuShip.colors.shipFill;
    gameXP [1].color = menuShip.colors.negative;
}

function updateGameArea ()
{
    if (fpsMonitor.time > 0) fpsHud ("update");
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
    if (gameScreen == "game")
    {
        gameItems = gameItems.filter (item => !item.taken || item.z > 0);
        gameShots = gameShots.filter (shot => !shot.hit && shot.x > 0 && shot.x < gameMap.width && shot.y > 0 && shot.y < gameMap.height);
        gameHits = gameHits.filter (hit => !hit.reverse || hit.r > 0);
        gameEnemies = gameEnemies.filter (enemy => enemy.life > 0);
        enemiesHud ();
        if (gameModes.findIndex (mode => mode.active == true) == 1 && gameArea.frame % 250 == 0) gameEnemies.push (new enemy (Math.floor (Math.random () * 3), 0, 0, Math.floor (Math.random () * 720) - 360));
        else if (gameModes.findIndex (mode => mode.active == true) == 2 && gameArea.frame % 500 == 0) gameItems.push (new item (0, Math.floor (Math.random () * gameMap.width), Math.floor (Math.random () * gameMap.height)));
        gameObjects = gameItems.concat (gameEnemies).concat (gameShips).concat (gameShots);
        gameObjects.sort ((object1, object2) => object1.z - object2.z);
        if (enemies == 0 && gameModes.findIndex (mode => mode.active == true) < 2)
        {
            if (!gameBoss) gameBoss = new boss (0, gameMap.width / 2, gameMap.height / 2);
            gameBoss.update ();
        }
        for (var object in gameObjects)
        {
            gameObjects [object].update ();
            if (gameHits.findIndex (hit => hit.name == gameObjects [object].name) > -1) for (var hit in gameHits.filter (hit => hit.name == gameObjects [object].name)) gameHits [hit].update ();
        }
        for (var hit in gameHits.filter (hit => hit.name == "hit0")) gameHits [hit].update ();
    }
    if (gameModal != null || gameScreen != "game")
    {
        if (gameScreen == "menu" && wss != null && wss.readyState == WebSocket.OPEN) wssSend ();
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
        if (menuShip) menuShip.update ();
        else if (gameScreen != "game") for (var ship in gameShips) gameShips [ship].update ();
    }
    gameArea.frame++;
    gameArea.animation = window.requestAnimationFrame (updateGameArea);
}