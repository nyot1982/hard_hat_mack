window.addEventListener ("keydown", (e) => { if ((document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "SELECT") || e.keyCode == 9 || e.keyCode == 27 || gameAlert.length > 0) { e.preventDefault (); startControl (99, "keyboard", "keys", e.keyCode, e.key); }});
window.addEventListener ("keyup", (e) => { if ((document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "SELECT") || e.keyCode == 9 || e.keyCode == 27 || gameAlert.length > 0) { stopControl (99, "keyboard", "keys", e.keyCode); }});
window.addEventListener ('gamepaddisconnected', gamepadDisconnected);
window.addEventListener ('gamepadconnected', gamepadConnected);

function controls ()
{
    var player = 2;
    for (const gamepad of navigator.getGamepads ())
    {
        if (!gamepad || gamepad.mapping == "" && !gamepad.id.toLowerCase ().includes ("joystick")) continue;
        var form = document.getElementById ("players");
        if (gameScreen == "menu" && (gameModes.findIndex (mode => mode.active == true) == 1 || gameModes.findIndex (mode => mode.active == true) == 2) && form.style.display == "block" && !document.getElementById (gamepad.index))
        {
            var element = document.createElement ("input");
            element.id = gamepad.index * 1;
            element.name = "name";
            element.type = "text";
            element.autocomplete = "name";
            element.maxLength = "11";
            element.value = (storedPlayers [form.length - 1] && storedPlayers [form.length - 1].name ? storedPlayers [form.length - 1].name : "Player " + player);
            element.required = true;
            element.setAttribute ("oninput", "javascript: this.setCustomValidity ('');");
            form.insertBefore (element, form.elements [form.length - 1]);
            form.insertBefore (document.createTextNode (" "), form.elements [form.length - 1]);
            element = document.createElement ("a");
            element.title = "Mouse interaction";
            element.className = "fa fa-mouse fa-beat interaction";
            form.insertBefore (element, form.elements [form.length - 1]);
        }
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
        player++;
    }
}

function gamepadConnected (e)
{
    if (e.gamepad.mapping == "standard") var newControl = "gamepad";
    else if (e.gamepad.id.toLowerCase ().includes ("joystick")) var newControl = "joystick";
    else return;
    gameControls [e.gamepad.index * 1] = newControl;
    if (newControl && document.getElementById (newControl).style.display == 'none') $('#' + newControl).fadeIn (1000);
    pressed.buttons [e.gamepad.index * 1] = [];
    pressed.axes [e.gamepad.index * 1] = [];
    if (gameScreen == "game" && gameModes.findIndex (mode => mode.active == true) != 0 && gameModes.findIndex (mode => mode.active == true) != 3)
    {
        for (var player in players)
        {
            if (players [player].control == null) players [player].control = e.gamepad.index * 1;
        }
    }
    else
    {
        changeControl (newControl, e.gamepad.index * 1);
        if (gameAlert.length > 0)
        {
            gameAlert = [];
            if (document.getElementById ("players").style.display == "block" || document.getElementById ("player").style.display == "block" || document.getElementById ("sign").style.display == "block") changeTab ("input");
            else changeTab ("menu");
        }
    }
}

function gamepadDisconnected (e)
{
    if (e.gamepad.mapping == "" && !e.gamepad.id.toLowerCase ().includes ("joystick")) return;
    var oldControl = gameControls [e.gamepad.index * 1],
        form = document.getElementById ("players");
    delete gameControls [e.gamepad.index * 1];
    pressed.buttons.splice (pressed.buttons.indexOf (e.gamepad.index * 1), 1);
    pressed.axes.splice (pressed.axes.indexOf (e.gamepad.index * 1), 1);

    if (gameScreen == "menu" && gameModes.findIndex (mode => mode.active == true) != 0 && gameModes.findIndex (mode => mode.active == true) != 3 && form.length > 2)
    {
        for (var i = 0; i < form.length; i++)
        {
            if (form.elements [i].id == e.gamepad.index * 1)
            {
                form.elements [i].remove ();
                form.getElementsByTagName ("a")[i].remove ();
                break;
            }
        }
    }
    var controlFinded = null;
    for (const gamepad of navigator.getGamepads ())
    {
        if (!gamepad) continue;
        if (gamepad.mapping == "standard" && oldControl == "gamepad" || gamepad.id.toLowerCase ().includes ("joystick") && oldControl == "joystick") controlFinded = gamepad.index * 1;
    }
    if (controlFinded == null)
    {
        changeControl ("keyboard", 99);
        $('#' + oldControl).fadeOut (1000);
    }
    else if (gameScreen == "game" && gameModes.findIndex (mode => mode.active == true) != 1 && gameModes.findIndex (mode => mode.active == true) != 2) players [0].control = controlFinded;
}

function startControl (id_control, control, bt_type, bt_code, bt_value)
{
    if (!pressed [bt_type][id_control].includes (bt_code) || bt_type == "axes")
    {
        if (!pressed [bt_type][id_control].includes (bt_code)) pressed [bt_type][id_control].push (bt_code);
        changeControl (control, id_control);
        var player = 0,
            gameShip = -1;
        if (gameScreen == "game" && gameShips.length > 0 && gameConfirm.length == 0)
        {
            if (gameModes.findIndex (mode => mode.active == true) == 1 || gameModes.findIndex (mode => mode.active == true) == 2) player = players.findIndex (player => player.control == id_control);
            if (player > -1) gameShip = gameShips.findIndex (ship => ship.name == players [player].name);
            if (control == "keyboard")
            {
                if (bt_code == 37) bt_value = -1;
                else bt_value = 1;
            }
        }
        else if (control == "keyboard") bt_value = 1;
        userActionStart (control, bt_type, bt_code, bt_value, gameShip);
    }
}

function stopControl (id_control, control, bt_type, bt_code)
{
    if (pressed [bt_type][id_control].includes (bt_code))
    {
        pressed [bt_type][id_control].splice (pressed [bt_type][id_control].indexOf (bt_code), 1);
        var player = 0,
            gameShip = -1;
        if (gameScreen == "game" && gameShips.length > 0 && gameConfirm.length == 0)
        {
            if (gameModes.findIndex (mode => mode.active == true) == 1 || gameModes.findIndex (mode => mode.active == true) == 2) player = players.findIndex (player => player.control == id_control);
            if (player > -1) gameShip = gameShips.findIndex (ship => ship.name == players [player].name);
            userActionStop (control, bt_type, bt_code, gameShip);
        }
    }
}

function userActionStart (control, bt_type, bt_code, bt_value, gameShip)
{
    if (changingButton != null && control == changingButton.control && bt_type == changingButton.bt_type) buttonChange (bt_code);
    else if (gameScreen == "start" && control == "keyboard")
    {
        gameSound.sounds =
        {
            type: new audio ("sound/type.wav", true),
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
            game: new audio ("music/game.mp3", true),
            boss: new audio ("music/boss.mp3", true)
        };
        //toggleFullScreen ();
    }
    else if (gameScreen == "intro")
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
    else if (gameAlert.length > 0)
    {
        gameAlert = [];
        if (document.getElementById ("players").style.display == "block" || document.getElementById ("player").style.display == "block" || document.getElementById ("sign").style.display == "block") changeTab ("input");
        else changeTab ("menu");
    }
    else
    {
        if (gameConfirm.length > 0) var screen = "confirm";
        else if (gameScreen == "menu")
        {
            if (document.getElementById ("players").style.display == "block" || document.getElementById ("player").style.display == "block" || document.getElementById ("sign").style.display == "block") var screen = "input";
            else if (menuShip != null && gameModal == null) var screen = "menu";
        }
        else if (gameScreen == "skins") var screen = "skins";
        else if (gameScreen == "game" && gameShips.length > 0 && gameModal == null) var screen = "game";
        else if (gameModal != null) var screen = "modal_" + gameModal;

        if (bt_type == null) var userAction = userActions.findIndex (action => action.screen.includes (screen) && action [control].includes (bt_code));
        else var userAction = userActions.findIndex (action => action.screen.includes (screen) && action [control][bt_type].includes (bt_code));

        if (userAction > -1)
        {
            switch (userActions [userAction].action)
            {
                case 'strafe_down':
                    menuShip.strafing (-bt_value);
                break;
                case 'strafe_up':
                    menuShip.strafing (bt_value);
                break;
                case 'fire_menu':
                    menuShip.firing (true);
                break;
                case 'confirm_no':
                    gameConfirm = [];
                    changeTab ("menu");
                break;
                case 'confirm_yes':
                    if (!blackScreen)
                    {
                        if (gameModes.findIndex (mode => mode.active == true) == 3)
                        {
                            gameShip = gameShips.findIndex (ship => ship.name == players [0].name);
                            fetchLoad ("xp_save", "name=" + gameShips [gameShip].name + "&xp=" + gameShips [gameShip].xp);
                            const data =
                            {
                                action: "menu",
                                player_id: playerId,
                            };
                            wss.send (JSON.stringify (data));
                        }
                        else
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
                break;
                case 'input_change':
                    var form_sign = document.getElementById ("sign"),
                        form_player = document.getElementById ("player"),
                        form_players = document.getElementById ("players"),
                        form = null;
                    
                    if (form_sign.style.display == "block") form = form_sign;
                    else if (form_player.style.display == "block") form = form_player;
                    else if (form_players.style.display == "block") form = form_players;
                    
                    for (var i = 0; i < form.length; i++)
                    {
                        if (form.elements [i] == document.activeElement)
                        {
                            i++;
                            if (i == form.length) i = 0;
                            if (form.elements [i].type == "hidden")
                            {
                                i++;
                                if (i == form.length) i = 0;
                            }
                            form.elements [i].focus ();
                            break;
                        }
                    }
                break;
                case 'input_exit':
                    if (gameModes.findIndex (mode => mode.active == true) == 3)
                    {
                        const data =
                        {
                            action: "menu",
                            player_id: playerId
                        };
                        wss.send (JSON.stringify (data));    
                    }
                    else gameLoadScreen ("menu");
                break;
                case 'skin_left':
                case 'skin_right':
                case 'skin_down':
                case 'skin_up':
                    if (players [0].skins.findIndex (skin => skin == skinSel) > -1) gameText [skinSel].color = "white";
                    else gameText [skinSel].color = "yellow";
                    gameShips [skinSel].turning (0);
                    gameShips [skinSel].heading = 0;
                    if (userActions [userAction].action == "skin_left")
                    {     
                        skinSel--;
                        if (skinSel == -1) skinSel = skins.length - 1;
                    }
                    else if (userActions [userAction].action == "skin_right")
                    {
                        skinSel++;
                        if (skinSel == skins.length) skinSel = 0;
                    }
                    else if (userActions [userAction].action == "skin_down")
                    {
                        skinSel -= 10;
                        if (skinSel < 0) skinSel = skins.length + skinSel;
                    }
                    else if (userActions [userAction].action == "skin_up")
                    {
                        skinSel += 10;
                        if (skinSel >= skins.length) skinSel = skinSel - skins.length;
                    }
                    if (players [0].skins.findIndex (skin => skin == skinSel) > -1) gameText [skinSel].color = "#0C0";
                    else gameText [skinSel].color = "red";
                    gameShips [skinSel].turning (-1);
                break;
                case 'unlock_skin':
                    if (players [0].skins.findIndex (skin => skin == skinSel) == -1 && players [0].skins.length < Math.floor (players [0].xp / 100)) fetchLoad ('unlock_skin', 'id=' + players [0].id + '&skins=' + players [0].skins.join (",") + '&skin=' + skinSel);
                break;
                case 'skins_exit':
                    $("#blackScreen").fadeIn (1000);
                    setTimeout
                    (
                        () =>
                        {
                            gameLoadScreen ("player");
                            menuShip.y += 75;
                            form = document.getElementById ("player");
                            form.style.display = "block";
                            form.elements [0].focus ();
                            form.elements [2].innerHTML = '<option value="-1"' + (players [0].skin == -1 ? ' selected' : '') + '></option>';
                            for (var i = 0; i < players [0].skins.length; i++) form.elements [2].innerHTML += '<option value="' + players [0].skins [i] + '"' + (players [0].skins [i] == players [0].skin ? ' selected' : '') + '>' + skins [players [0].skins [i]].name + '</option>';
                            menuShip.changeColor (players [0].color || playerColors [0]);
                            gameXP.push (new component ("text", Math.floor (players [0].xp / 100), menuShip.colors.shipFill, menuShip.x, menuShip.y - 50, "center", 10, null, menuShip.colors.negative));
                            gameXP.push (new component ("text", (players [0].xp == 10000 ? 100 : players [0].xp - Math.floor (players [0].xp / 100) * 100) + "/100 XP", menuShip.colors.negative, menuShip.x, menuShip.y - 30, "center", 8, null, menuShip.colors.shipFill));
                            changeTab ("input");
                            menuShip.turning (-1);
                        },
                        1000
                    );
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
                case 'change_weapon':
                    if (gameShip > -1) gameShips [gameShip].changeWeapon ();
                break;
                case 'moveZ':
                    if (gameShip > -1) gameShips [gameShip].movingZ ();    
                break;
                case 'fire':
                    if (gameShip > -1) gameShips [gameShip].firing (true);
                break;
                case 'turn_left':
                case 'turn_right':
                    if (gameShip > -1) gameShips [gameShip].turning (bt_value);
                break;
                case 'move_front':
                    if (gameShip > -1) gameShips [gameShip].moving (bt_value);
                break;
                case 'move_back':
                    if (gameShip > -1) gameShips [gameShip].moving (-bt_value);
                break;
                case 'strafe_right':
                    if (gameShip > -1) gameShips [gameShip].strafing (bt_value);
                break;
                case 'strafe_left':
                    if (gameShip > -1) gameShips [gameShip].strafing (-bt_value);
                break;
            }
        }
    }
}

function userActionStop (control, bt_type, bt_code, gameShip)
{
    if ((gameScreen == "menu" || gameModal == "menu") && menuShip != null && gameConfirm.length == 0) var screen = "modal";
    else if (gameScreen == "game" && gameModal == null && gameShips.length > 0 && gameConfirm.length == 0) var screen = "game";
    
    var userAction = userActions.findIndex (action => action.screen.includes (screen) && action [control][bt_type].includes (bt_code));

    if (userAction > -1)
    {
        switch (userActions [userAction].action)
        {
            case 'fire_menu':
                menuShip.firing (false);
            break;
            case 'fire':
                if (gameShip > -1) gameShips [gameShip].firing (false);
            break;
            case 'turn_left':
            case 'turn_right':
                if (gameShip > -1) gameShips [gameShip].turning (0);
            break;
            case 'move_back':
            case 'move_front':
                if (gameShip > -1) gameShips [gameShip].moving (0);
            break;
            case 'strafe_right':
            case 'strafe_left':
                if (gameShip > -1) gameShips [gameShip].strafing (0);  
            break;
        }
    }
}

function stopUserInteractions (gamePlayer)
{
    for (var player in players)
    {
        if (gamePlayer == null || player == gamePlayer)
        {
            var gameShip = gameShips.findIndex (ship => ship.name == players [player].name);
            if (gameModes.findIndex (mode => mode.active == true) == 0)
            {
                pressed =
                {
                    keys:
                    {
                        99: []
                    },
                    buttons: [],
                    axes: []
                };
            }
            else
            {
                if (player == 0 || gameModes.findIndex (mode => mode.active == true) == 3) pressed.keys [players [player].control] = [];
                pressed.buttons [players [player].control] = [];
                pressed.axes [players [player].control] = [];
            }
            gameShips [gameShip].firing (false);
            gameShips [gameShip].moving (0);
            if (gameShips [gameShip].life == 0) gameShips [gameShip].movingZ (0);
            gameShips [gameShip].strafing (0);
            gameShips [gameShip].turning (0);
        }
    }
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

function changeControl (newControl, idControl)
{
    if (gameScreen != "start")
    {
        if (idControl != null)
        {
            menuControl = idControl;
            if (gameScreen == "game" && gameModes.findIndex (mode => mode.active == true) != 1 && gameModes.findIndex (mode => mode.active == true) != 2) players [0].control = idControl;
        }
        if (gameModes.findIndex (mode => mode.active == true) != 1 && gameModes.findIndex (mode => mode.active == true) != 2 && controlTab != newControl)
        {
            $('#' + controlTab).removeClass ("active");
            $('#' + newControl).addClass ("active");
            $('#' + gameTab + 'Tab-' + controlTab).removeClass ("active");
            $('#' + gameTab + 'Tab-' + controlTab).addClass ("unactive");
            if ($('#' + gameTab + 'Tab-' + newControl).hasClass ("toggle")) $('#' + gameTab + 'Tab-' + newControl).removeClass ("toggle");
            else if ($('#' + gameTab + 'Tab-' + newControl).hasClass ("unactive")) $('#' + gameTab + 'Tab-' + newControl).removeClass ("unactive");
            $('#' + gameTab + 'Tab-' + newControl).addClass ("active");
            controlTab = newControl;
        }
    }
}

function showControls (control, bt_type)
{
    var tab = document.getElementById ("gameTab-" + control),
        actions = userActions.filter (action => action.screen.includes ("game")),
        str = "";
    
    for (var i = 0; i < actions.length; i++)
    {
        if (i % 2 == 0) str += '<div class="col">';
        str += '<p>';
        if (actions [i].editable) str += '<a id="' + control + '-' + actions [i].action + '" href="javascript: changeButton (\'game\', \'' + actions [i].action + '\', \'' + control + '\', \'' + bt_type + '\');" title="Change ' + bt_type.substring (0, bt_type.length - 1) + '" class="changeButton">';
        var sep = "";
        if (control == "keyboard" && actions [i][control][bt_type].length == 0 || control != "keyboard" && actions [i][control][bt_type].length == 0 && actions [i][control]["axes"].length == 0) str += '<span class="fa fa-xmark no-key"></span> ';
        else
        {
            for (var key in actions [i][control][bt_type])
            {
                if (sep != "") str += sep;
                if (control == "keyboard")
                {
                    switch (actions [i][control][bt_type][key])
                    {
                        case 8:
                            str += '<span class="fa fa-left-long key" style="width: 6em;"></span> ';
                        break;
                        case 9:
                            str += '<span class="key" style="width: 5em; padding: 0;"><span class="fa fa-left-long-to-line" style="display: block;"></span><span class="fa fa-right-long-to-line" style="display: block;"></span></span> ';
                        break;
                        case 13:
                            str += '<span class="fa fa-turn-down-left key" style="width: 4em;"></span> ';
                        break;
                        case 16:
                            str += '<span class="fa-regular fa-up key" style="font-size: 1.5em; padding: 0.25em; width: 5em;"></span> ';
                        break;
                        case 17:
                            str += '<span class="key2" style="width: 4.5em;">Ctrl</span> ';
                        break;
                        case 18:
                            str += '<span class="key2" style="width: 4.5em;">Alt</span> ';
                        break;
                        case 19:
                            str += '<span class="key2">Brk</span> ';
                        break;
                        case 20:
                            str += '<span class="key2" style="width: 8em; padding-top: 0.3em;">Caps Lock</span> ';
                        break;
                        case 27:
                            str += '<span class="key2">Esc</span> ';
                        break;
                        case 32:
                            str += '<span class="fa fa-horizontal-rule key" style="width: 9em;"></span> ';
                        break;
                        case 33:
                            str += '<span class="key2" style="padding-top: 0.3em;">Pg Up</span> ';
                        break;
                        case 34:
                            str += '<span class="key2" style="padding-top: 0.3em;">Pg Dn</span> ';
                        break;
                        case 35:
                            str += '<span class="key2">End</span> ';
                        break;
                        case 36:
                            str += '<span class="key2">Hom</span> ';
                        break;
                        case 37:
                            str += '<span class="fa fa-left key"></span> ';
                        break;
                        case 38:
                            str += '<span class="fa fa-up key"></span> ';
                        break;
                        case 39:
                            str += '<span class="fa fa-right key"></span> ';
                        break;
                        case 40:
                            str += '<span class="fa fa-down key"></span> ';
                        break;
                        case 45:
                            str += '<span class="key2">Ins</span> ';
                        break;
                        case 46:
                            str += '<span class="key2">Del</span> ';
                        break;
                        case 91:
                            str += '<span class="key2">Win</span> ';
                        break;
                        case 96: case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105:
                            str += '<span class="key num">' + (actions [i][control][bt_type][key] - 96) + '</span> ';
                        break;
                        case 106:
                            str += '<span class="key num">*</span> ';
                        break;
                        case 107:
                            str += '<span class="key num">+</span> ';
                        break;
                        case 109:
                            str += '<span class="key num">-</span> ';
                        break;
                        case 110:
                            str += '<span class="key num">.</span> ';
                        break;
                        case 111:
                            str += '<span class="key num">/</span> ';
                        break;
                        case 144:
                            str += '<span class="key2 num" style="padding-top: 0.3em;">Num Lck</span> ';
                        break;
                        case 145:
                            str += '<span class="key2" style="padding-top: 0.3em;">Scr Lck</span> ';
                        break;
                        case 186:
                            str += '<span class="key">`</span> ';
                        break;
                        case 187:
                            str += '<span class="key">+</span> ';
                        break;
                        case 188:
                            str += '<span class="key">,</span> ';
                        break;
                        case 189:
                            str += '<span class="key">-</span> ';
                        break;
                        case 190:
                            str += '<span class="key">.</span> ';
                        break;
                        case 191:
                            str += '<span class="key">Ç</span> ';
                        break;
                        case 192:
                            str += '<span class="key">Ñ</span> ';
                        break;
                        case 219:
                            str += '<span class="key">\'</span> ';
                        break;
                        case 220:
                            str += '<span class="key">º</span> ';
                        break;
                        case 221:
                            str += '<span class="key">¡</span> ';
                        break;
                        case 222:
                            str += '<span class="key">´</span> ';
                        break;
                        case 226:
                            str += '<span class="key"><</span> ';
                        break;
                        case 112: case 113: case 114: case 115: case 116: case 117: case 118: case 119: case 120: case 121: case 122: case 123:
                            str += '<span class="key2">F' + (actions [i][control][bt_type][key] - 111) + '</span> ';
                        break;
                        default:
                            str += '<span class="key">' + String.fromCharCode (actions [i][control][bt_type][key]) + '</span> ';
                        break;
                    }
                }
                else if (control == "gamepad")
                {
                    switch (actions [i][control][bt_type][key])
                    {
                        case 0:
                            str += '<span class="button green">A</span> ';
                        break;
                        case 1:
                            str += '<span class="button red">B</span> ';
                        break;
                        case 2:
                            str += '<span class="button blue">X</span> ';
                        break;
                        case 3:
                            str += '<span class="button yellow">Y</span> ';
                        break;
                        case 4:
                            str += '<span class="button3">LB</span> ';
                        break;
                        case 5:
                            str += '<span class="button4">RB</span> ';
                        break;
                        case 6:
                            str += '<span class="button6">RT</span> ';
                        break;
                        case 7:
                            str += '<span class="button5">LT</span> ';
                        break;
                        case 8:
                            str += '<span class="button2">Select</span> ';
                        break;            
                        case 9:
                            str += '<span class="button2">Start</span> ';
                        break;
                        case 10:
                            str += '<span class="button silver">LS</span> ';
                        break;
                        case 11:
                            str += '<span class="button silver">RS</span> ';
                        break;
                        case 12:        
                            str += '<span class="button silver" style="padding: 0; line-height: 0; vertical-align: middle;"><span class="fa fa-square" style="display: block; color: red;"></span><span class="fa fa-square"></span><span class="fa fa-square"></span><span class="fa fa-square"></span><span class="fa fa-square" style="display: block;"></span></span> ';
                        break;
                        case 13:        
                            str += '<span class="button silver" style="padding: 0; line-height: 0; vertical-align: middle;"><span class="fa fa-square" style="display: block;"></span><span class="fa fa-square"></span><span class="fa fa-square"></span><span class="fa fa-square"></span><span class="fa fa-square" style="display: block; color: red;"></span></span> ';
                        break;
                        case 14:
                            str += '<span class="button silver" style="padding: 0; line-height: 0; vertical-align: middle;"><span class="fa fa-square" style="display: block;"></span><span class="fa fa-square" style="color: red;"></span><span class="fa fa-square"></span><span class="fa fa-square"></span><span class="fa fa-square" style="display: block;"></span></span> ';
                        break;
                        case 15:
                            str += '<span class="button silver" style="padding: 0; line-height: 0; vertical-align: middle;"><span class="fa fa-square" style="display: block;"></span><span class="fa fa-square"></span><span class="fa fa-square"></span><span class="fa fa-square" style="color: red;"></span><span class="fa fa-square" style="display: block;"></span></span> ';
                        break;
                        case 16:
                            str += '<span class="button gray">&nbsp;</span> ';
                        break;
                    }
                }
                else if (control == "joystick") str += '<span class="button red">' + (actions [i][control][bt_type][key] + 1) + '</span> ';
                sep = "/ ";
            }
            for (var key in actions [i][control]["axes"])
            {
                if (sep != "") str += sep;
                if (control == "gamepad")
                {
                    switch (actions [i][control]["axes"][key])
                    {
                        case 0:
                            if (actions [i].action == "turn_left") str += '<span class="fa fa-caret-left e1"></span><span class="button silver">LS</span> ';
                            else str += '<span class="button silver">LS</span><span class="fa fa-caret-right e1"></span> ';
                        break;
                        case 2:
                            if (actions [i].action == "turn_left") str += '<span class="fa fa-caret-left e1"></span><span class="button silver">RS</span> ';
                            else str += '<span class="button silver">RS</span><span class="fa fa-caret-right e1"></span> ';
                        break;
                    }
                }
                else if (control == "joystick")
                {
                    switch (actions [i][control]["axes"][key])
                    {
                        case 0:
                            if (actions [i].action == "turn_left") str += '<span class="fa fa-caret-left e1"></span><span class="button silver">S</span> ';
                            else str += '<span class="button silver">S</span><span class="fa fa-caret-right e1"></span> ';
                        break;
                        case 1:
                            if (actions [i].action == "move_front") str += '<span class="fa fa-caret-up e1"></span><span class="button silver">S</span> ';
                            else str += '<span class="fa fa-caret-down e1"></span><span class="button silver">S</span> ';
                        break;
                    }
                }
                sep = "/ ";
            }
        }
        if (actions [i].editable) str += actions [i].title + '</a> <a title="Mouse interaction" class="fa fa-mouse fa-beat interaction"></a></p>';
        else str += actions [i].title + '</p>';
        if (i % 2 != 0) str += '</div>';
    }
    tab.innerHTML = str;
}

function changeButton (screen, action, control, bt_type)
{
    if (changingButton == null)
    {
        changingButton =
        {
            i: userActions.findIndex (userAction => userAction.action == action),
            screen: screen,
            control: control,
            bt_type: bt_type
        };
        document.getElementById (control + '-' + action).className = 'changingButton';
        document.getElementById (control + '-' + action).title = 'Press a ' + bt_type.substring (0, bt_type.length - 1) + ' to add/remove or "' + (control == 'gamepad' ? 'Start' : control == 'joystick' ? '8' : 'Esc') + '" to cancel';
    }
}

function buttonChange (key)
{
    if (changingButton.control == "keyboard" && key != 27 || changingButton.control == "gamepad" && key != 9 || changingButton.control == "joystick" && key != 7)
    {
        for (var i = 0, add_bt = true; i < userActions.length; i++)
        {
            if (userActions [i].screen.includes (changingButton.screen))
            {
                var id_key = userActions [i][changingButton.control][changingButton.bt_type].indexOf (key);
                if (id_key > -1)
                {
                    userActions [i][changingButton.control][changingButton.bt_type].splice (id_key, 1);
                    if (i == changingButton.i) add_bt = false;
                }
            }
        }
        if (add_bt)
        {
            userActions [changingButton.i][changingButton.control][changingButton.bt_type].push (key);
            if (userActions [changingButton.i][changingButton.control][changingButton.bt_type].length > 2) userActions [changingButton.i][changingButton.control][changingButton.bt_type].shift ();
        }
        localStorage.userActions = JSON.stringify (userActions);
    }
    showControls (changingButton.control, changingButton.bt_type);
    changingButton = null;
}