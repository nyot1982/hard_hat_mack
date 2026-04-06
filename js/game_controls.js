window.addEventListener ("keydown", (e) => { if ((document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "SELECT") || e.keyCode == 9 || e.keyCode == 27) { e.preventDefault (); startControl (99, "keyboard", "keys", e.keyCode, e.key); }});
window.addEventListener ("keyup", (e) => { if ((document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "SELECT") || e.keyCode == 9 || e.keyCode == 27) { stopControl (99, "keyboard", "keys", e.keyCode); }});
window.addEventListener ('gamepaddisconnected', gamepadDisconnected);
window.addEventListener ('gamepadconnected', gamepadConnected);

function controls ()
{
    for (const gamepad of navigator.getGamepads ())
    {
        if (!gamepad || gamepad.mapping == "" && !gamepad.id.toLowerCase ().includes ("joystick")) continue;
        for (const [index, axis] of gamepad.axes.entries ())
        {
            if (axis.toFixed (2) * 1 != 0) startControl (gamepad.index * 1, (gamepad.mapping == "standard" ? "gamepad" : gamepad.id.toLowerCase ().includes ("joystick") ? "joystick" : ""), "axes", index, axis.toFixed (2) * 1);
            else stopControl (gamepad.index * 1, (gamepad.mapping == "standard" ? "gamepad" : gamepad.id.toLowerCase ().includes ("joystick") ? "joystick" : ""), "axes", index);
        }
        for (const [index, button] of gamepad.buttons.entries ())
        {
            if (button.pressed || button.touched) startControl (gamepad.index * 1, (gamepad.mapping == "standard" ? "gamepad" : gamepad.id.toLowerCase ().includes ("joystick") ? "joystick" : ""), "buttons", index, button.value.toFixed (2) * 1);
            else stopControl (gamepad.index * 1, (gamepad.mapping == "standard" ? "gamepad" : gamepad.id.toLowerCase ().includes ("joystick") ? "joystick" : ""), "buttons", index);
        }
    }
}

function gamepadConnected (e)
{
    pressed.buttons [e.gamepad.index * 1] = [];
    pressed.axes [e.gamepad.index * 1] = [];
}

function gamepadDisconnected (e)
{
    pressed.buttons.splice (pressed.buttons.indexOf (e.gamepad.index * 1), 1);
    pressed.axes.splice (pressed.axes.indexOf (e.gamepad.index * 1), 1);
}

function startControl (id_control, control, bt_type, bt_code, bt_value)
{
    if (!pressed [bt_type][id_control].includes (bt_code) || bt_type == "axes")
    {
        if (!pressed [bt_type][id_control].includes (bt_code)) pressed [bt_type][id_control].push (bt_code);
        var player = -1;
        if (gameScreen == "game" && gamePlayers.length > 0) player = gamePlayers.findIndex (player => player.name == "Player 1");
        if (control == "keyboard") bt_value = 1;
        userActionStart (control, bt_type, bt_code, bt_value, player);
    }
}

function stopControl (id_control, control, bt_type, bt_code)
{
    if (pressed [bt_type][id_control].includes (bt_code))
    {
        pressed [bt_type][id_control].splice (pressed [bt_type][id_control].indexOf (bt_code), 1);
        var player = -1;
        if (gameScreen == "game" && gamePlayers.length > 0)
        {
            player = gamePlayers.findIndex (player => player.name == "Player 1");
            userActionStop (id_control, control, bt_type, bt_code, player);
        }
    }
}

function userActionStart (control, bt_type, bt_code, bt_value, player)
{
    if (gameScreen == "start" && control == "keyboard")
    {
        gameSound.sounds =
        {
            shot0: new audio ("sound/shot0.wav", false),
            shot1: new audio ("sound/shot1.wav", false),
            shot2: new audio ("sound/shot2.wav", false),
            shot3: new audio ("sound/shot3.wav", false),
            hit0: new audio ("sound/hit0.wav", false),
            hit1: new audio ("sound/hit1.wav", false),
            hit2: new audio ("sound/hit2.wav", false)
        };
        gameMusic.musics =
        {
            menu: new audio ("music/menu.mp3", true),
            game: new audio ("music/game.mp3", true)
        };
    }
    else if (gameScreen == "menu")
    {
        if (!blackScreen)
        {
            blackScreen = true;
            $("#blackScreen").fadeIn (1000);
            setTimeout
            (
                () =>
                {
                    gameLoadScreen ("game");
                },
                1000
            );
        }
    }
    else if (gameScreen == "high_scores")
    {
        if (!blackScreen)
        {
            blackScreen = true;
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
    else if (gameScreen == "game")
    {
        if (bt_type == null) var userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control].includes (bt_code));
        else var userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control][bt_type].includes (bt_code));

        if (userAction > -1)
        {
            switch (userActions [userAction].action)
            {
                case 'move_up':
                    if (player > -1) gamePlayers [player].speedY = -bt_value;
                break;
                case 'move_down':
                    if (player > -1) gamePlayers [player].speedY = bt_value;
                break;
                 case 'move_left':
                    if (player > -1) gamePlayers [player].speedX = -bt_value;
                break;
                case 'move_right':
                    if (player > -1) gamePlayers [player].speedX = bt_value;
                break;
                case 'jump':
                    if (player > -1) gamePlayers [player].speedY = -5;
                break;
                case 'drop_drill':
                    if (player > -1) gamePlayers [player].drill (false);
                break;
            }
        }
    }
}

function userActionStop (id_control, control, bt_type, bt_code, player)
{
    var userAction = userActions.findIndex (action => action.screen.includes (gameScreen) && action [control][bt_type].includes (bt_code));

    if (userAction > -1)
    {
        switch (userActions [userAction].action)
        {
            case 'move_down':
                if (player > -1)
                {
                    var userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_up');
                    var bt_code_prev = userActions [userActionPrev][control][bt_type][bt_code];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].speedY = -1;
                    else gamePlayers [player].speedY = 0;
                }
            break;
            case 'move_up':
                if (player > -1)
                {
                    var userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_down');
                    var bt_code_prev = userActions [userActionPrev][control][bt_type][bt_code];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].speedY = 1;
                    else gamePlayers [player].speedY = 0;
                }
            break;
            case 'move_left':
                if (player > -1)
                {
                    var userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_right');
                    var bt_code_prev = userActions [userActionPrev][control][bt_type][bt_code];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].speedX = 1;
                    else gamePlayers [player].speedX = 0;
                }
            break;
            case 'move_right':
                if (player > -1)
                {
                    var userActionPrev = userActions.findIndex (action => action.screen.includes (gameScreen) && action.action == 'move_left');
                    var bt_code_prev = userActions [userActionPrev][control][bt_type][bt_code];
                    if (pressed [bt_type][id_control].includes (bt_code_prev)) gamePlayers [player].speedX = -1;
                    else gamePlayers [player].speedX = 0;
                }
            break;
        }
    }
}

function stopUserInteractions ()
{
    var player = gamePlayers.findIndex (player => player.name == "Player 1");
    pressed =
    {
        keys:
        {
            99: []
        },
        buttons: [],
        axes: []
    };
    gamePlayers [player].firing (false);
    gamePlayers [player].moving (0);
}

function mouseMove (e)
{
    e.preventDefault ();
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}

function mouseDown (e)
{
    e.preventDefault ();
    if (!mouse.pressed.includes (e.button)) mouse.pressed.push (e.button);
}

function mouseUp (e)
{
    if (mouse.pressed.includes (e.button)) mouse.pressed.splice (mouse.pressed.indexOf (e.button), 1);
}

function mouseWheel (e)
{
    mouse.wheelX = e.deltaX;
    mouse.wheelY = e.deltaY;
    mouse.wheelZ = e.deltaZ;
}

function vibrate (id_control, duration)
{
    for (i = navigator.getGamepads ().length; i > 0; i--)
    {
        if (id_control == null || id_control == i - 1)
        {
            const gamepad = navigator.getGamepads ()[i - 1];
            if (!gamepad) continue;
            if (gamepad.mapping == "standard")
            {
                gamepad.vibrationActuator.playEffect
                (
                    "dual-rumble",
                    {
                        startDelay: 0,
                        duration: duration,
                        weakMagnitude: 1,
                        strongMagnitude: 1
                    }
                );
                break;
            }
        }
    }
}