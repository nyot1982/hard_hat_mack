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

function beam_h (color1, color2, x, y, width)
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

function beam_v (color1, color2, x, y, height)
{
    this.color1 = color1;
    this.color2 = color2;
    this.x = x;
    this.y = y;
    this.width = 22;
    this.height = height;

    this.update = function ()
    {
        if (this.width - 11 > 0)
        {
            ctx = gameArea.ctx;
            ctx.fillStyle = this.color1;
            ctx.fillRect (this.x, this.y, 4, this.height);
            ctx.fillRect (this.x + 18, this.y, 4, this.height);
            ctx.fillStyle = this.color2;
            ctx.fillRect (this.x + 4, this.y, 14, this.height);
            for (var y = 24; y + 5 < this.height; y += 64)
            {
                ctx.fillStyle = "black";
                ctx.fillRect (this.x + 8, this.y + y, 6, 4);
                ctx.fillRect (this.x + 8, this.y + y + 14, 6, 4);
            }
        }
    }
}

function column (color1, color2, color3, x, y)
{
    this.color1 = color1;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.width = 18;
    this.height = 26;

    this.update = function ()
    {
        ctx = gameArea.ctx;
        ctx.fillStyle = this.color1;
        ctx.fillRect (this.x + 2, this.y, 14, 4);
        ctx.fillRect (this.x + 2, this.y + 16, 14, 4);
        ctx.fillRect (this.x, this.y + 20, 18, 6);
        ctx.fillStyle = this.color2;
        ctx.fillRect (this.x + 4, this.y + 4, 10, 4);
        ctx.fillRect (this.x + 4, this.y + 12, 10, 4);
        ctx.fillStyle = this.color3;
        ctx.fillRect (this.x + 6, this.y + 8, 6, 4);
    }
}

function chain (color, x, y, steps)
{
    this.color = color;
    this.x = x;
    this.y = y;
    this.steps = steps;
    this.width = 8;
    this.height = 8 * this.steps;

    this.update = function ()
    {
        ctx = gameArea.ctx;
        ctx.fillStyle = this.color;
        for (var y = 0; y < this.steps * 8; y += 8)
        {
            ctx.fillRect (this.x, this.y + y, 2, 6);
            ctx.fillRect (this.x + 6, this.y + y, 2, 6);
            ctx.fillRect (this.x + 2, this.y + y + 6, 4, 2);
        }
    }
}

function player (type, name, x, y, heading, speedX, speedY, bounce)
{
    this.type = (type != null ? type : 0);
    this.name = name || null;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.heading = (heading != null ? heading : 1);
    this.speedX = (speedX != null ? speedX : 0);
    this.speedY = (speedY != null ? speedY : 0);
    this.bounce = (bounce != null ? bounce : 0);
    this.width = 26;
    this.height = 30;
    this.moveX = 0;
    this.moveY = 0;
    this.jump = 0;

    this.drill = function (drilling)
    {
    }

    this.update = function (idPlayer)
    {
        if (gameScreen == "game")
        {
            var rockX = gameMap.width - this.width,
                rockY = gameMap.height - this.height;

            this.chain = false;
            for (var back in gameBack)
            {
                if (gameBack [back].constructor.name == "chain" && this.x + this.width >= gameBack [back].x && this.x <= gameBack [back].x + gameBack [back].width && this.y - 18 <= gameBack [back].y && this.y + this.height + 16 >= gameBack [back].y)
                {
                    this.chain = true;
                    if (this.y - 18 < gameBack [back].y && this.y + this.height + 16 >= gameBack [back].y) this.state = "chain";
                    else this.state = "ground";
                }
            }
            if (this.state == "ground" && this.jump != 0) this.speedY = this.jump;
            if (this.chain) this.speedY = this.moveY;
            if (this.state == "chain") this.speedX = 0;
            else
            {
                this.speedX = this.moveX;
                this.speedY = Number ((this.speedY + gravity).toFixed (2));    
            }
            if (this.speedX > 0) this.heading = 1;
            else if (this.speedX < 0) this.heading = -1;
            this.x += this.speedX; 
            this.y = Number ((this.y + this.speedY).toFixed (2));
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
            if (this.y == rockY) this.state = "ground";
            else if (this.state != "chain") 
            {
                this.state = "air";
                for (var front in gameFront)
                {
                    if ((this.x - this.speedX < gameFront [front].x + gameFront [front].width && this.x - this.speedX >= gameFront [front].x) || (this.x - this.speedX + this.width > gameFront [front].x && this.x - this.speedX + this.width <= gameFront [front].x + gameFront [front].width))
                    {
                        if ((this.y + this.height > gameFront [front].y && this.y + this.height <= gameFront [front].y + gameFront [front].height) || (this.y < gameFront [front].y + gameFront [front].height && this.y >= gameFront [front].y))
                        {
                            if (this.y < gameFront [front].y + gameFront [front].height && this.y >= gameFront [front].y) this.state = "air";
                            else this.state = "ground";
                            this.y -= this.speedY;
                            this.speedY = -(this.speedY * this.bounce);
                        }
                    }
                    if (this.y < gameFront [front].y + gameFront [front].height && this.y + this.height > gameFront [front].y && this.x + this.width > gameFront [front].x && this.x < gameFront [front].x + gameFront [front].width)
                    {
                        this.x -= this.speedX;
                        this.speedX = 0;
                    }
                }
            }
            if (this.state == "ground")
            {
                if (this.type > 3) this.type = 1;
                if (this.speedX != 0 && gameArea.frame % 2 == 0)
                {
                    if (this.type < 3) this.type++;
                    else this.type = 0;
                }
            }
            else if (this.state == "chain")
            {
                if (this.speedY == 0) this.type = 4;
                else if (gameArea.frame % 2 == 0)
                {
                    if (this.type == 4) this.type = 5;
                    else this.type = 4;
                }
            }
            else if (this.state == "air")
            {
                if (this.speedX == 0) this.type = 4;
                else this.type = 6;
            }
        }
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
            case 6:
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
        }
        ctx.restore ();
    }
}

function enemy (name, type, x, y)
{
    this.name = (name != null ? name : 0);
    this.type = (type != null ? type : 0);
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = 26;
    this.height = 32;
    this.speedX = 0;
    this.speedY = 0;

    this.update = function (idPlayer)
    {
        if ((this.speedX != 0 || this.speedY != 0) && gameArea.frame % 2 == 0)
        {
            if (this.type == 0) this.type = 1;
            else this.type = 0;
        }
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (this.x, this.y);
        switch (this.name)
        {
            case 0:
                switch (this.type)
                {
                    case 0:
                        ctx.fillStyle = "#55FFFF";
                        ctx.fillRect (8, 0, 4, 2);
                        ctx.fillRect (14, 0, 4, 2);
                        ctx.fillRect (4, 4, 6, 2);
                        ctx.fillRect (16, 4, 6, 2);
                        ctx.fillRect (8, 8, 10, 6);
                        ctx.fillRect (0, 14, 2, 6);
                        ctx.fillRect (24, 14, 2, 6);
                        ctx.fillRect (12, 20, 2, 2);
                        ctx.fillRect (8, 22, 10, 2);
                        ctx.fillRect (4, 24, 6, 4);
                        ctx.fillRect (16, 24, 6, 6);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (2, 2, 2, 2);
                        ctx.fillRect (10, 2, 6, 2);
                        ctx.fillRect (22, 2, 2, 2);
                        ctx.fillRect (12, 4, 2, 2);
                        ctx.fillRect (6, 6, 14, 2);
                        ctx.fillRect (6, 14, 14, 6);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect (8, 10, 10, 2);
                        ctx.fillRect (2, 12, 4, 2);
                        ctx.fillRect (20, 12, 4, 2);
                        ctx.fillRect (10, 14, 6, 2);
                        ctx.fillRect (8, 24, 4, 2);
                        ctx.fillRect (14, 24, 4, 2)
                        ctx.fillRect (2, 28, 8, 2);
                        ctx.fillRect (16, 30, 8, 2);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (12, 10, 2, 2);
                    break;
                    case 1:
                        ctx.fillStyle = "#55FFFF";
                        ctx.fillRect (8, 0, 2, 2);
                        ctx.fillRect (4, 2, 16, 2);
                        ctx.fillRect (16, 4, 6, 2);
                        ctx.fillRect (20, 6, 2, 2);
                        ctx.fillRect (8, 8, 10, 6);
                        ctx.fillRect (0, 18, 2, 4);
                        ctx.fillRect (24, 18, 2, 4);
                        ctx.fillRect (12, 20, 2, 2);
                        ctx.fillRect (8, 22, 10, 2);
                        ctx.fillRect (4, 24, 6, 6);
                        ctx.fillRect (16, 24, 6, 4);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (2, 0, 2, 2);
                        ctx.fillRect (14, 0, 2, 2);
                        ctx.fillRect (18, 0, 2, 2);
                        ctx.fillRect (22, 2, 2, 2);
                        ctx.fillRect (2, 4, 2, 2);
                        ctx.fillRect (10, 4, 2, 4);
                        ctx.fillRect (6, 6, 2, 2);
                        ctx.fillRect (14, 6, 2, 2);
                        ctx.fillRect (6, 16, 14, 4);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect (8, 10, 10, 2);
                        ctx.fillRect (4, 14, 4, 2);
                        ctx.fillRect (10, 14, 6, 2);
                        ctx.fillRect (18, 14, 4, 2);
                        ctx.fillRect (0, 16, 4, 2);
                        ctx.fillRect (22, 16, 4, 2);
                        ctx.fillRect (8, 24, 4, 2);
                        ctx.fillRect (14, 24, 4, 2)
                        ctx.fillRect (2, 30, 8, 2);
                        ctx.fillRect (16, 28, 8, 2);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (12, 10, 2, 2);
                    break;
                }
            break;
            case 1:
                switch (this.type)
                {
                    case 0:
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (8, 0, 10, 10);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect (6, 2, 14, 6);
                        ctx.fillRect (0, 10, 4, 4);
                        ctx.fillRect (10, 10, 6, 2);
                        ctx.fillRect (22, 10, 4, 4);
                        ctx.fillRect (4, 12, 18, 4);
                        ctx.fillRect (6, 16, 6, 12);
                        ctx.fillRect (14, 16, 6, 14);
                        ctx.fillRect (4, 28, 8, 2);
                        ctx.fillRect (14, 30, 8, 2);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (10, 4, 6, 2);
                        ctx.fillRect (12, 12, 2, 2);
                        ctx.fillRect (10, 14, 6, 6);
                        ctx.fillStyle = "#55FFFF";
                        ctx.fillRect (2, 10, 2, 2);
                        ctx.fillRect (6, 20, 6, 6);
                        ctx.fillRect (14, 20, 6, 8);
                    break;
                    case 1:
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (8, 0, 10, 10);
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect (6, 2, 14, 6);
                        ctx.fillRect (0, 6, 4, 4);
                        ctx.fillRect (2, 12, 2, 2);
                        ctx.fillRect (10, 10, 6, 2);
                        ctx.fillRect (22, 12, 2, 2);
                        ctx.fillRect (22, 6, 4, 4);
                        ctx.fillRect (4, 12, 18, 4);
                        ctx.fillRect (6, 16, 6, 14);
                        ctx.fillRect (14, 16, 6, 12);
                        ctx.fillRect (4, 30, 8, 2);
                        ctx.fillRect (14, 28, 8, 2);
                        ctx.fillStyle = "#FF55FF";
                        ctx.fillRect (10, 4, 6, 2);
                        ctx.fillRect (12, 12, 2, 2);
                        ctx.fillRect (10, 14, 6, 6);
                        ctx.fillStyle = "#55FFFF";
                        ctx.fillRect (2, 6, 2, 6);
                        ctx.fillRect (22, 10, 2, 2);
                        ctx.fillRect (6, 20, 6, 8);
                        ctx.fillRect (14, 20, 6, 6);
                    break;
                }
            break;
        }
        ctx.restore ();
    }
}

function component (type, src, color, x, y, width, height)
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
            ctx.fillStyle = this.color;
            this.width = 0;
            for (var x = 0; x < this.src.length; x++) this.character (this.src.substr (x, 1).toUpperCase (), this.x + this.width, this.y);
        }
    }

    this.character = function (char, x, y)
    {
        switch (char)
        {
            case " ":
                this.width += 14;
            break;
            case "0":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 10);
                ctx.fillRect (x + 6, y + 4, 2, 4);
                ctx.fillRect (x + 4, y + 6, 2, 4);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "1":
                ctx.fillRect (x + 4, y, 4, 12);
                ctx.fillRect (x + 2, y + 2, 2, 4);
                ctx.fillRect (x, y + 4, 2, 2);
                ctx.fillRect (x, y + 12, 12, 2);
                this.width += 14;
            break;
            case "2":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 2);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 6, y + 6, 4, 2);
                ctx.fillRect (x + 4, y + 8, 4, 2);
                ctx.fillRect (x + 2, y + 10, 4, 2);
                ctx.fillRect (x, y + 12, 12, 2);
                this.width += 14;
            break;
            case "3":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 2);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x, y + 10, 4, 2);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "4":
                ctx.fillRect (x + 6, y, 2, 2);
                ctx.fillRect (x + 8, y, 4, 14);
                ctx.fillRect (x + 4, y + 2, 4, 2);
                ctx.fillRect (x + 2, y + 4, 4, 2);
                ctx.fillRect (x, y + 6, 4, 2);
                ctx.fillRect (x, y + 8, 8, 2);
                this.width += 14;
            break;
            case "5":
                ctx.fillRect (x, y, 12, 2);
                ctx.fillRect (x, y + 2, 4, 4);
                ctx.fillRect (x, y + 6, 10, 2);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x, y + 10, 4, 2);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "6":
                ctx.fillRect (x + 4, y, 6, 2);
                ctx.fillRect (x + 2, y + 2, 4, 2);
                ctx.fillRect (x, y + 4, 4, 8);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "7":
                ctx.fillRect (x, y, 12, 2);
                ctx.fillRect (x, y + 2, 4, 2);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 6, y + 4, 4, 2);
                ctx.fillRect (x + 4, y + 6, 4, 8);
                this.width += 14;
            break;
            case "8":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 4);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 2, y + 6, 8, 2);
                ctx.fillRect (x, y + 8, 4, 4);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "9":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 4);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 2, y + 6, 10, 2);
                ctx.fillRect (x + 8, y + 8, 4, 2);
                ctx.fillRect (x + 6, y + 10, 4, 2);
                ctx.fillRect (x + 4, y + 12, 4, 2);
                this.width += 14;
            break;
            case "A":
            case "À":
            case "Á":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 12);
                ctx.fillRect (x + 8, y + 2, 4, 12);
                ctx.fillRect (x + 4, y + 6, 4, 2);
                this.width += 14;
            break;
            case "B":
                ctx.fillRect (x, y, 10, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x, y + 12, 10, 2);
                this.width += 14;
            break;
            case "C":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 8, y + 10, 4, 2);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "D":
                ctx.fillRect (x , y, 4, 14);
                ctx.fillRect (x + 4, y + 0, 4, 2);
                ctx.fillRect (x + 6, y + 2, 4, 2);
                ctx.fillRect (x + 8, y + 4, 4, 6);
                ctx.fillRect (x + 6, y + 10, 4, 2);
                ctx.fillRect (x + 4, y + 12, 4, 2);
                this.width += 14;
            break;
            case "E":
            case "È":
            case "É":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                ctx.fillRect (x + 8, y + 10, 4, 2);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "F":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 12);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                this.width += 14;
            break;
            case "G":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 6, y + 6, 6, 2);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "H":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 8, y, 4, 14);
                ctx.fillRect (x + 4, y + 6, 4, 2);
                this.width += 14;
            break;
            case "I":
            case "Ì":
            case "Í":
                ctx.fillRect (x, y, 12, 2);
                ctx.fillRect (x + 4, y + 2, 4, 10);
                ctx.fillRect (x, y + 12, 12, 2);
                this.width += 14;
            break;
            case "J":
                ctx.fillRect (x + 8, y, 4, 12);
                ctx.fillRect (x, y + 8, 4, 4);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "K":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 8, y, 4, 2);
                ctx.fillRect (x + 6, y + 2, 4, 2);
                ctx.fillRect (x + 4, y + 4, 4, 2);
                ctx.fillRect (x + 4, y + 6, 2, 2);
                ctx.fillRect (x + 4, y + 8, 4, 2);
                ctx.fillRect (x + 6, y + 10, 4, 2);
                ctx.fillRect (x + 8, y + 12, 4, 2);
                this.width += 14;
            break;
            case "L":
                ctx.fillRect (x, y, 4, 12);
                ctx.fillRect (x, y + 12, 12, 2);
                this.width += 14;
            break;
            case "M":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 8, y, 4, 14);
                ctx.fillRect (x + 4, y + 2, 4, 2);
                this.width += 14;
            break;
            case "N":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 8, y, 4, 14);
                ctx.fillRect (x + 4, y + 4, 2, 2);
                ctx.fillRect (x + 6, y + 6, 2, 2);
                this.width += 14;
            break;
            case "O":
            case "Ò":
            case "Ó":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 10);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "P":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 4, y, 6, 2);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                this.width += 14;
            break;
            case "Q":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 10);
                ctx.fillRect (x + 8, y + 2, 4, 8);
                ctx.fillRect (x + 2, y + 12, 6, 2);
                ctx.fillRect (x + 4, y + 6, 2, 2);
                ctx.fillRect (x + 6, y + 8, 2, 2);
                ctx.fillRect (x + 8, y + 10, 2, 2);
                ctx.fillRect (x + 10, y + 12, 2, 2);
                this.width += 14;
            break;
            case "R":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 4, y, 6, 2);
                ctx.fillRect (x + 8, y + 2, 4, 4);
                ctx.fillRect (x + 4, y + 6, 6, 2);
                ctx.fillRect (x + 4, y + 8, 4, 2);
                ctx.fillRect (x + 6, y + 10, 4, 2);
                ctx.fillRect (x + 8, y + 12, 4, 2);
                this.width += 14;
            break;
            case "S":
                ctx.fillRect (x + 2, y, 8, 2);
                ctx.fillRect (x, y + 2, 4, 4);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 2, y + 6, 8, 2);
                ctx.fillRect (x + 8, y + 8, 4, 4);
                ctx.fillRect (x, y + 10, 4, 2);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "T":
                ctx.fillRect (x, y, 12, 2);
                ctx.fillRect (x + 4, y + 2, 4, 12);
                this.width += 14;
            break;
            case "U":
            case "Ù":
            case "Ú":
                ctx.fillRect (x, y, 4, 12);
                ctx.fillRect (x + 8, y, 4, 12);
                ctx.fillRect (x + 2, y + 12, 8, 2);
                this.width += 14;
            break;
            case "V":
                ctx.fillRect (x, y, 4, 10);
                ctx.fillRect (x + 8, y, 4, 10);
                ctx.fillRect (x + 2, y + 10, 8, 2);
                ctx.fillRect (x + 4, y + 12, 4, 2);
                this.width += 14;
            break;
            case "W":
                ctx.fillRect (x, y, 4, 14);
                ctx.fillRect (x + 8, y, 4, 14);
                ctx.fillRect (x + 4, y + 10, 4, 2);
                this.width += 14;
            break;
            case "X":
                ctx.fillRect (x, y, 4, 4);
                ctx.fillRect (x + 8, y, 4, 4);
                ctx.fillRect (x + 2, y + 4, 8, 2);
                ctx.fillRect (x + 4, y + 6, 4, 2);
                ctx.fillRect (x + 2, y + 8, 8, 2);
                ctx.fillRect (x, y + 10, 4, 4);
                ctx.fillRect (x + 8, y + 10, 4, 4);
                this.width += 14;
            break;
            case "Y":
                ctx.fillRect (x, y, 4, 6);
                ctx.fillRect (x + 8, y, 4, 6);
                ctx.fillRect (x + 2, y + 6, 8, 2);
                ctx.fillRect (x + 4, y + 8, 4, 6);
                this.width += 14;
            break;
            case "Z":
                ctx.fillRect (x, y, 12, 2);
                ctx.fillRect (x + 8, y + 2, 4, 2);
                ctx.fillRect (x + 6, y + 4, 4, 2);
                ctx.fillRect (x + 4, y + 6, 4, 2);
                ctx.fillRect (x + 2, y + 8, 4, 2);
                ctx.fillRect (x, y + 10, 4, 2);
                ctx.fillRect (x, y + 12, 12, 2);
                this.width += 14;
            break;
            case "&":
                ctx.fillRect (x + 2, y, 6, 2);
                ctx.fillRect (x, y + 2, 4, 4);
                ctx.fillRect (x + 8, y + 2, 2, 2);
                ctx.fillRect (x + 2, y + 6, 4, 2);
                ctx.fillRect (x, y + 8, 4, 4);
                ctx.fillRect (x + 6, y + 8, 2, 2);
                ctx.fillRect (x + 10, y + 8, 2, 2);
                ctx.fillRect (x + 8, y + 10, 2, 2);
                ctx.fillRect (x + 2, y + 12, 6, 2);
                ctx.fillRect (x + 10, y + 12, 2, 2);
                this.width += 14;
            break;
            case "-":
                ctx.fillRect (x, y + 5, 12, 4);
                this.width += 14;
            break;
            case "+":
                ctx.fillRect (x + 4, y + 1, 4, 12);
                ctx.fillRect (x, y + 5, 12, 4);
                this.width += 14;
            break;
            case ".":
                ctx.fillRect (x, y + 10, 4, 4);
                this.width += 6;
            break;
            case ",":
                ctx.fillRect (x, y + 10, 4, 4);
                ctx.fillRect (x + 2, y + 14, 2, 2);
                ctx.fillRect (x, y + 16, 2, 2);
                this.width += 6;
            break;
            case ":":
                ctx.fillRect (x, y + 4, 4, 4);
                ctx.fillRect (x, y + 10, 4, 4);
                this.width += 6;
            break;
            case ";":
                ctx.fillRect (x, y + 4, 4, 4);
                ctx.fillRect (x, y + 10, 4, 4);
                ctx.fillRect (x + 2, y + 14, 2, 2);
                ctx.fillRect (x, y + 16, 2, 2);
                this.width += 6;
            break;
            case "(":
                ctx.fillRect (x + 4, y, 6, 2);
                ctx.fillRect (x + 2, y + 2, 6, 2);
                ctx.fillRect (x, y + 4, 6, 6);
                ctx.fillRect (x + 2, y + 10, 6, 2);
                ctx.fillRect (x + 4, y + 12, 6, 2);
                this.width += 12;
            break;
            case ")":
                ctx.fillRect (x, y, 6, 2);
                ctx.fillRect (x + 2, y + 2, 6, 2);
                ctx.fillRect (x + 4, y + 4, 6, 6);
                ctx.fillRect (x + 2, y + 10, 6, 2);
                ctx.fillRect (x, y + 12, 6, 2);
                this.width += 12;
            break;
            case "/":
                ctx.fillRect (x, y + 10, 2, 4);
                ctx.fillRect (x + 2, y + 8, 2, 4);
                ctx.fillRect (x + 4, y + 6, 2, 4);
                ctx.fillRect (x + 6, y + 4, 2, 4);
                ctx.fillRect (x + 8, y + 2, 2, 4);
                ctx.fillRect (x + 10, y, 2, 4);
                this.width += 12;
            break;
            case "\\":
                ctx.fillRect (x, y, 2, 4);
                ctx.fillRect (x + 2, y + 2, 2, 4);
                ctx.fillRect (x + 4, y + 4, 2, 4);
                ctx.fillRect (x + 6, y + 6, 2, 4);
                ctx.fillRect (x + 8, y + 8, 2, 4);
                ctx.fillRect (x + 10, y + 10, 2, 4);
                this.width += 12;
        }
        if (char == "Á" || char == "É" || char == "Í" || char == "Ó" || char == "Ú")
        {
            ctx.fillRect (x + 4, y - 4, 2, 2);
            ctx.fillRect (x + 6, y - 6, 2, 2);
        }
        else if (char == "À" || char == "È" || char == "Ì" || char == "Ò" || char == "Ù")
        {
            ctx.fillRect (x + 4, y - 6, 2, 2);
            ctx.fillRect (x + 6, y - 4, 2, 2);
        }
    }
}