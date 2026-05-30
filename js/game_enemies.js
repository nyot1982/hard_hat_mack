function enemy (type, x, y, heading)
{
    this.id = gameEnemies.length;
    this.type = type;
    this.x = x;
    this.y = y;
    this.heading = heading || 0;
    this.fire = false;
    this.lastShotFrame = -50;
    this.weapon = 0;
    if (this.type == 0)
    {
        this.width = 24;
        this.height = 33;
        this.speed = 4.5;
    }
    else if (this.type == 1)
    {
        this.width = 27;
        this.height = 32;
        this.speed = 6;
    }
    else if (this.type == 2)
    {
        this.width = 34;
        this.height = 34;
        this.speed = 3;
    }
    this.move = this.speed;
    this.life = 10;

    this.firing = function (active)
    {
        this.fire = active;
    }

    this.update = function ()
    {
        if (this.life > 0)
        {
            ctx = gameArea.ctx;
            if (gameArea.frame % 15 == 0)
            {
                this.action = Math.floor (Math.random () * 5);
                switch (this.action)
                {
                    case 3:
                        this.firing (true);
                        break;
                    case 4:
                        this.firing (false);
                        break;
                }
            }
            this.radians = this.heading * Math.PI / 180;
            if (this.move != 0)
            {
                this.x += this.move * Math.sin (this.radians);
                this.y -= this.move * Math.cos (this.radians);
                if (this.x < 0) this.x = gameMap.width;
                else if (this.x > gameMap.width) this.x = 0;
                if (this.y < 0) this.y = gameMap.height;
                else if (this.y > gameMap.height) this.y = 0;
            }
            ctx.save ();
            ctx.translate (this.x, this.y);
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
                ctx.beginPath ();
                ctx.arc (12, 18, 3, 0, 2 * Math.PI);
                ctx.strokeStyle = "#C2C2C2";
                ctx.stroke ();
                ctx.fillStyle = "black";
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
            }
            else if (this.type == 2)
            {
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
                ctx.beginPath ();
                ctx.lineWidth = 5;
                ctx.arc (17, 17, 13, 0, 2 * Math.PI);
                ctx.strokeStyle = "#B2B2B2";
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
            ctx.restore ();
        }
        else if (this.life > 0)
        {
            this.life = 0;
            if (gameSound.active)
            {
                gameSound.sounds ["hit0"].stop ();
                gameSound.sounds ["hit0"].play ();
            }
        }
    }
}