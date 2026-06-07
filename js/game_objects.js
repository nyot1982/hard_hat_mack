function audio (src, loop)
{
    this.src = src;
    this.loop = loop;
    this.audio = new Audio (this.src);
    this.audioCtx = new AudioContext ();
    this.buffer;
    this.source = this.audioCtx.createBufferSource (this.audio);
    this.source.connect (this.audioCtx.destination);
    this.audio.addEventListener
    (
        "loadeddata",
        () =>
        {
            this.duration = this.audio.duration;
        }
    )

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
}

function back (type, color, x, y, width, height)
{
    this.type = type;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        ctx = gameArea.ctx;
        ctx.beginPath ();
        if (this.type == "pattern")
        {
            this.image = new Image ();
            this.image.src = this.color;
            this.pattern = ctx.createPattern (this.image, "repeat");
            ctx.rect (this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.pattern;
            ctx.fill ();
        }
        else
        {
            ctx.rect (this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill ();
        }
    }
}

function player (type, name, x, y, width, height, heading, speedX, speedY, brake, bounce)
{
    this.type = (type != null ? type : 0);
    this.name = name || null;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = (width != null ? width : 0);
    this.height = (height != null ? height : 0);
    this.heading = (heading != null ? heading : 1);
    this.speedX = (speedX != null ? speedX : 0);
    this.speedY = (speedY != null ? speedY : 0);
    this.brake = (brake != null ? brake : 0.01);
    this.bounce = (bounce != null ? bounce : 0.75);

    this.update = function (idPlayer)
    {
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.scale (-this.heading, 1);
        ctx.translate (this.x - (this.heading == 1 ? this.width : 0), this.y);
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath ();
        ctx.moveTo (10, 0);
        ctx.lineTo (18, 0);
        ctx.lineTo (18, 2);
        ctx.lineTo (20, 2);
        ctx.lineTo (20, 4);
        ctx.lineTo (22, 4);
        ctx.lineTo (22, 8);
        ctx.lineTo (14, 8);
        ctx.lineTo (14, 10);
        ctx.lineTo (8, 10);
        ctx.lineTo (8, 8);
        ctx.lineTo (2, 8);
        ctx.lineTo (2, 6);
        ctx.lineTo (6, 6);
        ctx.lineTo (6, 4);
        ctx.lineTo (8, 4);
        ctx.lineTo (8, 2);
        ctx.lineTo (10, 2);
        ctx.closePath ();
        ctx.fill ();
        ctx.fillRect (0, 16, 4, 4);
        ctx.beginPath ();
        ctx.moveTo (20, 22);
        ctx.lineTo (24, 22);
        ctx.lineTo (24, 24);
        ctx.lineTo (26, 24);
        ctx.lineTo (26, 30);
        ctx.lineTo (20, 30);
        ctx.lineTo (20, 26);
        ctx.lineTo (16, 26);
        ctx.lineTo (16, 24);
        ctx.lineTo (20, 24);
        ctx.closePath ();
        ctx.fill ();
        ctx.beginPath ();
        ctx.moveTo (20, 22);
        ctx.lineTo (24, 22);
        ctx.lineTo (24, 24);
        ctx.lineTo (26, 24);
        ctx.lineTo (26, 30);
        ctx.lineTo (20, 30);
        ctx.lineTo (20, 26);
        ctx.lineTo (16, 26);
        ctx.lineTo (16, 24);
        ctx.lineTo (20, 24);
        ctx.closePath ();
        ctx.fill ();
        ctx.beginPath ();
        ctx.moveTo (4, 24);
        ctx.lineTo (10, 24);
        ctx.lineTo (10, 26);
        ctx.lineTo (8, 26);
        ctx.lineTo (8, 30);
        ctx.lineTo (2, 30);
        ctx.lineTo (2, 28);
        ctx.lineTo (4, 28);
        ctx.closePath ();
        ctx.fill ();
        ctx.fillStyle = "#FF55FF";
        ctx.beginPath ();
        ctx.moveTo (14, 8);
        ctx.lineTo (18, 8);
        ctx.lineTo (18, 14);
        ctx.lineTo (12, 14);
        ctx.lineTo (12, 12);
        ctx.lineTo (8, 12);
        ctx.lineTo (8, 10);
        ctx.lineTo (14, 10);
        ctx.closePath ();
        ctx.fill ();
        ctx.fillRect (8, 20, 14, 2);
        ctx.fillRect (4, 22, 16, 2);
        ctx.fillStyle = "#55FFFF";
        ctx.fillRect (2, 14, 2, 2);
        ctx.fillRect (10, 14, 10, 6);
        ctx.fillRect (4, 16, 6, 4);
        ctx.restore ();
    }

    this.newPos = function ()
    {
        if (this.speedX == 0) this.brake = 0;
        else if (this.speedX > 0)
        {
            this.heading = 1;
            this.speedX -= this.brake;
        }
        else if (this.speedX < 0)
        {
            this.heading = -1;
            this.speedX += this.brake;
        }
        this.speedY += gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom ();
    }

    this.hitBottom = function ()
    {
        var rockY = canvasHeight - this.height,
            rockX = canvasWidth - this.width;
        
        if (this.x < 0 || this.x > rockX)
        {
            if (this.x < 0) this.x = 0;
            else this.x = rockX;
            this.speedX = 0;
        }
        if (this.y < 0 || this.y > rockY)
        {
            if (this.y < 0) this.y = 0;
            else this.y = rockY;
            this.speedY = -(this.speedY * this.bounce);
        }
    }

    this.drill = function (drilling)
    {
    }
}

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
        else if (this.type == "text")
        {
            ctx.textAlign = this.width;
            ctx.textBaseline = "middle";
            ctx.font = this.height + "px PressStart2P";
            
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
}