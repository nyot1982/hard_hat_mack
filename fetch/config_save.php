<?php
    if (!isset ($_POST ['fetch_call']) OR $_POST ['fetch_call'] != "fetch_origin")
    {
        header ("Location: /");
        exit ();
    }
    else header ("Content-type: application/json");

    $mysqli = new mysqli ('localhost', 'nyot', '$P33dM4n1982', 'last_mission');
    $mysqli->query ("SET NAMES 'utf8'");
    if ($mysqli->connect_errno) $return ["error"] = 'Error! Conexion has failed: ('.$mysqli->connect_errno.') '.$mysqli->connect_error;
    else
    {
        $mysqli->query ('UPDATE players SET game_music = '.$_POST ['game_music'].', game_sound = '.$_POST ['game_sound'].', fps_monitor = '.$_POST ['fps_monitor'].', user_actions = \''.$_POST ['user_actions'].'\' WHERE id = '.$_POST ['id']);
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else $return ["ok"] = "Options saved";
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);