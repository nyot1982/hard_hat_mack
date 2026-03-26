<?php
    /*if ((!isset ($_POST ['fetch_call']) || $_POST ['fetch_call'] != "fetch_origin") && (!isset ($_GET ['code']) || !isset ($_GET ['state'])))
    {
        header ("Location: /");
        exit ();
    }
    else header ("Content-type: application/json");*/

    use League\OAuth2\Client\Provider\Google;

    require '../vendor/autoload.php';

    session_start ();

    $return ['ok'] = "";
    $return ['error'] = "";
    $clientId = '686557513597-2vmk1vfsjgre9fabt7r450kms0es58cb.apps.googleusercontent.com';
    $clientSecret = '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';
    //$clientId = $_POST ['client_id'];
    //$clientSecret = $_POST ['client_secret'];

    $redirectUri = (isset ($_SERVER ['HTTPS']) ? 'https://' : 'http://').$_SERVER ['HTTP_HOST'].$_SERVER ['PHP_SELF'];
    $params =
    [
        'clientId' => $clientId,
        'clientSecret' => $clientSecret,
        'redirectUri' => $redirectUri,
        'accessType' => 'offline',
        'prompt' => 'consent'
    ];
    $provider = new Google ($params);
    $options =
    [
        'scope' =>
        [
            'https://mail.google.com/'
        ]
    ];
    if ($provider === null) $return ['error'] = 'Provider missing';
    else if (!isset ($_GET ['code']))
    {
        $authUrl = $provider->getAuthorizationUrl ($options);
        $_SESSION ['oauth2state'] = $provider->getState ();
        header ("Location: ".$authUrl);
        exit;
    }
    else if (empty ($_GET ['state']) || ($_GET ['state'] !== $_SESSION ['oauth2state']))
    {
        unset ($_SESSION ['oauth2state']);   
        $return ['error'] = 'Invalid state';
    }
    else
    {
        unset ($_SESSION ['oauth2state']);   
        $token = $provider->getAccessToken
        (
            'authorization_code',
            [
                'code' => $_GET ['code']
            ]
        );
        $refreshToken = $token->getRefreshToken ();
        $mysqli = new mysqli ('localhost', 'nyot', '$P33dM4n1982', 'last_mission');
        $mysqli->query ("SET NAMES 'utf8'");
        if ($mysqli->connect_errno) $return ["error"] = 'Error! Conexion has failed: ('.$mysqli->connect_errno.') '.$mysqli->connect_error;
        else
        {
            $mysqli->query ('UPDATE vars SET value = "'.$refreshToken.'" WHERE name = "refresh_token"');
            if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
            else $return ["ok"] = htmlspecialchars ($refreshToken);
            if (isset ($mysqli)) $mysqli->close ();
        }
    }
    //echo json_encode ($return);
    echo $return ['error'];
    echo $return ['ok'];