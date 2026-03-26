function enemy (type, x, y, heading)
{
    this.id = gameEnemies.length;
    this.type = type;
    this.x = x;
    this.y = y;
    this.heading = heading || 0;
    this.fire = false;
    this.lastShotFrame = -50;
    if (this.type < 3) this.weapon = 0;
    else if (this.type == 4 || this.type == 5) this.weapon = 4;
    else if (this.type == 6) this.weapon = 5;

    if (this.type == 0)
    {
        this.width = 24;
        this.height = 33;
        this.engine = 0;
        this.engineInc = true;
        this.speed = 4.5;
    }
    else if (this.type == 1)
    {
        this.width = 27;
        this.height = 32;
        this.engine = 0;
        this.engineInc = true;
        this.speed = 6;
    }
    else if (this.type == 2)
    {
        this.width = 34;
        this.height = 34;
        this.engine = 100;
        this.engineInc = false;
        this.enemyColor = "#B2B2B2";
        this.speed = 3;
    }
    else if (this.type == 3)
    {
        this.width = 50;
        this.height = 40;
    }
    else if (this.type == 7)
    {
        this.width = 34;
        this.height = 32;
    }
    else if (this.type > 3)
    {
        this.width = 60;
        this.height = 62;
    }
    if (this.type < 3)
    {
        this.z = 500;
        this.move = this.speed;
        this.turn = 0;
        this.life = 10;
    }
    else if (this.type == 7)
    {
        this.z = 500;
        this.life = 10;
    }
    else
    {
        this.z = 0;
        this.life = 100;
    }

    this.firing = function (active)
    {
        if (this.z == 500) this.fire = active;
    }

    this.turning = function (turn)
    {
        if (this.z > 0)
        {
            if (turn == 0) this.turn = 0;
            else if (this.turn < 8 && this.turn > -8)
            {
                if (turn < 0 && this.turn == 0) this.turn = -4;
                else if (turn > 0 && this.turn == 0) this.turn = 4;
                this.turn += turn;
            }
        }
    }

    this.update = function ()
    {
        if (this.life > 0 && enemies > 0)
        {
            ctx = gameArea.ctx;
            if (this.type < 3 || this.type == 7)
            {
                if (this.type < 3)
                {
                    if (gameArea.frame % 15 == 0)
                    {
                        this.action = Math.floor (Math.random () * 5);
                        switch (this.action)
                        {
                            case 0:
                                this.turning (-1);
                                break;
                            case 1:
                                this.turning (0);
                                break;
                            case 2:
                                this.turning (1);
                                break;
                            case 3:
                                this.firing (true);
                                break;
                            case 4:
                                this.firing (false);
                                break;
                        }
                    }
                    this.enginemax = 4;
                    if (this.turn != 0) this.heading = (this.heading + this.turn) % 360;
                    this.radians = this.heading * Math.PI / 180;
                    if (this.move != 0)
                    {
                        this.x += this.move * Math.sin (this.radians);
                        this.y -= this.move * Math.cos (this.radians);
                        if (this.x < 0) this.x = gameMap.width;
                        else if (this.x > gameMap.width) this.x = 0;
                        if (this.y < 0) this.y = gameMap.height;
                        else if (this.y > gameMap.height) this.y = 0;
                        this.enginemax = this.speed / 1.5 * 8;
                    }
                }
                ctx.shadowColor = "#00000066";
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 18;
                ctx.shadowOffsetY = 18;    
            }
            else
            {
                if (this.type > 3)
                {
                    this.frameRate = Math.floor (Math.random () * 5);
                    if (gameArea.frame % (this.frameRate * 10) == 0)
                    {
                        if (this.fire) this.fire = false;
                        else this.fire = true;
                    } 
                }
                ctx.shadowColor = "transparent";
            }
            if (gameScreen == "game" && gameModal == null) mapHud ((this.type < 3 ? 'enemyItem' : this.type < 7 ? 'enemyItem2' : 'enemyItem3'), this.x, this.y, this.heading);
            ctx.save ();
            ctx.translate (this.x, this.y);
            if (this.type == 6) ctx.translate (4, 4);
            ctx.rotate (this.radians);
            ctx.translate (-(this.width / 2), -(this.height / 2));
            if (this.type == 0)
            {
                ctx.beginPath ();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#FFFFFFCC";
                ctx.fillStyle = "black";
                ctx.ellipse (6, 16.5, 16.5, 5, Math.PI * 0.50, 0, Math.PI);
                ctx.stroke ();
                ctx.fill ();
                ctx.beginPath ();
                ctx.ellipse (18, 16.5, 16.5, 5, Math.PI * 0.50, 0, Math.PI, true);
                ctx.stroke ();
                ctx.fill ();
                ctx.beginPath ();
                ctx.lineWidth = 2;
                ctx.arc (12, 20, 6, 0, 2 * Math.PI);
                ctx.strokeStyle = "#000000CC";
                ctx.stroke ();
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.shadowColor = "transparent";
                ctx.beginPath ();
                ctx.arc (12, 18, 3, 0, 2 * Math.PI);
                ctx.strokeStyle = "#C2C2C2";
                ctx.stroke ();
                ctx.fillStyle = "black";
                ctx.fill ();
                ctx.beginPath ();
                ctx.shadowColor = "#00000044";
                ctx.fillStyle = "#D88F95EE";
                ctx.ellipse (12, 29, 2, this.engine, 0, 0, Math.PI);
                ctx.fill ();
            }
            else if (this.type == 1)
            {
                ctx.beginPath ();
                ctx.strokeStyle = "#000000CC";
                ctx.lineWidth = 2;
                ctx.moveTo (12, 1);
                ctx.lineTo (14, 1);
                ctx.lineTo (18, 14);
                ctx.lineTo (25, 22);
                ctx.lineTo (25, 27);
                ctx.lineTo (22, 31);
                ctx.lineTo (4, 31);
                ctx.lineTo (1, 27);
                ctx.lineTo (1, 22);
                ctx.lineTo (8, 14);
                ctx.closePath ();
                ctx.stroke ();
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.beginPath ();
                ctx.shadowColor = "transparent";
                ctx.lineWidth = 0;
                ctx.moveTo (10.5, 6);
                ctx.lineTo (13, 6);
                ctx.lineTo (13, 28);
                ctx.lineTo (2, 28);
                ctx.lineTo (0, 26);
                ctx.lineTo (0, 23);
                ctx.lineTo (7.5, 14.5);
                ctx.closePath ();
                ctx.fillStyle = "#000";
                ctx.fill ();
                ctx.beginPath ();
                ctx.moveTo (13, 6);
                ctx.lineTo (15, 15);
                ctx.lineTo (22, 23);
                ctx.lineTo (22, 26);
                ctx.lineTo (20, 28);
                ctx.lineTo (6, 28);
                ctx.lineTo (4, 26);
                ctx.lineTo (4, 23);
                ctx.lineTo (11, 15);
                ctx.closePath ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.beginPath ();
                ctx.lineWidth = 3;
                ctx.moveTo (13, 24);
                ctx.lineTo (13, 28);
                ctx.strokeStyle = "black";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.shadowColor = "#00000044";
                ctx.fillStyle = "#D88F95EE";
                ctx.ellipse (9, 33, 2, this.engine, 0, 0, Math.PI);
                ctx.ellipse (17, 33, 2, this.engine, 0, 0, Math.PI);
                ctx.fill ();
            }
            else if (this.type == 2)
            {
                ctx.transform (this.engine / 100, 0, 0, 1, (this.width / 2) - (this.width * this.engine / 100 / 2), 0);
                if (this.engine > 2 && !this.engineInc) this.engine -= 2;
                else
                {
                    if (this.engine == 2)
                    {
                        this.engineInc = true;
                        if (this.enemyColor == "#B2B2B2") this.enemyColor = "#777";
                        else this.enemyColor = "#B2B2B2";
                    }
                    if (this.engine < 100 && this.engineInc) this.engine += 2;
                    else if (this.engine == 100) this.engineInc = false;
                }
                ctx.beginPath ();
                ctx.lineWidth = 8;
                ctx.arc (17, 17, 13, 0, 2 * Math.PI);
                ctx.strokeStyle = "#000000CC";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = 4;
                ctx.moveTo (17, 7);
                ctx.lineTo (17, 27);
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = 2;
                ctx.moveTo (15, 23);
                ctx.lineTo (12, 12);
                ctx.lineTo (8, 22);
                ctx.moveTo (19, 23);
                ctx.lineTo (22, 12);
                ctx.lineTo (26, 22);
                ctx.stroke ();
                ctx.shadowColor = "transparent";
                ctx.beginPath ();
                ctx.lineWidth = 5;
                ctx.arc (17, 17, 13, 0, 2 * Math.PI);
                ctx.strokeStyle = this.enemyColor;
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = 2;
                ctx.moveTo (17, 6);
                ctx.lineTo (17, 28);
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = 1;
                ctx.moveTo (16, 24);
                ctx.lineTo (12, 12);
                ctx.lineTo (8, 22);
                ctx.moveTo (18, 24);
                ctx.lineTo (22, 12);
                ctx.lineTo (26, 22);
                ctx.stroke ();
            }
            else if (this.type == 3)
            {
                ctx.beginPath ();                
                ctx.moveTo (9, 31);
                ctx.arcTo (5, 31, 5, 28, 8);
                ctx.lineTo (5, 13);
                ctx.arcTo (5, 5, 8, 5, 8);
                ctx.lineTo (22, 5);
                ctx.moveTo (22, 7);
                ctx.lineTo (28, 7);
                ctx.moveTo (28, 5);
                ctx.lineTo (37, 5);
                ctx.arcTo (41, 5, 41, 8, 8);
                ctx.lineTo (41, 28);
                ctx.arcTo (41, 31, 38, 31, 8);
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.moveTo (13, 35);
                ctx.arcTo (9, 35, 9, 32, 8);
                ctx.lineTo (9, 16);
                ctx.arcTo (9, 8, 12, 8, 8);
                ctx.lineTo (22, 8);
                ctx.moveTo (14, 15);
                ctx.lineTo (36, 15);
                ctx.moveTo (31, 8);
                ctx.lineTo (41, 8);
                ctx.arcTo (45, 8, 45, 12, 8);
                ctx.lineTo (45, 32);
                ctx.arcTo (45, 35, 42, 35, 8);
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#000";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.moveTo (11, 33);
                ctx.arcTo (7, 33, 7, 30, 8);
                ctx.moveTo (7, 23);
                ctx.lineTo (7, 21);
                ctx.moveTo (7, 20);
                ctx.lineTo (7, 18);
                ctx.moveTo (7, 17);
                ctx.lineTo (7, 15);
                ctx.moveTo (7, 13);
                ctx.arcTo (7, 7, 8, 7, 6);
                ctx.lineTo (19, 7);
                ctx.moveTo (22, 9);
                ctx.lineTo (28, 9);
                ctx.moveTo (31, 7);
                ctx.lineTo (38, 7);
                ctx.arcTo (43, 7, 43, 8, 6);
                ctx.moveTo (43, 15);
                ctx.lineTo (43, 17);
                ctx.moveTo (43, 18);
                ctx.lineTo (43, 20);
                ctx.moveTo (43, 21);
                ctx.lineTo (43, 23);
                ctx.moveTo (43, 25);
                ctx.arcTo (43, 33, 40, 33, 8);
                ctx.lineWidth = 8;
                ctx.strokeStyle = "#B2B2B2";
                ctx.stroke ();
            }
            else if (this.type == 4)
            {
                ctx.shadowColor = "transparent";
                ctx.translate (-8, 10);
                ctx.rotate (-(45 * Math.PI / 180));
                ctx.beginPath ();
                ctx.strokeStyle = "#000000CC";
                ctx.lineWidth = 2;
                ctx.lineTo (13, 1);
                ctx.lineTo (18, 11);
                ctx.lineTo (25, 19);
                ctx.lineTo (25, 24);
                ctx.lineTo (22, 28);
                ctx.lineTo (4, 28);
                ctx.lineTo (1, 24);
                ctx.lineTo (1, 19);
                ctx.lineTo (8, 11);
                ctx.closePath ();
                ctx.stroke ();
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.beginPath ();
                ctx.moveTo (13, 6);
                ctx.lineTo (15, 12);
                ctx.lineTo (22, 20);
                ctx.lineTo (22, 23);
                ctx.lineTo (20, 25);
                ctx.lineTo (6, 25);
                ctx.lineTo (4, 23);
                ctx.lineTo (4, 20);
                ctx.lineTo (11, 12);
                ctx.closePath ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.translate (54, 28);
                ctx.rotate (90 * Math.PI / 180);
                ctx.beginPath ();
                ctx.strokeStyle = "#000000CC";
                ctx.lineWidth = 2;
                ctx.lineTo (13, 1);
                ctx.lineTo (18, 11);
                ctx.lineTo (25, 19);
                ctx.lineTo (25, 24);
                ctx.lineTo (22, 28);
                ctx.lineTo (4, 28);
                ctx.lineTo (1, 24);
                ctx.lineTo (1, 19);
                ctx.lineTo (8, 11);
                ctx.closePath ();
                ctx.stroke ();
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.beginPath ();
                ctx.lineWidth = 0;
                ctx.moveTo (13, 6);
                ctx.lineTo (16, 6);
                ctx.lineTo (19, 12);
                ctx.lineTo (26, 20);
                ctx.lineTo (26, 24);
                ctx.lineTo (13, 24);
                ctx.closePath ();
                ctx.fillStyle = "#000";
                ctx.fill ();
                ctx.beginPath ();
                ctx.moveTo (13, 6);
                ctx.lineTo (15, 12);
                ctx.lineTo (22, 20);
                ctx.lineTo (22, 23);
                ctx.lineTo (20, 25);
                ctx.lineTo (6, 25);
                ctx.lineTo (4, 23);
                ctx.lineTo (4, 20);
                ctx.lineTo (11, 12);
                ctx.closePath ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.translate (56, 29.5);
                ctx.rotate (90 * Math.PI / 180);
                ctx.beginPath ();
                ctx.strokeStyle = "#000000CC";
                ctx.lineWidth = 2;
                ctx.lineTo (13, 1);
                ctx.lineTo (18, 11);
                ctx.lineTo (25, 19);
                ctx.lineTo (25, 24);
                ctx.lineTo (22, 28);
                ctx.lineTo (4, 28);
                ctx.lineTo (1, 24);
                ctx.lineTo (1, 19);
                ctx.lineTo (8, 11);
                ctx.closePath ();
                ctx.stroke ();
                ctx.fillStyle = "#000";
                ctx.fill ();
                ctx.beginPath ();
                ctx.moveTo (13, 6);
                ctx.lineTo (15, 12);
                ctx.lineTo (22, 20);
                ctx.lineTo (22, 23);
                ctx.lineTo (20, 25);
                ctx.lineTo (6, 25);
                ctx.lineTo (4, 23);
                ctx.lineTo (4, 20);
                ctx.lineTo (11, 12);
                ctx.closePath ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.translate (54.5, 28);
                ctx.rotate (90 * Math.PI / 180);
                ctx.beginPath ();
                ctx.strokeStyle = "#000000CC";
                ctx.lineWidth = 2;
                ctx.lineTo (13, 1);
                ctx.lineTo (18, 11);
                ctx.lineTo (25, 19);
                ctx.lineTo (25, 24);
                ctx.lineTo (22, 28);
                ctx.lineTo (4, 28);
                ctx.lineTo (1, 24);
                ctx.lineTo (1, 19);
                ctx.lineTo (8, 11);
                ctx.closePath ();
                ctx.stroke ();
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.beginPath ();
                ctx.lineWidth = 0;
                ctx.moveTo (10.5, 6);
                ctx.lineTo (13, 6);
                ctx.lineTo (13, 24);
                ctx.lineTo (2, 24);
                ctx.lineTo (0, 22);
                ctx.lineTo (0, 19);
                ctx.lineTo (7.5, 10.5);
                ctx.closePath ();
                ctx.fillStyle = "#000";
                ctx.fill ();
                ctx.beginPath ();
                ctx.moveTo (13, 6);
                ctx.lineTo (15, 12);
                ctx.lineTo (22, 20);
                ctx.lineTo (22, 23);
                ctx.lineTo (20, 25);
                ctx.lineTo (6, 25);
                ctx.lineTo (4, 23);
                ctx.lineTo (4, 20);
                ctx.lineTo (11, 12);
                ctx.closePath ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.rotate (135 * Math.PI / 180);
                ctx.translate (-10.5, -70);
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 4;
                ctx.beginPath ();
                ctx.moveTo (4, 3);
                ctx.lineTo (57, 58);
                ctx.moveTo (56, 3);
                ctx.lineTo (4, 58);
                ctx.stroke ();
                ctx.lineWidth = 1;
                ctx.beginPath ();
                ctx.arc (this.width / 2, this.height / 2, 11, 0, 2 * Math.PI);
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
                ctx.stroke ();
                ctx.lineWidth = 4;
                ctx.beginPath ();
                ctx.arc (this.width / 2, this.height / 2, 6, 0, 2 * Math.PI);
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.stroke ();
            }
            else if (this.type == 5)
            {
                ctx.shadowColor = "transparent";
                ctx.beginPath ();
                ctx.lineWidth = 0;
                ctx.moveTo (20, 0);
                ctx.lineTo (40, 0);
                ctx.lineTo (60, 20);
                ctx.lineTo (60, 42);
                ctx.lineTo (40, 62);
                ctx.lineTo (20, 62);
                ctx.lineTo (0, 42);
                ctx.lineTo (0, 20);
                ctx.closePath ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.fillStyle = "#000";
                ctx.fillRect (26, 0, 8, 4);
                ctx.fillRect (0, 27, 4, 8);
                ctx.fillRect (56, 27, 4, 8);
                ctx.fillRect (26, 58, 8, 4);
                ctx.beginPath ();
                ctx.arc (16, 8, 5, 0, 2 * Math.PI);
                ctx.arc (8, 16, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (20, 12, 5, 0, 2 * Math.PI);
                ctx.arc (12, 20, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (44, 8, 5, 0, 2 * Math.PI);
                ctx.arc (52, 16, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (40, 12, 5, 0, 2 * Math.PI);
                ctx.arc (48, 20, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (16, 54, 5, 0, 2 * Math.PI);
                ctx.arc (8, 46, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (20, 50, 5, 0, 2 * Math.PI);
                ctx.arc (12, 42, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (44, 54, 5, 0, 2 * Math.PI);
                ctx.arc (52, 46, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.beginPath ();
                ctx.arc (40, 50, 5, 0, 2 * Math.PI);
                ctx.arc (48, 42, 5, 0, 2 * Math.PI);
                ctx.fill ();
                ctx.translate (30, 20);
                ctx.rotate (45 * Math.PI / 180);
                ctx.beginPath ();
                ctx.roundRect (0, 0, 16, 16, 4);
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#222";
                ctx.stroke ();
                ctx.rotate (-45 * Math.PI / 180);
                ctx.fillStyle = "#4A4A4A";
                ctx.fillRect (-4, 7, 8, 2);
                ctx.fillRect (-4, 13, 8, 2);
                ctx.translate (-15, -22);
                ctx.rotate (45 * Math.PI / 180);
                ctx.beginPath ();
                ctx.roundRect (0, 0, 19, 24, 8);
                ctx.moveTo (0, 12);
                ctx.lineTo (20, 12);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.rotate (-45 * Math.PI / 180);
                ctx.translate (17, 13);
                ctx.rotate (-45 * Math.PI / 180);
                ctx.beginPath ();
                ctx.roundRect (0, 0, 19, 24, 8);
                ctx.moveTo (0, 12);
                ctx.lineTo (20, 12);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.rotate (45 * Math.PI / 180);
                ctx.translate (-34, 36);
                ctx.rotate (-45 * Math.PI / 180);
                ctx.beginPath ();
                ctx.roundRect (0, 0, 19, 24, 8);
                ctx.moveTo (0, 12);
                ctx.lineTo (20, 12);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.rotate (45 * Math.PI / 180);
                ctx.translate (51, -13);
                ctx.rotate (45 * Math.PI / 180);
                ctx.beginPath ();
                ctx.roundRect (0, 0, 19, 24, 8);
                ctx.moveTo (0, 12);
                ctx.lineTo (20, 12);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.rotate (-45 * Math.PI / 180);
            }
            else if (this.type == 6)
            {
                ctx.shadowColor = "transparent";
                ctx.beginPath ();
                ctx.lineWidth = 8;
                ctx.moveTo (0, 2);
                ctx.lineTo (0, 50);
                ctx.lineTo (10, 52);
                ctx.lineTo (10, 45);
                ctx.lineTo (42, 45);
                ctx.lineTo (42, 52);
                ctx.lineTo (52, 50);
                ctx.lineTo (52, 2);
                ctx.lineTo (42, 0);
                ctx.lineTo (42, 7);
                ctx.lineTo (10, 7);
                ctx.lineTo (10, 0);
                ctx.closePath ();
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.fillStyle = "#B2B2B2";
                ctx.fill ();
                ctx.beginPath ();
                ctx.lineWidth = 2;
                ctx.moveTo (0, 9);
                ctx.lineTo (10, 7);
                ctx.moveTo (0, 19);
                ctx.lineTo (10, 15);
                ctx.lineTo (42, 15);
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.moveTo (42, 7);
                ctx.lineTo (52, 9);
                ctx.moveTo (42, 15);
                ctx.lineTo (52, 19);
                ctx.moveTo (0, 33);
                ctx.lineTo (10, 37);
                ctx.lineTo (42, 37);
                ctx.lineTo (52, 33);
                ctx.moveTo (0, 43);
                ctx.lineTo (10, 45);
                ctx.moveTo (42, 45);
                ctx.lineTo (52, 43);
                ctx.strokeStyle = "#000";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = 4;
                ctx.moveTo (12, 0);
                ctx.lineTo (12, 7);
                ctx.moveTo (0, 52);
                ctx.lineTo (12, 54);
                ctx.lineTo (12, 47);
                ctx.lineTo (42, 47);
                ctx.moveTo (42, 54);
                ctx.lineTo (54, 52);
                ctx.lineTo (54, 2);
                ctx.stroke ();
                ctx.translate (this.width / 2 - 4, this.height / 2 - 5);
                ctx.rotate (this.heading * Math.PI / 180);
                this.heading++;
                if (this.heading == 360) this.heading = 0;
                ctx.fillStyle = "#000";
                ctx.fillRect (-4, -16, 8, 5);
                ctx.beginPath ();
                ctx.lineWidth = 3;
                ctx.arc (0, 0, 5, 0, Math.PI);
                ctx.moveTo (-5, 0);
                ctx.lineTo (-5, -10);
                ctx.lineTo (5, -10);
                ctx.lineTo (5, 0);
                ctx.strokeStyle = "#222";
                ctx.stroke ();
            }
            else if (this.type == 7)
            {
                ctx.translate  (this.width / 2, this.height / 2);
                ctx.shadowColor = "transparent";
                ctx.beginPath ();
                ctx.lineWidth = 4;
                ctx.arc (0, 0, 8, 0, 2 * Math.PI);
                ctx.strokeStyle = "#4A4A4A";
                ctx.stroke ();
                ctx.shadowColor = "#00000066";
                ctx.fillStyle = "#000";
                ctx.fill ();
                ctx.beginPath ();
                ctx.moveTo (6, 0);
                ctx.lineTo (17, 0);
                ctx.moveTo (-6, 0);
                ctx.lineTo (-17, 0);
                ctx.moveTo (0, 6);
                ctx.lineTo (0, 16);
                ctx.moveTo (0, -6);
                ctx.lineTo (0, -16);
                ctx.moveTo (5, 5);
                ctx.lineTo (12, 12);
                ctx.moveTo (-5, -5);
                ctx.lineTo (-12, -12);
                ctx.moveTo (-5, 5);
                ctx.lineTo (-12, 12);
                ctx.moveTo (5, -5);
                ctx.lineTo (12, -12);
                ctx.strokeStyle = "#B2B2B2";
                ctx.stroke ();
                ctx.beginPath ();
                ctx.lineWidth = 0;
                ctx.arc (0, 0, 2, 0, 2 * Math.PI);
                ctx.shadowColor = "transparent";
                ctx.fillStyle = "#4A4A4A";
                ctx.fill ();
            }
            if (this.type < 2)
            {
                if (this.engineInc)
                {
                    if (this.engine < this.enginemax) this.engine += 0.25 * this.enginemax;
                    else this.engineInc = false;
                }
                else
                {
                    if (this.engine > 0) this.engine -= 0.25 * this.enginemax;
                    else this.engineInc = true;
                }
            }
            ctx.restore ();

            for (var gameShot in gameShots)
            {
                if (gameShots [gameShot].name.substring (0, 6) != "enemy-" && gameShots [gameShot].name != "boss")
                {
                    var dx = this.x - gameShots [gameShot].x;
                    var dy = this.y - gameShots [gameShot].y;
                    if ((this.type < 3 && Math.sqrt (dx * dx + dy * dy) < 18) || (this.type == 3 && Math.sqrt (dx * dx + dy * dy) < 24) || (this.type > 3 && this.type < 7 && Math.sqrt (dx * dx + dy * dy) < 30) || (this.type == 7 && Math.sqrt (dx * dx + dy * dy) < 17))
                    {
                        var gameShip = gameShips.findIndex (ship => ship.name == gameShots [gameShot].name);
                        gameShots [gameShot].hit = true;
                        this.life -= 10;
                        if (this.life == 0)
                        {
                            gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
                            if (gameSound.active)
                            {
                                gameSound.sounds ["hit0"].stop ();
                                gameSound.sounds ["hit0"].play ();
                            }
                            if (this.type < 3)
                            {
                                enemies--;
                                if (gameShip > -1) gameShips [gameShip].score += 500;
                            }
                            else if (this.type < 7)
                            {
                                enemies -= 4;
                                if (gameShip > -1) gameShips [gameShip].score += 1000;
                            }
                            if (enemies < 0) enemies = 0;
                            if (this.type < 3) gameEnemies.push (new enemy (Math.floor (Math.random () * 3), Math.floor (Math.random () * gameMap.width), Math.floor (Math.random () * gameMap.height), Math.floor (Math.random () * 720) - 360));
                            if (this.type < 7) gameItems.push (new item (this.type, this.x, this.y));
                        }
                        else
                        {
                            gameHits.push (new hit (gameShots [gameShot].name, gameShots [gameShot].x, gameShots [gameShot].y, 20, 1));
                            if (gameSound.active)
                            {
                                gameSound.sounds ["hit1"].stop ();
                                gameSound.sounds ["hit1"].play ();
                            }
                            if (players [0].name == gameShots [gameShot].name && this.type < 7)
                            {
                                if (enemies > 0) enemies--;
                                if (gameShip > -1)
                                {
                                    if (gameModes.findIndex (mode => mode.active == true) == 3)
                                    {
                                        gameShips [gameShip].xp++;
                                        if (gameShips [gameShip].xp > 10000) gameShips [gameShip].xp = 10000;
                                    }
                                    else gameShips [gameShip].score += 100;
                                }
                            }
                        }
                    }
                }
            }
            if (this.fire && (gameArea.frame - this.lastShotFrame) >= 50)
            {
                if (this.weapon == 0) gameShots.push (new shot ("enemy-" + this.id, this.weapon, "black", this.x + (this.height / 2 + 24) * Math.sin (this.heading * Math.PI / 180), this.y - (this.height / 2 + 24) * Math.cos (this.heading * Math.PI / 180), 24, 3, 12, this.heading));
                else if (this.weapon == 4)
                {
                    if (this.type == 4) var startHeading = -45;
                    else if (this.type == 5) var startHeading = 0;
                    gameShots.push (new shot ("enemy-" + this.id, this.weapon, "black", this.x + (this.height / 2 + 28) * Math.sin ((this.heading + startHeading) * Math.PI / 180), this.y - (this.height / 2 + 28) * Math.cos ((this.heading + startHeading) * Math.PI / 180), 28, 3, 8, this.heading + startHeading));
                    gameShots.push (new shot ("enemy-" + this.id, this.weapon, "black", this.x + (this.width / 2 + 28) * Math.sin ((this.heading + startHeading + 90) * Math.PI / 180), this.y - (this.width / 2 + 28) * Math.cos ((this.heading + startHeading + 90) * Math.PI / 180), 28, 3, 8, this.heading + startHeading + 90));
                    gameShots.push (new shot ("enemy-" + this.id, this.weapon, "black", this.x + (this.height / 2 + 28) * Math.sin ((this.heading + startHeading + 180) * Math.PI / 180), this.y - (this.height / 2 + 28) * Math.cos ((this.heading + startHeading + 180) * Math.PI / 180), 28, 3, 8, this.heading + startHeading + 180));
                    gameShots.push (new shot ("enemy-" + this.id, this.weapon, "black", this.x + (this.width / 2 + 28) * Math.sin ((this.heading + startHeading + 270) * Math.PI / 180), this.y - (this.width / 2 + 28) * Math.cos ((this.heading + startHeading + 270) * Math.PI / 180), 28, 3, 8, this.heading + startHeading + 270));
                }
                else if (this.weapon == 5) gameShots.push (new shot ("enemy-" + this.id, this.weapon, "#B2B2B2", this.x + 16 * Math.sin (this.heading * Math.PI / 180), this.y - 16 * Math.cos (this.heading * Math.PI / 180), 4, 4, 6, this.heading));
                this.lastShotFrame = gameArea.frame;
            }
        }
        else if (this.life > 0 && enemies == 0)
        {
            this.life = 0;
            gameHits.push (new hit ("hit0", this.x, this.y, 40, 2));
            if (gameSound.active)
            {
                gameSound.sounds ["hit0"].stop ();
                gameSound.sounds ["hit0"].play ();
            }
        }
    }
}