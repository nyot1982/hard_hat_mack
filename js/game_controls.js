window.addEventListener ("keydown", (e) => { if ((document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "SELECT") || e.keyCode == 9 || e.keyCode == 27 || gameAlert.length > 0) { e.preventDefault (); startControl (99, "keyboard", "keys", e.keyCode, e.key); }});
window.addEventListener ("keyup", (e) => { if ((document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "SELECT") || e.keyCode == 9 || e.keyCode == 27 || gameAlert.length > 0) { stopControl (99, "keyboard", "keys", e.keyCode); }});
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
        var gameChar = -1;
        if (gameScreen == "game" && gameChars.length > 0 && gameConfirm.length == 0)
        {
            gameChar = gameChars.findIndex (char => char.name == "Player 1");
            if (control == "keyboard")
            {
                if (bt_code == 37) bt_value = -1;
                else bt_value = 1;
            }
        }
        else if (control == "keyboard") bt_value = 1;
        userActionStart (control, bt_type, bt_code, bt_value, gameChar);
    }
}

function stopControl (id_control, control, bt_type, bt_code)
{
    if (pressed [bt_type][id_control].includes (bt_code))
    {
        pressed [bt_type][id_control].splice (pressed [bt_type][id_control].indexOf (bt_code), 1);
        var gameChar = -1;
        if (gameScreen == "game" && gameChars.length > 0 && gameConfirm.length == 0)
        {
            gameChar = gameChars.findIndex (char => char.name == "Player 1");
            userActionStop (control, bt_type, bt_code, gameChar);
        }
    }
}

function userActionStart (control, bt_type, bt_code, bt_value, gameChar)
{
    if (gameScreen == "menu")
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
    else if (gameScreen == "game_over" || gameScreen == "game_completed")
    {
        if (!blackScreen)
        {
            blackScreen = true;
            $("#blackScreen").fadeIn (1000);
            setTimeout
            (
                () =>
                {
                    gameSound.sounds ["type"].stop ();
                    gameLoadScreen ("high_scores");
                },
                1000
            );
        }
    }
    else if (gameAlert.length > 0) gameAlert = [];
    else
    {
        if (gameConfirm.length > 0) var screen = "confirm";
        else if (gameScreen == "menu" && gameModal == null) var screen = "menu";
        else if (gameScreen == "game" && gameChars.length > 0 && gameModal == null) var screen = "game";
        else if (gameModal != null) var screen = "modal_" + gameModal;

        if (bt_type == null) var userAction = userActions.findIndex (action => action.screen.includes (screen) && action [control].includes (bt_code));
        else var userAction = userActions.findIndex (action => action.screen.includes (screen) && action [control][bt_type].includes (bt_code));

        if (userAction > -1)
        {
            switch (userActions [userAction].action)
            {
                case 'confirm_no':
                    gameConfirm = [];
                break;
                case 'confirm_yes':
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
                break;
                case 'open_modal':
                    gameOpenModal ("menu");
                break;
                case 'close_exit':
                    $("#blackScreen").fadeIn (1000);
                    setTimeout
                    (
                        () =>
                        {
                            gameLoadScreen ("menu");
                        },
                        1000
                    );
                break;
                case 'close_continue':
                    gameOpenModal ("menu");
                    gameArea.play ();
                break;
                case 'close_modal':
                    gameCloseModal ();
                break;
                case 'fire':
                    if (gameChar > -1) gameChars [gameChar].firing (true);
                break;
                case 'move_front':
                    if (gameChar > -1) gameChars [gameChar].moving (bt_value);
                break;
                case 'move_back':
                    if (gameChar > -1) gameChars [gameChar].moving (-bt_value);
                break;
            }
        }
    }
}

function userActionStop (control, bt_type, bt_code, gameChar)
{
    if ((gameScreen == "menu" || gameModal == "menu") && gameConfirm.length == 0) var screen = "modal";
    else if (gameScreen == "game" && gameModal == null && gameChars.length > 0 && gameConfirm.length == 0) var screen = "game";
    
    var userAction = userActions.findIndex (action => action.screen.includes (screen) && action [control][bt_type].includes (bt_code));

    if (userAction > -1)
    {
        switch (userActions [userAction].action)
        {
            case 'fire':
                if (gameChar > -1) gameChars [gameChar].firing (false);
            break;
            case 'move_back':
            case 'move_front':
                if (gameChar > -1) gameChars [gameChar].moving (0);
            break;
        }
    }
}

function stopUserInteractions ()
{
    var gameChar = gameChars.findIndex (char => char.name == "Player 1");
    pressed =
    {
        keys:
        {
            99: []
        },
        buttons: [],
        axes: []
    };
    gameChars [gameChar].firing (false);
    gameChars [gameChar].moving (0);
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