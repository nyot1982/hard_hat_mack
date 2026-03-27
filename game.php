<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Hard Hat Mack</title>
        <base href="/hard_hat_mack/">
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="language" content="English">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Hard Hat Mack">
        <meta name="keywords" content="hard hat mack">
        <link rel="shortcut icon" href="favicon.ico">
        <link rel="apple-touch-icon" href="favicon.png">
        <link rel="alternate" href="http://example.com/en" hreflang="en">
        <link rel="stylesheet" href="css/fontawesome.css" type="text/css">
        <link rel="stylesheet" href="css/brands.css" type="text/css">
        <link rel="stylesheet" href="css/regular.css" type="text/css">
        <link rel="stylesheet" href="css/solid.css" type="text/css">
        <link rel="stylesheet" href="css/game_styles.css" type="text/css">
        <script type="text/javascript" src="js/jquery-3.7.1.min.js"></script>
        <script type="text/javascript" src="js/tinycolor.min.js"></script>
        <script type="text/javascript" src="js/game_scripts.js"></script>
        <script type="text/javascript" src="js/game_screen.js"></script>
        <script type="text/javascript" src="js/game_controls.js"></script>
        <script type="text/javascript" src="js/game_ground.js"></script>
        <script type="text/javascript" src="js/game_ships.js"></script>
        <script type="text/javascript" src="js/game_enemies.js"></script>
        <script type="text/javascript" src="js/game_bosses.js"></script>
        <script type="text/javascript" src="js/game_objects.js"></script>
        <script type="text/javascript" src="js/game_hud.js"></script>
    </head>
    <body>
        <?php
            locale_set_default ('en-ES');
            ini_set ('date.timezone', 'Europe/Madrid');
            date_default_timezone_set ('Europe/Madrid');
        ?>
        <preloader><div class="spinner"></div></preloader>
        <main>
            <article>
                <div id="fps_monitor">
                    frame rate: <span id="frame_rate">0</span> <span title="Frames per second" style="cursor: default;">fps</span><br>
                    frame time: <span id="frame_time">0</span> <span title="Milliseconds" style="cursor: default;">ms</span>
                </div>
                <div id="blackScreen"></div>
            </article>
        </main>
    </body>
</html>