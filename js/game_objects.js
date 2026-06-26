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

function back (color, x, y, width, height)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        ctx = gameArea.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }
}

function floor (color, x, y, width, height)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.update = function ()
    {
        const patternCanvas = document.createElement ("canvas");
        const patternContext = patternCanvas.getContext ("2d");
        patternCanvas.width = 4;
        patternCanvas.height = 6;
        patternContext.fillStyle = this.color;
        patternContext.fillRect (0, 0, 2, 2);
        patternContext.fillRect (2, 2, 2, 4);
        ctx = gameArea.ctx;
        this.pattern = ctx.createPattern (patternCanvas, "repeat");
        ctx.fillStyle = this.pattern;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }
}

function beam (color1, color2, x, y, width, height)
{
    this.color1 = color1;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 16;

    this.update = function ()
    {
        if (this.width - 12 > 0)
        {
            ctx = gameArea.ctx;
            ctx.fillStyle = this.color1;
            ctx.fillRect (this.x, this.y, this.width, 4);
            ctx.fillRect (this.x, this.y + 12, this.width, 4);
            ctx.fillStyle = this.color2;
            ctx.fillRect (this.x + 6, this.y + 4, this.width - 12, 8);
            for (var x = 28; x + 7 < this.width; x += 62)
            {
                ctx.fillStyle = "black";
                ctx.fillRect (this.x + x, this.y + 6, 6, 4);
                ctx.fillRect (this.x + x + 16, this.y + 6, 6, 4);
            }
        }
    }
}

function player (type, name, x, y, width, height, heading, speedX, speedY, bounce)
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
    this.bounce = (bounce != null ? bounce : 0);
    this.moveX = 0;
    this.moveY = 0;

    this.update = function (idPlayer)
    {
        if (gameScreen == "game") this.newPos ();
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.scale (this.heading, 1);
        ctx.translate (this.x * this.heading - (this.heading == -1 ? this.width : 0), this.y);
        ctx.fillStyle = "#FFFFFF";
        switch (this.type)
        {
            case 0:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (22, 16, 4, 4);
                ctx.fillRect (2, 22, 4, 2);
                ctx.fillRect (0, 24, 10, 2);
                ctx.fillRect (0, 26, 6, 4);
                ctx.fillRect (16, 24, 6, 2);
                ctx.fillRect (18, 26, 4, 2);
                ctx.fillRect (18, 28, 6, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 14, 2);
                ctx.fillRect (6, 22, 16, 2);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (6, 14, 10, 6);
                ctx.fillRect (16, 16, 6, 4);
                ctx.fillRect (22, 14, 2, 2);
            break;
            case 2:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (4, 24, 6, 4);
                ctx.fillRect (4, 28, 8, 2);
                ctx.fillRect (18, 24, 8, 2);
                ctx.fillRect (20, 26, 6, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 18, 4);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (6, 14, 14, 6);
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect (10, 16, 6, 2);
                ctx.fillRect (10, 18, 10, 2);
            break;
            case 1:
            case 3:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (22, 12, 4, 4);
                ctx.fillRect (8, 24, 8, 2);
                ctx.fillRect (8, 26, 6, 2);
                ctx.fillRect (8, 28, 10, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 8, 2);
                ctx.fillRect (8, 20, 10, 4);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (6, 14, 10, 6);
                ctx.fillRect (16, 14, 4, 4);
                ctx.fillRect (18, 12, 4, 4);
                ctx.fillRect (22, 10, 2, 2);
            break;
            case 4:
                ctx.fillRect (8, 0, 4, 2);
                ctx.fillRect (14, 0, 4, 2);
                ctx.fillRect (6, 2, 6, 2);
                ctx.fillRect (14, 2, 6, 2);
                ctx.fillRect (6, 4, 14, 2);
                ctx.fillRect (4, 6, 18, 2);
                ctx.fillRect (2, 12, 6, 4);
                ctx.fillRect (18, 12, 6, 4);
                ctx.fillRect (4, 16, 4, 2);
                ctx.fillRect (18, 16, 4, 2);
                ctx.fillRect (8, 18, 4, 2);
                ctx.fillRect (14, 18, 4, 2);
                ctx.fillRect (8, 24, 4, 2);
                ctx.fillRect (14, 24, 4, 2);
                ctx.fillRect (4, 26, 6, 2);
                ctx.fillRect (16, 26, 6, 2);
                ctx.fillRect (2, 28, 8, 2);
                ctx.fillRect (16, 28, 8, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 10, 4);
                ctx.fillRect (8, 20, 10, 4);
                ctx.fillRect (4, 22, 4, 4);
                ctx.fillRect (18, 22, 4, 4);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (8, 12, 10, 6);
                ctx.fillRect (12, 18, 2, 2);
            break;
            case 5:
                ctx.fillRect (8, 0, 8, 2);
                ctx.fillRect (6, 2, 12, 2);
                ctx.fillRect (4, 4, 16, 2);
                ctx.fillRect (4, 6, 20, 2);
                ctx.fillRect (12, 8, 6, 2);
                ctx.fillRect (22, 16, 4, 4);
                ctx.fillRect (0, 24, 10, 2);
                ctx.fillRect (0, 26, 8, 2);
                ctx.fillRect (16, 24, 8, 2);
                ctx.fillRect (18, 26, 6, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 4, 2);
                ctx.fillRect (8, 10, 10, 2);
                ctx.fillRect (8, 12, 6, 2);
                ctx.fillRect (4, 20, 14, 2);
                ctx.fillRect (4, 22, 18, 2);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (6, 14, 10, 6);
                ctx.fillRect (16, 16, 6, 4);
                ctx.fillRect (22, 14, 2, 2);
            break;
        }
        ctx.restore ();
    }

    this.newPos = function ()
    {
        if (this.speedX > 0) this.heading = 1;
        else if (this.speedX < 0) this.heading = -1;
        if (this.speedY != 0)
        {
            if (this.speedX == 0) this.type = 4;
            else this.type = 5;
        }
        else
        {
            if (this.type > 3) this.type = 1;
            if (this.speedX != 0 && gameArea.frame % 2 == 0)
            {
                if (this.type < 3) this.type++;
                else this.type = 0;
            }
        }
        this.speedX = this.moveX;
        this.speedY += gravity;
        this.x += this.speedX; 
        this.y += this.speedY;
        this.collisions ();
    }

    this.collisions = function ()
    {
        var rockX = gameMap.width - this.width,
            rockY = gameMap.height - this.height;

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
        for (var front in gameFront)
        {
            if (this.x - this.speedX < gameFront [front].x + gameFront [front].width && this.x - this.speedX + this.width > gameFront [front].x && this.y + this.height > gameFront [front].y && this.y < gameFront [front].y + gameFront [front].height)
            {
                this.y -= this.speedY;
                this.speedY = -(this.speedY * this.bounce);
            }
            if (this.y < gameFront [front].y + gameFront [front].height && this.y + this.height > gameFront [front].y && this.x + this.width > gameFront [front].x && this.x < gameFront [front].x + gameFront [front].width)
            {
                this.x -= this.speedX;
                this.speedX = 0;
            }
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