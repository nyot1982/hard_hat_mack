<?php
    if (!isset ($_GET ['fetch_call']) OR $_GET ['fetch_call'] != base64_encode ("fetch_origin"))
    {
        header ("Location: /");
        exit ();
    }

    $mysqli = new mysqli ('localhost', 'nyot', '$P33dM4n1982', 'last_mission');
    $mysqli->query ("SET NAMES 'utf8'");
    if ($mysqli->connect_errno) $return ["error"] = 'Error! Conexion has failed: ('.$mysqli->connect_errno.') '.$mysqli->connect_error;
    else
    {
        $resultado = $mysqli->query ('SELECT * FROM players WHERE email = "'.base64_decode ($_GET ['email']).'"');
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else
        {
            if ($resultado->num_rows == 0) $return ["error"] = 'E.mail not found';
            else   
            {
                $player = $resultado->fetch_assoc ();
                if ($player ['validated'] == 1) $return ["error"] = 'E.mail already validated';
                else
                {
                    $mysqli->query ('UPDATE players SET validated = 1 WHERE email = "'.base64_decode ($_GET ['email']).'"');
                    if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                    else $return ["ok"] = "E.mail validated!";
                }
            }
            $resultado->free ();
        }
    }
    if (isset ($mysqli)) $mysqli->close ();
?>
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; overflow: hidden;">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Last Mission - Validate your player e.mail</title>
    </head>
    <body style="margin: 0; padding: 0; font-size: 14pt; font-family: Arial, Helvetica, sans-serif; text-align: left; overflow: auto; text-align: center;">
        <img width="203" height="92" src="../img/title.png" alt="Last Mission">
        <?php
            if ($return ['ok']) echo '<h1 style="color: #00CC00;">'.$return ['ok'].'</h1>';
            else if ($return ['error']) echo '<h1 style="color: red;">'.$return ['error'].'</h1>';
        ?>
    </body>
</html>