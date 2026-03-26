function ship (name, color, x, y, heading, moveSpeed, strafeSpeed, fire, weapons, engine1, engine2, engine1inc, engine2inc, lifes, life, fuel, ammo, shield, score_xp, gunStatus, wing1Status, wing2Status, engine1Status, engine2Status, time)
{
    this.idShip = null;
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
    this.engine1 = engine1 || 0;
    this.engine2 = engine2 || 0;
    this.engine1max = 4;
    this.engine2max = 4;
    this.engine1inc = engine1inc || true;
    this.engine2inc = engine2inc || true;
    this.lifes = lifes || 5;
    this.life = life || 100;
    this.fuel = fuel || 100;
    this.ammo = ammo || 100;
    this.shield = shield || 0;
    this.status =
    {
        gun: gunStatus || true,
        wing1: wing1Status || true,
        wing2: wing2Status || true,
        engine1: engine1Status || true,
        engine2: engine2Status || true
    }
    this.time = time || null;
    this.width = 28;
    this.height = 32;
    this.move = 0;
    this.moveZ = 0;
    this.strafe = 0;
    this.turn = 0;
    this.lastShotFrame = -this.weapons [this.weapon].fireRate / this.weapons [this.weapon].rate;
    this.repairing = null;
    this.xp = null;
    this.score = score_xp || 0;

    this.changeColor = function (color)
    {
        this.colors =
        {
            shipFill: color || null,
            gunFill: null,
            hook1Fill: null,
            hook2Fill: null,
            wing1Fill: null,
            wing2Fill: null,
            engine1Fill: null,
            engine2Fill: null,
            lightFill: "#7B797B",
            shipStroke: null,
            engine1Stroke: null,
            engine2Stroke: null,
            lightStroke: null,
            negative: null,
            near: null,
            shield: 0,
            shields:
            [
                "#813338",
                "#8E3C97",
                "#56AC4D"
            ],
            weapons:
            [
                "#C66D73",
                "#52AE4A",
                "#EFF373",
                "#73CFCE",
                "#A53C9A"
            ],
            pattern: null
        }
        if (tinycolor (this.colors.shipFill).isDark ()) this.colors.near = tinycolor (this.colors.shipFill).lighten (15).toHexString ();
        else this.colors.near = tinycolor (this.colors.shipFill).darken (15).toHexString ();
        this.colors.negative = tinycolor (this.colors.shipFill).toRgb ();
        this.colors.negative.r = 255 - this.colors.negative.r;
        this.colors.negative.g = 255 - this.colors.negative.g;
        this.colors.negative.b = 255 - this.colors.negative.b;
        this.colors.negative = tinycolor (this.colors.negative).toHexString ();
    }
    this.changeColor (color);

    this.changeWeapon = function ()
    {
        if (this.z > 0) 
        {
            this.weapon = this.weapons.findIndex (weapon => weapon.active == true)
            this.weapons [this.weapon].active = false;
            this.weapon++;
            if (this.weapon == this.weapons.length) this.weapon = 0;
            while (this.weapons [this.weapon].power == 0)
            {
                this.weapon++;
                if (this.weapon == this.weapons.length) this.weapon = 0;
            }
            this.weapons [this.weapon].active = true;
        }
    }

    this.firing = function (active)
    {
        if (gameModal == "menu" || gameScreen == "menu") this.fire = true;
        else if (gameScreen == "game" && this.z == 500) this.fire = active
    }

    this.turning = function (turn)
    {
        if (gameScreen == "menu")
        {
            if (turn == 0) this.turn = 0;
            else if (this.turn == 0) this.turn = turn;
        }
        else if (gameScreen == "game" && this.z > 0)
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
        if (gameScreen == "game" && this.z > 0)
        {
            if (!this.status.engine1 && !this.status.engine2) direction = 0;
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

    this.movingZ = function ()
    {
        if (this.moveZ == 0 && this.life > 0)
        {
            if (this.z == 0 && this.fuel > 0 && this.repairing == null) this.moveZ = 10;
            else if (this.z == 500)
            {
                this.fire = false;
                this.moveZ = -10;
            }
        }
    }

    this.strafing = function (direction)
    {
        if (this.z > 0)
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
                if (!this.status.engine1 && !this.status.engine2) direction = 0;
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
    }

    this.shotsHit = function (path)
    {
        if (gameScreen == "game" && gameModal == null && this.z == 500)
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
                    if (gameShips [this.idShip].name == players [0].name)
                    {
                        if (gameArea.centerPoint.x > canvasWidth / 2 && gameArea.centerPoint.x < (gameMap.width - canvasWidth) + canvasWidth / 2) shot.x -= gameArea.centerPoint.x - canvasWidth / 2;
                        if (gameArea.centerPoint.y > canvasHeight / 2 && gameArea.centerPoint.y < (gameMap.height - canvasHeight) + canvasHeight / 2) shot.y -= gameArea.centerPoint.y - canvasHeight / 2;
                    }
                    else if (gameShots [gameShot].name == players [0].name)
                    {
                        if (gameArea.centerPoint.x > canvasWidth / 2 && gameArea.centerPoint.x < (gameMap.width - canvasWidth) + canvasWidth / 2) shot.x += gameArea.centerPoint.x - canvasWidth / 2;
                        if (gameArea.centerPoint.y > canvasHeight / 2 && gameArea.centerPoint.y < (gameMap.height - canvasHeight) + canvasHeight / 2) shot.y += gameArea.centerPoint.y - canvasHeight / 2;
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
                            if (gameModes.findIndex (mode => mode.active == true) != 1 && gameModes.findIndex (mode => mode.active == true) != 2 && players [0].name == this.name && path != "shield")
                            {
                                var gameShip = gameShips.findIndex (ship => ship.name == gameShots [gameShot].name);
                                if (gameShip > -1) gameShips [gameShip].score += 100;
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
                            var gameShip = gameShips.findIndex (ship => ship.name == gameShots [gameShot].name);
                            if (gameShip > -1) gameShips [gameShip].score += 1000;
                            this.playerDead ();
                        }
                    }
                }
            }
        }
    }

    this.playerDead = function ()
    {
        if (gameControls [this.idControl] == "gamepad" && this.z >= 0) vibrate (this.idControl, 600);
        if (this.lifes > 0) this.lifes--;
        if (this.lifes == 0 && gameModes.findIndex (mode => mode.active == true) < 2) fetchLoad ("high_score_save", "name=" + this.name + "&score=" + this.score);
        setTimeout
        (
            () =>
            {
                if (this.lifes > 0)
                {
                    if (gameModal != null) gameCloseModal ();
                    this.x = startPoints [startPoints.findIndex (startPoint => startPoint.ship == this.name)].x;
                    this.y = startPoints [startPoints.findIndex (startPoint => startPoint.ship == this.name)].y;
                    this.z = startPoints [startPoints.findIndex (startPoint => startPoint.ship == this.name)].z;
                    this.heading = 0;
                    this.moveSpeed = 0;
                    this.strafeSpeed = 0;
                    this.fire = false;
                    this.engine1 = 0;
                    this.engine2 = 0;
                    this.engine1inc = true;
                    this.engine2inc = true;
                    this.life = 100;
                    this.fuel = 100;
                    this.ammo = 100;
                    this.shield = 0;
                    this.status.gun = true;
                    this.status.wing1 = true;
                    this.status.wing2 = true;
                    this.status.engine1 = true;
                    this.status.engine2 = true;
                    if (this.name == players [0].name)
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
                        if (enemies == 0)
                        {
                            gameMusic.musics.boss.stop ();
                            gameMusic.musics.boss.play ();
                        }
                        else if (enemies > 0)
                        {
                            gameMusic.musics.game.stop ();
                            gameMusic.musics.game.play ();
                        }
                    }
                }
                else
                {
                    if (gameModes.findIndex (mode => mode.active == true) != 0) players.splice (players.findIndex (player => player.name == this.name), 1);
                    gameShips.splice (this.idShip, 1);
                    if (gameModes.findIndex (mode => mode.active == true) == 2 && gameShips.length < 2)
                    {
                        if (gameShips.length == 0) gameOpenModal ("exit", "Game over: Draw game");
                        else gameOpenModal ("exit", "Game over: " + gameShips [0].name + " wins!");
                    }
                    else if (gameModes.findIndex (mode => mode.active == true) < 2 && gameShips.length == 0)
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
            this.idShip = gameShips.findIndex (ship => ship.name == this.name);
            if (players.findIndex (player => player.name == this.name) > -1) this.idControl = players [players.findIndex (player => player.name == this.name)].control;
        }
        else this.idControl = menuControl;
        if (this.life > 0)
        {
            if (this.z > 0 || this.ground != "snow")
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
                            this.engine1max = 4;
                            this.engine2max = 4;
                            if (pressed.keys [99].includes (38)) this.strafing (-1);
                            else if (pressed.keys [99].includes (40)) this.strafing (1);
                            else
                            {
                                if (this.engine1 > this.engine1max)
                                {
                                    this.engine1 = this.engine1max;
                                    this.engine1inc = false;
                                }
                                if (this.engine2 > this.engine2max)
                                {
                                    this.engine2 = this.engine2max;
                                    this.engine2inc = false;
                                }
                            }
                        }
                    }
                }
                else if (gameScreen == "game" && gameModal == null)
                {
                    this.maxSpeed = !this.status.engine1 || !this.status.engine2 ? 3 : 6;
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
                if (this.z < 0) ctx.globalAlpha = 0.5;
                else ctx.globalAlpha = 1;
                ctx.transform ((this.z / 10 + 50) / 100, 0, 0, (this.z / 10 + 50) / 100, (this.width / 2) - (this.width * (this.z / 10 + 50) / 100 / 2), (this.height / 2) - (this.height * (this.z / 10 + 50) / 100 / 2));
                if (this.z > 0)
                {
                    if (this.status.engine1)
                    {
                        ctx.beginPath ();
                        ctx.fillStyle = "#D88F95EE";
                        ctx.ellipse (9, 33, 2, this.engine1, 0, 0, Math.PI);
                        ctx.fill ();
                        if (this.engine1inc)
                        {
                            this.engine1 += 0.25 * this.engine1max;
                            if (this.engine1 >= this.engine1max)
                            {
                                this.engine1 = this.engine1max;
                                this.engine1inc = false;
                            }
                        }
                        else
                        {
                            this.engine1 -= 0.25 * this.engine1max;
                            if (this.engine1 <= 0)
                            {
                                this.engine1 = 0;
                                this.engine1inc = true;
                            }
                        }
                    }
                    if (this.status.engine2)
                    {
                        ctx.beginPath ();
                        ctx.fillStyle = "#D88F95EE";
                        ctx.ellipse (19, 33, 2, this.engine2, 0, 0, Math.PI);
                        ctx.fill ();
                        if (this.engine2inc)
                        {
                            this.engine2 += 0.25 * this.engine2max;
                            if (this.engine2 >= this.engine2max)
                            {
                                this.engine2 = this.engine2max;
                                this.engine2inc = false;
                            }
                        }
                        else
                        {
                            this.engine2 -= 0.25 * this.engine2max;
                            if (this.engine2 <= 0)
                            {
                                this.engine2 = 0;
                                this.engine2inc = true;
                            }
                        }
                    }
                    if (this.moveSpeed != 0 || this.strafeSpeed != 0)
                    {
                        if (Math.abs (this.moveSpeed) >= Math.abs (this.strafeSpeed))
                        {
                            this.engine1max = Math.abs (this.moveSpeed) * 8;
                            this.engine2max = Math.abs (this.moveSpeed) * 8;
                        }
                        else
                        {
                            this.engine1max = Math.abs (this.strafeSpeed) * 8;
                            this.engine2max = Math.abs (this.strafeSpeed) * 8;
                        }
                    }
                    else
                    {
                        this.engine1max = 4;
                        this.engine2max = 4;
                    }
                }
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
                if (this.colors.hook1Fill == null || this.colors.hook1Fill == this.colors.shipFill) this.paths.cockpit.addPath (this.paths.hook1);
                if (this.colors.hook2Fill == null || this.colors.hook2Fill == this.colors.shipFill) this.paths.cockpit.addPath (this.paths.hook2);
                ctx.lineWidth = 2;
                if (this.colors.shipStroke != null) var strokeColor = this.colors.shipStroke;
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
                if (this.status.engine1 || this.repairing != null)
                {
                    this.paths.engine1 = new Path2D ();
                    this.paths.engine1.roundRect (7, 29, 4, 2, 1);
                    if (this.colors.engine1Stroke != null) var engine1StrokeColor = this.colors.engine1Stroke;
                    else var engine1StrokeColor = this.colors.shipFill;
                    ctx.strokeStyle = engine1StrokeColor + "88";
                    ctx.stroke (this.paths.engine1);
                }
                if (this.status.engine2 || this.repairing != null)
                {
                    this.paths.engine2 = new Path2D ();
                    this.paths.engine2.roundRect (17, 29, 4, 2, 1);
                    if (this.colors.engine2Stroke != null) var engine2StrokeColor = this.colors.engine2Stroke;
                    else var engine2StrokeColor = this.colors.shipFill;
                    ctx.strokeStyle = engine2StrokeColor + "88";
                    ctx.stroke (this.paths.engine2);
                }
                if (this.status.engine1 || this.repairing != null && gameArea.frame % 125 >= 0 && gameArea.frame % 50 < 10)
                {
                    if (!this.status.engine1) ctx.fillStyle = engine1StrokeColor;
                    else if (this.colors.engine1Fill != null) ctx.fillStyle = this.colors.engine1Fill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.shipFill;
                    else ctx.fillStyle = this.colors.negative;
                    ctx.fill (this.paths.engine1);
                    if (this.z == 500) this.shotsHit ("engine1");
                }
                if (this.status.engine2 || this.repairing != null && gameArea.frame % 100 >= 0 && gameArea.frame % 100 < 20)
                {
                    if (!this.status.engine2) ctx.fillStyle = engine2StrokeColor;
                    else if (this.colors.engine2Fill != null) ctx.fillStyle = this.colors.engine2Fill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.shipFill;
                    else ctx.fillStyle = this.colors.negative;
                    ctx.fill (this.paths.engine2);
                    if (this.z == 500) this.shotsHit ("engine2");
                }
                if (this.status.gun || this.repairing != null && gameArea.frame % 75 >= 0 && gameArea.frame % 75 < 15)
                {
                    if (!this.status.gun) ctx.fillStyle = strokeColor;
                    else if (this.colors.gunFill != null) ctx.fillStyle = this.colors.gunFill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.pattern;
                    else ctx.fillStyle = this.colors.near;
                    ctx.fill (this.paths.gun);
                    if (this.z == 500) this.shotsHit ("gun");
                }
                if (this.status.wing1 || this.repairing != null && gameArea.frame % 75 >= 0 && gameArea.frame % 75 < 25)
                {
                    if (!this.status.wing1) ctx.fillStyle = strokeColor;
                    else if (this.colors.wing1Fill != null) ctx.fillStyle = this.colors.wing1Fill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.pattern;
                    else ctx.fillStyle = this.colors.near;
                    ctx.fill (this.paths.wing1);
                    if (this.z == 500) this.shotsHit ("wing1");
                }
                if (this.status.wing2 || this.repairing != null && gameArea.frame % 50 >= 0 && gameArea.frame % 50 < 25)
                {
                    if (!this.status.wing2) ctx.fillStyle = strokeColor;
                    else if (this.colors.wing2Fill != null) ctx.fillStyle = this.colors.wing2Fill;
                    else if (this.colors.pattern) ctx.fillStyle = this.colors.pattern;
                    else ctx.fillStyle = this.colors.near;
                    ctx.fill (this.paths.wing2);
                    if (this.z == 500) this.shotsHit ("wing2");
                }
                if (this.colors.hook1Fill != null && this.colors.hook1Fill != this.colors.shipFill)
                {
                    ctx.fillStyle = this.colors.hook1Fill;
                    ctx.fill (this.paths.hook1);
                }
                if (this.colors.hook2Fill != null && this.colors.hook2Fill != this.colors.shipFill)
                {
                    ctx.fillStyle = this.colors.hook2Fill;
                    ctx.fill (this.paths.hook2);
                }
                ctx.fillStyle = this.colors.pattern || this.colors.shipFill;
                ctx.fill (this.paths.cockpit);
                if (this.z == 500) this.shotsHit ("cockpit");
                ctx.rotate (45 * Math.PI / 180);
                ctx.fillStyle = this.colors.lightFill;
                ctx.lineWidth = 1;
                if (this.colors.lightStroke != null) ctx.strokeStyle = this.colors.lightStroke;
                else if (this.colors.pattern) ctx.strokeStyle = this.colors.negative + "66";
                else ctx.strokeStyle = this.colors.near;
                ctx.fill (this.paths.light);
                ctx.stroke (this.paths.light);
                ctx.rotate (-45 * Math.PI / 180);
                if (this.shield > 0 && this.z > 0)
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
                if (gameArea.frame % 50 == 0 && this.z > 0)
                {
                    if (this.colors.lightFill == "#7B797B")
                    {
                        if (gameModal == "menu" || gameScreen == "menu") this.colors.lightFill = this.colors.weapons [4];
                        else this.colors.lightFill = this.colors.weapons [this.weapon];
                    }
                    else this.colors.lightFill = "#7B797B";
                }
                else if (this.z == 0) this.colors.lightFill = "#7B797B";
            }
            if (this.name)
            {
                var textMeasure = 0;
                if (this.z > 0 || this.ground != "snow")
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
                    ctx.fillStyle = this.colors.shipFill;
                    ctx.fillText (this.name, this.x + (textMeasure == 0 ? 0 : textMeasure / 2 + 1), this.y - this.height / 2);
                    if (this.xp != null)
                    {
                        ctx.textAlign = "left";
                        ctx.font = "5px PressStart2P";
                        ctx.beginPath ();
                        ctx.rect (this.x - nameMeasure / 2 - 1, this.y - this.height / 2, textMeasure, 8);
                        ctx.fillStyle = this.colors.shipFill;
                        ctx.fill ();
                        ctx.fillStyle = this.colors.negative;
                        ctx.fillText (Math.floor (this.xp / 100), this.x - nameMeasure / 2 - 1, this.y - this.height / 2);
                    }
                    if (this.name == players [0].name)
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
                        ctx.fillStyle = this.colors.shipFill;
                        ctx.fill ();
                    }
                }
                this.z += this.moveZ;
                if (this.z == -500)
                {
                    this.moveZ = 0;
                    this.life = 0;
                    this.playerDead ();
                    return;
                }
                else if (this.z == 0)
                {
                    this.moveSpeed = 0;
                    this.strafeSpeed = 0;
                    this.turn = 0;
                    this.move = 0;
                    this.moveX = 0;
                    this.moveY = 0;
                    this.moveZ = 0;
                    this.strafe = 0;
                    if (this.ground == "base")
                    {
                        if (this.repairing == null && (!this.status.gun || !this.status.wing1 || !this.status.wing2 || !this.status.engine1 || !this.status.engine2) && (this.status.engine1 || this.status.engine2)) this.repairing = gameArea.frame;
                        else if (this.repairing != null && gameArea.frame - this.repairing == 500)
                        {
                            this.status.gun = true;
                            this.status.wing1 = true;
                            this.status.wing2 = true;
                            this.status.engine1 = true;
                            this.status.engine2 = true;
                            this.repairing = null;
                        }
                    }
                }
                else if (this.z == 500)
                {
                    this.moveZ = 0;
                    if (this.fuel == 0 || !this.status.engine1 && !this.status.engine2)
                    {
                        if (this.name == players [0].name) stopUserInteractions (0);
                        this.moveZ = -10;
                    }
                    else if (this.fuel > 0)
                    {
                        if (gameArea.frame % (60 - (Math.abs (this.moveSpeed) > Math.abs (this.strafeSpeed) ? Math.abs (this.moveSpeed * 5) : Math.abs (this.strafeSpeed * 5))) == 0)
                        {
                            this.fuel--;
                        }
                    }
                }
                if (this.z == 0 && this.ground == "water")
                {
                    if (gameSound.active)
                    {
                        gameSound.sounds ["hit2"].stop ();
                        gameSound.sounds ["hit2"].play ();
                    }
                    if (gameControls [this.idControl] == "gamepad") vibrate (this.idControl, 600);
                    this.moveZ = -2.5;
                }
                else if (this.z == 0 && (this.ground == "lava" || this.fuel == 0 || !this.status.engine1 && !this.status.engine2))
                {
                    gameHits.push (new hit ("hit0", this.x, this.y, 20, 1));
                    if (gameSound.active)
                    {
                        gameSound.sounds ["hit0"].stop ();
                        gameSound.sounds ["hit0"].play ();
                    }
                    this.life = 0;
                    this.playerDead ();
                    return;
                }
                else
                {
                    if (gameModes.findIndex (mode => mode.active == true) > 0)
                    {
                        for (var gameShip in gameShips)
                        {
                            if (this.name != gameShips [gameShip].name && this.z == gameShips [gameShip].z)
                            {
                                var dx = this.x - gameShips [gameShip].x;
                                var dy = this.y - gameShips [gameShip].y;
                                if (this.shield == 0 && gameShips [gameShip].shield == 0 && Math.sqrt (dx * dx + dy * dy) < 30)
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
                                        gameShips [gameShip].life = 0;
                                        gameShips [gameShip].score += 500;
                                        gameHits.push (new hit ("hit0", gameShips [gameShip].x, gameShips [gameShip].y, 40, 2));
                                        if (gameSound.active)
                                        {
                                            gameSound.sounds ["hit0"].stop ();
                                            gameSound.sounds ["hit0"].play ();
                                        }
                                        gameShips [gameShip].playerDead ();
                                    }
                                    this.playerDead ();
                                    return;
                                }
                                else if (this.shield > 0 && gameShips [gameShip].shield > 0 && Math.sqrt (dx * dx + dy * dy) < 58)
                                {
                                    this.shield -= 10;
                                    if (this.shield < 0) this.shield = 0;
                                    gameShips [gameShip].shield -= 10;
                                    if (gameShips [gameShip].shield < 0) gameShips [gameShip].shield = 0;
                                    gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                                    if (gameSound.active)
                                    {
                                        gameSound.sounds ["hit0"].stop ();
                                        gameSound.sounds ["hit0"].play ();
                                    }
                                }
                                else if (Math.sqrt (dx * dx + dy * dy) < 44)
                                {
                                    if (this.shield > 0 && gameShips [gameShip].shield == 0)
                                    {
                                        this.shield -= 10;
                                        if (this.shield < 0) this.shield = 0;
                                        this.score += 1000;
                                        gameShips [gameShip].life = 0;
                                        gameHits.push (new hit ("hit0", gameShips [gameShip].x, gameShips [gameShip].y, 40, 2));
                                        if (gameSound.active)
                                        {
                                            gameSound.sounds ["hit0"].stop ();
                                            gameSound.sounds ["hit0"].play ();
                                        }
                                        gameShips [gameShip].playerDead ();
                                    }
                                    else if (gameShips [gameShip].shield > 0 && this.shield == 0)
                                    {
                                        gameShips [gameShip].shield -= 10;
                                        if (gameShips [gameShip].shield < 0) gameShips [gameShip].shield = 0;       
                                        gameShips [gameShip].score += 1000;
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
                    if (enemies == 0 && gameBoss)
                    {
                        var dx = this.x - gameBoss.x;
                        var dy = this.y - gameBoss.y;
                        if (this.shield > 0 && Math.sqrt (dx * dx + dy * dy) < 45 && this.z == gameBoss.z)
                        {
                            if (gameSound.active)
                            {
                                gameSound.sounds ["hit1"].stop ();
                                gameSound.sounds ["hit1"].play ();
                            }
                            this.shield -= 5;
                            if (this.shield < 0) this.shield = 0;
                        }
                        else if (Math.sqrt (dx * dx + dy * dy) < 31 && this.z == gameBoss.z)
                        {
                            if (gameModes.findIndex (mode => mode.active == true) < 2 || this.name == players [0].name) this.life = 0;
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
                        if (this.shield > 0 && Math.sqrt (dx * dx + dy * dy) < 45 && this.z == gameEnemies [gameEnemy].z)
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
                                if (enemies > 0) enemies--;
                                this.score += 500;
                            }
                            if (gameEnemies [gameEnemy].type < 3) gameEnemies.push (new enemy (Math.floor (Math.random () * 3), Math.floor (Math.random () * gameMap.width), Math.floor (Math.random () * gameMap.height), Math.floor (Math.random () * 720) - 360));
                        }
                        else if (Math.sqrt (dx * dx + dy * dy) < 31 && this.z == gameEnemies [gameEnemy].z)
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
                                if (enemies > 0) enemies--;
                                this.score += 250;
                            }
                            if (gameEnemies [gameEnemy].type < 3) gameEnemies.push (new enemy (Math.floor (Math.random () * 3), Math.floor (Math.random () * gameMap.width), Math.floor (Math.random () * gameMap.height), Math.floor (Math.random () * 720) - 360));
                            this.playerDead ();
                        }
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