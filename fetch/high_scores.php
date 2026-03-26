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
        $resultado = $mysqli->query ('SELECT MAX(LENGTH(name)) FROM high_scores');
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else
        {
            $max_high_scores = $resultado->fetch_row ();
            $return ["max_high_scores"] = intval ($max_high_scores [0]);
            $resultado->free ();
            $resultado = $mysqli->query ('SELECT * FROM high_scores ORDER BY score DESC, id ASC');
            if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
            else
            {
                while ($high_score = $resultado->fetch_assoc ()) $return ["high_scores"][] = [ 'id' => intval ($high_score ['id']), 'name' => $high_score ['name'], 'score' => intval ($high_score ['score'])];
                $resultado->free ();
            }
        }
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);