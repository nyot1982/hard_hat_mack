<?php
    if (!isset ($_POST ['fetch_call']) OR $_POST ['fetch_call'] != "fetch_origin")
    {
        header ("Location: /");
        exit ();
    }
    else header ("Content-type: application/json");

    //Import PHPMailer classes into the global namespace
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\OAuth;
    //Alias the League Google OAuth2 provider class
    use League\OAuth2\Client\Provider\Google;

    //SMTP needs accurate times, and the PHP time zone MUST be set
    //This should be done in your php.ini, but this is how to do it if you don't have access to that
    date_default_timezone_set ('Etc/UTC');

    //Load dependencies from composer
    //If this causes an error, run 'composer install'
    require '../vendor/autoload.php';

    //If you don't want to use the built-in form, set your client id and secret here
    $clientId = $_POST ['client_id'];
    $clientSecret = $_POST ['client_secret'];
    $userName = $_POST ['user_name'];
    $email = $_POST ['email'];
    $password = $_POST ['password'];
    $color = $_POST ['color'];
    $gameMusic = $_POST ['game_music'];
    $gameSound = $_POST ['game_sound'];
    $fpsMonitor= $_POST ['fps_monitor'];
    $userActions= $_POST ['user_actions'];

    $mysqli = new mysqli ('localhost', 'nyot', '$P33dM4n1982', 'last_mission');
    $mysqli->query ("SET NAMES 'utf8'");
    if ($mysqli->connect_errno) $return ["error"] = 'Error! Conexion has failed: ('.$mysqli->connect_errno.') '.$mysqli->connect_error;
    else
    {
        $resultado = $mysqli->query ('SELECT * FROM players WHERE email = "'.$email.'"');
        if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
        else
        {
            if ($resultado->num_rows > 0) $return ["error"] = 'email_exists';
            else
            {
                $mysqli->query ('INSERT INTO players VALUES (NULL, 0, "'.$email.'", NULL, "'.$password.'", "'.$color.'", "", 0, '.$gameMusic.', '.$gameSound.', '.$fpsMonitor.', \''.$userActions.'\')');
                if ($mysqli->errno) $return ["error"] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                else
                {
                    $return ["ok"] = "Player created.";
                    
                    if (isset ($_SERVER ['HTTPS'])) $path = 'https://';
                    else $path = 'http://';
                    $path .= $_SERVER ['HTTP_HOST'].dirname ($_SERVER ['PHP_SELF']);

                    //Create a new PHPMailer instance
                    $mail = new PHPMailer ();

                    //Tell PHPMailer to use SMTP
                    $mail->isSMTP ();

                    //Enable SMTP debugging
                    //SMTP::DEBUG_OFF (0): Normal production setting; no debug output.
                    //SMTP::DEBUG_CLIENT (1): show client -> server messages only. Don't use this - it's very unlikely to tell you anything useful.
                    //SMTP::DEBUG_SERVER (2): show client -> server and server -> client messages - this is usually the setting you want
                    //SMTP::DEBUG_CONNECTION (3): As 2, but also show details about the initial connection; only use this if you're having trouble connecting (e.g. connection timing out)
                    //SMTP::DEBUG_LOWLEVEL (4): As 3, but also shows detailed low-level traffic. Only really useful for analyzing protocol-level bugs, very verbose, probably not what you need.
                    $mail->SMTPDebug = SMTP::DEBUG_OFF;

                    //Set the hostname of the mail server
                    $mail->Host = 'smtp.gmail.com';

                    //Set the SMTP port number:
                    // - 465 for SMTP with implicit TLS, a.k.a. RFC8314 SMTPS or
                    // - 587 for SMTP+STARTTLS
                    $mail->Port = 465;

                    //Set the encryption mechanism to use:
                    // - SMTPS (implicit TLS on port 465) or
                    // - STARTTLS (explicit TLS on port 587)
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;

                    //Whether to use SMTP authentication
                    $mail->SMTPAuth = true;

                    //Set AuthType to use XOAUTH2
                    $mail->AuthType = 'XOAUTH2';

                    //Use league/oauth2-client as OAuth2 token provider
                    //Create a new OAuth2 provider instance
                    $provider = new Google
                    (
                        [
                            'clientId' => $clientId,
                            'clientSecret' => $clientSecret
                        ]
                    );
                    if ($provider === null) $return ['error'] = 'Provider missing';
                    else
                    {
                        $resultado = $mysqli->query ('SELECT value FROM vars WHERE name = "refresh_token"');
                        if ($mysqli->errno) $return ['email']['error'] = 'Error! Query has failed: ('.$mysqli->errno.') '.$mysqli->error;
                        else
                        {
                            $refreshToken = $resultado->fetch_column ();

                            //Pass the OAuth provider instance to PHPMailer
                            $mail->setOAuth
                            (
                                new OAuth
                                (
                                    [
                                        'provider' => $provider,
                                        'clientId' => $clientId,
                                        'clientSecret' => $clientSecret,
                                        'refreshToken' => $refreshToken,
                                        'userName' => $userName
                                    ]
                                )
                            );

                            //Set who the message is to be sent from
                            //For gmail, this generally needs to be the same as the user you logged in as
                            $mail->setFrom ($userName, 'Last Mission');

                            //Set who the message is to be sent to
                            $mail->addAddress ($email);

                            //Set the subject 
                            $mail->Subject = 'Validate your player e.mail';

                            //Read an HTML message body from an external file, convert referenced images to embedded,

                            $mail->CharSet = PHPMailer::CHARSET_UTF8;
                            $mail->msgHTML ('<!DOCTYPE html>
                            <html lang="en" style="margin: 0; padding: 0; overflow: hidden;">
                                <head>
                                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                    <title>Last Mission - Validate your player e.mail</title>
                                </head>
                                <body style="margin: 0; padding: 0; font-size: 14pt; font-family: Arial, Helvetica, sans-serif; text-align: left; overflow: auto;">
                                    <div align="center">
                                        <img width="203" height="92" src="cid:title" alt="Last Mission">
                                        <h1>Player created.</h1>
                                    </div>
                                    <p>Validate your emlail to activate the player account by clicking on the following link:</p>
                                    <div align="center">
                                        <a href="'.$path.'/validate_email.php?fetch_call='.base64_encode ("fetch_origin").'&email='.base64_encode ($email).'"><h2>Validate e.mail</h2></a>
                                    </div>
                                </body>
                            </html>
                            ');

                            //Replace the plain text body with one created manually
                            $mail->AltBody = 'This is a plain-text message body';

                            $mail->AddEmbeddedImage ('../img/title.png','title', 'title.png'); 

                            //send the message, check for errors
                            if (!$mail->send ()) $return ['email']['error'] = 'Error: '.$mail->ErrorInfo;
                            else $return ['email']['ok'] = 'E.mail sent.';
                        }
                    }
                }
            }
            $resultado->free ();
        }
    }
    if (isset ($mysqli)) $mysqli->close ();
    echo json_encode ($return);