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
    this.brake = brake || 0.1;
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
    this.hit = false;
    
    this.update = function ()
    {
        if (!this.hit)
        {
            this.move = this.speed;

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