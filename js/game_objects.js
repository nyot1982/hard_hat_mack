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
            for (var x = 28; x + 7 < this.width; x += 104)
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

function bouncy (color, color2, color3, x, y)
{
    this.color = color;
    this.color2 = color2;
    this.color3 = color3;
    this.x = x;
    this.y = y;
    this.backupY = y;
    this.width = 26;
    this.height = 24;
    this.type = 0;

    this.update = function ()
    {
        if (gameArea.frame % 5 == 0 && this.type > 0 && this.type < 4) this.type++;
        ctx = gameArea.ctx;
        ctx.fillStyle = this.color;
        switch (this.type)
        {
            case 0:
            case 4:
                if (this.height != 24)
                {
                    this.y = this.backupY;
                    this.height = 24;
                    if (this.type == 4)
                    {
                        gamePlayers [0].y = this.y - 30;
                        gamePlayers [0].speedY = -4;
                        this.type = 0;
                    }
                }
                ctx.fillRect (this.x + 2, this.y, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (this.x + 8, this.y + 6, 10, 14);
                ctx.fillRect (this.x + 6, this.y + 10, 14, 6);
                ctx.fillRect (this.x + 2, this.y + 20, 22, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (this.x, this.y + 2, 26, 4);
                ctx.fillRect (this.x + 10, this.y + 6, 2, 4);
                ctx.fillRect (this.x + 14, this.y + 6, 2, 4);
                ctx.fillRect (this.x + 8, this.y + 10, 2, 4);
                ctx.fillRect (this.x + 12, this.y + 10, 2, 4);
                ctx.fillRect (this.x + 16, this.y + 10, 2, 4);
                ctx.fillRect (this.x + 10, this.y + 14, 2, 4);
                ctx.fillRect (this.x + 14, this.y + 14, 2, 4);
                ctx.fillRect (this.x + 8, this.y + 18, 2, 2);
                ctx.fillRect (this.x + 12, this.y + 18, 2, 2);
                ctx.fillRect (this.x + 16, this.y + 18, 2, 2);
            break;
            case 1:
            case 3:
                if (this.height != 20)
                {
                    this.y = this.backupY + 4;
                    this.height = 20;
                    gamePlayers [0].y = this.y - 30;
                }
                ctx.fillRect (this.x + 2, this.y, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (this.x + 6, this.y + 6, 14, 10);
                ctx.fillRect (this.x + 2, this.y + 10, 22, 2);
                ctx.fillRect (this.x + 2, this.y + 16, 22, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (this.x, this.y + 2, 26, 4);
                ctx.fillRect (this.x + 8, this.y + 6, 2, 2);
                ctx.fillRect (this.x + 12, this.y + 6, 2, 2);
                ctx.fillRect (this.x + 16, this.y + 6, 2, 2);
                ctx.fillRect (this.x + 4, this.y + 8, 4, 6);
                ctx.fillRect (this.x + 10, this.y + 8, 2, 6);
                ctx.fillRect (this.x + 14, this.y + 8, 2, 6);
                ctx.fillRect (this.x + 18, this.y + 8, 4, 6);
                ctx.fillRect (this.x + 8, this.y + 14, 2, 2);
                ctx.fillRect (this.x + 12, this.y + 14, 2, 2);
                ctx.fillRect (this.x + 16, this.y + 14, 2, 2);
            break;
            case 2:
                if (this.height != 10)
                {
                    this.y = this.backupY + 14;
                    this.height = 10;
                    gamePlayers [0].y = this.y - 30;
                }
                ctx.fillRect (this.x + 2, this.y, 22, 2);
                ctx.fillStyle = this.color2;
                ctx.fillRect (this.x + 2, this.y + 6, 22, 4);
                ctx.fillStyle = this.color3;
                ctx.fillRect (this.x, this.y + 2, 26, 4);
        }
    }
}

function player (type, name, x, y, heading, bounce)
{
    this.type = (type != null ? type : 0);
    this.name = name || null;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.heading = (heading != null ? heading : 1);
    this.bounce = (bounce != null ? bounce : 0);
    this.width = 26;
    this.height = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.jump = 0;
    this.jumping = false;
    this.bouncy = false;
    this.dead = 0;
    this.deadFrame = 0;
    this.lives = 3;
    this.floor = 0;

    this.drill = function (drilling)
    {
    }

    this.update = function (idPlayer)
    {
        if (gameScreen == "game")
        {
            this.x = Number ((this.x + this.speedX).toFixed (2));
            this.y = Number ((this.y + this.speedY).toFixed (2));
            if (this.dead == 0) for (var enemy in gameEnemies)
            {
                if (this.x <= gameEnemies [enemy].x + gameEnemies [enemy].width && this.x >= gameEnemies [enemy].x || this.x + this.width >= gameEnemies [enemy].x && this.x + this.width <= gameEnemies [enemy].x + gameEnemies [enemy].width)
                {
                    if (this.y <= gameEnemies [enemy].y + gameEnemies [enemy].height && this.y >= gameEnemies [enemy].y || this.y + this.height >= gameEnemies [enemy].y && this.y + this.height <= gameEnemies [enemy].y + gameEnemies [enemy].height) this.dead = 2;
                }
            }
            if (this.state != "chain")
            {
                if (this.dead == 0 && this.state == "ground") this.speedX = this.moveX;
                this.state = "air";
                for (var front in gameFront)
                {
                    if (this.x < gameFront [front].x + gameFront [front].width && this.x >= gameFront [front].x || this.x + this.width > gameFront [front].x && this.x + this.width <= gameFront [front].x + gameFront [front].width)
                    {
                        if (this.y + this.height > gameFront [front].y && this.y + this.height <= gameFront [front].y + gameFront [front].height && this.speedY > 0) this.y = gameFront [front].y - this.height;
                        else if (this.y < gameFront [front].y + gameFront [front].height && this.y >= gameFront [front].y && this.speedY < 0) this.y = gameFront [front].y + gameFront [front].height;
                        if (this.y == gameFront [front].y - this.height)
                        {
                            this.state = "ground";
                            if (gameFront [front].constructor.name == "bouncy" && !this.bouncy)
                            {
                                this.bouncy = true;
                                gameFront [front].type = 1;
                            }
                            else if (this.speedY > 2.8) this.dead = 1;
                            else if (gameFront [front].constructor.name == "beam_h") this.floor = this.y;
                        }
                        if (this.y == gameFront [front].y - this.height || this.y == gameFront [front].y + gameFront [front].height) this.speedY = -(this.speedY * this.bounce);
                    }
                    if (this.y < gameFront [front].y + gameFront [front].height && this.y + this.height > gameFront [front].y)
                    {
                        if (this.x == gameFront [front].x + gameFront [front].width  && this.speedX < 0 || this.x + this.width == gameFront [front].x && this.speedX > 0) this.speedX = 0;
                    }
                }
                if (this.x < 0) this.x = 0;
                else if (this.x > gameMap.width - this.width) this.x = gameMap.width - this.width;
                if (this.x == 0 && this.speedX < 0 || this.x == gameMap.width - this.width && this.speedX > 0) this.speedX = 0;
                if (this.y < 0) this.y = 0;
                else if (this.y > gameMap.height - this.height) this.y = gameMap.height - this.height;
                if (this.y == gameMap.height - this.height)
                {
                    this.state = "ground";
                    if (this.speedY > 2.8) this.dead = 1;
                }
                if (this.y == 0 || this.y == gameMap.height - this.height) this.speedY = -(this.speedY * this.bounce);
            }
            if (this.state == "air")
            {
                if (this.speedX != 0)
                {
                    if (!this.jumping || this.y >= this.jumping)
                    {
                        this.speedX = 0;
                        this.jumping = false;
                    }
                }
                if (this.bouncy)
                {
                    if (this.floor > gameMap.height - 318 - this.height && this.y <= this.floor - 64 || this.floor == gameMap.height - 318 - this.height && this.y <= gameMap.height - 62 - this.height)
                    {
                        this.jumping = this.y;
                        this.bouncy = false;
                        this.speedX = -1;
                        this.speedY = -2;
                    }
                }
                else this.speedY = Number ((this.speedY + gravity).toFixed (2));
                if (this.dead == 0)
                {
                    if (this.speedX == 0) this.type = 4;
                    else this.type = 6;
                }
            }
            else if (this.dead == 0)
            {
                this.chain_bottom = false;
                this.chain_top = false;
                for (var back in gameBack)
                {
                    if (gameBack [back].constructor.name == "chain" && this.x + this.width >= gameBack [back].x && this.x <= gameBack [back].x + gameBack [back].width && this.y - 18 <= gameBack [back].y && this.y + this.height + 16 >= gameBack [back].y)
                    {
                        if (this.y - 18 < gameBack [back].y && this.y + this.height + 16 > gameBack [back].y) this.state = "chain";
                        else
                        {
                            this.speedY = 0;
                            this.state = "ground";
                            if (this.y - 18 == gameBack [back].y) this.chain_bottom = true;
                            else if (this.y + this.height + 16 == gameBack [back].y) this.chain_top = true;
                        }
                    }
                }
                if (this.state == "chain")
                {
                    this.speedX = 0;
                    this.speedY = this.moveY;
                    if (this.speedY >= 0) this.type = 4;
                    else if (gameArea.frame % 5 == 0)
                    {
                        if (this.type == 4) this.type = 5;
                        else this.type = 4;
                    }
                }
                else if (this.state == "ground")
                {
                    if (this.chain_bottom && this.moveY < 0 || this.chain_top && this.moveY > 0)
                    {
                        this.speedY = this.moveY;
                        this.state = "chain";
                    }
                    if (this.jump != 0)
                    {
                        this.speedY = this.jump;
                        this.jumping = this.y;
                    }
                    else this.jumping = false;
                    if (this.type > 3) this.type = 1;
                    if (this.speedX != 0 && gameArea.frame % 3 == 0)
                    {
                        if (this.type < 3) this.type++;
                        else this.type = 0;
                    }
                }
            }
            if (this.dead > 0)
            {
                this.speedX = 0;
                if (this.state != "air") this.speedY = 0;
                if (this.type != 8 && gameArea.frame % 5 == 0)
                {
                    if (this.dead == 2)
                    {
                        this.deadFrame++;
                        if (this.deadFrame == 14) this.dead = 1;
                        if (this.deadFrame == 4 || this.deadFrame == 8 || this.deadFrame == 12)
                        {
                            this.heading = -1;
                            this.type = 3;
                        }
                        else if (this.deadFrame == 2 || this.deadFrame == 6 || this.deadFrame == 10 || this.deadFrame == 14) this.type = 4;
                        else
                        {
                            this.heading = 1;
                            this.type = 3;
                        }
                    }
                    else if (this.type == 7)
                    {
                        this.type = 8;
                        setTimeout
                        (
                            () =>
                            {
                                this.lives--;
                                gameText [9].src = "" + this.lives + ""; 
                                if (this.lives == 0)
                                {
                                    gameText.push (new component ("text", "Game over", "white", canvasWidth / 2 - 60, canvasHeight - 220));
                                    setTimeout
                                    (
                                        () =>
                                        {
                                            gameLoadScreen ("menu");
                                        },
                                        3000
                                    );
                                }
                                else
                                {
                                    this.dead = 0;
                                    this.deadFrame = 0;
                                    this.x = gameMap.width / 2 + 160;
                                    this.y = gameMap.height - 92;
                                    this.heading = -1;
                                    this.type = 0;
                                    this.state = "ground";
                                    gameEnemies [0].name = Math.floor (Math.random () * 2);
                                    gameEnemies [0].direction = Math.floor (Math.random () * 2);
                                    gameEnemies [0].x = gameMap.width / 2 - 194;
                                    gameEnemies [0].y = gameMap.height - 158;
                                }
                            },
                            2000
                        );
                    }
                    else if (this.type == 4) this.type = 7;
                    else this.type = 4; 
                }
                
            }
            else if (this.speedX > 0) this.heading = 1;
            else if (this.speedX < 0) this.heading = -1;
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
                ctx.fillRect (2, 12, 22, 4);
                ctx.fillRect (8, 16, 4, 6);
                ctx.fillRect (14, 16, 4, 6);
                ctx.fillRect (4, 22, 6, 2);
                ctx.fillRect (16, 22, 6, 2);
                ctx.fillRect (2, 24, 8, 2);
                ctx.fillRect (16, 24, 8, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 8, 10, 4);
                ctx.fillRect (8, 18, 10, 2);
                ctx.fillRect (4, 20, 2, 2);
                ctx.fillRect (20, 20, 2, 2);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (8, 12, 10, 4);
                ctx.fillRect (12, 16, 2, 2);
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
            break;
            case 7:
                ctx.fillRect (8, 10, 4, 2);
                ctx.fillRect (14, 10, 4, 2);
                ctx.fillRect (6, 12, 14, 2);
                ctx.fillRect (4, 14, 18, 2);
                ctx.fillRect (0, 18, 26, 2);
                ctx.fillRect (8, 22, 10, 2);
                ctx.fillRect (4, 26, 6, 2);
                ctx.fillRect (16, 26, 6, 2);
                ctx.fillRect (2, 28, 8, 2);
                ctx.fillRect (16, 28, 8, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 16, 10, 2);
                ctx.fillRect (4, 24, 18, 2);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (8, 18, 10, 2);
                ctx.fillRect (6, 20, 14, 2);
                ctx.fillRect (12, 22, 2, 2);
            break;
            case 8:
                ctx.fillRect (8, 16, 4, 2);
                ctx.fillRect (14, 16, 4, 2);
                ctx.fillRect (4, 18, 18, 2);
                ctx.fillRect (2, 22, 22, 2);
                ctx.fillRect (8, 24, 4, 4);
                ctx.fillRect (14, 24, 4, 4);
                ctx.fillRect (2, 28, 8, 2);
                ctx.fillRect (16, 28, 8, 2);
                ctx.fillStyle = "#FF55FF";
                ctx.fillRect (8, 20, 10, 2);
                ctx.fillRect (4, 26, 4, 2);
                ctx.fillRect (18, 26, 4, 2);
                ctx.fillStyle = "#55FFFF";
                ctx.fillRect (8, 22, 10, 2);
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
    this.direction = Math.floor (Math.random () * 2);

    this.update = function (idPlayer)
    {
        if (gameScreen == "game")
        {
            if (this.direction == 0)
            {
                if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 94)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 94)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 158)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 158)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 222)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 222)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 286)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 286)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 52 && this.y == gameMap.height - 286 && this.speedX == -1)
                {
                    this.speedX = 0;
                    this.speedY = -1;
                }
                else if (this.x == gameMap.width / 2 + 52 && this.y == gameMap.height - 350 && this.speedY == -1)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 350)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 350)
                {
                    this.speedX = 0;
                    this.direction = 1;
                }
            }
            else
            {
                if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 94)
                {
                    this.speedX = 0;
                    this.direction = 0;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 94)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 158)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 158)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 222)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 222)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 - 194 && this.y == gameMap.height - 286)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 286)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 52 && this.y == gameMap.height - 286 && this.speedY == 1)
                {
                    this.speedX = 1;
                    this.speedY = 0;
                }
                else if (this.x == gameMap.width / 2 + 52 && this.y == gameMap.height - 350 && this.speedX == -1)
                {
                    this.speedX = 0;
                    this.speedY = 1;
                }
                else if (this.x == gameMap.width / 2 + 168 && this.y == gameMap.height - 350)
                {
                    this.speedX = -1;
                    this.speedY = 0;
                }
            }
            this.x += this.speedX; 
            this.y += this.speedY;
            if ((this.speedX != 0 || this.speedY != 0) && gameArea.frame % 5 == 0)
            {
                if (this.type == 0) this.type = 1;
                else this.type = 0;
            }
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
    if (this.type == "text")
    {
        this.vertical = (width ? true : false);
        this.width = 0;
        this.height = 0;
    }
    else
    {
        this.width = width;
        this.height = height;
    }
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
            for (var i = 0, x = this.x, y = this.y; i < this.src.length; i++)
            {
                var char = this.src.substr (i, 1).toUpperCase (),
                    width = 14,
                    height = 16;

                if (char == "Á" || char == "É" || char == "Í" || char == "Ó" || char == "Ú")
                {
                    if (!this.vertical) y -= 6;
                    ctx.fillRect (x + 6, y, 4, 2);
                    ctx.fillRect (x + 4, y + 2, 4, 2);
                    y += 6;
                }
                else if (char == "À" || char == "È" || char == "Ì" || char == "Ò" || char == "Ù")
                {
                    if (!this.vertical) y -= 6;
                    ctx.fillRect (x + 2, y, 4, 2);
                    ctx.fillRect (x + 4, y + 2, 4, 2);
                    y += 6;
                }
                switch (char)
                {
                    case "0":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 10);
                        ctx.fillRect (x + 6, y + 4, 2, 4);
                        ctx.fillRect (x + 4, y + 6, 2, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "1":
                        ctx.fillRect (x + 4, y, 4, 12);
                        ctx.fillRect (x + 2, y + 2, 2, 4);
                        ctx.fillRect (x, y + 4, 2, 2);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "2":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 6, y + 6, 4, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 2);
                        ctx.fillRect (x + 2, y + 10, 4, 2);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "3":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "4":
                        ctx.fillRect (x + 6, y, 2, 2);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 2, 4, 2);
                        ctx.fillRect (x + 2, y + 4, 4, 2);
                        ctx.fillRect (x, y + 6, 4, 2);
                        ctx.fillRect (x, y + 8, 8, 2);
                    break;
                    case "5":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x, y + 6, 10, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "6":
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 2, y + 2, 4, 2);
                        ctx.fillRect (x, y + 4, 4, 8);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "7":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 6, y + 4, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 4, 8);
                    break;
                    case "8":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 2, y + 6, 8, 2);
                        ctx.fillRect (x, y + 8, 4, 4);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "9":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 2, y + 6, 10, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 2);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 4, y + 12, 4, 2);
                    break;
                    case "A":
                    case "À":
                    case "Á":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 12);
                        ctx.fillRect (x + 8, y + 2, 4, 12);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                    break;
                    case "B":
                        ctx.fillRect (x, y, 10, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 12, 10, 2);
                    break;
                    case "C":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "D":
                        ctx.fillRect (x , y, 4, 14);
                        ctx.fillRect (x + 4, y + 0, 4, 2);
                        ctx.fillRect (x + 6, y + 2, 4, 2);
                        ctx.fillRect (x + 8, y + 4, 4, 6);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 4, y + 12, 4, 2);
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
                    break;
                    case "F":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 12);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                    break;
                    case "G":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 6, y + 6, 6, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "H":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                    break;
                    case "I":
                    case "Ì":
                    case "Í":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x + 4, y + 2, 4, 10);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "J":
                        ctx.fillRect (x + 8, y, 4, 12);
                        ctx.fillRect (x, y + 8, 4, 4);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
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
                    break;
                    case "L":
                        ctx.fillRect (x, y, 4, 12);
                        ctx.fillRect (x, y + 12, 12, 2);
                    break;
                    case "M":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 2, 4, 2);
                    break;
                    case "N":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 4, 2, 2);
                        ctx.fillRect (x + 6, y + 6, 2, 2);
                    break;
                    case "O":
                    case "Ò":
                    case "Ó":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 10);
                        ctx.fillRect (x + 8, y + 2, 4, 10);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "P":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
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
                    break;
                    case "R":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 4);
                        ctx.fillRect (x + 4, y + 6, 6, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 2);
                        ctx.fillRect (x + 6, y + 10, 4, 2);
                        ctx.fillRect (x + 8, y + 12, 4, 2);
                    break;
                    case "S":
                        ctx.fillRect (x + 2, y, 8, 2);
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 2, y + 6, 8, 2);
                        ctx.fillRect (x + 8, y + 8, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "T":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x + 4, y + 2, 4, 12);
                    break;
                    case "U":
                    case "Ù":
                    case "Ú":
                        ctx.fillRect (x, y, 4, 12);
                        ctx.fillRect (x + 8, y, 4, 12);
                        ctx.fillRect (x + 2, y + 12, 8, 2);
                    break;
                    case "V":
                        ctx.fillRect (x, y, 4, 10);
                        ctx.fillRect (x + 8, y, 4, 10);
                        ctx.fillRect (x + 2, y + 10, 8, 2);
                        ctx.fillRect (x + 4, y + 12, 4, 2);
                    break;
                    case "W":
                        ctx.fillRect (x, y, 4, 14);
                        ctx.fillRect (x + 8, y, 4, 14);
                        ctx.fillRect (x + 4, y + 10, 4, 2);
                    break;
                    case "X":
                        ctx.fillRect (x, y, 4, 4);
                        ctx.fillRect (x + 8, y, 4, 4);
                        ctx.fillRect (x + 2, y + 4, 8, 2);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                        ctx.fillRect (x + 2, y + 8, 8, 2);
                        ctx.fillRect (x, y + 10, 4, 4);
                        ctx.fillRect (x + 8, y + 10, 4, 4);
                    break;
                    case "Y":
                        ctx.fillRect (x, y, 4, 6);
                        ctx.fillRect (x + 8, y, 4, 6);
                        ctx.fillRect (x + 2, y + 6, 8, 2);
                        ctx.fillRect (x + 4, y + 8, 4, 6);
                    break;
                    case "Z":
                        ctx.fillRect (x, y, 12, 2);
                        ctx.fillRect (x + 8, y + 2, 4, 2);
                        ctx.fillRect (x + 6, y + 4, 4, 2);
                        ctx.fillRect (x + 4, y + 6, 4, 2);
                        ctx.fillRect (x + 2, y + 8, 4, 2);
                        ctx.fillRect (x, y + 10, 4, 2);
                        ctx.fillRect (x, y + 12, 12, 2);
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
                    break;
                    case "-":
                        ctx.fillRect (x, y + 5, 12, 4);
                        height = 6;
                    break;
                    case "+":
                        ctx.fillRect (x + 4, y + 1, 4, 12);
                        ctx.fillRect (x, y + 5, 12, 4);
                        height = 14;
                    break;
                    case ".":
                        ctx.fillRect (x, y + 10, 4, 4);
                        width = 6;
                        height = 6;
                    break;
                    case ",":
                        ctx.fillRect (x, y + 10, 4, 4);
                        ctx.fillRect (x + 2, y + 14, 2, 2);
                        ctx.fillRect (x, y + 16, 2, 2);
                        width = 6;
                        height = 8;
                    break;
                    case ":":
                        ctx.fillRect (x, y + 2, 4, 4);
                        ctx.fillRect (x, y + 8, 4, 4);
                        width = 6;
                        height = 14;
                    break;
                    case ";":
                        ctx.fillRect (x, y + 4, 4, 4);
                        ctx.fillRect (x, y + 10, 4, 4);
                        ctx.fillRect (x + 2, y + 14, 2, 2);
                        ctx.fillRect (x, y + 16, 2, 2);
                        width = 6;
                    break;
                    case "(":
                        ctx.fillRect (x + 4, y, 6, 2);
                        ctx.fillRect (x + 2, y + 2, 6, 2);
                        ctx.fillRect (x, y + 4, 6, 6);
                        ctx.fillRect (x + 2, y + 10, 6, 2);
                        ctx.fillRect (x + 4, y + 12, 6, 2);
                        width = 12;
                    break;
                    case ")":
                        ctx.fillRect (x, y, 6, 2);
                        ctx.fillRect (x + 2, y + 2, 6, 2);
                        ctx.fillRect (x + 4, y + 4, 6, 6);
                        ctx.fillRect (x + 2, y + 10, 6, 2);
                        ctx.fillRect (x, y + 12, 6, 2);
                        width = 12;
                    break;
                    case "/":
                        ctx.fillRect (x, y + 10, 2, 4);
                        ctx.fillRect (x + 2, y + 8, 2, 4);
                        ctx.fillRect (x + 4, y + 6, 2, 4);
                        ctx.fillRect (x + 6, y + 4, 2, 4);
                        ctx.fillRect (x + 8, y + 2, 2, 4);
                        ctx.fillRect (x + 10, y, 2, 4);
                        width = 12;
                    break;
                    case "\\":
                        ctx.fillRect (x, y, 2, 4);
                        ctx.fillRect (x + 2, y + 2, 2, 4);
                        ctx.fillRect (x + 4, y + 4, 2, 4);
                        ctx.fillRect (x + 6, y + 6, 2, 4);
                        ctx.fillRect (x + 8, y + 8, 2, 4);
                        ctx.fillRect (x + 10, y + 10, 2, 4);
                        width = 12;
                }
                if (this.vertical)
                {
                    this.height += height;
                    y += height;
                    if (width > this.width) this.width = width;
                }
                else
                {
                    this.width += width;
                    x += width;
                    if (height > this.height) this.height = height;
                }   
            }
        }
    }
}