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
        $resultado = $mysqli->query ('SELECT * FROM players WHERE email = "'.$_POST ['email'].'"');
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else
        {
            if ($resultado->num_rows == 0) $return ["error"] = 'email_ko';
            else   
            {
                $player = $resultado->fetch_assoc ();
                if ($player ['password'] != $_POST ['password']) $return ["error"] = 'password_ko';
                else if ($player ['validated'] == 0) $return ["error"] = 'email_not_validated';
                else $return ["player"] = [ 'id' => intval ($player ['id']), 'validated' => intval ($player ['validated']), 'email' => $player ['email'], 'name' => $player ['name'], 'password' => $player ['password'], 'color' => $player ['color'], 'skin' => null, 'skins' => $player ['skins'], 'xp' => $player ['xp'] * 1, 'game_music' => $player ['game_music'] * 1, 'game_sound' => $player ['game_sound'] * 1, 'fps_monitor' => $player ['fps_monitor'] * 1, 'user_actions' => $player ['user_actions'] ];
            }
            $resultado->free ();
        }
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);