const sdl = require ('@kmamal/sdl');
const fs = require ('fs');
const { PNG } = require ('pngjs');
const { createCanvas, loadImage } = require ('canvas');

let windowWidth = sdl.video.displays [0].geometry.width,/*640,*/
    windowHeight = sdl.video.displays [0].geometry.height,/*400,*/
    canvasWidth = windowWidth,
    canvasHeight = windowHeight,
    window = sdl.video.createWindow
    (
        {
            title: "Hard Hat Mack",
            width: canvasWidth,
            height: canvasHeight,
            fullscreen: false
        }
    ),
    bonus = 5000,
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
    gravity = 0.12,
    gameScreen = null,
    gameTitle = null,
    gameMap =
    {
        name: null,
        width: canvasWidth,
        height: canvasHeight
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
    gameBack = [],
    gameFront = [],
    gameItems = [],
    gameEnemies = [],
    gamePlayers = [],
    gameText = [],
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
            const pngBuffer = fs.readFileSync ('./img/icon.png');
            const png = PNG.sync.read (pngBuffer);
            const { width, height, data } = png;
            window.setIcon (width, height, width * 4, 'rgba32', data);
            fileRead ('user.bin');
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
            stopUserInteractions ();
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
    catch (err)
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
    catch (err)
    {
        return undefined;
    }
}

function startControl (id_control, control, bt_type, bt_code, bt_value)
{
    if (!pressed [bt_type][id_control].includes (bt_code) || bt_type == "axes")
    {
        if (!pressed [bt_type][id_control].includes (bt_code)) pressed [bt_type][id_control].push (bt_code);
        let player = -1;
        if (gameScreen == "game" && gamePlayers.length > 0) player = 0;
        if (control == "keyboard") bt_value = 1;
        userActionStart (control, bt_type, bt_code, bt_value, player);
    }
}

function stopControl (id_control, control, bt_type, bt_code)
{
    if (pressed [bt_type][id_control].includes (bt_code))
    {
        pressed [bt_type][id_control].splice (pressed [bt_type][id_control].indexOf (bt_code), 1);
        let player = -1;
        if (gameScreen == "game" && gamePlayers.length > 0)
        {
            player = 0;
            userActionStop (id_control, control, bt_type, bt_code, player);
        }
    }
}

function userActionStart (control, bt_type, bt_code, bt_value, player)
{
    let userAction = null;
    if (bt_type == null) userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control].includes (bt_code));
    else userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control][bt_type].includes (bt_code));

    if (gameScreen == "menu")
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
                    if (player > -1)
                    {
                        if (gameArea.animation == null) gameArea.play ();
                        else  gameArea.pause ();
                    }
                break;
                case 'exit':
                    if (player > -1) gameLoadScreen ("menu");
                break;
                case 'move_up':
                    if (player > -1) gamePlayers [player].moveY = -bt_value;
                break;
                case 'move_down':
                    if (player > -1) gamePlayers [player].moveY = bt_value;
                break;
                 case 'move_left':
                    if (player > -1) gamePlayers [player].moveX = -bt_value;
                break;
                case 'move_right':
                    if (player > -1) gamePlayers [player].moveX = bt_value;
                break;
                case 'jump':
                    if (player > -1) gamePlayers [player].jump = -2;
                break;
                case 'drop':
                    if (player > -1) gamePlayers [player].dropItem ();
            }
        }
    }
}

function userActionStop (id_control, control, bt_type, bt_code, player)
{
    let userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control][bt_type].includes (bt_code));

    if (userAction > -1)
    {
        switch (userActions [userAction].action)
        {
            case 'move_down':
                if (player > -1)
                {
                    let userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_up');
                    let bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].moveY = -1;
                    else gamePlayers [player].moveY = 0;
                }
            break;
            case 'move_up':
                if (player > -1)
                {
                    let userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_down');
                    let bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].moveY = 1;
                    else gamePlayers [player].moveY = 0;
                }
            break;
            case 'move_left':
                if (player > -1)
                {
                    let userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_right');
                    let bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].moveX = 1;
                    else gamePlayers [player].moveX = 0;
                }
            break;
            case 'move_right':
                if (player > -1)
                {
                    let userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_left');
                    let bt_code_prev = userActions [userActionPrev][control][bt_type][0];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].moveX = -1;
                    else gamePlayers [player].moveX = 0;
                }
            break;
            case 'jump':
                if (player > -1) gamePlayers [player].jump = 0;
        }
    }
}

function stopUserInteractions ()
{
    let player = 0;
    pressed =
    {
        keys:
        {
            99: []
        },
        buttons: [],
        axes: []
    };
    gamePlayers [player].speedX = 0;
    gamePlayers [player].speedY = 0;
}

function gameLoadScreen (screen)
{
    gameTitle = null;
    gameBack = [];
    gameFront = [];
    gameItems = [];
    gameEnemies = [];
    gamePlayers = [];
    gameText = [];

    gameScreen = screen;
    if (gameScreen == "menu")
    {
        canvasWidth = windowWidth;;
        canvasHeight = windowHeight;
        gameArea.canvas.width = canvasWidth;
        gameArea.canvas.height = canvasHeight;
        gameBack.push (new back ("black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("image", "title.png", "", Math.round (canvasWidth / 2), 150, 362, 40);
        gameText.push (new component ("text", "IBM version by Dana How & Kevin Gilmore, through TMQ Software, inc.", "white", Math.round (canvasWidth / 2), gameTitle.y + 250, "center"));
        gameText.push (new component ("text", "An original game design by Michael Abbot & Matthew Alexander.", "white", Math.round (canvasWidth / 2), gameText [0].y + 50, "center"));
        gameText.push (new component ("text", "This remake was developed by Marc Pinyot Gascón using Node.js.", "white", Math.round (canvasWidth / 2), gameText [1].y + 50, "center"));
        gameText.push (new component ("text", "Vandal", "white", Math.round (canvasWidth / 2) - 241, gameText [2].y + 100));
        gameText.push (new component ("text", "Mack", "white", Math.round (canvasWidth / 2) - 27, gameText [3].y));
        gameText.push (new component ("text", "Osha", "white", Math.round (canvasWidth / 2) + 173, gameText [4].y));
        gameText.push (new enemy (0, 0, Math.round (canvasWidth / 2) - 214, gameText [5].y + 23));
        gameText.push (new player (0, Math.round (canvasWidth / 2) - 13, gameText [5].y + 25));
        gameText.push (new enemy (1, 0, Math.round (canvasWidth / 2) + 186, gameText [5].y + 23));
        gameText.push (new beam_h ("#FF55FF", "#55FFFF", Math.round (canvasWidth / 2) - 256, gameText [5].y + 55, 512));
        gameText.push (new component ("image", "electronic_arts.png", "", 246, canvasHeight - 150, 192, 66));
        gameText.push (new component ("text", "(C)1984 The Duplicators - 2026 nYoT", "white", Math.round (canvasWidth / 2) + 325, canvasHeight - 150));
    }
    else if (gameScreen == "config")
    {
        gameBack.push (new back ("black", 0, 0, canvasWidth, canvasHeight));
        gameTitle = new component ("text", "Configuration menu", "white", Math.round (canvasWidth / 2), 100, "center");
        gameText.push (new component ("text", "Press key for " + controls [editKey].key + ":", "white", Math.round (canvasWidth / 2) - 500, gameTitle.y + 105));
    }
    else if (gameScreen == "game")
    {
        canvasHeight = 400;
        canvasWidth = Math.round (canvasHeight * windowWidth / windowHeight);
        gameArea.canvas.width = canvasWidth;
        gameArea.canvas.height = canvasHeight;
        generateGameMap (1);
    }
}

function generateGameMap (level)
{
    switch (level)
    {
        case 1:
            gameMap =
            {
                level: level,
                width: canvasWidth,
                height: canvasHeight,
                elevatorFloor: 0,
                elevatorSpeed: 0
            };
            gameBack.push (new back ("black", 0, 0, gameMap.width, gameMap.height));
            gameBack.push (new beam_v ("#FFFFFF", "#55FFFF", Math.round (gameMap.width / 2) - 139, 96, 240));
            gameBack.push (new beam_v ("#FFFFFF", "#55FFFF", Math.round (gameMap.width / 2) + 117, 96, 240));
            gameBack.push (new chain ("#55FFFF", Math.round (gameMap.width / 2) + 60, 96, 4));
            gameBack.push (new chain ("#55FFFF", Math.round (gameMap.width / 2) - 186, 160, 4));
            gameBack.push (new chain ("#55FFFF", Math.round (gameMap.width / 2) + 178, 224, 4));
            gameBack.push (new chain ("#55FFFF", Math.round (gameMap.width / 2) - 186, 288, 4));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) - 159, 352));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) - 59, 352));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) + 41, 352));
            gameBack.push (new column ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) + 141, 352));
            gameBack.push (new elevator (2, "#FFFFFF", null, Math.round (gameMap.width / 2) - 201, 288, 4, 48));
            gameBack.push (new support ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) - 230, 346));
            gameFront.push (new bell ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) - 137, 18));
            gameFront.push (new machine ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) + 286, 54));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", Math.round (gameMap.width / 2) - 195, 80, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", Math.round (gameMap.width / 2) - 195, 144, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", Math.round (gameMap.width / 2) - 195, 208, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", Math.round (gameMap.width / 2) - 195, 272, 390));
            gameFront.push (new beam_h ("#55FFFF", "#FF55FF", Math.round (gameMap.width / 2) - 195, 336, 390));
            gameFront.push (new floor ("white", Math.round (gameMap.width / 2) - 256, 378, 512, 6));
            gameFront.push (new elevator (0, "#FFFFFF", "#FF55FF", Math.round (gameMap.width / 2) - 251, 280, 54, 8));
            gameFront.push (new elevator (1, "#FFFFFF", "#55FFFF", Math.round (gameMap.width / 2) - 251, 288, 4, 48));
            gameFront.push (new elevator (3, "#FFFFFF", "#55FFFF", Math.round (gameMap.width / 2) - 251, 336, 54, 10));
            gameFront.push (new bouncy ("#FFFFFF", "#FF55FF", "#55FFFF", Math.round (gameMap.width / 2) + 232, 354));
            gameItems.push (new hammer_drill ("#FFFFFF", "#FF55FF", Math.round (gameMap.width / 2) - 100, 306));
            gameEnemies.push (new enemy (Math.floor (Math.random () * 2), 0, Math.round (gameMap.width / 2) - 195, 240));
            gamePlayers.push (new player (0, Math.round (gameMap.width / 2) + 160, 306, -1));
        break;
        case 2:
            gameMap =
            {
                level: level,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("black", 0, 0, gameMap.width, gameMap.height));
        break;
        case 3:
            gameMap =
            {
                level: level,
                width: canvasWidth,
                height: canvasHeight
            };
            gameBack.push (new back ("black", 0, 0, gameMap.width, gameMap.height));
    }
    gameText.push (new component ("text", "Bonus:", "white", Math.round (gameMap.width / 2) - 300, 0));
    gameText.push (new component ("text", (bonus < 10 ? "0000" : bonus < 100 ? "000" : bonus < 1000 ? "00" : bonus < 10000 ? "0" : "") + bonus + "", "white", Math.round (gameMap.width / 2) - 210, 0));
    gameText.push (new component ("text", "Score:", "white", Math.round (gameMap.width / 2) - 90, 0));
    gameText.push (new component ("text", (score < 10 ? "0000" : score < 100 ? "000" : score < 1000 ? "00" : score < 10000 ? "0" : "") + score + "", "white", Math.round (gameMap.width / 2), 0));
    gameText.push (new component ("text", "Hi-score:", "white", Math.round (gameMap.width / 2) + 113, 0));
    gameText.push (new component ("text", (highscore < 10 ? "0000" : highscore < 100 ? "000" : highscore < 1000 ? "00" : highscore < 10000 ? "0" : "") + highscore + "", "white", Math.round (gameMap.width / 2) + 245, 0));
    gameText.push (new component ("text", "Level", "white", Math.round (gameMap.width / 2) + 300, 128, "vertical"));
    gameText.push (new component ("text", (gameMap.level < 10 ? "0" : "") + gameMap.level + "", "white", Math.round (gameMap.width / 2) + 286, 224));
    gameText.push (new component ("text", "Mack", "white", Math.round (gameMap.width / 2) + 300, 288, "vertical"));
    gameText.push (new component ("text", "lives", "white", Math.round (gameMap.width / 2) + 300, 368));
}

function updateGameArea ()
{
    gameArea.clear ();
    for (let back = 0; back < gameBack.length; back++) gameBack [back].update ();
    for (let front = 0; front < gameFront.length; front++) gameFront [front].update ();
    if (gameScreen == "game")
    {
        for (let item = 0; item < gameItems.length; item++) gameItems [item].update (item);
        for (let enemy = 0; enemy < gameEnemies.length; enemy++) gameEnemies [enemy].update (enemy);
        for (let player = 0; player < gamePlayers.length; player++) gamePlayers [player].update (player);
        for (let text = 0; text < gameText.length; text++) if (gameText [text]) gameText [text].update (text);
        if (gameMap.elevatorSpeed != 0)
        {
            gameMap.elevatorFloor -= gameMap.elevatorSpeed;
            if (gameMap.elevatorSpeed < 0 && gameMap.elevatorFloor == 192 || gameMap.elevatorSpeed > 0 && gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = 0;
        }
        /*console.clear ();
        console.log ("gamePlayers:", gamePlayers);
        console.log ("gameEnemies:", gameEnemies);
        console.log ("gameItems:", gameItems);
        console.log ("gameFront:", gameFront);
        console.log ("gameBack:", gameBack);*/
    }
    if (gameScreen != "game")
    {
        if (gameTitle) gameTitle.update ();
        for (let text = 0; text < gameText.length; text++) if (gameText [text]) gameText [text].update (text);
    }
    const buffer = gameArea.canvas.toBuffer ('raw');
    window.render (canvasWidth, canvasHeight, canvasWidth * 4, 'argb8888', buffer);
    gameArea.frame++;
}

async function fileRead (file)
{
    await fs.readFile
    (
        './' + file,
        'utf8',
        (err, data) =>
        {
            if (err)
            {
                console.error ('Error reading file:', err.message + '.');
                return;
            }
            let userData = decodeBase64Url (data);
            if (!userData)
            {
                console.error ('Error decoding base64Url data.');
                return;
            }
            userData = JSONparse (userData);
            if (userData == undefined)
            {
                console.error ('Error parsing JSON data.');
                return;
            }
            highscore = userData.highscore;
            controls = userData.controls;
            userActions [5].keyboard.keys = [controls [0].code];
            userActions [6].keyboard.keys = [controls [1].code];
            userActions [7].keyboard.keys = [controls [2].code];
            userActions [8].keyboard.keys = [controls [3].code];
            userActions [9].keyboard.keys = [controls [4].code];
            userActions [10].keyboard.keys = [controls [5].code];
            userActions [11].keyboard.keys = [controls [6].code];     
        }
    );
}

async function fileWrite (file)
{
    await fs.writeFile
    (
        './' + file,
        encodeBase64Url (JSONstringify ({ highscore: highscore, controls: controls })),
        'utf8',
        (err) =>
        {
            if (err)
            {
                console.error ('Error writing file:', err.message + '.');
                return;
            }
        }
    );
}

async function fileDelete (file)
{
    await fs.unlink
    (
        './' + file,
        (err) =>
        {
            if (err)
            {
                console.error ('Error deleting file:', err.message + '.');
                return;
            }
        }
    );
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
        ctx = gameArea.ctx;
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
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        const canvasAux = createCanvas (4, 6);
        canvasAux.width = 4;
        canvasAux.height = 6;
        const ctxAux = canvasAux.getContext ("2d");
        ctxAux.lineWidth = 0;
        ctxAux.fillStyle = this.color;
        ctxAux.fillRect (0, 0, 2, 2);
        ctxAux.fillRect (2, 2, 2, 4);
        this.pattern = ctx.createPattern (canvasAux);
        ctx.fillStyle = this.pattern;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }
}

function beam_h (color, color2, x, y, width)
{
    this.color = color;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 16;

    this.update = function ()
    {
        if (this.width - 12 > 0)
        {
            ctx = gameArea.ctx;
            ctx.lineWidth = 0;
            ctx.save ();
            ctx.translate (Math.round (this.x), Math.round (this.y));
            ctx.fillStyle = this.color;
            ctx.fillRect (0, 0, this.width, 4);
            ctx.fillRect (0, 12, this.width, 4);
            ctx.fillStyle = this.color2;
            ctx.fillRect (6, 4, this.width - 12, 8);
            for (let x = 28; x + 7 < this.width; x += 104)
            {
                ctx.fillStyle = "black";
                ctx.fillRect (x, 6, 6, 4);
                ctx.fillRect (x + 16, 6, 6, 4);
            }
            ctx.restore ();
        }
    }
}

function beam_v (color, color2, x, y, height)
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
            ctx = gameArea.ctx;
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
                ctx.fillStyle = "black";
                ctx.fillRect (8, y, 6, 4);
                ctx.fillRect (8, y + 14, 6, 4);
            }
            ctx.restore ();
        }
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
        ctx = gameArea.ctx;
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
        ctx = gameArea.ctx;
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
    this.startY = y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        this.y = this.startY - gameMap.elevatorFloor;
        ctx = gameArea.ctx;
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
    this.startY = y;
    this.width = 12;
    this.height = 32;
    this.startHeight = this.height;

    this.update = function ()
    {
        this.y = this.startY - gameMap.elevatorFloor;
        this.height = this.startHeight + gameMap.elevatorFloor;
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        const canvasAux = createCanvas (12, 16);
        canvasAux.width = 12;
        canvasAux.height = 16;
        const ctxAux = canvasAux.getContext ("2d");
        ctxAux.lineWidth = 0;
        ctxAux.fillStyle = this.color;
        ctxAux.fillRect (0, 0, canvasAux.width, canvasAux.height);
        ctxAux.clearRect (10, 10, 2, 2);
        ctxAux.clearRect (0, 12, 2, 2);
        ctxAux.clearRect (2, 14, 2, 2);
        ctxAux.clearRect (4, 0, 2, 2);
        ctxAux.clearRect (8, 0, 2, 2);
        ctxAux.clearRect (10, 2, 2, 2);
        ctxAux.clearRect (0, 4, 2, 2);
        ctxAux.clearRect (2, 6, 2, 2);
        ctxAux.clearRect (4, 8, 2, 2);
        ctxAux.fillStyle = this.color2;
        ctxAux.fillRect (6, 0, 2, 2);
        ctxAux.fillStyle = this.color3;
        ctxAux.fillRect (4, 14, 2, 2);
        ctxAux.fillRect (4, 6, 2, 2);
        const pattern = ctx.createPattern (canvasAux);
        ctx.fillStyle = pattern;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }
}

function bell (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.startX = x;
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
        ctx = gameArea.ctx;
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

function bouncy (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.startY = y;
    this.width = 26;
    this.height = 24;
    this.type = 0;

    this.update = function ()
    {
        ctx = gameArea.ctx;
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
                        gamePlayers [0].y = this.y - gamePlayers [0].height;
                        gamePlayers [0].speedY = -4;
                        //if (gamePlayers [0].dead > 0) gamePlayers [0].speedY = Number ((gamePlayers [0].speedY * 0.8).toFixed (2));
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
                    gamePlayers [0].y = this.y - gamePlayers [0].height;
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
                    gamePlayers [0].y = this.y - gamePlayers [0].height;
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

    this.update = function ()
    {
        ctx = gameArea.ctx;
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
        if (gameArea.frame % 300 == 0 && this.type == 0)
        {
            this.type = 1;
            gameEnemies.push (new bolt ("#FFFFFF", this.x, this.y));
        }
        else if (gameArea.frame % 120 == 0 && this.type == 1) this.type = 0;
    }
}

function bolt (color, x, y, bounce)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.bounce = (bounce != null ? bounce : 0.6);
    this.bounced = [0];
    this.width = 10;
    this.height = 10;
    this.speedX = -(Math.floor (Math.random () * 6 + 1));
    this.speedY = -(Math.floor (Math.random () * 4 - 2));
    this.gravity = gravity;

    this.update = function (idEnemy)
    {
        this.x = Number ((this.x + this.speedX).toFixed (2));
        this.y = Number ((this.y + this.speedY).toFixed (2));
        let beams = gameFront.filter (front => front.constructor.name == "beam_h");
        for (let beam = 1; beam < beams.length; beam++)
        {
            if (!this.bounced.includes (beam)) 
            {
                if (this.x < beams [beam].x + beams [beam].width && this.x >= beams [beam].x || this.x + this.width > beams [beam].x && this.x + this.width <= beams [beam].x + beams [beam].width)
                {
                    if (this.y + this.height > beams [beam].y && this.y + this.height <= beams [beam].y + beams [beam].height && this.speedY > 0) this.y = beams [beam].y - this.height;
                    if (this.y == beams [beam].y - this.height)
                    {
                        this.speedY = -(this.speedY * this.bounce);
                        this.bounced.push (beam);
                        if (!this.bounced.includes (beam - 1)) this.bounced.push (beam - 1);
                    }
                }
            }
        }
        this.speedY = this.speedY + this.gravity;
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        ctx.fillStyle = this.color;
        ctx.fillRect (0, 0, 10, 4);
        ctx.fillRect (2, 4, 6, 6);
        ctx.restore ();
        if (this.y > gameMap.height || this.x + this.width < 0) gameEnemies.splice (idEnemy, 1);
    }
}

function hammer_drill (color, color2, x, y)
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
        if (idItem == gamePlayers [0].item)
        {
            this.speedX = gamePlayers [0].speedX;
            this.speedY = gamePlayers [0].speedY;
        }
        else
        {
            if (this.direction == 0)
            {
                if (this.x == Math.round (gameMap.width / 2) - 100 && this.y == 306)
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
                else if (this.x == Math.round (gameMap.width / 2) + 167 && this.y == 242)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 170 && this.y == 242)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 170 && this.y == 178)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 110 && this.y == 178 && this.speedY == 0)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 110 && this.y == 114 && this.speedX == 0)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 50 && this.y == 114 && this.speedX > 0)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 50 && this.y == 50)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                    this.direction = 1
                }
            }
            else
            {
                if (this.x == Math.round (gameMap.width / 2) + 167 && this.y == 50)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 167 && this.y == 114)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 170 && this.y == 114)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 170 && this.y == 178)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 142 && this.y == 178)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 142 && this.y == 242)
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
        ctx = gameArea.ctx;
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

function player (type, x, y, heading)
{
    this.type = (type != null ? type : 0);
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
    this.bouncy = false;
    this.elevator = false;
    this.state = null;
    this.dead = 0;
    this.deadFrame = 0;
    this.lives = 3;
    this.floor = 0;
    this.enemyKill = null;
    this.item = null;

    this.dropItem = function ()
    {
        if (gameItems [this.item].constructor.name == "hammer_drill")
        {
            gameItems [this.item].direction = 0;
            gameItems [this.item].x = Math.round (gameMap.width / 2) - 100;
            gameItems [this.item].y = 306;
        }
        this.item = null;
    }

    this.update = function (idPlayer)
    {
        if (gameScreen == "game")
        {
            this.x = Number ((this.x + this.speedX).toFixed (2));
            this.y = Number ((this.y + this.speedY).toFixed (2));
            if (this.dead == 0)
            {
                for (let enemy = 0; enemy < gameEnemies.length; enemy++)
                {
                    if (this.x <= gameEnemies [enemy].x + gameEnemies [enemy].width && this.x + this.width >= gameEnemies [enemy].x && this.y <= gameEnemies [enemy].y + gameEnemies [enemy].height && this.y + this.height >= gameEnemies [enemy].y)
                    {
                        this.dead = 2;
                        gameEnemies [enemy].speedX = 0;
                        gameEnemies [enemy].speedY = 0;
                        gameEnemies [enemy].gravity = 0;
                        this.enemyKill = enemy;
                    }
                }
                if (this.item == null) for (let item = 0; item < gameItems.length; item++) if (this.x <= gameItems [item].x + gameItems [item].width && this.x + this.width >= gameItems [item].x && this.y <= gameItems [item].y + gameItems [item].height && this.y + this.height >= gameItems [item].y) this.item = item;
                if (this.item != null)
                {
                    gameItems [this.item].y = this.y;
                    if (this.heading == 1) gameItems [this.item].x = this.x + this.width;
                    else gameItems [this.item].x = this.x - gameItems [this.item].width;
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
                if (this.state != "chain")
                {
                    if (this.dead == 0 && this.state == "ground" && !this.bouncy && !this.elevator) this.speedX = this.moveX;
                    this.state = "air";
                    for (let front = 0; front < gameFront.length; front++)
                    {
                        if (this.x < gameFront [front].x + gameFront [front].width && this.x + this.width > gameFront [front].x)
                        {
                            if (this.y + this.height > gameFront [front].y && this.y <= gameFront [front].y && this.speedY > 0) this.y = gameFront [front].y - this.height;
                            else if (this.y < gameFront [front].y + gameFront [front].height && this.y + this.height >= gameFront [front].y + gameFront [front].height && this.speedY < 0) this.y = gameFront [front].y + gameFront [front].height;
                            if (this.y == gameFront [front].y - this.height)
                            {
                                this.state = "ground";
                                if (gameFront [front].constructor.name == "bouncy" && !this.bouncy)
                                {
                                    this.bouncy = true;
                                    gameFront [front].type = 1;
                                }
                                else if (gameFront [front].constructor.name == "elevator" && gameFront [front].type == 3 && !this.elevator && this.speedX < 0 && this.x + this.width == gameFront [front].x + gameFront [front].width)
                                {
                                    this.elevator = true;
                                    this.speedX = 0;
                                    this.x -= (this.x - gameFront [front].x) / 2;
                                    if (gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = -4;
                                    else if (gameMap.elevatorFloor == 192) gameMap.elevatorSpeed = 4;
                                    this.speedY = gameMap.elevatorSpeed;
                                }
                                else if (this.speedY > 2.8 || gameFront [front].constructor.name == "elevator" && gameFront [front].type == 0) this.dead = 1;
                                else if (gameFront [front].constructor.name == "beam_h") this.floor = this.y;
                                if (!this.elevator) this.speedY = 0;
                            }
                            else if (this.y == gameFront [front].y + gameFront [front].height)
                            {
                                if (gameFront [front].constructor.name == "bell")
                                {
                                    gameFront [front].rings = 1;
                                    if (gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = -4;
                                    else if (gameMap.elevatorFloor == 192) gameMap.elevatorSpeed = 4;
                                }
                                this.speedY = 0;
                            }
                        }
                        if (this.y < gameFront [front].y + gameFront [front].height && this.y + this.height > gameFront [front].y)
                        {
                            if (this.x == gameFront [front].x + gameFront [front].width && this.speedX < 0 || this.x + this.width == gameFront [front].x && this.speedX > 0)
                            {
                                if (gameFront [front].constructor.name == "bell")
                                {
                                    gameFront [front].rings = 1;
                                    if (gameMap.elevatorFloor == 0) gameMap.elevatorSpeed = -4;
                                    else if (gameMap.elevatorFloor == 192) gameMap.elevatorSpeed = 4;
                                }
                                this.speedX = 0;
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
                        if (this.speedY > 2.8) this.dead = 1;
                    }
                    if (this.y == 0 && this.speedY < 0 || this.y == gameMap.height - this.height && this.speedY > 0) this.speedY = 0;
                }
                if (this.state == "air")
                {
                    if (this.speedX != 0)
                    {
                        if (!this.jumping || this.y >= this.jumping)
                        {
                            this.speedX = 0;
                            this.jumping = false;
                        }
                    }
                    if (this.bouncy)
                    {
                        if (this.floor > 50 && this.y <= this.floor - 64 || this.floor == 50 && this.y <= 306)
                        {
                            this.jumping = this.y;
                            this.bouncy = false;
                            this.speedX = -1;
                            this.speedY = -2;
                        }
                    }
                    if (!this.bouncy || this.bouncy && this.dead > 0) this.speedY = Number ((this.speedY + gravity).toFixed (2));
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
                    for (let back = 0; back < gameBack.length; back++)
                    {
                        if (gameBack [back].constructor.name == "chain" && this.x + this.width >= gameBack [back].x && this.x <= gameBack [back].x + gameBack [back].width && this.y - 18 <= gameBack [back].y && this.y + this.height + 16 >= gameBack [back].y)
                        {
                            if (this.y - 18 < gameBack [back].y && this.y + this.height + 16 > gameBack [back].y) this.state = "chain";
                            else
                            {
                                this.speedY = 0;
                                this.state = "ground";
                                if (this.y - 18 == gameBack [back].y) this.chain_bottom = true;
                                else if (this.y + this.height + 16 == gameBack [back].y) this.chain_top = true;
                            }
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
                            this.speedY = this.jump;
                            this.jumping = this.y;
                        }
                        else this.jumping = false;
                        if (this.type > 3 && this.type < 14 && !this.bouncy) this.type = 1;
                        if (this.speedX != 0 && gameArea.frame % 5 == 0)
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
                    else if (this.type == 4) this.type = 7;
                    else if (this.type == 7)
                    {
                        this.type = 8;
                        setTimeout
                        (
                            () =>
                            {
                                if (this.enemyKill != null && gameEnemies [this.enemyKill].constructor.name == "bolt")
                                {
                                    gameEnemies.splice (this.enemyKill, 1);
                                    this.enemyKill = null;
                                }
                                this.lives--;
                                gameText [9].src = "" + this.lives + ""; 
                                if (this.lives == 0)
                                {
                                    gameText.push (new component ("text", "Game over", "white", Math.round (gameMap.width / 2) - 60, 178));
                                    setTimeout
                                    (
                                        () =>
                                        {
                                            gameLoadScreen ("menu");
                                        },
                                        3000
                                    );
                                }
                                else
                                {
                                    gameMap.elevatorFloor = 0;
                                    gameMap.elevatorSpeed = 0;
                                    this.type = 0;
                                    this.x = Math.round (gameMap.width / 2) + 160;
                                    this.y = 306;
                                    this.heading = -1;
                                    this.jump = 0;
                                    this.jumping = false;
                                    this.bouncy = false;
                                    this.elevator = false;
                                    this.state = null;
                                    this.dead = 0;
                                    this.deadFrame = 0;
                                    this.item = null;
                                    gameItems [0].direction = 0;
                                    gameItems [0].x = Math.round (gameMap.width / 2) - 100;
                                    gameItems [0].y = 306;
                                    gameEnemies [0].name = Math.floor (Math.random () * 2);
                                    gameEnemies [0].direction = Math.floor (Math.random () * 2);
                                    gameEnemies [0].x = Math.round (gameMap.width / 2) - 195;
                                    gameEnemies [0].y = 240;
                                }
                            },
                            2000
                        );
                    }
                    else this.type = 4; 
                }
            }
            else if (this.speedX > 0) this.heading = 1;
            else if (this.speedX < 0) this.heading = -1;
        }
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.scale (this.heading, 1);
        ctx.translate (Math.round (this.x) * this.heading - (this.heading == -1 ? this.width : 0), Math.round (this.y));
        ctx.fillStyle = "#FFFFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 14, 2);
                ctx.fillRect (6, 22, 16, 2);
                ctx.fillStyle = "#55FFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 18, 4);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (6, 14, 14, 6);
                ctx.fillStyle = "#FFFFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 8, 2);
                ctx.fillRect (8, 20, 10, 4);
                ctx.fillStyle = "#55FFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 10, 4);
                ctx.fillRect (8, 20, 10, 4);
                ctx.fillRect (4, 22, 4, 4);
                ctx.fillRect (18, 22, 4, 4);
                ctx.fillStyle = "#55FFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 10, 4);
                ctx.fillRect (8, 18, 10, 2);
                ctx.fillRect (4, 20, 2, 2);
                ctx.fillRect (20, 20, 2, 2);
                ctx.fillStyle = "#55FFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 14, 2);
                ctx.fillRect (4, 22, 18, 2);
                ctx.fillStyle = "#55FFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 16, 10, 2);
                ctx.fillRect (4, 24, 18, 2);
                ctx.fillStyle = "#55FFFF";
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
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 20, 10, 2);
                ctx.fillRect (4, 26, 4, 2);
                ctx.fillRect (18, 26, 4, 2);
                ctx.fillStyle = "#55FFFF";
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

    this.update = function (idEnemy)
    {
        if (gameScreen == "game")
        {
            if (this.direction == 0)
            {
                if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 304)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 304)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 240)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 240)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 176)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 176)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 112)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 112)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 51 && this.y == 112 && this.speedX == -1)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 51 && this.y == 48 && this.speedY == -1)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 48)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                    this.direction = 1;
                }
            }
            else
            {
                if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 48)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 51 && this.y == 48 && this.speedX == -1)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 51 && this.y == 112 && this.speedY == 1)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 112)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 112)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 176)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 176)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) + 169 && this.y == 240)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 240)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == Math.round (gameMap.width / 2) - 195 && this.y == 304)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                    this.direction = 0;
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
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (Math.round (this.x), Math.round (this.y));
        switch (this.name)
        {
            case 0:
                switch (this.type)
                {
                    case 0:
                        ctx.fillStyle = "#55FFFF";
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
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (2, 2, 2, 2);
                        ctx.fillRect (10, 2, 6, 2);
                        ctx.fillRect (22, 2, 2, 2);
                        ctx.fillRect (12, 4, 2, 2);
                        ctx.fillRect (6, 6, 14, 2);
                        ctx.fillRect (6, 14, 14, 6);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect (8, 10, 10, 2);
                        ctx.fillRect (2, 12, 4, 2);
                        ctx.fillRect (20, 12, 4, 2);
                        ctx.fillRect (10, 14, 6, 2);
                        ctx.fillRect (8, 24, 4, 2);
                        ctx.fillRect (14, 24, 4, 2)
                        ctx.fillRect (2, 28, 8, 2);
                        ctx.fillRect (16, 30, 8, 2);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (12, 10, 2, 2);
                    break;
                    case 1:
                        ctx.fillStyle = "#55FFFF";
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
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (2, 0, 2, 2);
                        ctx.fillRect (14, 0, 2, 2);
                        ctx.fillRect (18, 0, 2, 2);
                        ctx.fillRect (22, 2, 2, 2);
                        ctx.fillRect (2, 4, 2, 2);
                        ctx.fillRect (10, 4, 2, 4);
                        ctx.fillRect (6, 6, 2, 2);
                        ctx.fillRect (14, 6, 2, 2);
                        ctx.fillRect (6, 16, 14, 4);
                        ctx.fillStyle = "#FFFFFF";
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
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (12, 10, 2, 2);
                }
            break;
            case 1:
                switch (this.type)
                {
                    case 0:
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (8, 0, 10, 10);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect (6, 2, 14, 6);
                        ctx.fillRect (0, 10, 4, 4);
                        ctx.fillRect (10, 10, 6, 2);
                        ctx.fillRect (22, 10, 4, 4);
                        ctx.fillRect (4, 12, 18, 4);
                        ctx.fillRect (6, 16, 6, 12);
                        ctx.fillRect (14, 16, 6, 14);
                        ctx.fillRect (4, 28, 8, 2);
                        ctx.fillRect (14, 30, 8, 2);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (10, 4, 6, 2);
                        ctx.fillRect (12, 12, 2, 2);
                        ctx.fillRect (10, 14, 6, 6);
                        ctx.fillStyle = "#55FFFF";
                        ctx.fillRect (2, 10, 2, 2);
                        ctx.fillRect (6, 20, 6, 6);
                        ctx.fillRect (14, 20, 6, 8);
                    break;
                    case 1:
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (8, 0, 10, 10);
                        ctx.fillStyle = "#FFFFFF";
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
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (10, 4, 6, 2);
                        ctx.fillRect (12, 12, 2, 2);
                        ctx.fillRect (10, 14, 6, 6);
                        ctx.fillStyle = "#55FFFF";
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
    this.loadFile = async function (src)
    {
        try
        {
            this.image = await loadImage (src);
        }
        catch (err)
        {
            console.error ('Error loading picture:', err + '.');
        }
    }

    this.type = type;
    if (src == "lives") this.src = "" + gamePlayers [0].lives + "";
    else this.src = src;
    this.color = color;
    if (this.type == "image") this.loadFile ("./img/" + this.src);
    this.x = x;
    this.y = y;
    if (this.type == "text")
    {
        this.startX = this.x;
        this.direction = (width ? width : "left");
    }
    else
    {
        this.width = width;
        this.height = height;
    }

    this.update = function (idComponent)
    {
        ctx = gameArea.ctx;
        if (this.type == "image") ctx.drawImage (this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
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
        else if (this.type == "text")
        {
            if (this.width) ctx.fillStyle = this.color;
            else ctx.fillStyle = "transparent";
            this.width = 0;
            this.height = 0;
            for (let i = 0, x = this.x, y = this.y; i < this.src.length; i++)
            {
                let char = this.src.substr (i, 1).toUpperCase (),
                    width = 14,
                    height = 16;

                if (char == "Á" || char == "É" || char == "Í" || char == "Ó" || char == "Ú")
                {
                    if (this.direction != "vertical") y -= 6;
                    ctx.fillRect (x + 6, y, 4, 2);
                    ctx.fillRect (x + 4, y + 2, 4, 2);
                    y += 6;
                }
                else if (char == "À" || char == "È" || char == "Ì" || char == "Ò" || char == "Ù")
                {
                    if (this.direction != "vertical") y -= 6;
                    ctx.fillRect (x + 2, y, 4, 2);
                    ctx.fillRect (x + 4, y + 2, 4, 2);
                    y += 6;
                }
                switch (char)
                {
                    case "0":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 10);
                        ctx.fillRect (x + 6, y + 4, 2, 4);
                        ctx.fillRect (x + 4, y + 6, 2, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "1":
                        ctx.fillRect (x + 4, y, 4, 12);
                        ctx.fillRect (x + 2, y + 2, 2, 4);
                        ctx.fillRect (x, y + 4, 2, 2);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "2":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 6, y + 6, 4, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 2);
                        ctx.fillRect (x + 2, y + 10, 4, 2);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "3":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "4":
                        ctx.fillRect (x + 6, y, 2, 2);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 2, 4, 2);
                        ctx.fillRect (x + 2, y + 4, 4, 2);
                        ctx.fillRect (x, y + 6, 4, 2);
                        ctx.fillRect (x, y + 8, 8, 2);
                    break;
                    case "5":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x, y + 6, 10, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "6":
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 2, y + 2, 4, 2);
                        ctx.fillRect (x, y + 4, 4, 8);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "7":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 6, y + 4, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 4, 8);
                    break;
                    case "8":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 2, y + 6, 8, 2);
                        ctx.fillRect (x, y + 8, 4, 4);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "9":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 2, y + 6, 10, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 2);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 4, y + 12, 4, 2);
                    break;
                    case "A":
                    case "À":
                    case "Á":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 12);
                        ctx.fillRect (x + 8, y + 2, 4, 12);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                    break;
                    case "B":
                        ctx.fillRect (x, y, 10, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 12, 10, 2);
                    break;
                    case "C":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "D":
                        ctx.fillRect (x , y, 4, 14);
                        ctx.fillRect (x + 4, y + 0, 4, 2);
                        ctx.fillRect (x + 6, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 4, 4, 6);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 4, y + 12, 4, 2);
                    break;
                    case "E":
                    case "È":
                    case "É":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "F":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 12);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                    break;
                    case "G":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 6, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "H":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                    break;
                    case "I":
                    case "Ì":
                    case "Í":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x + 4, y + 2, 4, 10);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "J":
                        ctx.fillRect (x + 8, y, 4, 12);
                        ctx.fillRect (x, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "K":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 2);
                        ctx.fillRect (x + 6, y + 2, 4, 2);
                        ctx.fillRect (x + 4, y + 4, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 2, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 2);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 8, y + 12, 4, 2);
                    break;
                    case "L":
                        ctx.fillRect (x, y, 4, 12);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "M":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 2, 4, 2);
                    break;
                    case "N":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 4, 2, 2);
                        ctx.fillRect (x + 6, y + 6, 2, 2);
                    break;
                    case "O":
                    case "Ò":
                    case "Ó":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 10);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "P":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                    break;
                    case "Q":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 8);
                        ctx.fillRect (x + 2, y + 12, 6, 2);
                        ctx.fillRect (x + 4, y + 6, 2, 2);
                        ctx.fillRect (x + 6, y + 8, 2, 2);
                        ctx.fillRect (x + 8, y + 10, 2, 2);
                        ctx.fillRect (x + 10, y + 12, 2, 2);
                    break;
                    case "R":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 2);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 8, y + 12, 4, 2);
                    break;
                    case "S":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 2, y + 6, 8, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "T":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x + 4, y + 2, 4, 12);
                    break;
                    case "U":
                    case "Ù":
                    case "Ú":
                        ctx.fillRect (x, y, 4, 12);
                        ctx.fillRect (x + 8, y, 4, 12);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "V":
                        ctx.fillRect (x, y, 4, 10);
                        ctx.fillRect (x + 8, y, 4, 10);
                        ctx.fillRect (x + 2, y + 10, 8, 2);
                        ctx.fillRect (x + 4, y + 12, 4, 2);
                    break;
                    case "W":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 10, 4, 2);
                    break;
                    case "X":
                        ctx.fillRect (x, y, 4, 4);
                        ctx.fillRect (x + 8, y, 4, 4);
                        ctx.fillRect (x + 2, y + 4, 8, 2);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                        ctx.fillRect (x + 2, y + 8, 8, 2);
                        ctx.fillRect (x, y + 10, 4, 4);
                        ctx.fillRect (x + 8, y + 10, 4, 4);
                    break;
                    case "Y":
                        ctx.fillRect (x, y, 4, 6);
                        ctx.fillRect (x + 8, y, 4, 6);
                        ctx.fillRect (x + 2, y + 6, 8, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 6);
                    break;
                    case "Z":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 6, y + 4, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                        ctx.fillRect (x + 2, y + 8, 4, 2);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "&":
                        ctx.fillRect (x + 2, y, 6, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 2, 2);
                        ctx.fillRect (x + 2, y + 6, 4, 2);
                        ctx.fillRect (x, y + 8, 4, 4);
                        ctx.fillRect (x + 6, y + 8, 2, 2);
                        ctx.fillRect (x + 10, y + 8, 2, 2);
                        ctx.fillRect (x + 8, y + 10, 2, 2);
                        ctx.fillRect (x + 2, y + 12, 6, 2);
                        ctx.fillRect (x + 10, y + 12, 2, 2);
                    break;
                    case "-":
                        ctx.fillRect (x, y + 5, 12, 4);
                        height = 6;
                    break;
                    case "+":
                        ctx.fillRect (x + 4, y + 1, 4, 12);
                        ctx.fillRect (x, y + 5, 12, 4);
                        height = 14;
                    break;
                    case ".":
                        ctx.fillRect (x, y + 10, 4, 4);
                        width = 6;
                        height = 6;
                    break;
                    case ",":
                        ctx.fillRect (x, y + 10, 4, 4);
                        ctx.fillRect (x + 2, y + 14, 2, 2);
                        ctx.fillRect (x, y + 16, 2, 2);
                        width = 6;
                        height = 8;
                    break;
                    case ":":
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x, y + 8, 4, 4);
                        width = 6;
                        height = 14;
                    break;
                    case ";":
                        ctx.fillRect (x, y + 4, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 4);
                        ctx.fillRect (x + 2, y + 14, 2, 2);
                        ctx.fillRect (x, y + 16, 2, 2);
                        width = 6;
                    break;
                    case "(":
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 2, y + 2, 6, 2);
                        ctx.fillRect (x, y + 4, 6, 6);
                        ctx.fillRect (x + 2, y + 10, 6, 2);
                        ctx.fillRect (x + 4, y + 12, 6, 2);
                        width = 12;
                    break;
                    case ")":
                        ctx.fillRect (x, y, 6, 2);
                        ctx.fillRect (x + 2, y + 2, 6, 2);
                        ctx.fillRect (x + 4, y + 4, 6, 6);
                        ctx.fillRect (x + 2, y + 10, 6, 2);
                        ctx.fillRect (x, y + 12, 6, 2);
                        width = 12;
                    break;
                    case "/":
                        ctx.fillRect (x, y + 10, 2, 4);
                        ctx.fillRect (x + 2, y + 8, 2, 4);
                        ctx.fillRect (x + 4, y + 6, 2, 4);
                        ctx.fillRect (x + 6, y + 4, 2, 4);
                        ctx.fillRect (x + 8, y + 2, 2, 4);
                        ctx.fillRect (x + 10, y, 2, 4);
                        width = 12;
                    break;
                    case "\\":
                        ctx.fillRect (x, y, 2, 4);
                        ctx.fillRect (x + 2, y + 2, 2, 4);
                        ctx.fillRect (x + 4, y + 4, 2, 4);
                        ctx.fillRect (x + 6, y + 6, 2, 4);
                        ctx.fillRect (x + 8, y + 8, 2, 4);
                        ctx.fillRect (x + 10, y + 10, 2, 4);
                        width = 12;
                }
                if (this.direction == "vertical")
                {
                    this.height += height;
                    y += height;
                    if (width > this.width) this.width = width;
                }
                else
                {
                    this.width += width;
                    x += width;
                    if (height > this.height) this.height = height;
                }   
            }
            if (this.direction == "center") this.x = this.startX - Math.round (this.width / 2);
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
        process.exit (0);
    }
);

gameArea.start ();
gameLoadScreen ("menu");