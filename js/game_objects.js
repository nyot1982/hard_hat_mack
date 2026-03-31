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

function mack (type, color, x, y, width, height, speedX, speedY, brake, bounce)
{
    this.type = type || 0;
    this.color = color || null;
    this.x = x || 0;
    this.y = y || 0;    
    this.width = width || 0;
    this.height = height || 0;
    this.speedX = speedX || 0;
    this.speedY = speedY || 0;
    this.brake = brake || 0.02;
    this.bounce = bounce || 0.75;
    this.gravity = gravity;
    this.gravitySpeed = gravitySpeed;

    this.update = function ()
    {
        ctx = gameArea.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect (this.x, this.y, this.width, this.height);
    }

    this.newPos = function ()
    {
        if (this.speedX > 0) this.speedX -= this.brake;
        else if (this.speedX < 0) this.speedX += this.brake;
        else if (this.speedX == 0) this.brake = 0;
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
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
            this.speedX = -(this.speedX);
        }
        if (this.y < 0 || this.y > rockY)
        {
            if (this.y < 0) this.y = 0;
            else this.y = rockY;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
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
                        bre
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