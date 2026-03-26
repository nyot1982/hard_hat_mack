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
        $resultado = $mysqli->query ('SELECT * FROM high_scores');
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else
        {
            $high_scores = $resultado->num_rows;
            $resultado->free ();
            $resultado = $mysqli->query ('SELECT * FROM high_scores ORDER BY score ASC, id DESC');
            if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
            else
            {
                $high_score = $resultado->fetch_assoc ();
                $resultado->free ();
                if ($high_scores < 10 || intval ($_POST ['score']) > intval ($high_score ['score']))
                {
                    $return ["error"] = '';
                    if ($high_scores == 10)
                    {
                        $mysqli->query ('DELETE FROM high_scores WHERE id = '.$high_score ['id']);
                        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                    }
                    if ($return ["error"] == '')
                    {
                        $return = [];
                        $mysqli->query ("INSERT INTO high_scores VALUES (NULL, '".$_POST ['name']."', ".$_POST ['score'].")");
                        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                        else
                        {
                            $resultado = $mysqli->query ('SELECT MAX(id) FROM high_scores');
                            if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                            else
                            {
                                $high_score = $resultado->fetch_row ();
                                $return ["high_score_save"] = intval ($high_score [0]);
                                $resultado->free ();
                            }
                        }
                    }
                }
                else $return ["high_score_save"] = 0;
            }
        }
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);