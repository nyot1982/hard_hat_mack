function audio (src, loop)
{
    this.src = src;
    this.loop = loop;
    this.audioCtx = new AudioContext ();
    this.buffer;
    this.source;
    this.duration = 0;
    
    this.load = async function ()
    {
        try
        {
            const response = await fetch (this.src);
            this.audioCtx.decodeAudioData
            (
                await response.arrayBuffer (), (buf) =>
                {
                    // executes when buffer has been decoded
                    this.buffer = buf;
                    this.duration = buf.duration.toFixed (2);
                }
            );
        }
        catch (err)
        {
            console.error (`Unable to fetch the audio file. Error: ${err.message}`);
        }
    }

    this.play = function ()
    {
        this.source = this.audioCtx.createBufferSource ();
        this.source.buffer = this.buffer;
        this.source.playbackRate.value = 1;
        this.source.connect (this.audioCtx.destination);
        this.source.loop = this.loop;
        this.source.loopStart = 0;
        this.source.loopEnd = 0;
        this.source.start ();
    }

    this.pause = function ()
    {
        if (this.source) this.source.stop ();
    }

    this.stop = function ()
    {
        if (this.source)
        {
            this.source.stop ();
            this.source = null;
        }
    }

    this.load ();
}

function mack (type, color, x, y, width, height)
{
    this.type = type;
    this.color = color;
    this.x = x;
    this.y = y;    
    this.width = width;
    this.height = height;

    this.speedX = 0;
    this.speedY = 0;    
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.bounce = 0.6;

    this.update = function ()
    {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }

    this.newPos = function ()
    {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom ();
    }

    this.hitBottom = function ()
    {
        var rockbottom = canvasHeight - this.height;
        if (this.y > rockbottom)
        {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
}

function mack2 (name, x, y, heading, moveSpeed, strafeSpeed, fire, weapons, lifes, life, fuel, ammo, shield, score_xp, gunStatus, wing1Status, wing2Status, time)
{
    this.idChar = null;
    this.idControl = null;
    this.name = name || null;
    this.x = x || canvasWidth / 2;
    this.y = y || canvasHeight / 2;
    this.heading = heading || 0;
    this.moveSpeed = moveSpeed || 0;
    this.strafeSpeed = strafeSpeed || 0;
    this.fire = fire || false;
    if (this.name == null)
    {
        this.weapons =
        [
            {
                power: 1,
                rate: 1,
                fireRate: 50,
                active: true
            }
        ];
    }
    else
    {
        this.weapons = weapons ||
        [
            {
                name: "Laser",
                power: 1,
                rate: 1,
                fireRate: 30,
                active: true
            },
            {
                name: "Pulse",
                power: 0,
                rate: 1,
                fireRate: 66,
                active: false
            },
            {
                name: "K-can",
                power: 0,
                rate: 1,
                fireRate: 54,
                active: false
            },
            {
                name: "Hyper",
                power: 0,
                rate: 1,
                fireRate: 36,
                active: false
            }
        ];
    }
    this.weapon = this.weapons.findIndex (weapon => weapon.active == true)
    this.lifes = lifes || 5;
    this.life = life || 100;
    this.fuel = fuel || 100;
    this.ammo = ammo || 100;
    this.shield = shield || 0;
    this.status =
    {
        gun: gunStatus || true,
        wing1: wing1Status || true,
        wing2: wing2Status || true
    }
    this.time = time || null;
    this.width = 28;
    this.height = 32;
    this.move = 0;
    this.strafe = 0;
    this.turn = 0;
    this.lastShotFrame = -this.weapons [this.weapon].fireRate / this.weapons [this.weapon].rate;
    this.repairing = null;
    this.xp = null;
    this.score = score_xp || 0;

    this.firing = function (active)
    {
        if (gameModal == "menu" || gameScreen == "menu") this.fire = true;
        else if (gameScreen == "game") this.fire = active
    }

    this.turning = function (turn)
    {
        if (gameScreen == "menu")
        {
            if (turn == 0) this.turn = 0;
            else if (this.turn == 0) this.turn = turn;
        }
        else if (gameScreen == "game")
        {
            if (turn == 0 || turn < 0 && !this.status.wing1 || turn > 0 && !this.status.wing2) this.turn = 0;
            else if (gameControls [this.idControl] == "gamepad") this.turn = turn * 10;
            else
            {
                if (turn < 0 && this.turn > -10)
                {
                    if (this.turn == 0) this.turn = -5;
                    this.turn += turn;
                    if (this.turn < -10) this.turn = -10;
                }
                else if (turn > 0 && this.turn < 10)
                {
                    if (this.turn == 0) this.turn = 5;
                    this.turn += turn;
                    if (this.turn > 10) this.turn = 10;
                }
            }
        }
    }

    this.moving = function (direction)
    {
        if (gameScreen == "game")
        {
            if (direction < 0)
            {
                if (this.moveSpeed <= 0) this.move = -0.5;
                else if (this.moveSpeed > 0) this.move = -1;
            }
            else if (direction > 0)
            {
                if (this.moveSpeed < 0) this.move = 1;
                else if (this.moveSpeed >= 0) this.move = 0.5;
            }
            else if (direction == 0)
            {
                if (this.moveSpeed < 0) this.move = 0.5;
                else if (this.moveSpeed > 0) this.move = -0.5;
                else if (this.moveSpeed == 0) this.move = 0; 
            }
        }
    }

    this.strafing = function (direction)
    {
        if (gameScreen == "menu" || gameModal == "menu")
        {
            if (gameScreen == "menu") this.menuItems = 8;
            else if (gameModal == "menu") this.menuItems = 5;
            if (direction == 0) this.strafe = 0;
            else if (this.strafe == 0)
            {
                this.strafeSpeed = 2;
                if (this.menuItem === undefined) this.menuItem = 0;
                if (direction < 0 && this.menuItem > 0 || direction > 0 && this.menuItem < this.menuItems - 1)
                {
                    this.endStrafe = this.y + 25 * direction;
                    this.strafe = this.strafeSpeed * direction;
                    this.menuItem += direction;
                }
                else
                {
                    this.strafeSpeed = 6;
                    this.endStrafe = this.y + (this.menuItems - 1) * 25 * direction * -1;
                    this.strafe = this.strafeSpeed * direction * -1;
                    if (this.menuItem == 0) this.menuItem = this.menuItems - 1;
                    else if (this.menuItem == this.menuItems - 1) this.menuItem = 0;
                }
            }
        }
        else if (gameScreen == "game" && gameModal == null)
        {
            if (direction < 0)
            {
                if (this.strafeSpeed <= 0) this.strafe = -0.5;
                else if (this.strafeSpeed > 0) this.strafe = -1;
            }
            else if (direction > 0)
            {
                if (this.strafeSpeed < 0) this.strafe = 1;
                else if (this.strafeSpeed >= 0) this.strafe = 0.5;
            }
            else if (direction == 0)
            {
                if (this.strafeSpeed < 0) this.strafe = 0.5;
                else if (this.strafeSpeed > 0) this.strafe = -0.5;
                else if (this.strafeSpeed == 0) this.strafe = 0; 
            }
        }
    }

    this.shotsHit = function (path)
    {
        if (gameScreen == "game" && gameModal == null)
        {
            for (var gameShot in gameShots)
            {
                if (this.name != gameShots [gameShot].name)
                {
                    var shot = 
                    {
                        x: gameShots [gameShot].x,
                        y: gameShots [gameShot].y
                    }
                    if (ctx.isPointInStroke (this.paths [path], shot.x, shot.y) || ctx.isPointInPath (this.paths [path], shot.x, shot.y))
                    {
                        gameShots [gameShot].hit = true;
                        if (path == "shield") this.shield--;
                        else if (gameShots [gameShot].weapon == 6) this.life = 0;
                        else
                        {
                            if (this.status [path] == true) this.status [path] = false;
                            this.life -= 10;
                        }
                        if (this.life > 0)
                        {
                            gameHits.push (new hit (this.name, gameShots [gameShot].x, gameShots [gameShot].y, 20, 1));
                            if (gameSound.active)
                            {
                                gameSound.sounds ["hit1"].stop ();
                                gameSound.sounds ["hit1"].play ();
                            }
                            if (gameModes.findIndex (mode => mode.active == true) == 0 && path != "shield")
                            {
                                var gameChar = gameChars.findIndex (char => char.name == gameShots [gameShot].name);
                                if (gameChar > -1) gameChars [gameChar].score += 100;
                            }
                            if (gameControls [this.idControl] == "gamepad") vibrate (this.idControl, 300);
                        }
                        else
                        {
                            gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                            if (gameSound.active)
                            {
                                gameSound.sounds ["hit0"].stop ();
                                gameSound.sounds ["hit0"].play ();
                            }
                            var gameChar = gameChars.findIndex (char => char.name == gameShots [gameShot].name);
                            if (gameChar > -1) gameChars [gameChar].score += 1000;
                            this.playerDead ();
                        }
                    }
                }
            }
        }
    }

    this.playerDead = function ()
    {
        if (gameControls [this.idControl] == "gamepad") vibrate (this.idControl, 600);
        if (this.lifes > 0) this.lifes--;
        if (this.lifes == 0 && gameModes.findIndex (mode => mode.active == true) < 2) fetchLoad ("high_score_save", "name=" + this.name + "&score=" + this.score);
        setTimeout
        (
            () =>
            {
                if (this.lifes > 0)
                {
                    if (gameModal != null) gameCloseModal ();
                    this.x = 0;
                    this.y = 0;
                    this.heading = 0;
                    this.moveSpeed = 0;
                    this.strafeSpeed = 0;
                    this.fire = false;
                    this.life = 100;
                    this.fuel = 100;
                    this.ammo = 100;
                    this.shield = 0;
                    this.status.gun = true;
                    this.status.wing1 = true;
                    this.status.wing2 = true;
                    if (this.name == gameChars [0].name)
                    {
                        var newPoint = this.x;
                        if (newPoint < canvasWidth / 2) newPoint = canvasWidth / 2;
                        else if (newPoint > (gameMap.width - canvasWidth) + canvasWidth / 2) newPoint = (gameMap.width - canvasWidth) + canvasWidth / 2;
                        if (newPoint < gameArea.centerPoint.x) ctx.translate (gameArea.centerPoint.x - newPoint, 0);
                        else if (newPoint > gameArea.centerPoint.x) ctx.translate (-(newPoint - gameArea.centerPoint.x), 0);
                        gameArea.centerPoint.x = newPoint;
                        newPoint = this.y;
                        if (newPoint < canvasHeight / 2) newPoint = canvasHeight / 2;
                        else if (newPoint > (gameMap.height - canvasHeight) + canvasHeight / 2) newPoint = (gameMap.height - canvasHeight) + canvasHeight / 2;
                        if (newPoint < gameArea.centerPoint.y) ctx.translate (0, gameArea.centerPoint.y - newPoint);
                        else if (newPoint > gameArea.centerPoint.y) ctx.translate (0, -(newPoint - gameArea.centerPoint.y));
                        gameArea.centerPoint.y = newPoint;
                    }
                    if (gameMusic.active)
                    {
                        gameMusic.musics.game.stop ();
                        gameMusic.musics.game.play ();
                    }
                }
                else
                {
                    gameChars.splice (this.idChar, 1);
                    if (gameModes.findIndex (mode => mode.active == true) == 2 && gameChars.length < 2)
                    {
                        if (gameChars.length == 0) gameOpenModal ("exit", "Game over: Draw game");
                        else gameOpenModal ("exit", "Game over: " + gameChars [0].name + " wins!");
                    }
                    else if (gameModes.findIndex (mode => mode.active == true) < 2 && gameChars.length == 0)
                    {
                        $("#blackScreen").fadeIn (1000);
                        setTimeout
                        (
                            () =>
                            {
                                gameLoadScreen ("game_over");
                            },
                            1000
                        );
                    }
                }
            },
            1000
        );
    }

    this.update = function ()
    {
        if (this.name)
        {
            this.idChar = gameChars.findIndex (char => char.name == this.name);
            this.idControl = gameChars [this.idChar].control;
        }
        else this.idControl = menuControl;
        if (this.life > 0)
        {
            if (this.ground != "snow")
            {
                if (this.turn != 0)
                {
                    if (this.turn != 0) this.heading = (this.heading + this.turn) % 360;
                }
                this.radians = this.heading * Math.PI / 180;
                if (gameScreen == "menu" || gameModal == "menu")
                {
                    if (this.strafe != 0)
                    {
                        this.x += this.strafe * Math.sin ((this.heading + 90) * Math.PI / 180);
                        this.y -= this.strafe * Math.cos ((this.heading + 90) * Math.PI / 180);    
                        if (this.y > this.endStrafe && this.strafe > 0 || this.y < this.endStrafe && this.strafe < 0)
                        {
                            this.y = this.endStrafe;
                            if (this.y > this.endStrafe && this.menuItem < 0) this.menuItem = 0;
                            else if (this.y < this.endStrafe && this.menuItem >= this.menuItems) this.menuItem = this.menuItems - 1;
                            this.endStrafe = null;
                            this.strafe = 0;
                            this.strafeSpeed = 0;
                            if (pressed.keys [99].includes (38)) this.strafing (-1);
                            else if (pressed.keys [99].includes (40)) this.strafing (1);
                        }
                    }
                }
                else if (gameScreen == "game" && gameModal == null)
                {
                    this.maxSpeed = 6;
                    if (this.moveSpeed == 0 && this.move != 0 || this.moveSpeed != 0 && Math.abs (this.moveSpeed) <= this.maxSpeed)
                    {
                        this.moveSpeed = this.moveSpeed * 10 + this.move;
                        this.moveSpeed /= 10;
                        if (this.moveSpeed < 0 && this.move < 0 && this.moveSpeed <= -this.maxSpeed)
                        {
                            this.moveSpeed = -this.maxSpeed;
                            this.move = 0;
                        }
                        else if (this.moveSpeed > 0 && this.move > 0 && this.moveSpeed >= this.maxSpeed)
                        {
                            this.moveSpeed = this.maxSpeed;
                            this.move = 0;
                        }
                        else if (this.moveSpeed <= 0 && this.move == -1) this.move = -0.5;
                        else if (this.moveSpeed >= 0 && this.move == 1) this.move = 0.5;
                        else if (this.moveSpeed == 0) this.move = 0;
                        var moveX = this.moveSpeed * Math.sin (this.radians);
                        var moveY = this.moveSpeed * Math.cos (this.radians);
                        this.x += moveX;
                        this.y -= moveY;
                    }
                    if (this.strafeSpeed == 0 && this.strafe != 0 || this.strafeSpeed != 0 && Math.abs (this.strafeSpeed) <= this.maxSpeed)
                    {
                        this.strafeSpeed = this.strafeSpeed * 10 + this.strafe;
                        this.strafeSpeed /= 10;
                        if (this.strafeSpeed < 0 && this.strafe < 0 && this.strafeSpeed <= -this.maxSpeed)
                        {
                            this.strafeSpeed = -this.maxSpeed;
                            this.strafe = 0;
                        }
                        else if (this.strafeSpeed > 0 && this.strafe > 0 && this.strafeSpeed >= this.maxSpeed)
                        {
                            this.strafeSpeed = this.maxSpeed;
                            this.strafe = 0;
                        }
                        else if (this.strafeSpeed <= 0 && this.strafe == -1) this.strafe = -0.5;
                        else if (this.strafeSpeed >= 0 && this.strafe == 1) this.strafe = 0.5;
                        else if (this.strafeSpeed == 0) this.strafe = 0;
                        var moveX = this.strafeSpeed * Math.sin ((this.heading + 90) * Math.PI / 180);
                        var moveY = this.strafeSpeed * Math.cos ((this.heading + 90) * Math.PI / 180);
                        this.x += moveX;
                        this.y -= moveY;    
                    }
                }
                if (this.x < 0) this.x = 0;
                else if (this.x > gameMap.width) this.x = gameMap.width;
                if (this.y < 0) this.y = 0;
                else if (this.y > gameMap.height) this.y = gameMap.height;
                ctx = gameArea.ctx;
                ctx.save ();
                ctx.translate (this.x, this.y);
                ctx.rotate (this.radians);
                ctx.translate (-(this.width / 2), -(this.height / 2));
                ctx.globalAlpha = 1;
                this.paths = [];
                this.paths.cockpit = new Path2D ();
                this.paths.cockpit.rect (9, 13, 10, 1);
                this.paths.cockpit.rect (8, 14, 12, 1);
                this.paths.cockpit.rect (7, 15, 14, 14);
                this.paths.light = new Path2D ();
                this.paths.light.roundRect (21, 1, 8, 8, 2);
                this.paths.hook1 = new Path2D ();
                this.paths.hook1.rect (5, 19, 2, 8);
                this.paths.hook2 = new Path2D ();
                this.paths.hook2.rect (21, 19, 2, 8);
                if (this.colors.hook1Fill == null || this.colors.hook1Fill == this.colors.charFill) this.paths.cockpit.addPath (this.paths.hook1);
                if (this.colors.hook2Fill == null || this.colors.hook2Fill == this.colors.charFill) this.paths.cockpit.addPath (this.paths.hook2);
                ctx.lineWidth = 2;
                if (this.colors.charStroke != null) var strokeColor = this.colors.charStroke;
                else var strokeColor = this.colors.negative;
                ctx.strokeStyle = strokeColor + "CC";
                ctx.stroke (this.paths.cockpit)
                if (this.status.gun || this.repairing != null)
                {
                    this.paths.gun = new Path2D ();
                    this.paths.gun.roundRect (13, 1, 2, 7, 1);
                    this.paths.gun.roundRect (11, 7, 6, 7, 2);
                    ctx.stroke (this.paths.gun);
                }
                if (this.status.wing1 || this.repairing != null)
                {
                    this.paths.wing1 = new Path2D ();
                    this.paths.wing1.roundRect (3, 9, 2, 6, 2);
                    this.paths.wing1.roundRect (1, 13, 4, 16, 2);
                    this.paths.wing1.roundRect (1, 26, 2, 5, 2);
                    ctx.stroke (this.paths.wing1);
                }
                if (this.status.wing2 || this.repairing != null)
                {
                    this.paths.wing2 = new Path2D ();
                    this.paths.wing2.roundRect (23, 9, 2, 6, 2);
                    this.paths.wing2.roundRect (23, 13, 4, 16, 2);
                    this.paths.wing2.roundRect (25, 26, 2, 5, 2);
                    ctx.stroke (this.paths.wing2);
                }
                if (this.status.gun || this.repairing != null && gameArea.frame % 75 >= 0 && gameArea.frame % 75 < 15)
                {
                    if (!this.status.gun) ctx.fillStyle = strokeColor;
                    else if (this.colors.gunFill != null) ctx.fillStyle = this.colors.gunFill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.pattern;
                    else ctx.fillStyle = this.colors.near;
                    ctx.fill (this.paths.gun);
                    this.shotsHit ("gun");
                }
                if (this.status.wing1 || this.repairing != null && gameArea.frame % 75 >= 0 && gameArea.frame % 75 < 25)
                {
                    if (!this.status.wing1) ctx.fillStyle = strokeColor;
                    else if (this.colors.wing1Fill != null) ctx.fillStyle = this.colors.wing1Fill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.pattern;
                    else ctx.fillStyle = this.colors.near;
                    ctx.fill (this.paths.wing1);
                    this.shotsHit ("wing1");
                }
                if (this.status.wing2 || this.repairing != null && gameArea.frame % 50 >= 0 && gameArea.frame % 50 < 25)
                {
                    if (!this.status.wing2) ctx.fillStyle = strokeColor;
                    else if (this.colors.wing2Fill != null) ctx.fillStyle = this.colors.wing2Fill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.pattern;
                    else ctx.fillStyle = this.colors.near;
                    ctx.fill (this.paths.wing2);
                    this.shotsHit ("wing2");
                }
                if (this.colors.hook1Fill != null && this.colors.hook1Fill != this.colors.charFill)
                {
                    ctx.fillStyle = this.colors.hook1Fill;
                    ctx.fill (this.paths.hook1);
                }
                if (this.colors.hook2Fill != null && this.colors.hook2Fill != this.colors.charFill)
                {
                    ctx.fillStyle = this.colors.hook2Fill;
                    ctx.fill (this.paths.hook2);
                }
                ctx.fillStyle = this.colors.pattern || this.colors.charFill;
                ctx.fill (this.paths.cockpit);
                this.shotsHit ("cockpit");
                ctx.rotate (45 * Math.PI / 180);
                ctx.fillStyle = this.colors.lightFill;
                ctx.lineWidth = 1;
                if (this.colors.lightStroke != null) ctx.strokeStyle = this.colors.lightStroke;
                else if (this.colors.pattern) ctx.strokeStyle = this.colors.negative + "66";
                else ctx.strokeStyle = this.colors.near;
                ctx.fill (this.paths.light);
                ctx.stroke (this.paths.light);
                ctx.rotate (-45 * Math.PI / 180);
                if (this.shield > 0)
                {
                    this.paths.shield = new Path2D ();
                    this.paths.shield.arc (14, 19, 30, 0, 2 * Math.PI);
                    ctx.beginPath ();
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = this.colors.shields [this.colors.shield] + "FF";
                    ctx.fillStyle = this.colors.shields [this.colors.shield] + "66";
                    ctx.stroke (this.paths.shield);
                    ctx.fill (this.paths.shield);
                    if (gameArea.frame % 5 == 0)
                    {
                        this.colors.shield++;
                        if (this.colors.shield == this.colors.shields.length) this.colors.shield = 0;
                    }
                    this.shotsHit ("shield");
                }
                if (this.name)
                {
                    ctx.translate (-this.x, -this.y);
                    ctx.translate (this.width / 2, this.height / 2);
                }
                ctx.restore ();
                if (gameArea.frame % 50 == 0)
                {
                    if (this.colors.lightFill == "#7B797B")
                    {
                        if (gameModal == "menu" || gameScreen == "menu") this.colors.lightFill = this.colors.weapons [4];
                        else this.colors.lightFill = this.colors.weapons [this.weapon];
                    }
                    else this.colors.lightFill = "#7B797B";
                }
                else this.colors.lightFill = "#7B797B";
            }
            if (this.name)
            {
                var textMeasure = 0;
                if (this.ground != "snow")
                {
                    ctx.textBaseline = "middle";
                    if (this.xp != null)
                    {
                        ctx.font = "5px PressStart2P";
                        textMeasure = ctx.measureText (Math.floor (this.xp / 100));
                        textMeasure = textMeasure.width;      
                    }
                    ctx.textAlign = "center";
                    ctx.font = "6px PressStart2P";
                    var nameMeasure = ctx.measureText (this.name);
                    nameMeasure = nameMeasure.width + textMeasure;
                    ctx.beginPath ();    
                    ctx.rect (this.x - nameMeasure / 2 - 2, this.y - this.height / 2, nameMeasure + 4, 10);
                    ctx.fillStyle = this.colors.negative;
                    ctx.fill ();
                    ctx.fillStyle = this.colors.charFill;
                    ctx.fillText (this.name, this.x + (textMeasure == 0 ? 0 : textMeasure / 2 + 1), this.y - this.height / 2);
                    if (this.xp != null)
                    {
                        ctx.textAlign = "left";
                        ctx.font = "5px PressStart2P";
                        ctx.beginPath ();
                        ctx.rect (this.x - nameMeasure / 2 - 1, this.y - this.height / 2, textMeasure, 8);
                        ctx.fillStyle = this.colors.charFill;
                        ctx.fill ();
                        ctx.fillStyle = this.colors.negative;
                        ctx.fillText (Math.floor (this.xp / 100), this.x - nameMeasure / 2 - 1, this.y - this.height / 2);
                    }
                    if (this.name == gameChars [0].name)
                    {
                        if (this.x > canvasWidth / 2 && this.x < (gameMap.width - canvasWidth) + canvasWidth / 2)
                        {
                            ctx.translate (-(this.x - gameArea.centerPoint.x), 0);
                            gameArea.centerPoint.x = this.x;
                        }
                        if (this.y > canvasHeight / 2 && this.y < (gameMap.height - canvasHeight) + canvasHeight / 2)
                        {
                            ctx.translate (0, -(this.y - gameArea.centerPoint.y));
                            gameArea.centerPoint.y = this.y;
                        }
                    }
                    if (this.repairing != null)
                    {
                        ctx.beginPath ();
                        ctx.rect (this.x - 50 / 2, this.y + 10, 50, 5);
                        ctx.fillStyle = this.colors.negative;
                        ctx.fill ();
                        ctx.beginPath ();
                        ctx.rect (this.x - 50 / 2, this.y + 10, Math.round ((gameArea.frame - this.repairing) * 50 / 500), 5);
                        ctx.fillStyle = this.colors.charFill;
                        ctx.fill ();
                    }
                }
                if (gameModes.findIndex (mode => mode.active == true) > 0)
                {
                    for (var gameChar in gameChars)
                    {
                        if (this.name != gameChars [gameChar].name)
                        {
                            var dx = this.x - gameChars [gameChar].x;
                            var dy = this.y - gameChars [gameChar].y;
                            if (this.shield == 0 && gameChars [gameChar].shield == 0 && Math.sqrt (dx * dx + dy * dy) < 30)
                            {
                                this.life = 0;
                                this.score += 500;
                                gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                                if (gameSound.active)
                                {
                                    gameSound.sounds ["hit0"].stop ();
                                    gameSound.sounds ["hit0"].play ();
                                }
                                if (gameModes.findIndex (mode => mode.active == true) == 1 || gameModes.findIndex (mode => mode.active == true) == 2)
                                {
                                    gameChars [gameChar].life = 0;
                                    gameChars [gameChar].score += 500;
                                    gameHits.push (new hit ("hit0", gameChars [gameChar].x, gameChars [gameChar].y, 40, 2));
                                    if (gameSound.active)
                                    {
                                        gameSound.sounds ["hit0"].stop ();
                                        gameSound.sounds ["hit0"].play ();
                                    }
                                    gameChars [gameChar].playerDead ();
                                }
                                this.playerDead ();
                                return;
                            }
                            else if (this.shield > 0 && gameChars [gameChar].shield > 0 && Math.sqrt (dx * dx + dy * dy) < 58)
                            {
                                this.shield -= 10;
                                if (this.shield < 0) this.shield = 0;
                                gameChars [gameChar].shield -= 10;
                                if (gameChars [gameChar].shield < 0) gameChars [gameChar].shield = 0;
                                gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                                if (gameSound.active)
                                {
                                    gameSound.sounds ["hit0"].stop ();
                                    gameSound.sounds ["hit0"].play ();
                                }
                            }
                            else if (Math.sqrt (dx * dx + dy * dy) < 44)
                            {
                                if (this.shield > 0 && gameChars [gameChar].shield == 0)
                                {
                                    this.shield -= 10;
                                    if (this.shield < 0) this.shield = 0;
                                    this.score += 1000;
                                    gameChars [gameChar].life = 0;
                                    gameHits.push (new hit ("hit0", gameChars [gameChar].x, gameChars [gameChar].y, 40, 2));
                                    if (gameSound.active)
                                    {
                                        gameSound.sounds ["hit0"].stop ();
                                        gameSound.sounds ["hit0"].play ();
                                    }
                                    gameChars [gameChar].playerDead ();
                                }
                                else if (gameChars [gameChar].shield > 0 && this.shield == 0)
                                {
                                    gameChars [gameChar].shield -= 10;
                                    if (gameChars [gameChar].shield < 0) gameChars [gameChar].shield = 0;       
                                    gameChars [gameChar].score += 1000;
                                    this.life = 0;
                                    gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                                    if (gameSound.active)
                                    {
                                        gameSound.sounds ["hit0"].stop ();
                                        gameSound.sounds ["hit0"].play ();
                                    }
                                    this.playerDead ();
                                    return;
                                }
                            }
                        }
                    }
                }
                if (gameBoss)
                {
                    var dx = this.x - gameBoss.x;
                    var dy = this.y - gameBoss.y;
                    if (this.shield > 0 && Math.sqrt (dx * dx + dy * dy) < 45)
                    {
                        if (gameSound.active)
                        {
                            gameSound.sounds ["hit1"].stop ();
                            gameSound.sounds ["hit1"].play ();
                        }
                        this.shield -= 5;
                        if (this.shield < 0) this.shield = 0;
                    }
                    else if (Math.sqrt (dx * dx + dy * dy) < 31)
                    {
                        if (gameModes.findIndex (mode => mode.active == true) < 2 || this.name == gameChars [0].name) this.life = 0;
                        gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                        if (gameSound.active)
                        {
                            gameSound.sounds ["hit0"].stop ();
                            gameSound.sounds ["hit0"].play ();
                        }
                        this.playerDead ();
                    }
                }
                else for (var gameEnemy in gameEnemies)
                {
                    var dx = this.x - gameEnemies [gameEnemy].x;
                    var dy = this.y - gameEnemies [gameEnemy].y;
                    if (this.shield > 0 && Math.sqrt (dx * dx + dy * dy) < 45)
                    {
                        gameEnemies [gameEnemy].life = 0;
                        gameHits.push (new hit ("hit0", gameEnemies [gameEnemy].x, gameEnemies [gameEnemy].y, 40, 2));
                        if (gameSound.active)
                        {
                            gameSound.sounds ["hit0"].stop ();
                            gameSound.sounds ["hit0"].play ();
                        }
                        if (gameControls [this.idControl] == "gamepad") vibrate (this.idControl, 300);
                        this.shield -= 5;
                        if (this.shield < 0) this.shield = 0;
                        if (gameEnemies [gameEnemy].type < 7)
                        {
                            gameItems.push (new item (null, gameEnemies [gameEnemy].x, gameEnemies [gameEnemy].y));
                            this.score += 500;
                        }
                        if (gameEnemies [gameEnemy].type < 3) gameEnemies.push (new enemy (Math.floor (Math.random () * 3), Math.floor (Math.random () * gameMap.width), Math.floor (Math.random () * gameMap.height), Math.floor (Math.random () * 720) - 360));
                    }
                    else if (Math.sqrt (dx * dx + dy * dy) < 31)
                    {
                        this.life = 0;
                        gameEnemies [gameEnemy].life = 0;
                        gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                        gameHits.push (new hit ("hit0", gameEnemies [gameEnemy].x, gameEnemies [gameEnemy].y, 40, 2));
                        if (gameSound.active)
                        {
                            gameSound.sounds ["hit0"].stop ();
                            gameSound.sounds ["hit0"].play ();
                        }
                        if (gameControls [this.idControl] == "gamepad") vibrate (this.idControl, 600);
                        if (gameEnemies [gameEnemy].type < 7)
                        {
                            gameItems.push (new item (null, gameEnemies [gameEnemy].x, gameEnemies [gameEnemy].y));
                            this.score += 250;
                        }
                        if (gameEnemies [gameEnemy].type < 3) gameEnemies.push (new enemy (Math.floor (Math.random () * 3), Math.floor (Math.random () * gameMap.width), Math.floor (Math.random () * gameMap.height), Math.floor (Math.random () * 720) - 360));
                        this.playerDead ();
                    }
                }
            }
            if (this.fire && (gameArea.frame - this.lastShotFrame) >= this.weapons [this.weapon].fireRate / this.weapons [this.weapon].rate)
            {
                var shot_fired = false;
                if (gameModal == "menu" || gameScreen == "menu")
                {
                    menuShots.push (new shot (this.name, 0, "#c66d73", this.x + (this.height / 2) * Math.sin (this.heading * Math.PI / 180), this.y - (this.height / 2) * Math.cos (this.heading * Math.PI / 180), 24, 3, 16, this.heading));
                    this.fire = false;
                    shot_fired = true;
                }
                else if (gameScreen == "game" && gameModal == null && this.ammo > 0)
                {
                    if (this.weapon == 0)
                    {
                        if (this.weapons [this.weapon].power == 1 && this.status.gun)
                        {
                            gameShots.push (new shot (this.name, this.weapon, "black", this.x + (this.height / 2 + 24) * Math.sin (this.heading * Math.PI / 180), this.y - (this.height / 2 + 24) * Math.cos (this.heading * Math.PI / 180), 24, 3, 12, this.heading));
                            shot_fired = true;
                        }
                        if (this.weapons [this.weapon].power == 2)
                        {
                            if (this.status.wing1) gameShots.push (new shot (this.name, this.weapon, "black", this.x + (this.height / 2 + 16) * Math.sin ((this.heading - 18) * Math.PI / 180), this.y - (this.height / 2 + 16) * Math.cos ((this.heading - 18) * Math.PI / 180), 24, 3, 12, this.heading));
                            if (this.status.wing2) gameShots.push (new shot (this.name, this.weapon, "black", this.x + (this.height / 2 + 16) * Math.sin ((this.heading + 18) * Math.PI / 180), this.y - (this.height / 2 + 16) * Math.cos ((this.heading + 18) * Math.PI / 180), 24, 3, 12, this.heading));
                            if (this.status.wing1 || this.status.wing2) shot_fired = true;
                        }
                    }
                    else if (this.weapon == 1)
                    {
                        if (this.status.wing1) gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y, 12, 3, 8, this.heading - 90));
                        if (this.status.gun) gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y, 12, 3, 8, this.heading));
                        if (this.status.wing2) gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y, 12, 3, 8, this.heading + 90));
                        if (this.weapons [this.weapon].power == 2)
                        {
                            if (this.status.wing1)
                            {
                                gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y - 12, 12, 3, 8, this.heading - 90));
                                gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y + 12, 12, 3, 8, this.heading - 90));
                            }
                            if (this.status.gun)
                            {
                                gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x - 12, this.y, 12, 3, 8, this.heading));
                                gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x + 12, this.y, 12, 3, 8, this.heading));
                            }
                            if (this.status.wing2)
                            {
                                gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y - 12, 12, 3, 8, this.heading + 90));
                                gameShots.push (new shot (this.name, this.weapon, "#BBB", this.x, this.y + 12, 12, 3, 8, this.heading + 90));
                            }
                        }
                        if (this.status.gun || this.status.wing1 || this.status.wing2) shot_fired = true;
                    }
                    else if (this.weapon == 2)
                    {
                        if (this.status.wing1) gameShots.push (new shot (this.name, this.weapon, "#292C9C", this.x + 48 * Math.sin ((this.heading - 90) * Math.PI / 180), this.y - 48 * Math.cos ((this.heading - 90) * Math.PI / 180), 16, 0, 10, this.heading));
                        if (this.status.gun) gameShots.push (new shot (this.name, this.weapon, "#292C9C", this.x, this.y, 16, 0, 10, this.heading));
                        if (this.status.wing2) gameShots.push (new shot (this.name, this.weapon, "#292C9C", this.x + 48 * Math.sin ((this.heading + 90) * Math.PI / 180), this.y - 48 * Math.cos ((this.heading + 90) * Math.PI / 180), 16, 0, 10, this.heading));
                        if (this.weapons [this.weapon].power == 2)
                        {
                            if (this.status.wing1) gameShots.push (new shot (this.name, this.weapon, "#292C9C", this.x + 96 * Math.sin ((this.heading - 90) * Math.PI / 180), this.y - 96 * Math.cos ((this.heading - 90) * Math.PI / 180), 16, 0, 10, this.heading));
                            if (this.status.wing2) gameShots.push (new shot (this.name, this.weapon, "#292C9C", this.x + 96 * Math.sin ((this.heading + 90) * Math.PI / 180), this.y - 96 * Math.cos ((this.heading + 90) * Math.PI / 180), 16, 0, 10, this.heading));
                        }
                        if (this.status.gun || this.status.wing1 || this.status.wing2) shot_fired = true;
                    }
                    else if (this.weapon == 3)
                    {
                        if (this.status.gun)
                        {
                            gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading - 45));
                            gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading));
                            gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading + 45));
                            gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading + 180));
                        }
                        if (this.status.wing1) gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading - 135));
                        if (this.status.wing2) gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading + 135));
                        if (this.weapons [this.weapon].power == 2)
                        {
                            if (this.status.wing1) gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading - 90));
                            if (this.status.wing2) gameShots.push (new shot (this.name, this.weapon, "black", this.x, this.y, 14, 3, 11, this.heading + 90));
                        }
                        if (this.status.gun || this.status.wing1 || this.status.wing2) shot_fired = true;
                    }
                    if (shot_fired) this.ammo--;
                }
                if (shot_fired)
                {
                    this.lastShotFrame = gameArea.frame;
                    if (gameSound.active && this.ammo > 0)
                    {
                        gameSound.sounds ["shot" + this.weapon].stop ();
                        gameSound.sounds ["shot" + this.weapon].play ();
                    }
                }
                if (gameControls [this.idControl] == "gamepad") vibrate (this.idControl, 150);
            }
        }
    }
}

function shot (name, weapon, color, x, y, width, height, speed, heading)
{
    this.name = name;
    this.weapon = weapon;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.heading = heading;
    this.radians = this.heading * Math.PI / 180;
    this.move = 0;
    this.turn = 0;
    this.hit = false;
    
    this.update = function ()
    {
        if (!this.hit)
        {
            this.move = this.speed;
            this.heading = (this.heading + this.turn) % 360;
            this.radians = this.heading * Math.PI / 180;
            this.x += this.move * Math.sin (this.radians);
            this.y -= this.move * Math.cos (this.radians);

            ctx = gameArea.ctx;
            ctx.save ();
            ctx.translate (this.x, this.y);
            ctx.rotate (this.radians);
            if (this.weapon == 0 || this.weapon == 4)
            {
                ctx.lineWidth = 0;
                ctx.fillStyle = this.color;
                ctx.fillRect (-(this.height / 2), 0, this.height, this.width);
                if (this.weapon == 4) ctx.fillRect (-4.5, this.width - 7, 9, 3);
            }
            else if (this.weapon == 1)
            {
                ctx.lineWidth = this.height;
                ctx.beginPath ();
                ctx.moveTo (0, 0);
                ctx.lineTo (-this.width, this.width);
                ctx.moveTo (0, 0);
                ctx.lineTo (this.width, this.width);
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.moveTo (0, 3);
                ctx.lineTo (-(this.width - 3), this.width);
                ctx.moveTo (0, 3);
                ctx.lineTo (this.width - 3, this.width);
                ctx.strokeStyle = this.color;
                ctx.stroke ();
                ctx.beginPath ();
                ctx.moveTo (0, 6);
                ctx.lineTo (-(this.width - 6), this.width);
                ctx.moveTo (0, 6);
                ctx.lineTo (this.width - 6, this.width);
                ctx.strokeStyle = "black";
                ctx.stroke ();
            }
            else if (this.weapon == 2)
            {
                ctx.beginPath ();
                ctx.lineWidth = 0;
                ctx.arc (0, 0, this.width, 0, 2 * Math.PI);
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.beginPath ();
                ctx.lineWidth = this.width / 2;
                ctx.arc (0, 0, this.width / 2, 0, 2 * Math.PI);
                ctx.strokeStyle = "black";
                ctx.stroke ();
                ctx.fillStyle = this.color;
                ctx.fill ();
            }
            else if (this.weapon == 3)
            {
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 3, this.width, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = '#4A4A4A';
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 0, this.width, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = this.color;
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 7, this.width - 4, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = '#4A4A4A';
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 4, this.width - 4, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = this.color;
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 12, this.width - 8, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = '#4A4A4A';
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 9, this.width - 8, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = this.color;
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 14, this.width - 12, -Math.PI / 1.1, -0.3);
                ctx.strokeStyle = this.color;
                ctx.stroke ();
            }
            else if (this.weapon == 5)
            {
                ctx.beginPath ();
                ctx.lineWidth = this.height;
                ctx.arc (0, 0, this.width, 0, 2 * Math.PI);
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.fillStyle = this.color;
                ctx.fill ();
            }
            ctx.restore ();
        }
    }
}

function hit (name, x, y, radius, add)
{
    this.name = name;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.add = add;
    this.r = 0;
    this.reverse = false;
    this.colors = ['#813338', '#8E3C97', '#56AC4D'];
    this.color = 0;
    
    this.update = function ()
    {
        if (!this.reverse || this.r > 0)
        {
            if (this.reverse && this.r > 0) this.r -= this.add;
            else if (this.r < this.radius) this.r += this.add;
            else this.reverse = true;
            ctx = gameArea.ctx;
            ctx.beginPath ();
            ctx.arc (this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.fillStyle = this.colors [this.color];
            if (this.r % 5 == 0)
            {
                this.color++
                if (this.color == this.colors.length) this.color = 0;
            }
            ctx.fill ();
        }
    }
}

function item (enemy, x, y)
{
    if (enemy == 0) this.type = Math.floor (Math.random () * 10);
    else if (enemy < 3) this.type = Math.floor (Math.random () * 4);
    else this.type = Math.floor (Math.random () * 6) + 4;
    this.x = x;
    this.y = y;
    this.taken = false;
    this.radius = 16;
    this.icons = ['solid/heart', 'solid/gas-pump', 'solid/crosshairs', 'solid/shield-halved', 'solid/clock', 'solid/burst', 'extra_life', 'P', 'K', 'H'];

    this.update = function ()
    {
        if (!this.taken)
        {
            ctx = gameArea.ctx;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000CC";
            ctx.beginPath ();
            ctx.arc (this.x, this.y, this.radius, 0, 2 * Math.PI);
            var grad = ctx.createRadialGradient (this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
            grad.addColorStop (0, "#B2B2B2");
            grad.addColorStop (1, "#4A4A4A");
            ctx.fillStyle = grad;
            ctx.fill ();
            ctx.stroke ();
            if (this.type < 7)
            {
                this.image = new Image ();
                this.image.src = "svgs/" + this.icons [this.type] + ".svg";
                if (this.type == 6) ctx.drawImage (this.image, this.x - this.radius / 2 - 1, this.y - this.radius / 2 + 1, this.radius, this.radius);
                else ctx.drawImage (this.image, this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
            }
            else
            {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = this.radius + "px PressStart2P";
                ctx.fillStyle = "black";
                ctx.fillText (this.icons [this.type], this.x, this.y);
            }
            this.radius -= (16 / 1000);

            for (var gameChar in gameChars)
            {
                var dx = this.x - gameChars [gameChar].x;
                var dy = this.y - gameChars [gameChar].y;
                if (Math.sqrt (dx * dx + dy * dy) < 30)
                {
                    this.taken = true;
                    if (gameChars [gameChar].life > 0)
                    {
                        if (this.type == 0) var vital = "life";
                        else if (this.type == 1) var vital = "fuel";
                        else if (this.type == 2) var vital = "ammo";
                        else if (this.type == 3) var vital = "shield";
                        else if (this.type == 4 && gameChars [gameChar].weapons [gameChars [gameChar].weapon].rate == 1) gameChars [gameChar].weapons [gameChars [gameChar].weapon].rate = 1.5;
                        else if (this.type == 5 && gameChars [gameChar].weapons [gameChars [gameChar].weapon].power == 1) gameChars [gameChar].weapons [gameChars [gameChar].weapon].power++;
                        else if (this.type == 6 && gameChars [gameChar].lifes < 10) gameChars [gameChar].lifes++;
                        else if (this.type > 6 && gameChars [gameChar].weapon != this.type - 6)
                        {
                            gameChars [gameChar].weapons [gameChars [gameChar].weapon].active = false;
                            gameChars [gameChar].weapon = this.type - 6;
                            gameChars [gameChar].weapons [gameChars [gameChar].weapon].active = true;
                            if (gameChars [gameChar].weapons [gameChars [gameChar].weapon].power == 0) gameChars [gameChar].weapons [gameChars [gameChar].weapon].power = 1;
                        }
                        if (this.type < 4)
                        {
                            gameChars [gameChar][vital] += 10;
                            if (gameChars [gameChar][vital] > 100) gameChars [gameChar][vital] = 100;        
                        }
                    }
                }
            }
        }
    }
}

function component (type, src, color, x, y, width, height, max, backColor)
{
    this.type = type;
    this.src = src;
    this.color = color;
    if (this.type == "image")
    {
        this.image = new Image ();
        this.image.src = this.src;
    }
    else if (this.type == "type") this.typeFrame = 1;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.max = max;
    this.backColor = backColor;

    this.update = function (idComponent)
    {
        ctx = gameArea.ctx;
        if (this.type == "image") ctx.drawImage (this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        else if (this.type == "rect")
        {
            ctx.beginPath ();
            ctx.rect (this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill ();
        }
        else if (this.type == "circle")
        {
            ctx.beginPath ();
            ctx.arc (this.x, this.y, this.height, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill ();
        }
        else
        {
            ctx.textAlign = this.width;
            ctx.textBaseline = "middle";
            ctx.font = this.height + "px PressStart2P";
            if (this.type == "type" && idComponent <= idTypeAct)
            {
                ctx.fillStyle = this.color;
                if (idTypeAct == idComponent && gameArea.frame % 5 == 0) this.typeFrame++;
                if (this.typeFrame == this.src.length && idTypeAct == idComponent) 
                {
                    ctx.fillText (this.src, this.x, this.y);
                    idTypeAct++;
                }
                else ctx.fillText (this.src.substr (0, this.typeFrame), this.x, this.y);
                if (idTypeAct == gameText.length) gameSound.sounds ["type"].stop ();
            }
            else if (this.type != "type")
            {
                if (this.backColor != null)
                {
                    ctx.beginPath ();
                    var textMeasure = ctx.measureText (this.src);
                    ctx.roundRect (this.x - textMeasure.width / 2 - (this.height < 10 ? 4 : 6), this.y - this.height / 2 - (this.height < 10 ? 2 : 4), textMeasure.width + (this.height < 10 ? 8 : 12), this.height + (this.height < 10 ? 4 : 8), 2 * Math.PI);
                    ctx.fillStyle = this.backColor;
                    ctx.fill ();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = this.color + "CC";
                    ctx.stroke ();
                }
                ctx.fillStyle = this.color;
                if (this.max != null) ctx.fillText (this.src, this.x, this.y + 1, this.max);
                else ctx.fillText (this.src, this.x, this.y + 1);
            }
        }
        if (gameModal == "menu" || gameScreen == "menu")
        {
            for (var menuShot in menuShots)
            {
                var dx = this.x - menuShots [menuShot].x;
                var dy = this.y - menuShots [menuShot].y;
                if (Math.sqrt (dx * dx + dy * dy) < 12)
                {
                    menuShots [menuShot].hit = true;
                    menuHits.push (new hit (this.src, menuShots [menuShot].x, menuShots [menuShot].y, 20, 1));
                    if (gameSound.active)
                    {
                        gameSound.sounds ["hit1"].stop ();
                        gameSound.sounds ["hit1"].play ();
                    }
                    switch (this.src)
                    {
                        case "Sound":
                            if (gameSound.active)
                            {
                                for (var sound in gameSound.sounds) gameSound.sounds [sound].stop ();
                                gameSound.active = false;
                            }
                            else gameSound.active = true;
                            $("#sound").addClass ("change");
                            setTimeout
                            (
                                () =>
                                {
                                    document.getElementById ("sound").innerHTML = gameSound.active ? "On" : "Off";
                                    $("#sound").removeClass ("change");
                                },
                                300
                            );
                        break;
                        case "Music":
                            if (gameMusic.active)
                            {
                                if (gameModal == "menu") gameMusic.musics.game.stop ();
                                else gameMusic.musics.menu.stop ();
                                gameMusic.active = false;
                            }
                            else
                            {
                                if (gameModal == "menu") gameMusic.musics.game.play ();
                                else gameMusic.musics.menu.play ();
                                gameMusic.active = true;
                            }
                            $("#music").addClass ("change");
                            setTimeout
                            (
                                () =>
                                {
                                    document.getElementById ("music").innerHTML = gameMusic.active ? "On" : "Off";
                                    $("#music").removeClass ("change");
                                },
                                300
                            );
                        break;
                        case "FPS Monitor":
                            fpsHud ("toggle");
                        break;
                        case "High Scores":
                            setTimeout
                            (
                                () =>
                                {
                                    $("#blackScreen").fadeIn (1000);
                                    setTimeout
                                    (
                                        () =>
                                        {
                                            gameLoadScreen ("high_scores");
                                        },
                                        1000
                                    );
                                },
                                600
                            );
                        break;
                        case "Pause":
                            setTimeout
                            (
                                () =>
                                {
                                    gameOpenModal ("continue", "Game paused");
                                },
                                600
                            );
                            setTimeout
                            (
                                () =>
                                {
                                    gameArea.pause ();
                                },
                                700
                            );
                        break;
                        case "Exit":
                            gameConfirm.push (new component ("text", ">>> Are you sure?", "yellow", 705, gameText [gameText.length - 2].y, "left", 10));
                        break;
                    }
                }
            }
        }
    }
}