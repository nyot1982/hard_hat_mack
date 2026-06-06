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

function player (type, name, x, y, width, height, speedX, speedY, brake, bounce)
{
    this.type = (type != null ? type : 0);
    this.name = name || null;
    this.x = (x != null ? x : 0);
    this.y = (y != null ? y : 0);
    this.width = (width != null ? width : 0);
    this.height = (height != null ? height : 0);
    this.speedX = (speedX != null ? speedX : 0);
    this.speedY = (speedY != null ? speedY : 0);
    this.brake = (brake != null ? brake : 0.01);
    this.bounce = (bounce != null ? bounce : 0.75);
    this.gravity = gravity;

    this.update = function (idPlayer)
    {
        ctx = gameArea.ctx;
        ctx.lineWidth = 0;
        ctx.save ();
        ctx.translate (this.x, this.y);
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
        if (this.speedX > 0) this.speedX -= this.brake;
        else if (this.speedX < 0) this.speedX += this.brake;
        else if (this.speedX == 0) this.brake = 0;
        this.speedY += this.gravity;
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
            this.speedX = -(this.speedX);
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
    }
}