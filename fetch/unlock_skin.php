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
        if ($_POST ['skins'] == "") $skins = $_POST ['skin'];
        else $skins = $_POST ['skins'].','.$_POST ['skin'];
        $mysqli->query ('UPDATE players SET skins = "'.$skins.'" WHERE id = '.$_POST ['id']);
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else $return ["skin"] = $_POST ['skin'] * 1;
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);