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