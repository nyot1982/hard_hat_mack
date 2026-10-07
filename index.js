import sdl from '@kmamal/sdl';
import fs from 'fs';
import { PNG } from 'pngjs';
import { createCanvas, loadImage } from 'canvas';
import audio from 'audio';

let windowWidth = 640,//sdl.video.displays [0].geometry.width,//640,
    windowHeight = 400,//sdl.video.displays [0].geometry.height,//400,
    window = sdl.video.createWindow
    (
        {
            title: "Hard Hat Mack",
            width: windowWidth,
            height: windowHeight,
            fullscreen: false
        }
    ),
    canvasWidth = windowWidth,
    canvasHeight = windowHeight,
    level = 0,
    levelCompleted = false,
    bonus = 0,
    score = 0,
    highscore = 0,
    editKey = 0,
    controls =
    [
        {
            key: "up",
            code: 82
        },
        {
            key: "down",
            code: 81
        },
        {
            key: "left",
            code: 80
        },
        {
            key: "right",
            code: 79
        },
        {
            key: "jump",
            code: 44
        },
        {
            key: "drop",
            code: 40
        },
        {
            key: "pause",
            code: 19
        }
    ],
    pressed =
    {
        keys:
        {
            99: []
        },
        buttons: [],
        axes: []
    },
    gravity = 0.12,
    player = null,
    gameScreen = null,
    gameTitle = null,
    gameMap = {},
    gameBack = [],
    gameFront = [],
    gameItems = [],
    gameEnemies = [],
    gameText = [],
    gameImages = [],
    gameAudios = [],
    loading = 0,
    loadingErrors = 0,
    userActions =
    [
        {
            screen: ["menu"],
            action: "play",
            keyboard:
            {
                keys: [44] // Space
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
            screen: ["menu"],
            action: "config",
            keyboard:
            {
                keys: [40] // Enter
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
            screen: ["menu"],
            action: "exit",
            keyboard:
            {
                keys: [41] // Esc
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
            screen: ["config"],
            action: "edit",
            keyboard:
            {
                keys: [] 
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
            screen: ["config"],
            action: "exit",
            keyboard:
            {
                keys: [41] // Esc
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
            screen: ["game"],
            action: "move_up",
            keyboard:
            {
                keys: [82] // Up
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
            keyboard:
            {
                keys: [81] // Down
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
            keyboard:
            {
                keys: [80] // Left
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
            keyboard:
            {
                keys: [79] // Right
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
            keyboard:
            {
                keys: [44] // Space
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
            action: "drop",
            keyboard:
            {
                keys: [40] // Enter
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
        },
        {
            screen: ["game"],
            action: "pause",
            keyboard:
            {
                keys: [19] // p
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
            screen: ["game"],
            action: "exit",
            keyboard:
            {
                keys: [41] // Esc
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
        }
    ],
    gameArea =
    {
        canvas: createCanvas (canvasWidth, canvasHeight),
        start: function ()
        {
            gameText.push (new component ("text", "loading...", "#ffffff", Math.round (canvasWidth / 2), 20, "center", 9));
            gameText.push (new component ("text", "", null, Math.round (canvasWidth / 2), 30, "center", 9));
            gameImages = fs.readdirSync ("img");
            gameAudios = fs.readdirSync ("audio");
            loading = 2 + gameImages.length + gameAudios.length;
            fileRead ('user.bin');
            setIcon ('icon.png');
            loadImages ('img');
            loadAudio ('audio');
            this.canvas.id = "hardHatMack";
            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            this.ctx = this.canvas.getContext ("2d");
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = "high";
            this.frame = 0;
            this.fps = 60;
            this.play ();
        },
        play: function ()
        {
            this.animation = setInterval
            (
                () =>
                {
                    updateGameArea ();
                },
                1000 / this.fps
            );
        },
        pause: function ()
        {
            clearInterval (this.animation);
            this.animation = null;
        },
        stop: function ()
        {
            clearInterval (this.animation);
            this.animation = null;
            this.frame = null;
            this.ctx = null;
            this.canvas = null;
        },
        clear: function ()
        {
            this.ctx.clearRect (0, 0, this.canvas.width, this.canvas.height);
        }
    };

function encodeBase64Url (input)
{
    return Buffer.from (input).toString ('base64').replace (/\+/g, '-').replace (/\//g, '_').replace (/=+$/, '');
}

function decodeBase64Url (input)
{
    const base64 = input.replace (/-/g, '+').replace (/_/g, '/') + '=='.slice (0, (4 - (input.length % 4)) % 4);
    return Buffer.from (base64, 'base64').toString ();
}

function JSONparse (input)
{
    if (typeof input !== "string") return undefined;
    try
    {
        let json = JSON.parse (input);
        if (typeof json === 'object') return json;
        else return undefined;
    }
    catch (error)
    {
        return undefined;
    }
}

function JSONstringify (input)
{
    if (typeof input !== "object") return undefined;
    try
    {
        let json = JSON.stringify (input);
        if (typeof json === 'string') return json;
        else return undefined;
    }
    catch (error)
    {
        return undefined;
    }
}

function startControl (id_control, control, bt_type, bt_code, bt_value)
{
    if (!pressed [bt_type][id_control].includes (bt_code) || bt_type == "axes")
    {
        if (!pressed [bt_type][id_control].includes (bt_code)) pressed [bt_type][id_control].push (bt_code);
        if (control == "keyboard") bt_value = 1;
        userActionStart (control, bt_type, bt_code, bt_value);
    }
}

function stopControl (id_control, control, bt_type, bt_code)
{
    if (pressed [bt_type][id_control].includes (bt_code))
    {
        pressed [bt_type][id_control].splice (pressed [bt_type][id_control].indexOf (bt_code), 1);
        if (gameScreen == "game" && player != null) userActionStop (id_control, control, bt_type, bt_code);
    }
}

function userActionStart (control, bt_type, bt_code, bt_value)
{
    let userAction = null;
    if (bt_type == null) userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control].includes (bt_code));
    else userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control][bt_type].includes (bt_code));

    if (gameScreen == null && control == "keyboard" && bt_code == 41) window.destroy ();
    else if (gameScreen == "menu")
    {
        if (userAction > -1)
        {
            switch (userActions [userAction].action)
            {
                case 'play':
                    gameLoadScreen ("game");
                break;
                case 'config':
                    gameLoadScreen ("config");
                break;
                case 'exit':
                    window.destroy ();
            }
        }
    }
    else if (gameScreen == "config")
    {
        if (userAction == -1) userAction = 3;
        switch (userActions [userAction].action)
        {
            case 'exit':
                gameLoadScreen ("menu");
            break;
            case 'edit':
                if (bt_code != 41)
                {
                    controls [editKey].code = bt_code;
                    userActions [editKey + 5].keyboard.keys = [controls [editKey].code];
                    editKey++;
                    if (editKey == controls.length)
                    {
                        editKey = 0;
                        fileWrite ('user.bin');
                        gameLoadScreen ("menu");
                    }
                    else gameText [0].src = "Press key for " + controls [editKey].key + ":";
                }
        }
    }
    else if (gameScreen == "game")
    {
        if (userAction > -1)
        {
            switch (userActions [userAction].action)
            {
                case 'pause':
                    if (gameArea.animation == null) gameArea.play ();
                    else  gameArea.pause ();
                break;
                case 'exit':
                    gameLoadScreen ("menu");
                break;
                case 'move_up':
                    player.moveY = -bt_value;
                break;
                case 'move_down':
                    player.moveY = bt_value;
                break;
                 case 'move_left':
                    player.moveX = -bt_value;
                break;
                case 'move_right':
                    player.moveX = bt_value;
                break;
                case 'jump':
                    player.jump = -0.9;
                break;
                case 'drop':
                    player.dropItem ();
            }
        }
    }
}

function userActionStop (id_control, control, bt_type, bt_code)
{
    let userActionPrev = 0,
        bt_code_prev = 0,
        userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control][bt_type].includes (bt_code));

    if (userAction > -1)
    {
        switch (userActions [userAction].action)
        {
            case 'move_down':
                userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_up');
                bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                if (pressed [bt_type][id_control].includes (bt_code_prev)) player.moveY = -1;
                else player.moveY = 0;
            break;
            case 'move_up':
                userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_down');
                bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                if (pressed [bt_type][id_control].includes (bt_code_prev)) player.moveY = 1;
                else player.moveY = 0;
            break;
            case 'move_left':
                userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_right');
                bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                if (pressed [bt_type][id_control].includes (bt_code_prev)) player.moveX = 1;
                else player.moveX = 0;
            break;
            case 'move_right':
                userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_left');
                bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                if (pressed [bt_type][id_control].includes (bt_code_prev)) player.moveX = -1;
                else player.moveX = 0;
            break;
            case 'jump':
                player.jump = 0;
        }
    }
}

function gameLoadScreen (screen)
{
    if (gameScreen != screen)
    {
        player = null;
        gameTitle = null;
        gameText = [];
        score = 0;
        if (screen == "menu") level = 0;
        else if (screen == "game") level = 2;
    }
    gameBack = [];
    gameFront = [];
    gameItems = [];
    gameEnemies = [];
    gameScreen = screen;
    switch (gameScreen)
    {
        case 'menu':
            canvasWidth = windowWidth;;
            canvasHeight = windowHeight;
            gameArea.canvas.width = canvasWidth;
            gameArea.canvas.height = canvasHeight;
            gameBack.push (new back ("#000000", 0, 0, canvasWidth, canvasHeight));
            gameTitle = new component ("image", "title.png", "", Math.round (canvasWidth / 2), 46 * canvasHeight / 400, 362, 40);
            gameText.push (new component ("text", "Node.js version by Marc Pinyot Gascón.", "#ffffff", Math.round (canvasWidth / 2), 96 * canvasHeight / 400, "center"));
            gameText.push (new component ("text", "An original game design by", "#ffffff", Math.round (canvasWidth / 2), 152 * canvasHeight / 400, "center"));
            gameText.push (new component ("text", "Michael Abbot & Matthew Alexander.", "#ffffff", Math.round (canvasWidth / 2), gameText [1].y + 24, "center"));
            gameText.push (new component ("text", "Vandal", "#55ffff", Math.round (canvasWidth / 2) - 223, 220 * canvasHeight / 400));
            gameText.push (new component ("text", "Mack", "#55ffff", Math.round (canvasWidth / 2) - 27, gameText [3].y));
            gameText.push (new component ("text", "Osha", "#55ffff", Math.round (canvasWidth / 2) + 169, gameText [3].y));
            gameText.push (new enemy (0, 0, Math.round (canvasWidth / 2) - 195, gameText [3].y + 22));
            gameText.push (new mack (0, "#ffffff", "#ff55ff", "#55ffff", Math.round (canvasWidth / 2) - 13, gameText [3].y + 24));
            gameText.push (new enemy (1, 0, Math.round (canvasWidth / 2) + 183, gameText [3].y + 22));
            gameText.push (new girder_h (0, "#ff55ff", "#55ffff", Math.round (canvasWidth / 2) - 223, gameText [3].y + 54, 446));
            gameText.push (new component ("text", "Space: Play", "#ff55ff", Math.round (canvasWidth / 2), 320 * canvasHeight / 400, "center", 9));
            gameText.push (new component ("text", "Enter: Config", "#ff55ff", Math.round (canvasWidth / 2), gameText [10].y + 18, "center", 9));
            gameText.push (new component ("text", "Esc: Quit", "#ff55ff", Math.round (canvasWidth / 2), gameText [11].y + 18, "center", 9));
            gameText.push (new component ("image", "electronic_arts.png", "", 40 * canvasWidth / 640 + 96, canvasHeight - 16 * canvasHeight / 400 - 33, 192, 66));
            gameText.push (new component ("text", "(C) 2026 nYoT", "#ffffff", canvasWidth - 40 * canvasWidth / 640 - 176, canvasHeight - 16 * canvasHeight / 400 - 14));
        break;
        case 'config':
            gameBack.push (new back ("#000000", 0, 0, canvasWidth, canvasHeight));
            gameTitle = new component ("text", "Configuration menu", "#ffffff", Math.round (canvasWidth / 2), 40 * canvasHeight / 400, "center");
            gameText.push (new component ("text", "Press key for " + controls [editKey].key + ":", "#ffffff", 40 * canvasWidth / 640, gameTitle.y + 50));
        break;
        case 'game':
            canvasHeight = 400;
            canvasWidth = Math.round (canvasHeight * windowWidth / windowHeight);
            gameArea.canvas.width = canvasWidth;
            gameArea.canvas.height = canvasHeight;
            generateGameMap ();
    }
}

function generateGameMap ()
{
    bonus = 5000;
    levelCompleted = false;
    switch (level)
    {
        case 1:
            let girderBreak = 0, girderX = 0, girderY = 0, girderTurn = 0;
            gameMap =
            {
                startFrame: gameArea.frame,
                x: Math.round ((canvasWidth - 558) / 2),
                width: canvasWidth,
                height: canvasHeight,
                elevatorFloor: 0,
                elevatorSpeed: 0,
                items: 4,
                girderBreaks: [],
                player:
                {
                    type: 0,
                    x: Math.round ((canvasWidth - 558) / 2) + 411,
                    y: 306,
                    heading: -1
                },
                enemies:
                [
                    {
                        x: Math.round ((canvasWidth - 558) / 2) + 56,
                        y: 240
                    }
                ]
            };
            gameBack.push (new back ("#000000", 0, 0, gameMap.width, gameMap.height));
            gameBack.push (new girder_v ("#ffffff", "#55ffff", gameMap.x + 116, 96, 240));
            gameBack.push (new girder_v ("#ffffff", "#55ffff", gameMap.x + 364, 96, 240));
            gameBack.push (new chain ("#55ffff", gameMap.x + 317, 96, 4));
            gameBack.push (new chain ("#55ffff", gameMap.x + 65, 160, 4));
            gameBack.push (new chain ("#55ffff", gameMap.x + 429, 224, 4));
            gameBack.push (new chain ("#55ffff", gameMap.x + 65, 288, 4));
            gameBack.push (new column ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 92, 352));
            gameBack.push (new column ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 192, 352));
            gameBack.push (new column ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 292, 352));
            gameBack.push (new column ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 392, 352));
            gameBack.push (new elevator (1, "#ffffff", "#55ffff", gameMap.x, 288, 4, 48));
            gameBack.push (new elevator (2, "#ffffff", null, gameMap.x + 50, 288, 4, 48));
            gameBack.push (new support ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 21, 346));
            gameFront.push (new bell ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 114, 18));
            gameFront.push (new machine ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 523, 54));
            gameFront.push (new girder_h (0, "#55ffff", "#ff55ff", gameMap.x + 56, 80, 390));
            gameItems.push (new tool ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 335, 52));
            for (let i = 0; i < 4; i++)
            {
                girderBreak = Math.floor (Math.random () * 6);
                gameMap.girderBreaks.push
                (
                    {
                        girderBreak: girderBreak,
                        girderPiece: null
                    }
                );
                gameFront.push (new girder_h (1, "#55ffff", "#ff55ff", gameMap.x + 56, 144 + i * 64, 111 + girderBreak * 28));
                gameFront.push (new girder_h (2, "#55ffff", "#ff55ff", gameMap.x + 195 + girderBreak * 28, 144 + i * 64, 251 - girderBreak * 28));
                girderBreak = Math.floor (Math.random () * 2);
                if (girderBreak == 0)
                {
                    girderY = 132 + i * 64;
                    girderTurn = -45;
                }
                else
                {
                    girderY = 112 + i * 64;
                    girderTurn = 45;
                }
                girderBreak = Math.floor (Math.random () * (i < 3 ? 4 : 3));
                switch (girderBreak)
                {
                    case 0:
                        if (girderTurn == -45) girderX = 84;
                        else girderX = 95;
                    break;
                    case 1:
                        if (girderTurn == -45) girderX = 139;
                        else girderX = 150;
                    break;
                    case 2:
                        if (girderTurn == -45) girderX = 332;
                        else girderX = 343;
                    break;
                    case 3:
                        if (girderTurn == -45) girderX = 387;
                        else girderX = 398;
                }
                gameItems.push (new girder_piece ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + girderX, girderY, girderTurn));
            }
            gameFront.push (new elevator (0, "#ffffff", "#ff55ff", gameMap.x, 280, 54, 8));
            gameFront.push (new elevator (2, null, null, gameMap.x, 288, 0, 48));
            gameFront.push (new elevator (3, "#ffffff", "#55ffff", gameMap.x, 336, 54, 10));
            gameFront.push (new springboard ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 488, 354));
            gameItems.push (new jackhammer ("#ffffff", "#ff55ff", gameMap.x + 151, 306));
            gameEnemies.push (new enemy (Math.floor (Math.random () * 2), 0, gameMap.x + 56, 240));
        break;
        case 2:
            gameMap =
            {
                startFrame: gameArea.frame,
                x: Math.round ((canvasWidth - 558) / 2),
                width: canvasWidth,
                height: canvasHeight,
                items: 6,
                player:
                {
                    type: 1,
                    x: Math.round ((canvasWidth - 558) / 2) + 8,
                    y: 348,
                    heading: 1
                },
                enemies:
                [
                    {
                        x: Math.round ((canvasWidth - 558) / 2) + 475,
                        y: 346
                    }
                ]
            };
            gameBack.push (new back ("#000000", 0, 0, gameMap.width, gameMap.height));
            gameBack.push (new wire ("#ffffff", 2, [{x: gameMap.x + 217, y: 64}, {x: gameMap.x + 225, y: 56}, {x: gameMap.x + 251, y: 56}, {x: gameMap.x + 251, y: 322}]));
            gameBack.push (new chain ("#55ffff", gameMap.x + 484, 288, 8));
            gameBack.push (new concrete_mixer (0, "#ffffff", null, null, gameMap.x + 170, 346));
            gameBack.push (new trap ("#ffffff", "#ff55ff", gameMap.x + 84, 194, 26, 14));
            gameFront.push (new concrete_mixer (1, "#ffffff", "#ff55ff", "#55ffff", gameMap.x + 170, 356));
            gameFront.push (new magnet ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 300, 16));
            gameFront.push (new crane ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 198, 52));
            gameFront.push (new incinerator ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 530, 64));
            gameFront.push (new conveyor_belt ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 392, 100));
            gameFront.push (new conveyor_belt ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 54, 334));
            gameFront.push (new girder_h (1, "#ff55ff", "#55ffff", gameMap.x + 169, 80, 70));
            gameFront.push (new girder_h (2, "#ff55ff", "#55ffff", gameMap.x + 263, 80, 70));
            gameFront.push (new girder_h (2, "#ff55ff", "#55ffff", gameMap.x, 144, 166));
            gameFront.push (new girder_h (1, "#ff55ff", "#55ffff", gameMap.x + 336, 144, 166));
            gameFront.push (new girder_h (2, "#ff55ff", "#55ffff", gameMap.x, 208, 166));
            gameFront.push (new girder_h (1, "#ff55ff", "#55ffff", gameMap.x + 336, 208, 166));
            gameFront.push (new girder_h (2, "#ff55ff", "#55ffff", gameMap.x, 272, 166));
            gameFront.push (new girder_h (1, "#ff55ff", "#55ffff", gameMap.x + 336, 272, 166));
            gameFront.push (new girder_h (0, "#ff55ff", "#55ffff", gameMap.x + 196, 322, 110));
            gameFront.push (new duct ("#ffffff", "#ff55ff", gameMap.x, 292));
            gameFront.push (new spigot ("#ffffff", "#55ffff", gameMap.x + 58, 306));
            gameItems.push (new tool ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 280, 350));
            gameItems.push (new toolbox ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 111, 122));
            gameItems.push (new toolbox ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 27, 186));
            gameItems.push (new toolbox ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 447, 186));
            gameItems.push (new toolbox ("#ffffff", "#ff55ff", "#55ffff", gameMap.x, 250));
            gameItems.push (new toolbox ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 363, 250));
            gameItems.push (new toolbox ("#ffffff", "#ff55ff", "#55ffff", gameMap.x + 308, 356));
            gameEnemies.push (new trap ("#ffffff", "#ff55ff", gameMap.x + 92, 202, 10, 6));
            gameEnemies.push (new enemy (Math.floor (Math.random () * 2), 0, gameMap.enemies [0].x, gameMap.enemies [0].y));
        break;
        case 3:
            gameMap =
            {
                startFrame: gameArea.frame,
                x: Math.round ((canvasWidth - 558) / 2),
                width: canvasWidth,
                height: canvasHeight,
                items: 0,
                player:
                {
                    type: 1,
                    x: Math.round ((canvasWidth - 558) / 2) + 8,
                    y: 348,
                    heading: 1
                }
            };
            gameBack.push (new back ("#000000", 0, 0, gameMap.width, gameMap.height));
    }
    gameFront.push (new floor ("#ffffff", gameMap.x, 378, 512, 6));
    if (player == null)
    {
        gameText.push (new component ("text", "Bonus:", "#ffffff", gameMap.x, 0));
        gameText.push (new component ("value", "bonus", "#ffffff", gameMap.x + 84, 0, "left", 5));
        gameText.push (new component ("text", "Score:", "#ffffff", gameMap.x + 182, 0));
        gameText.push (new component ("value", "score", "#ffffff", gameMap.x + 266, 0, "left", 5));
        gameText.push (new component ("text", "Hi-score:", "#ffffff", gameMap.x + 364, 0));
        gameText.push (new component ("value", "highscore", "#ffffff", gameMap.x + 490, 0, "left", 5));
        gameText.push (new component ("text", "Level", "#ffffff", gameMap.x + 546, 128, "vertical"));
        gameText.push (new component ("value", "level", "#ffffff", gameMap.x + 532, 224, "left", 2));
        gameText.push (new component ("text", "Mack", "#ffffff", gameMap.x + 546, 288, "vertical"));
        gameText.push (new component ("value", "player.ups", "#ffffff", gameMap.x + 546, 368, "left", 1));
        player = new mack (gameMap.player.type, "#ffffff", "#ff55ff", "#55ffff", gameMap.player.x, gameMap.player.y, gameMap.player.heading);
    }
    else
    {
        player.type = gameMap.player.type;
        player.x = gameMap.player.x;
        player.y = gameMap.player.y;
        player.heading = gameMap.player.heading;
        player.jump = 0;
        player.jumping = false;
        player.springboard = false;
        player.elevator = false;
        player.state = null;
        player.dead = 0;
        player.deadFrame = 0;
        player.item = null;
        player.gravity = gravity;
    }
    gameAudios [8].play ();
}

function updateGameArea ()
{
    gameArea.clear ();
    if (gameScreen == null)
    {
        if (loading == 0)
        {
            if (loadingErrors > 0)
            {
                if (loadingErrors == 1) loading = "Loading not completed. 1 Error finded.";
                else loading = "Loading not completed. " + loadingErrors + " Errors finded.";
                loadingErrors = -1;
            }
            else
            {
                loading = "Loading completed.";
                loadingErrors = gameArea.frame;
            }
            gameText.push (new component ("text", loading, "#ffffff", Math.round (canvasWidth / 2), gameText [gameText.length - 1].y + 29, "center", 9));
            loading = -1;
        }
        else if (loading == -1 && loadingErrors > -1 && gameArea.frame == loadingErrors + 120) gameLoadScreen ("menu");
    }
    else
    {
        for (let back = 0; back < gameBack.length; back++) gameBack [back].update ();
        for (let front = 0; front < gameFront.length; front++) gameFront [front].update ();
        if (gameScreen == "game")
        {
            if (levelCompleted)
            {
                if (bonus > 0 && gameArea.frame - gameMap.startFrame == 10)
                {
                    score += 100;
                    bonus -= 100;
                    if (bonus == 0) gameAudios [7].play ();
                    else gameAudios [2].play ();
                    gameMap.startFrame = gameArea.frame;
                }
                if (bonus == 0 && gameArea.frame - gameMap.startFrame == 160)
                {
                    if (score > highscore)
                    {
                        highscore = score;
                        fileWrite ('user.bin');
                    }
                    level++;
                    gameLoadScreen ("game");
                }
            }
            else if (player.dead == 0 && bonus > 0 && gameArea.frame - gameMap.startFrame == 160)
            {
                bonus -= 100;
                if (bonus == 0) player.dead = 1;
                gameMap.startFrame = gameArea.frame;
            }
            for (let item = 0; item < gameItems.length; item++) gameItems [item].update (item);
            for (let enemy = 0; enemy < gameEnemies.length; enemy++) gameEnemies [enemy].update (enemy);
            if (player != null) player.update ();
            if (gameMap.elevatorSpeed != 0)
            {
                gameMap.elevatorFloor -= gameMap.elevatorSpeed;
                if (gameMap.elevatorSpeed < 0 && gameMap.elevatorFloor == 192 || gameMap.elevatorSpeed > 0 && gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = 0;
            }
            /*console.clear ();
            console.log ("player:", player);
            console.log ("gameMap:", gameMap);
            console.log ("gameEnemies:", gameEnemies);
            console.log ("gameItems:", gameItems);
            console.log ("gameFront:", gameFront);
            console.log ("gameBack:", gameBack);*/
        }
    }
    if (gameTitle) gameTitle.update ();
    for (let text = 0; text < gameText.length; text++) if (gameText [text]) gameText [text].update (text);
    const buffer = gameArea.canvas.toBuffer ('raw');
    window.render (canvasWidth, canvasHeight, canvasWidth * 4, 'argb8888', buffer);
    gameArea.frame++;
}

async function fileRead (file)
{
    let color = "red";
    await fs.readFile
    (
        file,
        'utf8',
        (error, data) =>
        {
            if (error)
            {
                console.error ('Error reading file:', error.message + '.');
                loadingErrors++;
            }
            else
            {
                let userData = decodeBase64Url (data);
                if (!userData)
                {
                    console.error ('Error decoding base64Url data.');
                    loadingErrors++;
                }
                else
                {
                    userData = JSONparse (userData);
                    if (userData == undefined)
                    {
                        console.error ('Error parsing JSON data.');
                        loadingErrors++;
                    }
                    else
                    {
                        highscore = userData.highscore;
                        controls = userData.controls;
                        userActions [5].keyboard.keys = [controls [0].code];
                        userActions [6].keyboard.keys = [controls [1].code];
                        userActions [7].keyboard.keys = [controls [2].code];
                        userActions [8].keyboard.keys = [controls [3].code];
                        userActions [9].keyboard.keys = [controls [4].code];
                        userActions [10].keyboard.keys = [controls [5].code];
                        userActions [11].keyboard.keys = [controls [6].code];
                        color = "#00FF00";
                    }
                }
            }
            gameText.push (new component ("text", file, color, Math.round (canvasWidth / 2), gameText [gameText.length - 1].y + 19, "center", 9));
            loading--;
        }
    );
}

async function fileWrite (file)
{
    await fs.writeFile
    (
        file,
        encodeBase64Url (JSONstringify ({ highscore: highscore, controls: controls })),
        'utf8',
        (error) =>
        {
            if (error)
            {
                console.error ('Error writing file:', error.message + '.');
                return;
            }
        }
    );
}

async function fileDelete (file)
{
    await fs.unlink
    (
        file,
        (error) =>
        {
            if (error)
            {
                console.error ('error deleting file:', error.message + '.');
                return;
            }
        }
    );
}

async function setIcon (file)
{
    let color = "#00FF00";
    const pngBuffer = await fs.readFileSync (file);
    const png = await PNG.sync.read (pngBuffer);
    const { width, height, data } = png;
    try
    {
        await window.setIcon (width, height, width * 4, 'rgba32', data);
    }
    catch (error)
    {
        console.error ('Error loading icon:', error.message + '.');
        color = "red";
        loadingErrors++;
    }
    gameText.push (new component ("text", file, color, Math.round (canvasWidth / 2), gameText [gameText.length - 1].y + 19, "center", 9));
    loading--;
}

async function loadAudio (dir)
{
    for (let gameAudio = 0; gameAudio < gameAudios.length; gameAudio++)
    {
        let color = "#00FF00";
        try
        {
            gameAudios [gameAudio] = await audio (dir + "/" + gameAudios [gameAudio]);
        }
        catch (error)
        {
            console.error ('Error loading audio:', error.message + '.');
            color = "red";
        }
        gameText.push (new component ("text", gameAudios [gameAudio].source, color, Math.round (canvasWidth / 2), gameText [gameText.length - 1].y + 19, "center", 9));
        loading--;
    }
}

async function loadImages (dir)
{
    for (let gameImage = 0; gameImage < gameImages.length; gameImage++)
    {
        let color = "#00FF00";
        try
        {
            gameImages [gameImage] = await loadImage (dir + "/" + gameImages [gameImage]);
        }
        catch (error)
        {
            console.error ('Error loading picture:', error.message + '.');
            color = "red";
        }
        gameText.push (new component ("text", gameImages [gameImage].src, color, Math.round (canvasWidth / 2), gameText [gameText.length - 1].y + 19, "center", 9));
        loading--;
    }
}

function back (color, x, y, width, height)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.fillStyle = this.color;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }
}

function floor (color, x, y, width, height)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        const canvasAux = createCanvas (4, 6);
        canvasAux.width = 4;
        canvasAux.height = 6;
        const ctxAux = canvasAux.getContext ("2d");
        ctxAux.lineWidth = 0;
        ctxAux.fillStyle = this.color;
        ctxAux.fillRect (0, 0, 2, 2);
        ctxAux.fillRect (2, 2, 2, 4);
        const pattern = ctx.createPattern (canvasAux);
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = pattern;
        ctx.fillRect (0, 0, this.width, this.height);
        ctx.restore ();
    }
}

function girder_h (type, color, color2, x, y, width)
{
    this.type = (type != null ? type : 0);
    this.color = color;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 16;
    this.speedY = 0;

    this.update = function ()
    {
        if (this.width - 12 > 0)
        {
            if (this.y == 144 && this.speedY < 0)
            {
                this.speedY = 0.5;
                if (player.girder) player.speedY = 0.5;
            }
            else if (this.y == 322 && this.speedY > 0)
            {
                this.speedY = -0.5;
                if (player.girder) player.speedY = -0.5;
            }
            this.y += this.speedY;
            let ctx = gameArea.ctx;
            ctx.lineWidth = 0;
            ctx.save ();
            ctx.translate (Math.round (this.x), Math.round (this.y));
            ctx.fillStyle = this.color;
            ctx.fillRect (0, 0, this.width, 4);
            ctx.fillRect (0, 12, this.width, 4);
            ctx.fillStyle = this.color2;
            switch (this.type)
            {
                case 0:
                    ctx.fillRect (6, 4, this.width - 12, 8);
                    for (let x = 30; x + 30 < this.width; x += 84)
                    {
                        ctx.fillStyle = "#000000";
                        ctx.fillRect (x, 6, 6, 4);
                        ctx.fillRect (x + 16, 6, 6, 4);
                        if (level == 0 && (x == 114 || x == 254)) x -= 28;
                        else if (level == 1 && (x == 30 || x == 226)) x += 28;
                        else if (level == 2 && x == 30) x -= 56;
                    }
                break;
                case 1:
                    ctx.fillRect (6, 4, this.width - 6, 8);
                    for (let x = 30; x + 22 < this.width; x += 84)
                    {
                        ctx.fillStyle = "#000000";
                        ctx.fillRect (x, 6, 6, 4);
                        ctx.fillRect (x + 16, 6, 6, 4);
                        if (level == 1 && x == 30) x += 28;
                    }
                break;
                case 2:
                    ctx.fillRect (0, 4, this.width - 6, 8);
                    for (let x = 52; this.width - x > 0; x += 84)
                    {
                        ctx.fillStyle = "#000000";
                        ctx.fillRect (this.width - x, 6, 6, 4);
                        ctx.fillRect (this.width - x + 16, 6, 6, 4);
                        if (level == 1 && x == 52) x += 28;
                    }
                break;
                case 3:
                    ctx.fillRect (0, 4, this.width, 8);
                    for (let x = 30; x + 22 < this.width; x += 84)
                    {
                        ctx.fillStyle = "#000000";
                        ctx.fillRect (x, 6, 6, 4);
                        ctx.fillRect (x + 16, 6, 6, 4);
                    }
            }
            ctx.restore ();
        }
    }
}

function girder_v (color, color2, x, y, height)
{
    this.color = color;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.width = 22;
    this.height = height;

    this.update = function ()
    {
        if (this.width - 11 > 0)
        {
            let ctx = gameArea.ctx;
            ctx.lineWidth = 0;
            ctx.save ();
            ctx.translate (Math.round (this.x), Math.round (this.y));
            ctx.fillStyle = this.color;
            ctx.fillRect (0, 0, 4, this.height);
            ctx.fillRect (18, 0, 4, this.height);
            ctx.fillStyle = this.color2;
            ctx.fillRect (4, 0, 14, this.height);
            for (let y = 24; y + 5 < this.height; y += 64)
            {
                ctx.fillStyle = "#000000";
                ctx.fillRect (8, y, 6, 4);
                ctx.fillRect (8, y + 14, 6, 4);
            }
            ctx.restore ();
        }
    }
}

function girder_piece (color, color2, color3, x, y, turn)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.startX = this.x;
    this.y = y;
    this.startY = this.y;
    this.turn = (turn != null ? turn : 0);
    this.startTurn = this.turn;
    this.width = 28;
    this.height = 16;
    this.type = 0;

    this.update = function (idItem)
    {
        if (this.type == 0)
        {
            this.x = this.startX;
            this.y = this.startY;
            this.turn = this.startTurn;
        }
        this.radians = this.turn * Math.PI / 180;
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.rotate (this.radians);
        ctx.fillStyle = this.color;
        switch (this.type)
        {
            case 0:
                ctx.fillRect (0, 0, this.width, 4);
                ctx.fillRect (0, this.height - 4, this.width, 4);
                ctx.fillStyle = this.color2;
                ctx.fillRect (2, 4, this.width - 4, this.height - 8);
                ctx.fillStyle = "#000000";
                ctx.fillRect (3, 6, 6, 4);
                ctx.fillRect (19, 6, 6, 4);
            break;
            case 1:
                ctx.fillRect (0, 0, this.width, this.height);
                ctx.fillStyle = this.color3;
                ctx.fillRect (0, 4, this.width, this.height - 8);
            break;
            case 2:
                ctx.fillRect (0, 0, this.width, this.height);
                ctx.fillStyle = this.color2;
                ctx.fillRect (0, 4, this.width, this.height - 8);
            break;
            case 3:
                ctx.fillStyle = this.color3;
                ctx.fillRect (0, 0, this.width, this.height);
                ctx.fillStyle = this.color2;
                ctx.fillRect (0, 4, this.width, this.height - 8);
                if (gameMap.girderBreaks [(this.y - 144) / 64].girderBreak == 1 || gameMap.girderBreaks [(this.y - 144) / 64].girderBreak == 4)
                {
                    ctx.fillStyle = "#000000";
                    ctx.fillRect (3, 6, 6, 4);
                    ctx.fillRect (19, 6, 6, 4);
                }
        }
        ctx.restore ();
    }
}

function column (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.width = 18;
    this.height = 26;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        ctx.fillRect (2, 0, 14, 4);
        ctx.fillRect (2, 16, 14, 4);
        ctx.fillRect (0, 20, 18, 6);
        ctx.fillStyle = this.color2;
        ctx.fillRect (4, 4, 10, 4);
        ctx.fillRect (4, 12, 10, 4);
        ctx.fillStyle = this.color3;
        ctx.fillRect (6, 8, 6, 4);
        ctx.restore ();
    }
}

function chain (color, x, y, steps)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.steps = steps;
    this.width = 8;
    this.height = 8 * this.steps;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        for (let y = 0; y < this.steps * 8; y += 8)
        {
            ctx.fillRect (0, y, 2, 6);
            ctx.fillRect (6, y, 2, 6);
            ctx.fillRect (2, y + 6, 4, 2);
        }
        ctx.restore ();
    }
}

function elevator (type, color, color2, x, y, width, height)
{
    this.type = (type != null ? type : 0);
    this.color = color;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.startY = this.y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        this.y = this.startY - gameMap.elevatorFloor;
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.fillStyle = this.color;
        ctx.fillRect (this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color2;
        switch (this.type)
        {
            case 0:
                ctx.fillRect (this.x + 6, this.y + 2, 42, 4);
            break;
            case 1:
                ctx.fillRect (this.x + 2, this.y, 2, 48);
            break;
            case 3:
                ctx.fillRect (this.x + 8, this.y + 2, 38, 4);
        }
    }
}

function support (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.startY = this.y;
    this.width = 12;
    this.height = 32;
    this.startHeight = this.height;

    this.update = function ()
    {
        this.y = this.startY - gameMap.elevatorFloor;
        this.height = this.startHeight + gameMap.elevatorFloor;
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        const canvasAux = createCanvas (12, 16);
        canvasAux.width = 12;
        canvasAux.height = 16;
        const ctxAux = canvasAux.getContext ("2d");
        ctxAux.lineWidth = 0;
        ctxAux.fillStyle = this.color;
        ctxAux.fillRect (0, 0, canvasAux.width, canvasAux.height);
        ctxAux.clearRect (4, 0, 2, 2);
        ctxAux.clearRect (6, 2, 2, 2);
        ctxAux.clearRect (8, 4, 2, 2);
        ctxAux.clearRect (10, 6, 2, 2);
        ctxAux.clearRect (2, 6, 2, 2);
        ctxAux.clearRect (4, 8, 2, 2);
        ctxAux.clearRect (6, 10, 2, 2);
        ctxAux.clearRect (8, 12, 2, 2);
        ctxAux.clearRect (10, 14, 2, 2);
        ctxAux.fillStyle = this.color2;
        ctxAux.fillRect (0, 6, 2, 2);
        ctxAux.fillStyle = this.color3;
        ctxAux.fillRect (10, 4, 2, 2);
        ctxAux.fillRect (10, 12, 2, 2);
        const pattern = ctx.createPattern (canvasAux);
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = pattern;
        ctx.fillRect (0, 0, this.width, this.height);
        ctx.restore ();
    }
}

function bell (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.startX = this.x;
    this.y = y;
    this.width = 18;
    this.startWidth = this.width;
    this.height = 20;
    this.type = 0;
    this.rings = 0;

    this.update = function ()
    {
        if (this.type == 1) this.x = this.startX - 2;
        else this.x = this.startX;
        if (this.type == 0 || this.type == 2) this.width = this.startWidth;
        else this.width = this.startWidth + 2;
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        if (gameArea.frame % 5 == 0 && this.rings > 0)
        {
            this.type++;
            if (this.type == 4)
            {
                this.type = 0;
                this.rings++;
                if (this.rings == 6) this.rings = 0;
            }
        }
        switch (this.type)
        {
            case 0:
            case 2:
                ctx.fillRect (6, 6, 6, 2);
                ctx.fillRect (4, 8, 10, 4);
                ctx.fillRect (2, 12, 14, 4);
                ctx.fillRect (0, 16, 18, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (4, 0, 2, 6);
                ctx.fillRect (12, 0, 2, 6);
                ctx.fillRect (8, 18, 2, 2);
            break;
            case 1:
                ctx.fillRect (8, 6, 8, 2);
                ctx.fillRect (4, 8, 14, 2);
                ctx.fillRect (0, 10, 18, 2);
                ctx.fillRect (2, 12, 14, 2);
                ctx.fillRect (6, 14, 10, 2);
                ctx.fillRect (8, 16, 6, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 2, 2, 2);
                ctx.fillRect (16, 2, 2, 4);
                ctx.fillRect (12, 18, 2, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 0, 2, 2);
                ctx.fillRect (14, 0, 2, 2);
                ctx.fillRect (10, 4, 2, 2);
                ctx.fillRect (18, 6, 2, 2);
                ctx.fillRect (6, 18, 2, 2);
            break;
            case 3:
                ctx.fillRect (4, 6, 8, 2);
                ctx.fillRect (2, 8, 14, 2);
                ctx.fillRect (2, 10, 18, 2);
                ctx.fillRect (4, 12, 14, 2);
                ctx.fillRect (4, 14, 10, 2);
                ctx.fillRect (6, 16, 6, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (4, 0, 2, 2);
                ctx.fillRect (12, 0, 2, 2);
                ctx.fillRect (8, 4, 2, 2);
                ctx.fillRect (0, 6, 2, 2);
                ctx.fillRect (12, 18, 2, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (2, 2, 2, 4);
                ctx.fillRect (10, 2, 2, 2);
                ctx.fillRect (6, 18, 2, 2);
        }
        ctx.restore ();
    }
}

function springboard (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.startY = this.y;
    this.width = 26;
    this.height = 24;
    this.type = 0;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.fillStyle = this.color;
        if (gameArea.frame % 5 == 0 && this.type > 0 && this.type < 4) this.type++;
        switch (this.type)
        {
            case 0:
            case 4:
                if (this.height != 24)
                {
                    this.y = this.startY;
                    this.height = 24;
                    if (this.type == 4)
                    {
                        player.y = this.y - player.height;
                        player.speedY = -4;
                        //if (player.dead > 0) player.speedY = Number ((player.speedY * 0.8).toFixed (2));
                        this.type = 0;
                    }
                }
                ctx.translate (Math.round (this.x), Math.round (this.y));
                ctx.fillRect (2, 0, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 6, 10, 14);
                ctx.fillRect (6, 10, 14, 6);
                ctx.fillRect (2, 20, 22, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (0, 2, 26, 4);
                ctx.fillRect (10, 6, 2, 4);
                ctx.fillRect (14, 6, 2, 4);
                ctx.fillRect (8, 10, 2, 4);
                ctx.fillRect (12, 10, 2, 4);
                ctx.fillRect (16, 10, 2, 4);
                ctx.fillRect (10, 14, 2, 4);
                ctx.fillRect (14, 14, 2, 4);
                ctx.fillRect (8, 18, 2, 2);
                ctx.fillRect (12, 18, 2, 2);
                ctx.fillRect (16, 18, 2, 2);
            break;
            case 1:
            case 3:
                if (this.height != 20)
                {
                    this.y = this.startY + 4;
                    this.height = 20;
                    player.y = this.y - player.height;
                }
                ctx.translate (Math.round (this.x), Math.round (this.y));
                ctx.fillRect (2, 0, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (6, 6, 14, 10);
                ctx.fillRect (2, 10, 22, 2);
                ctx.fillRect (2, 16, 22, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (0, 2, 26, 4);
                ctx.fillRect (8, 6, 2, 2);
                ctx.fillRect (12, 6, 2, 2);
                ctx.fillRect (16, 6, 2, 2);
                ctx.fillRect (4, 8, 4, 6);
                ctx.fillRect (10, 8, 2, 6);
                ctx.fillRect (14, 8, 2, 6);
                ctx.fillRect (18, 8, 4, 6);
                ctx.fillRect (8, 14, 2, 2);
                ctx.fillRect (12, 14, 2, 2);
                ctx.fillRect (16, 14, 2, 2);
            break;
            case 2:
                if (this.height != 10)
                {
                    this.y = this.startY + 14;
                    this.height = 10;
                    player.y = this.y - player.height;
                }
                ctx.translate (Math.round (this.x), Math.round (this.y));
                ctx.fillRect (2, 0, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (2, 6, 22, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (0, 2, 26, 4);
        }
        ctx.restore ();
    }
}

function machine (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.width = 26;
    this.height = 32;
    this.type = 0;
    this.shotFrame = gameArea.frame + 500;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        switch (this.type)
        {
            case 0:
                ctx.fillRect (14, 0, 6, 2);
                ctx.fillRect (12, 2, 10, 2);
                ctx.fillRect (16, 4, 4, 4);
                ctx.fillRect (8, 8, 14, 18);
                ctx.fillRect (22, 10, 4, 16);
                ctx.fillRect (4, 30, 20, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 6, 4);
                ctx.fillRect (0, 10, 8, 6);
                ctx.fillRect (4, 16, 8, 10);
                ctx.fillRect (16, 14, 2, 2);
                ctx.fillRect (12, 16, 14, 2);
                ctx.fillRect (6, 26, 20, 4);
                ctx.fillRect (4, 28, 2, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (14, 8, 2, 10);
                ctx.fillRect (18, 14, 2, 4);
                ctx.fillRect (16, 18, 6, 8);
            break;
            case 1:
                ctx.fillRect (14, 2, 6, 2);
                ctx.fillRect (12, 4, 10, 2);
                ctx.fillRect (16, 6, 4, 4);
                ctx.fillRect (0, 10, 24, 2);
                ctx.fillRect (8, 12, 18, 14);
                ctx.fillRect (4, 30, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (0, 8, 2, 2);
                ctx.fillRect (4, 8, 2, 2);
                ctx.fillRect (0, 12, 2, 2);
                ctx.fillRect (6, 10, 8, 4);
                ctx.fillRect (4, 12, 4, 6);
                ctx.fillRect (16, 16, 4, 2);
                ctx.fillRect (12, 18, 14, 2);
                ctx.fillRect (4, 18, 8, 6);
                ctx.fillRect (0, 20, 4, 2);
                ctx.fillRect (6, 24, 6, 4);
                ctx.fillRect (12, 26, 14, 4);
                ctx.fillRect (0, 28, 12, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (14, 10, 2, 10);
                ctx.fillRect (16, 20, 6, 6);
        }
        ctx.restore ();
        if (!levelCompleted)
        {
            if (this.type == 0 && gameArea.frame == this.shotFrame)
            {
                this.type = 1;
                gameEnemies.push (new bolt ("#ffffff", this.x, this.y));
            }
            else if (this.type == 1 && gameArea.frame - this.shotFrame == 120)
            {
                this.type = 0;
                this.shotFrame += 500;
            }
        }
    }
}

function bolt (color, x, y, bounce)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.bounce = (bounce != null ? bounce : 0.6);
    this.bounced = 0;
    this.width = 10;
    this.height = 10;
    this.speedX = -(Math.floor (Math.random () * 6 + 1));
    this.speedY = -(Math.floor (Math.random () * 4 - 2));
    this.gravity = gravity;

    this.update = function (idEnemy)
    {
        if (!levelCompleted)
        {
            this.x = Number ((this.x + this.speedX).toFixed (2));
            this.y = Number ((this.y + this.speedY).toFixed (2));
            for (let front = 0; front < gameFront.length; front++)
            {
                if ((gameFront [front].constructor.name == "girder_piece" || gameFront [front].constructor.name == "girder_h") && gameFront [front].y > this.bounced)
                {
                    if (this.x < gameFront [front].x + gameFront [front].width && this.x >= gameFront [front].x || this.x + this.width > gameFront [front].x && this.x + this.width <= gameFront [front].x + gameFront [front].width)
                    {
                        if (this.y + this.height > gameFront [front].y && this.y + this.height <= gameFront [front].y + gameFront [front].height && this.speedY > 0) this.y = gameFront [front].y - this.height;
                        if (this.y == gameFront [front].y - this.height)
                        {
                            this.speedY = -(this.speedY * this.bounce);
                            this.bounced = gameFront [front].y;
                            gameAudios [1].play ();
                        }
                    }
                }
            }
            this.speedY = this.speedY + this.gravity;
            if (this.y > gameMap.height || this.x + this.width < 0) gameEnemies.splice (idEnemy, 1);
        }
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        ctx.fillRect (0, 0, 10, 4);
        ctx.fillRect (2, 4, 6, 6);
        ctx.restore ();
    }
}

function jackhammer (color, color2, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.width = 28;
    this.height = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.type = 0;
    this.direction = 0;

    this.update = function (idItem)
    {
        if (!levelCompleted)
        {
            if (idItem == player.item)
            {
                this.speedX = player.speedX;
                this.speedY = player.speedY;
            }
            else
            {
                if (this.direction == 0)
                {
                    if (this.x == gameMap.x + 151 && this.y == 306)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == Math.round (gameMap.width / 2) - Math.round (this.width / 2) && this.y == 306)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == Math.round (gameMap.width / 2) - Math.round (this.width / 2) && this.y == 242 && this.speedX == 0)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 418 && this.y == 242)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 81 && this.y == 242)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 81 && this.y == 178)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 141 && this.y == 178 && this.speedY == 0)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 141 && this.y == 114 && this.speedX == 0)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 201 && this.y == 114 && this.speedX > 0)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 201 && this.y == 50)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                        this.direction = 1
                    }
                }
                else
                {
                    if (this.x == gameMap.x + 418 && this.y == 50)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 418 && this.y == 114)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 81 && this.y == 114)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 81 && this.y == 178)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 393 && this.y == 178)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 393 && this.y == 242)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == Math.round (gameMap.width / 2) - Math.round (this.width / 2) && this.y == 242)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == Math.round (gameMap.width / 2) - Math.round (this.width / 2) && this.y == 306)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                        this.direction = 0;
                    }
                }
                this.x += this.speedX; 
                this.y += this.speedY;
            }
            if (this.speedX != 0 && this.speedY == 0 && gameArea.frame % 5 == 0)
            {
                if (this.type == 0) this.type = 1;
                else this.type = 0;
            }
        }
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y + (this.type == 1 ? 6 : 0)));
        ctx.fillStyle = this.color;
        ctx.fillRect (10, 0, 6, 2);
        ctx.fillRect (0, 2, 28, 2);
        ctx.fillRect (2, 4, 24, 2);
        ctx.fillRect (8, 10, 10, 6);
        ctx.fillRect (10, 20, 8, 2);
        ctx.fillRect (12, 22, 4, (this.type == 0 ? 8 : 2));
        ctx.fillStyle = this.color2;
        ctx.fillRect (8, 6, 10, 4);
        ctx.fillRect (8, 12, 10, 2);
        ctx.fillRect (8, 16, 10, 6);
        ctx.restore ();
    }
}

function toolbox (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 28;
    this.height = 22;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        ctx.fillRect (4, 6, 20, 2);
        ctx.fillRect (2, 8, 24, 2);
        ctx.fillRect (0, 10, 28, 12);
        ctx.fillStyle = this.color2;
        ctx.fillRect (2, 14, 8, 6);
        ctx.fillRect (16, 14, 12, 6);
        ctx.fillStyle = this.color3;
        ctx.fillRect (10, 0, 8, 2);
        ctx.fillRect (8, 2, 2, 4);
        ctx.fillRect (18, 2, 2, 4);
        ctx.fillStyle = "#000000";
        ctx.fillRect (10, 6, 2, 2);
        ctx.fillRect (12, 8, 2, 2);
        ctx.fillRect (14, 10, 2, 4);  
        ctx.restore ();
    }
}

function duct (color, color2, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 78;
    this.height = 14;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        ctx.fillRect (0, 4, 76, 2);
        ctx.fillRect (0, 8, 78, 2);
        ctx.fillStyle = this.color2;
        ctx.fillRect (0, 0, 70, 2);
        ctx.fillRect (0, 2, 74, 2);
        ctx.fillRect (0, 6, 78, 2);
        ctx.fillRect (0, 10, 78, 4);
        ctx.restore ();
    }
}

function spigot (color, color2, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 18;
    this.height = 12;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color2;
        ctx.fillRect (0, 0, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect (0, 4, this.width, 2);
        ctx.fillRect (0, 8, this.width, 2);
        ctx.restore ();
    }
}

function tool (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.type = Math.floor (Math.random () * 4);
    if (this.type == 0) this.width = 28;
    else if (this.type == 1)
    {
        this.x += 4;
        this.width = 20;
    }
    else this.width = 26;
    if (this.type == 1)
    {
        this.y -= 4;
        this.height = 32;
    }
    else this.height = 28;
    this.width = 26;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        switch (this.type)
        {
            case 0:
                ctx.fillStyle = this.color;
                ctx.fillRect (16, 0, 6, 4);
                ctx.fillRect (14, 2, 4, 8);
                ctx.fillRect (24, 4, 4, 6);
                ctx.fillRect (18, 8, 8, 4);
                ctx.fillRect (12, 10, 8, 4);
                ctx.fillRect (10, 12, 8, 4);
                ctx.fillRect (8, 14, 8, 4);
                ctx.fillRect (2, 16, 8, 4);
                ctx.fillRect (0, 18, 4, 4);
                ctx.fillRect (10, 18, 4, 8);
                ctx.fillRect (4, 24, 8, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (18, 2, 2, 2);
                ctx.fillRect (24, 4, 2, 2);
                ctx.fillRect (2, 20, 2, 2);
                ctx.fillRect (10, 22, 2, 2);
            break;
            case 1:
                ctx.fillStyle = this.color3;
                ctx.fillRect (0, 2, 10, 14);
                ctx.fillRect (4, 22, 2, 2);
                ctx.fillRect (4, 28, 2, 2);
                ctx.fillStyle = this.color;
                ctx.fillRect (0, 0, 10, 2);
                ctx.fillRect (8, 2, 4, 6);
                ctx.fillRect (0, 6, 6, 2);
                ctx.fillRect (0, 10, 6, 2);
                ctx.fillRect (2, 16, 6, 2);
                ctx.fillRect (2, 20, 4, 2);
                ctx.fillRect (2, 26, 4, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (12, 2, 4, 6);
                ctx.fillRect (16, 6, 2, 2);
                ctx.fillRect (18, 2, 2, 6);
                ctx.fillRect (2, 18, 2, 2);
                ctx.fillRect (2, 24, 2, 2);
                ctx.fillRect (2, 30, 2, 2);
            break;
            case 2:
                ctx.fillStyle = this.color2;
                ctx.fillRect (12, 6, 6, 22);
                ctx.fillStyle = this.color;
                ctx.fillRect (20, 0, 6, 8);
                ctx.fillRect (6, 2, 14, 4);
                ctx.fillRect (4, 4, 4, 4);
                ctx.fillRect (2, 6, 2, 2);
                ctx.fillRect (0, 8, 2, 2);
                ctx.fillRect (12, 20, 6, 6);
                ctx.fillStyle = this.color3;
                ctx.fillRect (2, 8, 2, 2);
            break;
            case 3:
                ctx.fillStyle = this.color;
                ctx.fillRect (16, 0, 6, 2);
                ctx.fillRect (12, 2, 6, 2);
                ctx.fillRect (8, 4, 18, 6);
                ctx.fillRect (6, 6, 18, 6);
                ctx.fillRect (4, 8, 18, 6);
                ctx.fillRect (6, 14, 14, 2);
                ctx.fillRect (8, 16, 10, 2);
                ctx.fillRect (6, 20, 14, 2);
                ctx.fillRect (0, 26, 26, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (18, 2, 6, 6);
                ctx.fillRect (10, 12, 6, 2);
                ctx.fillRect (12, 14, 2, 8);
                ctx.fillRect (10, 18, 6, 2);
                ctx.fillRect (6, 22, 14, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (0, 24, 26, 2);
        }
        ctx.restore ();
    }
}

function magnet (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 26;
    this.height = 32;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color3;
        ctx.fillRect (10, 0, 6, 22);
        ctx.fillStyle = this.color;
        ctx.fillRect (4, 22, 18, 2);
        ctx.fillRect (2, 24, 22, 2);
        ctx.fillRect (0, 28, 26, 2);
        ctx.fillStyle = this.color2;
        ctx.fillRect (2, 26, 22, 2);
        ctx.fillRect (2, 30, 22, 2);
        ctx.restore ();
    }
}

function crane (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 28;
    this.height = 28;
    this.type = 0;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        if (gameArea.frame % 25 == 0)
        {
            if (this.type == 0) this.type = 1;
            else this.type = 0;
        }
        switch (this.type)
        {
            case 0:
                ctx.fillRect (4, 2, 10, 2);
                ctx.fillRect (2, 4, 14, 2);
                ctx.fillRect (4, 12, 20, 2);
                ctx.fillRect (2, 14, 24, 12);
                ctx.fillRect (4, 26, 20, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 0, 2, 2);
                ctx.fillRect (10, 14, 10, 12);
                ctx.fillRect (8, 16, 2, 8);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 6, 6, 6);
                ctx.fillRect (6, 16, 2, 8);
                ctx.fillRect (12, 16, 4, 2);
                ctx.fillRect (8, 18, 14, 4);
            break;
            case 1:
                ctx.fillRect (4, 6, 10, 2);
                ctx.fillRect (2, 8, 14, 2);
                ctx.fillRect (2, 12, 24, 2);
                ctx.fillRect (0, 14, 28, 12);
                ctx.fillRect (2, 26, 24, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 4, 2, 2);
                ctx.fillRect (6, 14, 18, 12);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 10, 6, 2);
                ctx.fillRect (12, 16, 6, 2);
                ctx.fillRect (10, 18, 10, 4);
                ctx.fillRect (12, 22, 6, 2);
        }
        ctx.restore ();
    }
}

function wire (color, thick, points)
{
    this.color = color;
    this.thick = (thick != null ? thick : 1);
    this.points = (points != null ? points : []);

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.beginPath ();
        ctx.moveTo (Math.round (this.points [0].x), Math.round (this.points [0].y));
        for (let i = 1; i < this.points.length; i++) ctx.lineTo (this.points [i].x, (i + 1 == this.points.length ? gameFront [14].y + gameFront [14].speedY : this.points [i].y));
        ctx.lineWidth = this.thick;
        ctx.strokeStyle = this.color;
        ctx.stroke ();
    }
}

function incinerator (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 28;
    this.height = 50;
    this.type = 0;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color2;
        ctx.fillRect (4, 4, 22, 26);
        ctx.fillRect (0, 6, 4, 10);
        ctx.fillRect (0, 34, 28, 4);
        ctx.fillRect (0, 46, 28, 4);
        ctx.fillStyle = this.color;
        ctx.fillRect (4, 8, 22, 8);
        ctx.fillStyle = "#000000";
        ctx.fillRect (8, 10, 14, 4);
        ctx.fillStyle = this.color;
        ctx.fillRect (14, 12, 4, 2);
        ctx.fillRect (8, 18, 14, 2);
        ctx.fillRect (8, 24, 6, 4);
        ctx.fillRect (16, 24, 6, 4);
        ctx.fillRect (0, 30, 26, 2);
        ctx.fillStyle = this.color3;
        ctx.fillRect (6, 0, 6, 4);
        ctx.fillRect (18, 0, 6, 4);
        ctx.fillRect (6, 38, 22, 8);
        ctx.fillStyle = this.color2;
        if (gameArea.frame % 25 == 0)
        {
            if (this.type == 3) this.type = 0;
            else this.type++;
        }
        switch (this.type)
        {
            case 1:
                ctx.fillRect (-18, 14, 2, 2);
                ctx.fillRect (-10, 16, 2, 2);
                ctx.fillRect (-2, 16, 2, 2);
                ctx.fillRect (-18, 20, 2, 4);
                ctx.fillRect (-16, 24, 4, 2);
                ctx.fillRect (-14, 26, 2, 2);
                ctx.fillRect (-10, 24, 2, 2);
                ctx.fillRect (-6, 28, 2, 2);
                ctx.fillRect (-2, 28, 2, 4);
                ctx.fillRect (-16, 18, 6, 6);
                ctx.fillRect (-8, 20, 8, 8);
                ctx.fillStyle = this.color;
                ctx.fillRect (-16, 16, 4, 2);
                ctx.fillRect (-14, 18, 6, 2);
                ctx.fillRect (-4, 18, 4, 2);
                ctx.fillRect (-10, 20, 6, 2);
                ctx.fillRect (-14, 22, 6, 2);
                ctx.fillRect (-6, 26, 6, 2);
            break;
            case 2:
                ctx.fillRect (-18, 0, 4, 8);
                ctx.fillRect (-14, 6, 6, 22);
                ctx.fillRect (-10, 12, 6, 18);
                ctx.fillRect (-2, 16, 2, 2);
                ctx.fillRect (-4, 20, 4, 12);
                ctx.fillRect (-26, 18, 8, 2);
                ctx.fillRect (-18, 18, 4, 8);
                ctx.fillRect (-22, 24, 2, 2);
                ctx.fillStyle = this.color;
                ctx.fillRect (-20, 2, 4, 6);
                ctx.fillRect (-10, 10, 4, 2);
                ctx.fillRect (-26, 14, 4, 2);
                ctx.fillRect (-10, 14, 2, 2);
                ctx.fillRect (-24, 16, 4, 2);
                ctx.fillRect (-18, 16, 6, 2);
                ctx.fillRect (-14, 18, 6, 2);
                ctx.fillRect (-6, 18, 6, 2);
                ctx.fillRect (-26, 20, 10, 2);
                ctx.fillRect (-22, 22, 6, 2);
                ctx.fillRect (-14, 22, 6, 2);
                ctx.fillRect (-6, 24, 2, 2);
            break;
            case 3:
                ctx.fillRect (-14, 0, 4, 8);
                ctx.fillRect (-26, 6, 2, 4);
                ctx.fillRect (-10, 6, 2, 8);
                ctx.fillRect (-26, 10, 4, 10);
                ctx.fillRect (-18, 10, 4, 2);
                ctx.fillRect (-22, 12, 2, 2);
                ctx.fillRect (-16, 12, 4, 2);
                ctx.fillRect (-8, 12, 4, 4);
                ctx.fillRect (-18, 14, 6, 2);
                ctx.fillRect (-22, 16, 2, 2);
                ctx.fillRect (-10, 16, 10, 14);
                ctx.fillRect (-22, 18, 8, 8);
                ctx.fillRect (-14, 20, 4, 8);
                ctx.fillStyle = this.color;
                ctx.fillRect (-26, 2, 4, 4);
                ctx.fillRect (-16, 2, 4, 6);
                ctx.fillRect (-28, 4, 2, 6);
                ctx.fillRect (-22, 8, 4, 2);
                ctx.fillRect (-10, 10, 4, 2);
                ctx.fillRect (-18, 16, 6, 2);
                ctx.fillRect (-14, 18, 6, 2);
                ctx.fillRect (-26, 20, 10, 2);
                ctx.fillRect (-22, 22, 6, 2);
                ctx.fillRect (-14, 22, 6, 2);
        }
        ctx.restore ();
    }
}

function trap (color, color2, x, y, width, height)
{
    this.color = color;
    this.color2 = color2;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        const canvasAux = createCanvas (1, this.height);
        canvasAux.width = 1;
        canvasAux.height = this.height;
        const ctxAux = canvasAux.getContext ("2d");
        ctxAux.lineWidth = 0;
        for (let y = 0; y + 2 <= this.height; y += 2)
        {
            if (ctxAux.fillStyle == this.color) ctxAux.fillStyle = this.color2;
            else ctxAux.fillStyle = this.color;
            ctxAux.fillRect (0, y, 1, 2);
        }
        const pattern = ctx.createPattern (canvasAux);
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = pattern;
        ctx.fillRect (0, 0, this.width, this.height);
        ctx.restore ();
    }
}

function conveyor_belt (color, color2, color3, x, y, width, height)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.startX = this.x;
    this.y = (y != null ? y : 0);
    this.startY = this.y;
    this.width = (width != null ? width : 6);
    this.height = (height != null ? height : 32);
    this.turn = 0;
       
    this.update = function ()
    {
        if (this.color != null && this.color2 != null && this.color3 != null)
        {
            this.x = this.startX + 102;
            this.y = this.startY + 12;
            this.radians = this.turn * Math.PI / 180;
            let ctx = gameArea.ctx;
            ctx.lineWidth = 0;
            ctx.save ();
            ctx.translate (Math.round (this.startX), Math.round (this.startY));
            ctx.fillStyle = this.color;
            ctx.fillRect (0, 34, 2, 8);
            gameFront.push (new conveyor_belt (null, null, null, this.startX, this.startY + 34, 2, 8));
            for (let i = 0; i < 17; i++)
            {
                ctx.fillRect (2 + i * 6, 32 - i * 2, 12, 12);
                gameFront.push (new conveyor_belt (null, null, null, this.startX + 2 + i * 6, this.startY + 32 - i * 2, 12, 12));
            }
            ctx.fillRect (110, 2, 2, 8);
            gameFront.push (new conveyor_belt (null, null, null, this.startX + 110, this.startY + 2, 2, 8));
            ctx.fillRect (102, 12, 6, 32);
            ctx.fillRect (88, 36, 14, 8);
            ctx.fillRect (86, 38, 2, 2);
            ctx.fillRect (84, 42, 4, 2);
            ctx.fillStyle = this.color2;
            ctx.translate (8, 38);
            ctx.rotate (this.radians);
            ctx.fillRect (-2, -6, 4, 12);
            ctx.rotate (-this.radians);
            ctx.translate (96, -32);
            ctx.rotate (this.radians);
            ctx.fillRect (-2, -6, 4, 12);
            ctx.rotate (-this.radians);
            ctx.translate (-104, -6);
            for (let i = 0; i < 13; i++) ctx.fillRect (16 + i * 6, 30 - i * 2, 8, 8);
            ctx.fillRect (14, 32, 2, 2);
            ctx.fillRect (16, 38, 2, 2);
            ctx.fillRect (94, 4, 2, 2);
            ctx.fillRect (96, 10, 2, 2);
            ctx.fillStyle = this.color;
            for (let i = 0; i < 6; i++) ctx.fillRect (23 + i * 12, 30 - i * 4, 6, 4);
            ctx.fillStyle = this.color3;
            ctx.fillRect (7, 34, 2, 2);
            ctx.fillRect (7, 40, 2, 2);
            ctx.fillRect (84, 40, 6, 2);
            ctx.fillRect (90, 38, 10, 4);
            ctx.fillStyle = "#000000";
            ctx.fillRect (7, 36, 2, 4);
            ctx.restore ();
            this.turn += 10;
            if (this.turn == 360) this.turn = 0;
        }
    }
}

function concrete_mixer (type, color, color2, color3, x, y)
{
    this.type = type;
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    if (this.type == 0)
    {
        this.width = 34;
        this.height = 10;
    }
    else
    {
        this.width = 44;
        this.height = 22;
    }
    
    this.update = function ()
    {
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        switch (this.type)
        {
            case 0:
                ctx.fillRect (6, 0, 22, 2);
                ctx.fillRect (2, 2, 30, 4);
                ctx.fillRect (0, 6, 34, 4);
                ctx.fillStyle = "#000000";
                ctx.fillRect (8, 2, 18, 2);
                ctx.fillRect (6, 4, 22, 4);
                ctx.fillRect (8, 8, 18, 2);
            break;
            case 1:
                ctx.fillRect (0, 0, 34, 10);
                ctx.fillRect (2, 10, 30, 2);
                ctx.fillRect (4, 12, 26, 2);
                ctx.fillRect (38, 0, 6, 2);
                ctx.fillRect (34, 4, 10, 2);
                ctx.fillRect (36, 8, 6, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (38, 2, 6, 2);
                ctx.fillRect (10, 14, 14, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (36, 6, 6, 2);
                ctx.fillRect (0, 18, 34, 4);
                ctx.fillStyle = "#000000";
                ctx.fillRect (4, 2, 4, 8);
                ctx.fillRect (6, 10, 6, 2);
        }
        ctx.restore ();
    }
}

function mack (type, color, color2, color3, x, y, heading)
{
    this.type = (type != null ? type : 0);
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.heading = (heading != null ? heading : 1);
    this.width = 26;
    this.height = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.jump = 0;
    this.jumping = false;
    this.springboard = false;
    this.elevator = false;
    this.girder = false;
    this.conveyor_belt = false;
    this.state = null;
    this.dead = 0;
    this.deadFrame = 0;
    this.ups = 3;
    this.floor = 0;
    this.enemyKill = null;
    this.item = null;
    this.gravity = gravity;

    this.dropItem = function ()
    {
        if (this.item != null && gameItems [this.item].constructor.name == "jackhammer")
        {
            gameItems [this.item].direction = 0;
            gameItems [this.item].x = gameMap.x + 151;
            gameItems [this.item].y = 306;
            this.item = null;
        }
    }

    this.update = function ()
    {
        if (gameScreen == "game" && !levelCompleted)
        {
            this.x = Number ((this.x + this.speedX).toFixed (2));
            this.y = Number ((this.y + this.speedY).toFixed (2));
            if (this.dead == 0)
            {
                for (let enemy = 0; enemy < gameEnemies.length; enemy++)
                {
                    if (this.x < gameEnemies [enemy].x + gameEnemies [enemy].width && this.x + this.width > gameEnemies [enemy].x && this.y < gameEnemies [enemy].y + gameEnemies [enemy].height && this.y + this.height > gameEnemies [enemy].y)
                    {
                        this.dead = 2;
                        gameEnemies [enemy].speedX = 0;
                        gameEnemies [enemy].speedY = 0;
                        gameEnemies [enemy].gravity = 0;
                        this.enemyKill = enemy;
                    }
                }
                for (let item = 0; item < gameItems.length; item++)
                {
                    if (this.x <= gameItems [item].x + gameItems [item].width && this.x + this.width >= gameItems [item].x && this.y <= gameItems [item].y + gameItems [item].height && this.y + this.height >= gameItems [item].y)
                    {
                        if (gameItems [item].constructor.name == "tool" || gameItems [item].constructor.name == "toolbox")
                        {
                            if (gameItems [item].constructor.name == "tool") score += 200;
                            else
                            {
                                score += 25;
                                gameMap.items--;
                            }
                            gameItems.splice (item, 1);
                            item--;
                            if (this.item != null && this.item > item) this.item--;
                        }
                        else if (this.item == null)
                        {
                            if (gameItems [item].constructor.name == "girder_piece")
                            {
                                score += 10;
                                gameItems [item].type = 1;
                                gameItems [item].turn = 0;
                            }
                            this.item = item;
                        }
                    }
                }
                if (this.item != null)
                {
                    if (this.heading == 1 && this.x < gameMap.x + 506 - this.width || this.x < gameMap.x + 19 + gameItems [this.item].width) gameItems [this.item].x = this.x + this.width;
                    else gameItems [this.item].x = this.x - gameItems [this.item].width;
                    gameItems [this.item].y = this.y;
                    if (gameItems [this.item].constructor.name == "girder_piece")
                    {
                        gameItems [this.item].y += 4;
                        if (this.floor > 0 && gameMap.girderBreaks [this.floor - 1].girderPiece == null && gameItems [this.item].x == gameMap.x + 167 + gameMap.girderBreaks [this.floor - 1].girderBreak * 28 && gameItems [this.item].type > 0)
                        {
                            score += 25;
                            gameItems [this.item].type = 2;
                            gameItems [this.item].y = this.floor * 64 + 80;
                            gameMap.girderBreaks [this.floor - 1].girderPiece = gameFront.length;
                            gameFront.push (gameItems [this.item]);
                            gameItems.splice (this.item, 1);
                            this.item = null;
                            gameAudios [0].play ();
                        }
                    }
                    else if (this.floor > 0 && gameItems [this.item].constructor.name == "jackhammer" && gameItems [this.item].x == gameMap.x + 167 + gameMap.girderBreaks [this.floor - 1].girderBreak * 28 && gameMap.girderBreaks [this.floor - 1].girderPiece != null && gameFront [gameMap.girderBreaks [this.floor - 1].girderPiece].type < 3)
                    {
                        score += 50;
                        gameFront [gameMap.girderBreaks [this.floor - 1].girderPiece].type = 3;
                        gameMap.items--;
                        gameAudios [3].play ();
                        if (gameMap.items == 0)
                        {
                            levelCompleted = true;
                            gameMap.startFrame = gameArea.frame;
                        }
                    }
                }
            }
            if (this.elevator)
            {
                if (gameMap.elevatorSpeed == 0)
                {
                    this.speedY = 0;
                    if (this.dead == 0)
                    {
                        if (this.type < 14)
                        {
                            if (this.type == 4) this.type = 7;
                            if (gameArea.frame % 5 == 0) this.type++;
                        }
                        else this.elevator = false;
                    }
                }
                else if (this.dead == 0) this.type = 4;
            }
            else
            {
                if (this.dead == 0 && this.state == "ground" && !this.springboard && !this.elevator) this.speedX = this.moveX;
                if (this.state != "chain") this.state = "air";
                for (let front = 0; front < gameFront.length; front++)
                {
                    if (this.x < gameFront [front].x + gameFront [front].width && this.x + this.width > gameFront [front].x)
                    {
                        if (this.state != "chain")
                        {
                            if (this.y + this.height > gameFront [front].y && this.y <= gameFront [front].y && this.speedY > 0) this.y = gameFront [front].y - this.height;
                            else if (this.y < gameFront [front].y + gameFront [front].height && this.y + this.height >= gameFront [front].y + gameFront [front].height && this.speedY < 0) this.y = gameFront [front].y + gameFront [front].height;
                        }
                        if (this.y == gameFront [front].y - this.height)
                        {
                            this.state = "ground";
                            this.girder = false;
                            this.conveyor_belt = false;
                            if (gameFront [front].constructor.name == "springboard" && !this.springboard)
                            {
                                this.springboard = true;
                                gameFront [front].type = 1;
                            }
                            else if (gameFront [front].constructor.name == "elevator" && gameFront [front].type == 3 && !this.elevator && this.speedX < 0 && this.x + this.width == gameFront [front].x + gameFront [front].width)
                            {
                                this.elevator = true;
                                this.speedX = 0;
                                if (this.item == null) this.x -= (this.x - Math.round (gameFront [front].x) / 2);
                                else this.x = gameFront [front].x;
                                if (gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = -4;
                                else if (gameMap.elevatorFloor == 192) gameMap.elevatorSpeed = 4;
                                this.speedY = gameMap.elevatorSpeed;
                            }
                            else if ((this.speedY > 2.8 || gameFront [front].constructor.name == "concrete_mixer" || gameFront [front].constructor.name == "elevator" && gameFront [front].type == 0) && this.dead == 0) this.dead = 1;
                            else if (gameFront [front].constructor.name == "girder_h")
                            {
                                if (level != 2) this.floor = (gameFront [front].y - 80) / 64;
                                else if (gameFront [front].type == 0)
                                {
                                    this.girder = true;
                                    if (gameFront [front].speedY == 0) gameFront [front].speedY = -0.5;
                                    this.speedY = gameFront [front].speedY;
                                }
                            }
                            else if (gameFront [front].constructor.name == "conveyor_belt")
                            {
                                this.speedX = 1;
                                this.conveyor_belt = true;
                            }
                            if (!this.elevator && !this.girder) this.speedY = 0;
                        }
                        else if (this.state != "chain" && this.y == gameFront [front].y + gameFront [front].height)
                        {
                            if (gameFront [front].constructor.name == "bell")
                            {
                                score += 10;
                                gameFront [front].rings = 1;
                                if (gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = -4;
                                else if (gameMap.elevatorFloor == 192) gameMap.elevatorSpeed = 4;
                            }
                            this.speedY = 0;
                        }
                    }
                    if (this.state != "chain" && this.y < gameFront [front].y + gameFront [front].height && this.y + this.height > gameFront [front].y)
                    {
                        if (this.x == gameFront [front].x + gameFront [front].width && this.speedX < 0 || this.x + this.width == gameFront [front].x && this.speedX > 0)
                        {
                            if (this.y + this.height - gameFront [front].y < 4) this.y -= (this.y + this.height - gameFront [front].y);
                            else
                            {
                                if (gameFront [front].constructor.name == "bell")
                                {
                                    score += 10;
                                    gameFront [front].rings = 1;
                                    if (gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = -4;
                                    else if (gameMap.elevatorFloor == 192) gameMap.elevatorSpeed = 4;
                                }
                                else if (gameFront [front].constructor.name == "conveyor_belt") this.dead = 1;
                                this.speedX = 0;
                            }
                        }
                    }
                }
                if (this.x < 0) this.x = 0;
                else if (this.x > gameMap.width - this.width) this.x = gameMap.width - this.width;
                if (this.x == 0 && this.speedX < 0 || this.x == gameMap.width - this.width && this.speedX > 0) this.speedX = 0;
                if (this.y < 0) this.y = 0;
                else if (this.y > gameMap.height - this.height) this.y = gameMap.height - this.height;
                if (this.y == gameMap.height - this.height)
                {
                    this.state = "ground";
                    if (this.speedY > 2.8 && this.dead == 0) this.dead = 1;
                }
                if (this.y == 0 && this.speedY < 0 || this.y == gameMap.height - this.height && this.speedY > 0) this.speedY = 0;
                if (this.state == "air")
                {
                    if (this.speedX != 0)
                    {
                        if (!this.jumping || this.speedX < 0 && this.x == this.jumping - 62 || this.speedX > 0 && this.x == this.jumping + 62)
                        {
                            this.speedX = 0;
                            this.jumping = false;
                            this.gravity = gravity;
                        }
                    }
                    if (this.springboard)
                    {
                        if (this.floor > 0 && this.y <= 50 + this.floor * 64 - 66 || this.floor == 0 && this.y <= 306)
                        {
                            this.jumping = this.x;
                            this.springboard = false;
                            this.speedX = -1;
                            this.speedY = -0.9;
                            this.gravity = 0.03;
                        }
                    }
                    if (!this.springboard || this.springboard && this.dead > 0) this.speedY = Number ((this.speedY + this.gravity).toFixed (2));
                    if (this.dead == 0)
                    {
                        if (this.speedX == 0) this.type = 4;
                        else this.type = 6;
                    }
                }
                else if (this.dead == 0)
                {
                    this.chain_bottom = false;
                    this.chain_top = false;
                    if (this.state != "ground") this.state = "air";
                    for (let back = 0; back < gameBack.length; back++)
                    {
                        if (gameBack [back].constructor.name == "chain" && this.x + this.width >= gameBack [back].x && this.x <= gameBack [back].x + gameBack [back].width && this.y + this.height + 16 >= gameBack [back].y && this.y <= gameBack [back].y + gameBack [back].height)
                        {
                            if (this.state == "ground")
                            {                                
                                if (this.y + this.height + 16 == gameBack [back].y) this.chain_top = true;
                                else if (this.y <= gameBack [back].y + gameBack [back].height) this.chain_bottom = true;
                            }
                            else this.state = "chain";
                        }
                    }
                    if (this.state == "chain")
                    {
                        this.speedX = 0;
                        this.speedY = this.moveY;
                        if (this.speedY >= 0) this.type = 4;
                        else if (gameArea.frame % 5 == 0)
                        {
                            if (this.type == 4) this.type = 5;
                            else this.type = 4;
                        }
                    }
                    else if (this.state == "ground")
                    {
                        if (this.chain_bottom && this.moveY < 0 || this.chain_top && this.moveY > 0)
                        {
                            this.speedY = this.moveY;
                            this.state = "chain";
                        }
                        if (this.jump != 0)
                        {
                            gameAudios [6].play ();
                            this.speedY += this.jump;
                            this.jumping = this.x;
                            this.gravity = 0.03;
                        }
                        else
                        {
                            this.jumping = false;
                            this.gravity = gravity;
                        }
                        if (this.type > 3 && this.type < 14 && !this.springboard) this.type = 1;
                        if (!this.conveyor_belt && this.speedX != 0 && gameArea.frame % 5 == 0)
                        {
                            if (this.type < 3) this.type++;
                            else this.type = 0;
                        }
                    }
                }
            }
            if (this.dead > 0)
            {
                this.speedX = 0;
                if (this.state != "air" && !this.elevator) this.speedY = 0;
                if (this.type != 8 && gameArea.frame % 5 == 0)
                {
                    if (this.dead == 2)
                    {
                        this.deadFrame++;
                        if (this.deadFrame == 14) this.dead = 1;
                        if (this.deadFrame == 4 || this.deadFrame == 8 || this.deadFrame == 12)
                        {
                            this.heading = -1;
                            this.type = 3;
                        }
                        else if (this.deadFrame == 2 || this.deadFrame == 6 || this.deadFrame == 10 || this.deadFrame == 14) this.type = 4;
                        else
                        {
                            this.heading = 1;
                            this.type = 3;
                        }
                    }
                    else if (this.dead == 1 && this.type == 4) this.type = 7;
                    else if (this.type == 7)
                    {
                        this.type = 8;
                        gameAudios [9].play ();
                        gameMap.startFrame = gameArea.frame; 
                    }
                    else this.type = 4; 
                }
                else if (this.ups > 0 && this.type == 8 && gameArea.frame - gameMap.startFrame == 120)
                {
                    if (this.enemyKill != null && gameEnemies [this.enemyKill].constructor.name == "bolt")
                    {
                        gameEnemies.splice (this.enemyKill, 1);
                        this.enemyKill = null;
                    }
                    this.ups--;
                    if (this.ups > 0)
                    {
                        bonus = 5000;
                        gameMap.startFrame = gameArea.frame;
                        this.type = gameMap.player.type;
                        this.x = gameMap.player.x;
                        this.y = gameMap.player.y;
                        this.heading = gameMap.player.heading;
                        this.jump = 0;
                        this.jumping = false;
                        this.springboard = false;
                        this.elevator = false;
                        this.girder = false;
                        this.conveyor_belt = false;
                        this.state = null;
                        this.dead = 0;
                        this.deadFrame = 0;
                        this.enemyKill = null;
                        this.item = null;
                        this.gravity = gravity;
                        let gameEnemy = gameEnemies.findIndex (enemy => enemy.constructor.name == "enemy");
                        gameEnemies [gameEnemy].name = Math.floor (Math.random () * 2);
                        gameEnemies [gameEnemy].direction = Math.floor (Math.random () * 2);
                        gameEnemies [gameEnemy].x = gameMap.enemies [0].x;
                        gameEnemies [gameEnemy].y = gameMap.enemies [0].y;
                        if (level == 1)
                        {
                            gameFront [1].shotFrame = gameArea.frame + 500;
                            gameMap.elevatorFloor = 0;
                            gameMap.elevatorSpeed = 0;
                            for (let front = 0; front < gameFront.length; front++) if (gameFront [front].constructor.name == "girder_piece" && gameFront [front].type < 3)
                            {
                                gameMap.girderBreaks [(gameFront [front].y - 144) / 64].girderPiece = null;
                                gameItems.push (gameFront [front]);
                                gameFront.splice (front, 1);
                                front--;
                            }
                            for (let item = 0; item < gameItems.length; item++)
                            {
                                if (gameItems [item].constructor.name == "jackhammer")
                                {
                                    gameItems [item].direction = 0;
                                    gameItems [item].x = gameMap.x + 151;
                                    gameItems [item].y = 306;
                                }
                                else if (gameItems [item].constructor.name == "girder_piece" && gameItems [item].type > 0) gameItems [item].type = 0;
                            }
                        }
                        else if (level == 2)
                        {
                            gameFront [14].speedY = 0;
                            gameFront [14].y = 322;
                        }
                    }
                    else
                    {
                        if (score > highscore)
                        {
                            highscore = score;
                            fileWrite ('user.bin');
                        }
                        gameText.push (new component ("text", "Game over", "#ffffff", Math.round (gameMap.width / 2), 178, "center"));
                        gameMap.startFrame = gameArea.frame;
                    }
                }
                else if (this.ups == 0 && gameArea.frame - gameMap.startFrame == 180) gameLoadScreen ("menu");
            }
            else if (this.speedX > 0) this.heading = 1;
            else if (this.speedX < 0) this.heading = -1;
        }
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.scale (this.heading, 1);
        ctx.translate (Math.round (this.x) * this.heading - (this.heading == -1 ? this.width : 0), Math.round (this.y));
        ctx.fillStyle = this.color;
        switch (this.type)
        {
            case 0:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (22, 16, 4, 4);
                ctx.fillRect (2, 22, 4, 2);
                ctx.fillRect (0, 24, 10, 2);
                ctx.fillRect (0, 26, 6, 4);
                ctx.fillRect (16, 24, 6, 2);
                ctx.fillRect (18, 26, 4, 2);
                ctx.fillRect (18, 28, 6, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 14, 2);
                ctx.fillRect (6, 22, 16, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 14, 10, 6);
                ctx.fillRect (16, 16, 6, 4);
                ctx.fillRect (22, 14, 2, 2);
            break;
            case 2:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (4, 24, 6, 4);
                ctx.fillRect (4, 28, 8, 2);
                ctx.fillRect (18, 24, 8, 2);
                ctx.fillRect (20, 26, 6, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 18, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 14, 14, 6);
                ctx.fillStyle = this.color;
                ctx.fillRect (10, 16, 6, 2);
                ctx.fillRect (10, 18, 10, 2);
            break;
            case 1:
            case 3:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (22, 12, 4, 4);
                ctx.fillRect (8, 24, 8, 2);
                ctx.fillRect (8, 26, 6, 2);
                ctx.fillRect (8, 28, 10, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 8, 2);
                ctx.fillRect (8, 20, 10, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 14, 10, 6);
                ctx.fillRect (16, 14, 4, 4);
                ctx.fillRect (18, 12, 4, 4);
                ctx.fillRect (22, 10, 2, 2);
            break;
            case 4:
            case 10:
            case 14:
                ctx.fillRect (8, 0, 4, 2);
                ctx.fillRect (14, 0, 4, 2);
                ctx.fillRect (6, 2, 6, 2);
                ctx.fillRect (14, 2, 6, 2);
                ctx.fillRect (6, 4, 14, 2);
                ctx.fillRect (4, 6, 18, 2);
                ctx.fillRect (2, 12, 6, 4);
                ctx.fillRect (18, 12, 6, 4);
                ctx.fillRect (4, 16, 4, 2);
                ctx.fillRect (18, 16, 4, 2);
                ctx.fillRect (8, 18, 4, 2);
                ctx.fillRect (14, 18, 4, 2);
                ctx.fillRect (8, 24, 4, 2);
                ctx.fillRect (14, 24, 4, 2);
                ctx.fillRect (4, 26, 6, 2);
                ctx.fillRect (16, 26, 6, 2);
                ctx.fillRect (2, 28, 8, 2);
                ctx.fillRect (16, 28, 8, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 10, 4);
                ctx.fillRect (8, 20, 10, 4);
                ctx.fillRect (4, 22, 4, 4);
                ctx.fillRect (18, 22, 4, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (8, 12, 10, 6);
                ctx.fillRect (12, 18, 2, 2);
            break;
            case 5:
                ctx.fillRect (8, 0, 4, 2);
                ctx.fillRect (14, 0, 4, 2);
                ctx.fillRect (6, 2, 6, 2);
                ctx.fillRect (14, 2, 6, 2);
                ctx.fillRect (6, 4, 14, 2);
                ctx.fillRect (4, 6, 18, 2);
                ctx.fillRect (2, 12, 22, 4);
                ctx.fillRect (8, 16, 4, 6);
                ctx.fillRect (14, 16, 4, 6);
                ctx.fillRect (4, 22, 6, 2);
                ctx.fillRect (16, 22, 6, 2);
                ctx.fillRect (2, 24, 8, 2);
                ctx.fillRect (16, 24, 8, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 10, 4);
                ctx.fillRect (8, 18, 10, 2);
                ctx.fillRect (4, 20, 2, 2);
                ctx.fillRect (20, 20, 2, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (8, 12, 10, 4);
                ctx.fillRect (12, 16, 2, 2);
            break;
            case 6:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (22, 16, 4, 4);
                ctx.fillRect (0, 24, 10, 2);
                ctx.fillRect (0, 26, 8, 2);
                ctx.fillRect (16, 24, 8, 2);
                ctx.fillRect (18, 26, 6, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 14, 2);
                ctx.fillRect (4, 22, 18, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (6, 14, 10, 6);
                ctx.fillRect (16, 16, 6, 4);
                ctx.fillRect (22, 14, 2, 2);
            break;
            case 7:
            case 9:
            case 11:
            case 13:
                ctx.fillRect (8, 10, 4, 2);
                ctx.fillRect (14, 10, 4, 2);
                ctx.fillRect (6, 12, 14, 2);
                ctx.fillRect (4, 14, 18, 2);
                ctx.fillRect (0, 18, 26, 2);
                ctx.fillRect (8, 22, 10, 2);
                ctx.fillRect (4, 26, 6, 2);
                ctx.fillRect (16, 26, 6, 2);
                ctx.fillRect (2, 28, 8, 2);
                ctx.fillRect (16, 28, 8, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 16, 10, 2);
                ctx.fillRect (4, 24, 18, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (8, 18, 10, 2);
                ctx.fillRect (6, 20, 14, 2);
                ctx.fillRect (12, 22, 2, 2);
            break;
            case 8:
            case 12:
                ctx.fillRect (8, 16, 4, 2);
                ctx.fillRect (14, 16, 4, 2);
                ctx.fillRect (4, 18, 18, 2);
                ctx.fillRect (2, 22, 22, 2);
                ctx.fillRect (8, 24, 4, 4);
                ctx.fillRect (14, 24, 4, 4);
                ctx.fillRect (2, 28, 8, 2);
                ctx.fillRect (16, 28, 8, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (8, 20, 10, 2);
                ctx.fillRect (4, 26, 4, 2);
                ctx.fillRect (18, 26, 4, 2);
                ctx.fillStyle = this.color3;
                ctx.fillRect (8, 22, 10, 2);
        }
        ctx.restore ();
    }
}

function enemy (name, type, x, y)
{
    this.name = (name != null ? name : 0);
    this.type = (type != null ? type : 0);
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 26;
    this.height = 32;
    this.speedX = 0;
    this.speedY = 0;
    this.direction = Math.floor (Math.random () * 2);

    this.update = function ()
    {
        if (gameScreen == "game" && !levelCompleted)
        {
            if (level == 1)
            {
                if (this.direction == 0)
                {
                    if (this.x == gameMap.x + 420 && this.y == 304)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 304)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 240)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 420 && this.y == 240)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 420 && this.y == 176)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 176)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 112)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 420 && this.y == 112)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 308 && this.y == 112 && this.speedX == -1)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 308 && this.y == 48 && this.speedY == -1)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 48)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                        this.direction = 1;
                    }
                }
                else
                {
                    if (this.x == gameMap.x + 420 && this.y == 48)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 308 && this.y == 48 && this.speedX == -1)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 308 && this.y == 112 && this.speedY == 1)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 420 && this.y == 112)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 112)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 176)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 420 && this.y == 176)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 420 && this.y == 240)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 240)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                    }
                    else if (this.x == gameMap.x + 56 && this.y == 304)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                        this.direction = 0;
                    }
                }
            }
            else if (level == 2)
            {
                if (this.direction == 0)
                {
                    if (this.x == gameMap.x + 475 && this.y == 346)
                    {
                        this.speedX = -1;
                        this.speedY = 0;
                    }
                    else if (this.x == gameMap.x + 215 && this.y == 346)
                    {
                        this.speedX = 1;
                        this.speedY = 0;
                        this.direction = 1;
                    }
                }
                else
                {
                    if (this.x == gameMap.x + 475 && this.y == 346)
                    {
                        this.speedX = 0;
                        this.speedY = -1;
                    }
                    else if (this.x == gameMap.x + 475 && this.y == 240)
                    {
                        this.speedX = 0;
                        this.speedY = 1;
                        this.direction = 0;
                    }
                }
            }
            this.x += this.speedX; 
            this.y += this.speedY;
            if ((this.speedX != 0 || this.speedY != 0) && gameArea.frame % 10 == 0)
            {
                if (this.type == 0) this.type = 1;
                else this.type = 0;
            }
        }
        let ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        switch (this.name)
        {
            case 0:
                switch (this.type)
                {
                    case 0:
                        ctx.fillStyle = "#55ffff";
                        ctx.fillRect (8, 0, 4, 2);
                        ctx.fillRect (14, 0, 4, 2);
                        ctx.fillRect (4, 4, 6, 2);
                        ctx.fillRect (16, 4, 6, 2);
                        ctx.fillRect (8, 8, 10, 6);
                        ctx.fillRect (0, 14, 2, 6);
                        ctx.fillRect (24, 14, 2, 6);
                        ctx.fillRect (12, 20, 2, 2);
                        ctx.fillRect (8, 22, 10, 2);
                        ctx.fillRect (4, 24, 6, 4);
                        ctx.fillRect (16, 24, 6, 6);
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (2, 2, 2, 2);
                        ctx.fillRect (10, 2, 6, 2);
                        ctx.fillRect (22, 2, 2, 2);
                        ctx.fillRect (12, 4, 2, 2);
                        ctx.fillRect (6, 6, 14, 2);
                        ctx.fillRect (6, 14, 14, 6);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect (8, 10, 10, 2);
                        ctx.fillRect (2, 12, 4, 2);
                        ctx.fillRect (20, 12, 4, 2);
                        ctx.fillRect (10, 14, 6, 2);
                        ctx.fillRect (8, 24, 4, 2);
                        ctx.fillRect (14, 24, 4, 2)
                        ctx.fillRect (2, 28, 8, 2);
                        ctx.fillRect (16, 30, 8, 2);
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (12, 10, 2, 2);
                    break;
                    case 1:
                        ctx.fillStyle = "#55ffff";
                        ctx.fillRect (8, 0, 2, 2);
                        ctx.fillRect (4, 2, 16, 2);
                        ctx.fillRect (16, 4, 6, 2);
                        ctx.fillRect (20, 6, 2, 2);
                        ctx.fillRect (8, 8, 10, 6);
                        ctx.fillRect (0, 18, 2, 4);
                        ctx.fillRect (24, 18, 2, 4);
                        ctx.fillRect (12, 20, 2, 2);
                        ctx.fillRect (8, 22, 10, 2);
                        ctx.fillRect (4, 24, 6, 6);
                        ctx.fillRect (16, 24, 6, 4);
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (2, 0, 2, 2);
                        ctx.fillRect (14, 0, 2, 2);
                        ctx.fillRect (18, 0, 2, 2);
                        ctx.fillRect (22, 2, 2, 2);
                        ctx.fillRect (2, 4, 2, 2);
                        ctx.fillRect (10, 4, 2, 4);
                        ctx.fillRect (6, 6, 2, 2);
                        ctx.fillRect (14, 6, 2, 2);
                        ctx.fillRect (6, 16, 14, 4);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect (8, 10, 10, 2);
                        ctx.fillRect (4, 14, 4, 2);
                        ctx.fillRect (10, 14, 6, 2);
                        ctx.fillRect (18, 14, 4, 2);
                        ctx.fillRect (0, 16, 4, 2);
                        ctx.fillRect (22, 16, 4, 2);
                        ctx.fillRect (8, 24, 4, 2);
                        ctx.fillRect (14, 24, 4, 2)
                        ctx.fillRect (2, 30, 8, 2);
                        ctx.fillRect (16, 28, 8, 2);
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (12, 10, 2, 2);
                }
            break;
            case 1:
                switch (this.type)
                {
                    case 0:
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (8, 0, 10, 10);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect (6, 2, 14, 6);
                        ctx.fillRect (0, 10, 4, 4);
                        ctx.fillRect (10, 10, 6, 2);
                        ctx.fillRect (22, 10, 4, 4);
                        ctx.fillRect (4, 12, 18, 4);
                        ctx.fillRect (6, 16, 6, 12);
                        ctx.fillRect (14, 16, 6, 14);
                        ctx.fillRect (4, 28, 8, 2);
                        ctx.fillRect (14, 30, 8, 2);
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (10, 4, 6, 2);
                        ctx.fillRect (12, 12, 2, 2);
                        ctx.fillRect (10, 14, 6, 6);
                        ctx.fillStyle = "#55ffff";
                        ctx.fillRect (2, 10, 2, 2);
                        ctx.fillRect (6, 20, 6, 6);
                        ctx.fillRect (14, 20, 6, 8);
                    break;
                    case 1:
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (8, 0, 10, 10);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect (6, 2, 14, 6);
                        ctx.fillRect (0, 6, 4, 4);
                        ctx.fillRect (2, 12, 2, 2);
                        ctx.fillRect (10, 10, 6, 2);
                        ctx.fillRect (22, 12, 2, 2);
                        ctx.fillRect (22, 6, 4, 4);
                        ctx.fillRect (4, 12, 18, 4);
                        ctx.fillRect (6, 16, 6, 14);
                        ctx.fillRect (14, 16, 6, 12);
                        ctx.fillRect (4, 30, 8, 2);
                        ctx.fillRect (14, 28, 8, 2);
                        ctx.fillStyle = "#ff55ff";
                        ctx.fillRect (10, 4, 6, 2);
                        ctx.fillRect (12, 12, 2, 2);
                        ctx.fillRect (10, 14, 6, 6);
                        ctx.fillStyle = "#55ffff";
                        ctx.fillRect (2, 6, 2, 6);
                        ctx.fillRect (22, 10, 2, 2);
                        ctx.fillRect (6, 20, 6, 8);
                        ctx.fillRect (14, 20, 6, 6);
                }
        }
        ctx.restore ();
    }
}

function component (type, src, color, x, y, width, height)
{
    this.type = type;
    this.src = src;
    this.color = color;
    if (this.type == "image")
    {
        this.src = "img/" + this.src;
        this.image = gameImages.findIndex (image => image.src == this.src);
    }
    this.x = x;
    this.y = y;
    if (this.type == "text" || this.type == "value")
    {
        this.direction = (width != null ? width : "left");
        if (this.direction == "vertical") this.tildeY = 0;
        else this.tildeY = 6;
        if (this.type == "value") this.chars = (height != null ? height : 0);
        else this.size = (height != null ? height : 12);
    }
    else
    {
        this.width = width;
        this.height = height;
    }

    this.update = function ()
    {
        let ctx = gameArea.ctx;
        if (this.type == "image") ctx.drawImage (gameImages [this.image], this.x - Math.round (this.width / 2), this.y - Math.round (this.height / 2), this.width, this.height);
        else if (this.type == "rect")
        {
            ctx.beginPath ();
            ctx.rect (this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill ();
        }
        else if (this.type == "circle")
        {
            ctx.beginPath ();
            ctx.arc (this.x, this.y, this.height, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill ();
        }
        else if (this.type == "text" || this.type == "value")
        {
            if (this.type == "text") this.text = this.src;
            else if (this.type == "value")
            {
                eval ('this.text = ' + this.src + ';');
                this.text = (this.text < 10 ? "0000" : this.text < 100 ? "000" : this.text < 1000 ? "00" : this.text < 10000 ? "0" : "") + this.text + "";
                this.text = this.text.substr (5 - this.chars, this.chars);
            }
            if (this.width) ctx.fillStyle = this.color;
            else ctx.fillStyle = "transparent";
            this.width = 0;
            this.height = 0;
            ctx.save ();
            ctx.translate (Math.round (this.x), Math.round (this.y));
            ctx.scale (this.size / 12, this.size / 12);
            for (let i = 0; i < this.text.length; i++)
            {
                let char = this.text.substr (i, 1).toUpperCase (),
                    width = 14,
                    height = 16;

                if (char == "Á" || char == "É" || char == "Í" || char == "Ó" || char == "Ú")
                {
                    ctx.fillRect (6, 0 - this.tildeY, 4, 2);
                    ctx.fillRect (4, 2 - this.tildeY, 4, 2);
                }
                else if (char == "À" || char == "È" || char == "Ì" || char == "Ò" || char == "Ù")
                {
                    ctx.fillRect (2, 0 - this.tildeY, 4, 2);
                    ctx.fillRect (4, 2 - this.tildeY, 4, 2);
                }
                switch (char)
                {
                    case "0":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 10);
                        ctx.fillRect (6, 4, 2, 4);
                        ctx.fillRect (4, 6, 2, 4);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "1":
                        ctx.fillRect (4, 0, 4, 12);
                        ctx.fillRect (2, 2, 2, 4);
                        ctx.fillRect (0, 4, 2, 2);
                        ctx.fillRect (0, 12, 12, 2);
                    break;
                    case "2":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 2);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (6, 6, 4, 2);
                        ctx.fillRect (4, 8, 4, 2);
                        ctx.fillRect (2, 10, 4, 2);
                        ctx.fillRect (0, 12, 12, 2);
                    break;
                    case "3":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 2);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (4, 6, 6, 2);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (0, 10, 4, 2);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "4":
                        ctx.fillRect (6, 0, 2, 2);
                        ctx.fillRect (8, 0, 4, 14);
                        ctx.fillRect (4, 2, 4, 2);
                        ctx.fillRect (2, 4, 4, 2);
                        ctx.fillRect (0, 6, 4, 2);
                        ctx.fillRect (0, 8, 8, 2);
                    break;
                    case "5":
                        ctx.fillRect (0, 0, 12, 2);
                        ctx.fillRect (0, 2, 4, 4);
                        ctx.fillRect (0, 6, 10, 2);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (0, 10, 4, 2);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "6":
                        ctx.fillRect (4, 0, 6, 2);
                        ctx.fillRect (2, 2, 4, 2);
                        ctx.fillRect (0, 4, 4, 8);
                        ctx.fillRect (4, 6, 6, 2);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "7":
                        ctx.fillRect (0, 0, 12, 2);
                        ctx.fillRect (0, 2, 4, 2);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (6, 4, 4, 2);
                        ctx.fillRect (4, 6, 4, 8);
                    break;
                    case "8":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 4);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (2, 6, 8, 2);
                        ctx.fillRect (0, 8, 4, 4);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "9":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 4);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (2, 6, 10, 2);
                        ctx.fillRect (8, 8, 4, 2);
                        ctx.fillRect (6, 10, 4, 2);
                        ctx.fillRect (4, 12, 4, 2);
                    break;
                    case "A":
                    case "À":
                    case "Á":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 12);
                        ctx.fillRect (8, 2, 4, 12);
                        ctx.fillRect (4, 6, 4, 2);
                    break;
                    case "B":
                        ctx.fillRect (0, 0, 10, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (4, 6, 6, 2);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (0, 12, 10, 2);
                    break;
                    case "C":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (8, 10, 4, 2);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "D":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (4, 0, 4, 2);
                        ctx.fillRect (6, 2, 4, 2);
                        ctx.fillRect (8, 4, 4, 6);
                        ctx.fillRect (6, 10, 4, 2);
                        ctx.fillRect (4, 12, 4, 2);
                    break;
                    case "E":
                    case "È":
                    case "É":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (4, 6, 6, 2);
                        ctx.fillRect (8, 10, 4, 2);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "F":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 12);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (4, 6, 6, 2);
                    break;
                    case "G":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (6, 6, 6, 2);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "H":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (8, 0, 4, 14);
                        ctx.fillRect (4, 6, 4, 2);
                    break;
                    case "I":
                    case "Ì":
                    case "Í":
                        ctx.fillRect (0, 0, 12, 2);
                        ctx.fillRect (4, 2, 4, 10);
                        ctx.fillRect (0, 12, 12, 2);
                    break;
                    case "J":
                        ctx.fillRect (8, 0, 4, 12);
                        ctx.fillRect (0, 8, 4, 4);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "K":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (8, 0, 4, 2);
                        ctx.fillRect (6, 2, 4, 2);
                        ctx.fillRect (4, 4, 4, 2);
                        ctx.fillRect (4, 6, 2, 2);
                        ctx.fillRect (4, 8, 4, 2);
                        ctx.fillRect (6, 10, 4, 2);
                        ctx.fillRect (8, 12, 4, 2);
                    break;
                    case "L":
                        ctx.fillRect (0, 0, 4, 12);
                        ctx.fillRect (0, 12, 12, 2);
                    break;
                    case "M":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (8, 0, 4, 14);
                        ctx.fillRect (4, 2, 4, 2);
                    break;
                    case "N":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (8, 0, 4, 14);
                        ctx.fillRect (4, 4, 2, 2);
                        ctx.fillRect (6, 6, 2, 2);
                    break;
                    case "O":
                    case "Ò":
                    case "Ó":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 10);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "P":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (4, 0, 6, 2);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (4, 6, 6, 2);
                    break;
                    case "Q":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (8, 2, 4, 8);
                        ctx.fillRect (2, 12, 6, 2);
                        ctx.fillRect (4, 6, 2, 2);
                        ctx.fillRect (6, 8, 2, 2);
                        ctx.fillRect (8, 10, 2, 2);
                        ctx.fillRect (10, 12, 2, 2);
                    break;
                    case "R":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (4, 0, 6, 2);
                        ctx.fillRect (8, 2, 4, 4);
                        ctx.fillRect (4, 6, 6, 2);
                        ctx.fillRect (4, 8, 4, 2);
                        ctx.fillRect (6, 10, 4, 2);
                        ctx.fillRect (8, 12, 4, 2);
                    break;
                    case "S":
                        ctx.fillRect (2, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 4);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (2, 6, 8, 2);
                        ctx.fillRect (8, 8, 4, 4);
                        ctx.fillRect (0, 10, 4, 2);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "T":
                        ctx.fillRect (0, 0, 12, 2);
                        ctx.fillRect (4, 2, 4, 12);
                    break;
                    case "U":
                    case "Ù":
                    case "Ú":
                        ctx.fillRect (0, 0, 4, 12);
                        ctx.fillRect (8, 0, 4, 12);
                        ctx.fillRect (2, 12, 8, 2);
                    break;
                    case "V":
                        ctx.fillRect (0, 0, 4, 10);
                        ctx.fillRect (8, 0, 4, 10);
                        ctx.fillRect (2, 10, 8, 2);
                        ctx.fillRect (4, 12, 4, 2);
                    break;
                    case "W":
                        ctx.fillRect (0, 0, 4, 14);
                        ctx.fillRect (8, 0, 4, 14);
                        ctx.fillRect (4, 10, 4, 2);
                    break;
                    case "X":
                        ctx.fillRect (0, 0, 4, 4);
                        ctx.fillRect (8, 0, 4, 4);
                        ctx.fillRect (2, 4, 8, 2);
                        ctx.fillRect (4, 6, 4, 2);
                        ctx.fillRect (2, 8, 8, 2);
                        ctx.fillRect (0, 10, 4, 4);
                        ctx.fillRect (8, 10, 4, 4);
                    break;
                    case "Y":
                        ctx.fillRect (0, 0, 4, 6);
                        ctx.fillRect (8, 0, 4, 6);
                        ctx.fillRect (2, 6, 8, 2);
                        ctx.fillRect (4, 8, 4, 6);
                    break;
                    case "Z":
                        ctx.fillRect (0, 0, 12, 2);
                        ctx.fillRect (8, 2, 4, 2);
                        ctx.fillRect (6, 4, 4, 2);
                        ctx.fillRect (4, 6, 4, 2);
                        ctx.fillRect (2, 8, 4, 2);
                        ctx.fillRect (0, 10, 4, 2);
                        ctx.fillRect (0, 12, 12, 2);
                    break;
                    case "&":
                        ctx.fillRect (2, 0, 6, 2);
                        ctx.fillRect (0, 2, 4, 4);
                        ctx.fillRect (8, 2, 2, 2);
                        ctx.fillRect (2, 6, 4, 2);
                        ctx.fillRect (0, 8, 4, 4);
                        ctx.fillRect (6, 8, 2, 2);
                        ctx.fillRect (10, 8, 2, 2);
                        ctx.fillRect (8, 10, 2, 2);
                        ctx.fillRect (2, 12, 6, 2);
                        ctx.fillRect (10, 12, 2, 2);
                    break;
                    case "=":
                        ctx.fillRect (0, 2, 12, 4);
                        ctx.fillRect (0, 8, 12, 4);
                    break;
                    case "-":
                        ctx.fillRect (0, 5, 12, 4);
                    break;
                    case "_":
                        ctx.fillRect (0, 12, 12, 4);
                        height = 18;
                    break;
                    case "+":
                        ctx.fillRect (4, 1, 4, 12);
                        ctx.fillRect (0, 5, 12, 4);
                        height = 14;
                    break;
                    case "·":
                        ctx.fillRect (0, 5, 4, 4);
                        width = 6;
                    break;
                    case ".":
                        ctx.fillRect (0, 10, 4, 4);
                        width = 6;
                    break;
                    case ",":
                        ctx.fillRect (0, 10, 4, 4);
                        ctx.fillRect (2, 14, 2, 2);
                        ctx.fillRect (0, 16, 2, 2);
                        width = 6;
                        height = 20;
                    break;
                    case ":":
                        ctx.fillRect (0, 2, 4, 4);
                        ctx.fillRect (0, 8, 4, 4);
                        width = 6;
                    break;
                    case ";":
                        ctx.fillRect (0, 4, 4, 4);
                        ctx.fillRect (0, 10, 4, 4);
                        ctx.fillRect (2, 14, 2, 2);
                        ctx.fillRect (0, 16, 2, 2);
                        width = 6;
                        height = 20;
                    break;
                    case "(":
                        ctx.fillRect (4, 0, 6, 2);
                        ctx.fillRect (2, 2, 6, 2);
                        ctx.fillRect (0, 4, 6, 6);
                        ctx.fillRect (2, 10, 6, 2);
                        ctx.fillRect (4, 12, 6, 2);
                        width = 12;
                    break;
                    case ")":
                        ctx.fillRect (0, 0, 6, 2);
                        ctx.fillRect (2, 2, 6, 2);
                        ctx.fillRect (4, 4, 6, 6);
                        ctx.fillRect (2, 10, 6, 2);
                        ctx.fillRect (0, 12, 6, 2);
                        width = 12;
                    break;
                    case "{":
                        ctx.fillRect (4, 0, 6, 2);
                        ctx.fillRect (2, 2, 4, 4);
                        ctx.fillRect (0, 6, 4, 2);
                        ctx.fillRect (2, 8, 4, 4);
                        ctx.fillRect (4, 12, 6, 2);
                        width = 12;
                    break;
                    case "}":
                        ctx.fillRect (0, 0, 6, 2);
                        ctx.fillRect (4, 2, 4, 4);
                        ctx.fillRect (6, 6, 4, 2);
                        ctx.fillRect (4, 8, 4, 4);
                        ctx.fillRect (0, 12, 6, 2);
                        width = 12;
                    break;
                    case "<":
                        ctx.fillRect (6, 0, 4, 2);
                        ctx.fillRect (4, 2, 4, 2);
                        ctx.fillRect (2, 4, 4, 2);
                        ctx.fillRect (0, 6, 4, 2);
                        ctx.fillRect (2, 8, 4, 2);
                        ctx.fillRect (4, 10, 4, 2);
                        ctx.fillRect (6, 12, 4, 2);
                        width = 12;
                    break;
                    case ">":
                        ctx.fillRect (0, 0, 4, 2);
                        ctx.fillRect (2, 2, 4, 2);
                        ctx.fillRect (4, 4, 4, 2);
                        ctx.fillRect (6, 6, 4, 2);
                        ctx.fillRect (4, 8, 4, 2);
                        ctx.fillRect (2, 10, 4, 2);
                        ctx.fillRect (0, 12, 4, 2);
                        width = 12;
                    break;
                    case "[":
                        ctx.fillRect (0, 0, 8, 2);
                        ctx.fillRect (0, 2, 4, 10);
                        ctx.fillRect (0, 12, 8, 2);
                        width = 10;
                    break;
                    case "]":
                        ctx.fillRect (0, 0, 8, 2);
                        ctx.fillRect (4, 2, 4, 10);
                        ctx.fillRect (0, 12, 8, 2);
                        width = 10;
                    break;
                    case "/":
                        ctx.fillRect (0, 10, 2, 4);
                        ctx.fillRect (2, 8, 2, 4);
                        ctx.fillRect (4, 6, 2, 4);
                        ctx.fillRect (6, 4, 2, 4);
                        ctx.fillRect (8, 2, 2, 4);
                        ctx.fillRect (10, 0, 2, 4);
                    break;
                    case "\\":
                        ctx.fillRect (0, 0, 2, 4);
                        ctx.fillRect (2, 2, 2, 4);
                        ctx.fillRect (4, 4, 2, 4);
                        ctx.fillRect (6, 6, 2, 4);
                        ctx.fillRect (8, 8, 2, 4);
                        ctx.fillRect (10, 10, 2, 4);
                }
                if (this.direction == "vertical")
                {
                    this.height += height;
                    if (width > this.width) this.width = width;
                    ctx.translate (0, height);
                }
                else
                {
                    this.width += width;
                    if (height > this.height) this.height = height;
                    ctx.translate (width, 0);
                }   
            }
            ctx.restore ();
            if (this.direction == "center") this.x = Math.round (canvasWidth / 2) - Math.round (this.width / 2 * this.size / 12);
        }
    }
}

window.on
(
    'keyDown',
    (event) =>
    {
        startControl (99, "keyboard", "keys", event.scancode, event.key);
    }
);

window.on
(
    'keyUp',
    (event) =>
    {
        stopControl (99, "keyboard", "keys", event.scancode);
    }
);

window.on
(
    'close',
    () =>
    {
        gameArea.stop ();
        process.exit (0);
    }
);

gameArea.start ();