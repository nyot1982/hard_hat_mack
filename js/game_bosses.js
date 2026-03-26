function boss (type, x, y)
{
    if (gameMusic.active)
    {
        gameMusic.musics.game.stop ();
        gameMusic.musics.boss.play ();
    }
    this.type = type;
    this.x = x;
    this.y = y;
    this.z = 500;
    this.fire = false;
    this.weapon = 0;
    this.weapons =
    [
        {
            fireRate: 50
        },
        {
            fireRate: 10
        },
        {
            fireRate: 5
        }
    ];
    this.lastShotFrame = -this.weapons [this.weapon].fireRate;
    this.shotHeading = 0;

    if (this.type == 0)
    {
        this.width = 70;
        this.height = 70;
        this.engine1 = 0;
        this.engine2 = 0;
        this.engine3 = 0;
        this.engine4 = 0;
        this.engine1inc = true;
        this.engine2inc = true;
        this.engine3inc = true;
        this.engine4inc = true;
        this.engine1Life = 100;
        this.engine2Life = 100;
        this.engine3Life = 100;
        this.engine4Life = 100;
        this.life = 500;    
        this.speed = 2;
        this.moveX = 0;
        this.moveY = 0;
    }

    this.changeWeapon = function (weapon)
    {
        if (this.z == 500) this.weapon = weapon;
    }

    this.firing = function (active)
    {
        if (this.z == 500) this.fire = active;
    }

    this.movingX = function (direction)
    {   
        if (this.z > 0)
        {
            this.engine1 = 0;
            this.engine3 = 0;
            this.engine1inc = true;
            this.engine3inc = true;
            if (direction == 0 || (this.engine1Life == 0 && this.engine3Life == 0) || (direction == -1 && this.engine3Life == 0) || (direction == 1 && this.engine1Life == 0)) this.moveX = 0;
            else this.moveX = this.speed * direction;
        }
    }

    this.movingY = function (direction)
    {   
        if (this.z > 0)
        {
            this.engine2 = 0;
            this.engine4 = 0;
            this.engine2inc = true;
            this.engine4inc = true;
            if (direction == 0 || (this.engine4Life == 0 && this.engine2Life == 0) || (direction == -1 && this.engine2Life == 0) || (direction == 1 && this.engine4Life == 0)) this.moveY = 0;
            else this.moveY = this.speed * -direction;
        }
    }

    this.speeding = function (increment)
    {
        if ((this.speed > 2 && increment < 0) || (this.speed < 8 && increment > 0))
        {
            this.speed += increment;
            if (this.moveX < 0)
            {
                this.engine3 = 0;
                this.engine3inc = true;
                this.moveX = -this.speed;
            }
            else if (this.moveX > 0)
            {
                this.engine1 = 0;
                this.engine1inc = true;
                this.moveX = this.speed;
            }
            if (this.moveY < 0)
            {
                this.engine4 = 0;
                this.engine4inc = true;
                this.moveY = -this.speed;
            }
            else if (this.moveY > 0)
            {
                this.engine2 = 0;
                this.engine2inc = true;
                this.moveY = this.speed;
            }
        }
    }

    this.update = function ()
    {
        if (this.life > 0)
        {
            if (this.type == 0)
            {
                if (gameArea.frame % 10 == 0)
                {
                    this.action = Math.floor (Math.random () * 11);
                    switch (this.action)
                    {
                        case 0:
                            if (this.x < 70) this.movingX (1);
                            else this.movingX (-1);
                            break;
                        case 1:
                            if (this.x > gameMap.width - 70) this.movingX (-1);
                            else this.movingX (1);
                            break;
                        case 2:
                            if (this.y < 70) this.movingY (1);
                            else this.movingY (-1);
                            break;
                        case 3:
                            if (this.y > gameMap.height - 70) this.movingY (-1);
                            else this.movingY (1);
                            break;
                        case 4:
                            this.speeding (-2);
                            break;
                        case 5:
                            this.speeding (2);
                            break;
                        case 6:
                            this.firing (true);
                            break;
                        case 7:
                            this.firing (false);
                            break;
                        case 8:
                            this.changeWeapon (0);
                            break;
                        case 9:
                            this.changeWeapon (1);
                            break;
                        case 10:
                            this.changeWeapon (2);
                            break;
                    }
                }
                this.engine1max = 8
                this.engine2max = 8
                this.engine3max = 8
                this.engine4max = 8
                if (this.moveX != 0)
                {
                    if (this.moveX < 0) this.engine3max = 40;
                    else if (this.moveX > 0) this.engine1max = 40;
                    if (this.x + this.moveX < 70) this.x = 70;
                    else if (this.x + this.moveX > gameMap.width - 70) this.x = gameMap.width - 70;
                    else this.x += this.moveX;
                }
                if (this.moveY != 0)
                {
                    if (this.moveY < 0) this.engine4max = 40;
                    else if (this.moveY > 0) this.engine2max = 40;
                    if (this.y + this.moveY < 70) this.y = 70;
                    else if (this.y + this.moveY > gameMap.height - 70) this.y = gameMap.height - 70;
                    else this.y += this.moveY;
                }
                if (gameScreen == "game" && gameModal == null) mapHud ('bossItem', this.x, this.y);
                ctx = gameArea.ctx;
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 18;
                ctx.shadowOffsetY = 18;
                ctx.save ();
                ctx.translate (this.x, this.y);
                ctx.translate (-(this.width / 2), -(this.height / 2));
                ctx.lineWidth = 0;
                this.paths = [];
                this.paths.engine1 = new Path2D ();
                this.paths.engine1.rect (8, 21, 7, 28);
                this.canvas = document.createElement ("canvas");
                this.ctx = this.canvas.getContext ("2d");
                this.canvas.width = 7;
                this.canvas.height = 28;
                this.ctx.shadowColor = "#00000066";
                this.ctx.fillStyle = "#000";
                this.ctx.fillRect (0, 0, 7, 28);
                this.ctx.shadowColor = "transparent";
                this.ctx.fillStyle = "#4A4A4A";
                this.ctx.fillRect (0, 14, 7, 14);
                if (this.engine1Life == 0)
                {
                    this.ctx.clearRect (0, 0, 7, 3);
                    this.ctx.clearRect (0, 7, 7, 3);
                }
                this.pattern = ctx.createPattern (this.canvas, "repeat");
                ctx.fillStyle = this.pattern;
                ctx.fill (this.paths.engine1);
                this.paths.engine2 = new Path2D ();
                this.paths.engine2.rect (21, 8, 28, 7);
                this.ctx = this.canvas.getContext ("2d");
                this.canvas.width = 28;
                this.canvas.height = 7;
                this.ctx.shadowColor = "#00000066";
                this.ctx.fillStyle = "#000";
                this.ctx.fillRect (0, 0, 28, 7);
                this.ctx.shadowColor = "transparent";
                this.ctx.fillStyle = "#4A4A4A";
                this.ctx.fillRect (14, 0, 14, 7);
                if (this.engine2Life == 0) this.ctx.clearRect (0, 4, 7, 3);
                this.pattern = ctx.createPattern (this.canvas, "repeat");
                ctx.fillStyle = this.pattern;
                ctx.fill (this.paths.engine2);
                this.paths.boss = new Path2D ();
                this.paths.boss.rect (15, 15, 40, 40);
                ctx.shadowColor = "#00000066";
                ctx.fillStyle = "#8C3C94";
                ctx.fill (this.paths.boss);
                this.paths.engine3 = new Path2D ();
                this.paths.engine3.rect (55, 21, 7, 28);
                this.ctx = this.canvas.getContext ("2d");
                this.canvas.width = 7;
                this.canvas.height = 28;
                this.ctx.shadowColor = "#00000066";
                this.ctx.fillStyle = "#000";
                this.ctx.fillRect (0, 0, 7, 28);
                this.ctx.shadowColor = "transparent";
                this.ctx.fillStyle = "#4A4A4A";
                this.ctx.fillRect (0, 14, 7, 14);
                if (this.engine3Life == 0) this.ctx.clearRect (0, 4, 7, 3);
                this.pattern = ctx.createPattern (this.canvas, "repeat");
                ctx.fillStyle = this.pattern;
                ctx.fill (this.paths.engine3);
                this.paths.engine4 = new Path2D ();
                this.paths.engine4.rect (21, 55, 28, 7);
                this.ctx = this.canvas.getContext ("2d");
                this.canvas.width = 28;
                this.canvas.height = 7;
                this.ctx.shadowColor = "#00000066";
                this.ctx.fillStyle = "#000";
                this.ctx.fillRect (0, 0, 28, 7);
                this.ctx.shadowColor = "transparent";
                this.ctx.fillStyle = "#4A4A4A";
                this.ctx.fillRect (14, 0, 14, 7);
                if (this.engine4Life == 0) this.ctx.clearRect (7, 0, 7, 3);
                this.pattern = ctx.createPattern (this.canvas, "repeat");
                ctx.fillStyle = this.pattern;
                ctx.fill (this.paths.engine4);
                ctx.shadowColor = "transparent";
                ctx.fillStyle = "#4A4A4A";
                ctx.fillRect (22, 22, 26, 26);
                ctx.lineWidth = 6;
                ctx.beginPath ();
                ctx.moveTo (0, 0);
                ctx.lineTo (35, 35);
                ctx.strokeStyle = "#000";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.moveTo (35, 35);
                ctx.lineTo (53, 53);
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.strokeStyle = "#8C3C94";
                ctx.moveTo (53, 17);
                ctx.lineTo (17, 53);
                ctx.strokeStyle = "#8C3C94";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.shadowColor = "#00000066";
                ctx.moveTo (53, 17);
                ctx.lineTo (70, 0);
                ctx.moveTo (17, 53);
                ctx.lineTo (0, 70);
                ctx.moveTo (53, 53);
                ctx.lineTo (70, 70);
                ctx.stroke ();
                ctx.beginPath ();
                ctx.shadowColor = "transparent";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 3;
                ctx.moveTo (69, -1);
                ctx.lineTo (-1, 69);
                ctx.stroke ();
                if (this.engine1Life > 0)
                {
                    ctx.beginPath ();
                    ctx.fillStyle = "#D88F95EE";
                    ctx.ellipse (7, 35, 7, this.engine1, Math.PI * 0.50, 0, Math.PI);
                    ctx.fill ();
                    if (this.engine1inc)
                    {
                        this.engine1 += this.engine1max / 8;
                        if (this.engine1 == this.engine1max) this.engine1inc = false;
                    }
                    else
                    {
                        this.engine1 -= this.engine1max / 8;
                        if (this.engine1 == 0) this.engine1inc = true;
                    }
                }
                if (this.engine2Life > 0)
                {
                    ctx.beginPath ();
                    ctx.fillStyle = "#D88F95EE";
                    ctx.ellipse (35, 7, 7, this.engine2, 0, Math.PI, 0);
                    ctx.fill ();
                    if (this.engine2inc)
                    {
                        this.engine2 += this.engine2max / 8;
                        if (this.engine2 == this.engine2max) this.engine2inc = false;
                    }
                    else
                    {
                        this.engine2 -= this.engine2max / 8;
                        if (this.engine2 == 0) this.engine2inc = true;
                    }
                }
                ctx.shadowColor = "#00000044";
                if (this.engine3Life > 0)
                {
                    ctx.beginPath ();
                    ctx.fillStyle = "#D88F95EE";
                    ctx.ellipse (63, 35, 7, this.engine3, Math.PI * 0.50, 0, Math.PI, true);
                    ctx.fill ();
                    if (this.engine3inc)
                    {
                        this.engine3 += this.engine3max / 8;
                        if (this.engine3 == this.engine3max) this.engine3inc = false;
                    }
                    else
                    {
                        this.engine3 -= this.engine3max / 8;
                        if (this.engine3 == 0) this.engine3inc = true;
                    }
                }
                if (this.engine4Life > 0)
                {
                    ctx.beginPath ();
                    ctx.fillStyle = "#D88F95EE";
                    ctx.ellipse (35, 63, 7, this.engine4, 0, 0, Math.PI);
                    ctx.fill ();
                    if (this.engine4inc)
                    {
                        this.engine4 += this.engine4max / 8;
                        if (this.engine4 == this.engine4max) this.engine4inc = false;
                    }
                    else
                    {
                        this.engine4 -= this.engine4max / 8;
                        if (this.engine4 == 0) this.engine4inc = true;
                    }
                }
            }
            ctx.restore ();
            for (var gameShot in gameShots)
            {
                if (gameShots [gameShot].name.substring (0, 6) != "enemy-" && gameShots [gameShot].name != "boss")
                {
                    if (gameShots [gameShot].x >= this.x - 27 && gameShots [gameShot].x <= this.x - 20 + gameShots [gameShot].speed / 2 && gameShots [gameShot].y >= this.y - 14 && gameShots [gameShot].y <= this.y + 14 && this.z == 500) bossHit (gameShot, 1);
                    else if (gameShots [gameShot].x >= this.x - 14 && gameShots [gameShot].x <= this.x + 14 && gameShots [gameShot].y >= this.y - 27 && gameShots [gameShot].y <= this.y - 20 + gameShots [gameShot].speed / 2 && this.z == 500) bossHit (gameShot, 2);
                    else if (gameShots [gameShot].x >= this.x + 20 - gameShots [gameShot].speed / 2 && gameShots [gameShot].x <= this.x + 27 && gameShots [gameShot].y >= this.y - 14 && gameShots [gameShot].y <= this.y + 14 && this.z == 500) bossHit (gameShot, 3);
                    else if (gameShots [gameShot].x >= this.x - 14 && gameShots [gameShot].x <= this.x + 14 && gameShots [gameShot].y >= this.y + 20 - gameShots [gameShot].speed / 2 && gameShots [gameShot].y <= this.y + 27 && this.z == 500) bossHit (gameShot, 4);
                    else if (gameShots [gameShot].x >= this.x - 20 && gameShots [gameShot].x <= this.x + 20 && gameShots [gameShot].y >= this.y - 20 && gameShots [gameShot].y <= this.y + 20 && this.z == 500) bossHit (gameShot, 0);
                }
            }
            if (this.fire && (gameArea.frame - this.lastShotFrame >= this.weapons [this.weapon].fireRate))
            {
                if (this.weapon == 0)
                {
                    gameShots.push (new shot ("boss", 4, "black", this.x - this.width, this.y, 28, 3, 8, 0));
                    gameShots.push (new shot ("boss", 4, "black", this.x - this.width + 28, this.y, 28, 3, 8, 0));
                    gameShots.push (new shot ("boss", 4, "black", this.x, this.y - this.height, 28, 3, 8, 90));
                    gameShots.push (new shot ("boss", 4, "black", this.x, this.y - this.height + 28, 28, 3, 8, 90));
                    gameShots.push (new shot ("boss", 4, "black", this.x + this.width - 28, this.y, 28, 3, 8, 180));
                    gameShots.push (new shot ("boss", 4, "black", this.x + this.width, this.y, 28, 3, 8, 180));
                    gameShots.push (new shot ("boss", 4, "black", this.x, this.y + this.height - 28, 28, 3, 8, 270));
                    gameShots.push (new shot ("boss", 4, "black", this.x, this.y + this.height, 28, 3, 8, 270));
                }
                else if (this.weapon == 1) gameShots.push (new shot ("boss", 5, "#B2B2B2", this.x + 32 * Math.sin (this.shotHeading * Math.PI / 180), this.y - 32 * Math.cos (this.shotHeading * Math.PI / 180), 4, 4, 6, this.shotHeading));
                else if (this.weapon == 2)
                {
                    var shotHeading = Math.floor (Math.random () * 8) * 45;
                    gameShots.push (new shot ("boss", 0, "black", this.x + 32 * Math.sin (shotHeading * Math.PI / 180), this.y - 32 * Math.cos (shotHeading * Math.PI / 180), 24, 3, 12, shotHeading));
                }
                this.lastShotFrame = gameArea.frame;
            }
            this.shotHeading++;
            if (this.shotHeading == 360) this.shotHeading = 0;
        }
    }
}

function bossHit (gameShot, engine)
{
    var gameShip = gameShips.findIndex (ship => ship.name == gameShots [gameShot].name);
    gameShots [gameShot].hit = true;
    gameBoss.life -= 10;
    if (gameBoss.life == 0)
    {
        gameHits.push (new hit ("hit0", gameBoss.x, gameBoss.y, 80, 4));
        if (gameSound.active)
        {
            gameSound.sounds ["hit0"].stop ();
            gameSound.sounds ["hit0"].play ();
        }
        gameShips [gameShip].score += 5000;
        if (gameModal != null) gameCloseModal ();
        if (gameMusic.active) gameMusic.musics.boss.stop ();
        setTimeout
        (
            () =>
            {
                blackScreen = true
                $("#blackScreen").fadeIn (1000);
                setTimeout
                (
                    () =>
                    {
                        gameLoadScreen ("game_completed");
                    },
                    1000
                );
            },
            1000
        );
    }
    else
    {
        if (engine == 1)
        {
            if (gameBoss.engine1Life > 0) gameBoss.engine1Life -= 10;
            gameShots [gameShot].x = gameBoss.x - 23.5;
        }
        else if (engine == 2)
        {
            if (gameBoss.engine2Life > 0) gameBoss.engine2Life -= 10;
            gameShots [gameShot].y = gameBoss.y - 23.5;
        }
        else if (engine == 3)
        {
            if (gameBoss.engine3Life > 0) gameBoss.engine3Life -= 10;
            gameShots [gameShot].x = gameBoss.x + 23.5;
        }
        else if (engine == 4)
        {
            if (gameBoss.engine4Life > 0) gameBoss.engine4Life -= 10;
            gameShots [gameShot].y = gameBoss.y + 23.5;
        }
        gameHits.push (new hit (gameShots [gameShot].name, gameShots [gameShot].x, gameShots [gameShot].y, 20, 1));
        if (gameSound.active)
        {
            gameSound.sounds ["hit1"].stop ();
            gameSound.sounds ["hit1"].play ();
        }
        gameShips [gameShip].score += 100;
    }
}