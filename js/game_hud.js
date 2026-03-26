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