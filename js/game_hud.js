
function resetHuds ()
{
    if (document.getElementById ("hudsMulti").style.display == "inline-flex") changeHuds (false);
    menuShip.speedHud ();
    document.getElementById ("headingHud").style.left = "-371.25px";
    document.getElementById ("zHud").innerHTML = "0 m";
    document.getElementById ("enemiesHud2").style.width = "270px";
    var weaponElements = document.getElementsByClassName ("weaponsHud");
    for (var i = 0; i < weaponElements.length; i++)
    {
        if (i == 0) $(weaponElements [i]).addClass ("active");
        else $(weaponElements [i]).removeClass ("active");
        $(weaponElements [i]).removeClass ("enable");
        $("#fire" + i + "rate").removeClass ("active");
        $("#fire" + i + "power").removeClass ("active");
    }
    document.getElementById ("lifeHud").style.width = "0px";
    document.getElementById ("fuelHud").style.width = "0px";
    document.getElementById ("ammoHud").style.width = "0px";
    document.getElementById ("shieldHud").style.width = "0px";
    if (gameModes.findIndex (mode => mode.active == true) > -1) gameModeHud (-1);
}

function usersPlayingHud ()
{
    var element = document.getElementById ("lifesHud");
    if (element.innerHTML == "")
    {
        element.style.minWidth = null;
        element.style.display = null;
        element.style.gridTemplateColumns = null;
        element.style.padding = null;
        element.style.cursor = "pointer";
        element.innerHTML = '<img title="Number of players in game" src="svgs/ship.svg"/> <span id="usersPlaying" title="Number of players in game">' + gameShips.length + '</span> <a id="mouse_interaction" title="Mouse interaction" class="fa fa-mouse fa-beat interaction" style="color: var(--color10); cursor: pointer;"></a>';
        usersPlayingDetails = 0;
    }
    else
    {
        if (usersPlayingDetails == 0 && gameShips.length != document.getElementById ("usersPlaying").textContent * 1)
        {
            if (gameShips.length > document.getElementById ("usersPlaying").textContent * 1) document.getElementById ("usersPlaying").style.color = "var(--color-7)";
            else document.getElementById ("usersPlaying").style.color = "var(--color-6)";
            document.getElementById ("usersPlaying").className = "change";
            document.getElementById ("usersPlaying").textContent = gameShips.length;
            setTimeout
            (
                () =>
                {
                    document.getElementById ("usersPlaying").style.color = null;
                    document.getElementById ("usersPlaying").className = "";
                },
                250
            );
        }
        else if (usersPlayingDetails == 1)
        {
            element.innerHTML = '<span id="usersPlayingDiv"></span> <a id="mouse_interaction" title="Mouse interaction" class="fa fa-mouse fa-beat interaction" style="color: var(--color10); cursor: pointer;"></a>';
            element.style.height = (23 * gameShips.length) + "px";
            usersPlayingDetails = 2;
        }
        else if (usersPlayingDetails == 2)
        {
            element = document.getElementById ("usersPlayingDiv");
            element.innerHTML = '';
            gameShipsXP = gameShips;
            gameShipsXP.sort ((ship1, ship2) => ship2.xp - ship1.xp);
            for (var ship in gameShipsXP) element.innerHTML += (ship > 0 ? '<br>' : '') + gameShipsXP [ship].shipHuds ("userPlaying" + ship, "Ship") + ' <span style="color: var(--color1);" title="Level">' + Math.floor (gameShipsXP [ship].xp / 100) + '</span> <span title="Name">' + gameShipsXP [ship].name + '</span>';
        }
        else if (usersPlayingDetails == -1)
        {
            element.innerHTML = '<img title="Number of players in game" src="svgs/ship.svg"/> <span id="usersPlaying" title="Number of players in game">' + gameShips.length + '</span> <a id="mouse_interaction" title="Mouse interaction" class="fa fa-mouse fa-beat interaction" style="color: var(--color10); cursor: pointer;"></a>';
            element.style.height = "23px";
            usersPlayingDetails = 0;
        }
    }
}

function gameModeHud (gameMode)
{
    $("#mode").addClass ("change");
    var activeMode = gameModes.findIndex (mode => mode.active == true);
    setTimeout
    (
        () =>
        {
            if (gameMode == -1)
            {
                document.getElementById ("mode").className = "fa fa-fw fa-times optionsIcon";
                document.getElementById ("mode").title = "No game mode selected";
                gameModes [activeMode].active = false;
            }
            else
            {
                document.getElementById ("mode").className = "fa fa-fw fa-" + gameModes [gameMode].icon + " optionsIcon";
                document.getElementById ("mode").title = gameModes [gameMode].title;
                gameModes [gameMode].active = true;
            }
            $("#mode").removeClass ("change");
        },
        300
    );
}

function fpsHud (action)
{
    if (action == "toggle")
    {
        if ($("#fps_monitor").hasClass ("active"))
        {
            $("#fps_monitor").removeClass ("active");
            action = 0;
            fpsMonitor.time = 0;
            fpsMonitor.frame = 0;
            fpsMonitor.fps = 0;
            fpsMonitor.ms = 0;
            document.getElementById ("frame_rate").innerHTML = 0;
            document.getElementById ("frame_time").innerHTML = 0;
        }
        else
        {
            $("#fps_monitor").addClass ("active");
            action = 1;
            fpsMonitor.time = Date.now ();
            fpsMonitor.frame = gameArea.frame || 0;
        }
        if (typeof (Storage) === "undefined") alert ("This browser does not support local web storage.");
        else localStorage.fpsMonitor = action;
    }
    else if (action == "update" && Date.now () - fpsMonitor.time >= 1000)
    {
        fpsMonitor.fps = gameArea.frame - fpsMonitor.frame;
        fpsMonitor.ms = Math.round (1000 / fpsMonitor.fps);
        if (fpsMonitor.ms === Infinity) fpsMonitor.ms = 0;
        document.getElementById ("frame_rate").innerHTML = fpsMonitor.fps;
        document.getElementById ("frame_time").innerHTML = fpsMonitor.ms;
        fpsMonitor.frame = gameArea.frame;
        fpsMonitor.time = Date.now ();
    }
}

function enemiesHud ()
{
    var element = document.getElementById ("enemiesHud2");
    if (enemies != parseInt (element.style.width))
    {
        element.style.width = enemies + "px";
        element.className = "change";
        setTimeout
        (
            () =>
            {
                element.className = "";
            },
            1000
        );
    }
}

function changeTab (newTab)
{
    if (gameTab != newTab)
    {
        $('#' + gameTab).removeClass ("active");
        $('#' + newTab).addClass ("active");
        $('#' + gameTab + 'Tab-' + controlTab).removeClass ("active");
        $('#' + gameTab + 'Tab-' + controlTab).addClass ("unactive");
        if ($('#' + newTab + 'Tab-' + controlTab).hasClass ("toggle")) $('#' + newTab + 'Tab-' + controlTab).removeClass ("toggle");
        else if ($('#' + newTab + 'Tab-' + controlTab).hasClass ("unactive")) $('#' + newTab + 'Tab-' + controlTab).removeClass ("unactive");
        $('#' + newTab + 'Tab-' + controlTab).addClass ("active");
        gameTab = newTab;
    }
}

function changeHuds (multi)
{
    if (multi)
    {
        document.getElementById ("hudSpeedAltitude").style.display = "none";
        document.getElementById ("hudSpeedAltitude").parentElement.className = "col no-margin center";
        document.getElementById ("hudSpeedAltitude").parentElement.style.width = "600px";
        document.getElementById ("hudEnemy").innerHTML = '';
        document.getElementById ("hudEnemy").parentElement.style.display = "none";
        document.getElementById ("hudVitals").parentElement.style.display = "none";
        document.getElementById ("hudHeading").parentElement.className = "col no-margin center";
        document.getElementById ("hudHeading").innerHTML = '<p><b>ENEMY</b></p><div id="enemiesHud"><div id="enemiesHud2" style="width: 270px;"></div></div><p>&nbsp;</p>';
        document.getElementById ("hudsMulti").style.display = "inline-flex";
        document.getElementById ("hudsMulti").innerHTML = "";
    }
    else
    {
        document.getElementById ("hudSpeedAltitude").style.display = "block";
        document.getElementById ("hudSpeedAltitude").parentElement.className = "col center";
        document.getElementById ("hudSpeedAltitude").parentElement.style.width = null;
        document.getElementById ("hudEnemy").parentElement.style.display = "block";
        document.getElementById ("hudEnemy").innerHTML = '<p>&nbsp;</p><p><b>ENEMY</b></p><div id="enemiesHud"><div id="enemiesHud2" style="width: 270px;"></div></div>';
        document.getElementById ("hudVitals").parentElement.style.display = "block";
        document.getElementById ("hudHeading").parentElement.className = "col center";
        document.getElementById ("hudHeading").innerHTML = '<p><b>HEADING</b></p><div class="turnHud"><div id="headingHud"><div class="e5">W</div><div>|</div><div class="e5">NW</div><div>|</div><div class="e1">N</div><div>|</div><div class="e5">NE</div><div>|</div><div class="e1">E</div><div>|</div><div class="e5">SE</div><div>|</div><div class="e1">S</div><div>|</div><div class="e5">SW</div><div>|</div><div class="e1">W</div><div>|</div><div class="e5">NW</div><div>|</div><div class="e1">N</div><div>|</div><div class="e5">NE</div><div>|</div><div class="e1">E</div><div>|</div><div class="e5">SE</div><div>|</div><div class="e1">S</div><div>|</div><div class="e5">SW</div><div>|</div><div class="e1">W</div><div>|</div><div class="e5">NW</div><div>|</div><div class="e1">N</div><div>|</div><div class="e5">NE</div><div>|</div><div class="e1">E</div></div></div>';
        document.getElementById ("hudsMulti").style.display = "none";
        document.getElementById ("hudsMulti").innerHTML = "";
    }
}