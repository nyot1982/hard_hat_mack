<?php
    if (!isset ($_POST ['fetch_call']) OR $_POST ['fetch_call'] != "fetch_origin")
    {
        header ("Location: /");
        exit ();
    }
    else header ("Content-type: application/json");

    $return ["error"] = 'name_exists';
    $return ["player"] = [ 'name' => $_POST ['name'], 'color' => $_POST ['color'] ];
         
    echo json_encode ($return);