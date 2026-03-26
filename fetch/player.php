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
        $resultado = $mysqli->query ('SELECT * FROM players WHERE name = "'.$_POST ['name'].'" AND id <> '.$_POST ['id']);
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else
        {
            if ($resultado->num_rows > 0) $return ["error"] = 'name_exists';
            else
            {
                if ($_POST ['skin'] > -1) $_POST ['color'] = 'skin'.$_POST ['skin'];
                $mysqli->query ('UPDATE players SET name = "'.$_POST ['name'].'", color = "'.$_POST ['color'].'" WHERE id = '.$_POST ['id']);
                if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                else $return ["player"] = [ 'name' => $_POST ['name'], 'color' => $_POST ['color'], 'skin' => $_POST ['skin'] ];
            }
            $resultado->free ();
        }
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);