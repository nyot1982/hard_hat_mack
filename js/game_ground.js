function ground (type, color, x, y, width, height)
{
    this.type = type;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    if (this.type == "water") this.move = 0;
    else if (this.type == "lava")
    {
        this.r1 = 0;
        this.r2 = 0;
        this.r3 = 0;
        this.r4 = 0;
    }

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
        else if (this.type == "menu")
        {
            ctx.rect (this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill ();
        }
        else if (this.type == "base")
        {
            ctx.lineWidth = 4;
            ctx.rect (this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill ();
            ctx.strokeStyle = "#00000033";
            ctx.stroke ();
            squares ("black", "yellow", this.x + 7, this.y + 7, 15, 17, 2, 2, false);
            squares ("red", "white", this.x + 43, this.y + 7, 15, 17, 2, 2, false);
            squares ("black", "yellow", this.x + 7, this.y + 47, 15, 17, 2, 2, false);
            squares ("red", "white", this.x + 43, this.y + 47, 15, 17, 2, 2, false);
        }
        else
        {
            const patternCanvas = document.createElement ("canvas");
            const patternContext = patternCanvas.getContext ("2d");
            if (this.type == "grass")
            {
                patternCanvas.width = 18;
                patternCanvas.height = 18;
            }
            else if (this.type == "water")
            {
                patternCanvas.width = 30;
                patternCanvas.height = 32;
            }
            else
            {
                patternCanvas.width = 32;
                patternCanvas.height = 32;
            }
            patternContext.fillStyle = this.color;
            patternContext.fillRect (0, 0, patternCanvas.width, patternCanvas.height);
            patternContext.strokeStyle = "transparent";
            patternContext.lineWidth = 0;
            if (this.type == "water")
            {
                patternContext.globalAlpha = 0.25;
                this.path0 = new Path2D ();
                this.path0.rect (8, 2, 3, 2);
                this.path0.rect (0, 4, 4, 2);
                this.path0.rect (8, 8, 3, 2);
                this.path0.rect (23, 8, 3, 2);
                this.path0.rect (0, 12, 4, 2);
                this.path0.rect (15, 18, 4, 2);
                this.path0.rect (23, 20, 3, 2);
                this.path0.rect (4, 22, 4, 2);
                this.path0.rect (11, 24, 4, 2);
                this.path0.rect (15, 28, 4, 2);
                this.path0.rect (26, 28, 4, 2);
                this.path1 = new Path2D ();
                this.path1.rect (10, 4, 3, 2);
                this.path1.rect (0, 2, 4, 2);
                this.path1.rect (6, 8, 3, 2);
                this.path1.rect (21, 6, 3, 2);
                this.path1.rect (2, 14, 4, 2);
                this.path1.rect (13, 16, 4, 2);
                this.path1.rect (25, 18, 3, 2);
                this.path1.rect (2, 22, 4, 2);
                this.path1.rect (9, 24, 4, 2);
                this.path1.rect (13, 28, 4, 2);
                this.path1.rect (24, 26, 4, 2);
                /*this.path2 = new Path2D ();
                this.path2.rect (18, 2, 3, 2);
                this.path2.rect (10, 4, 4, 2);
                this.path2.rect (3, 8, 3, 2);
                this.path2.rect (18, 8, 3, 2);
                this.path2.rect (10, 12, 4, 2);
                this.path2.rect (25, 18, 4, 2);
                this.path2.rect (3, 20, 3, 2);
                this.path2.rect (14, 22, 4, 2);
                this.path2.rect (21, 24, 4, 2);
                this.path2.rect (6, 28, 4, 2);
                this.path2.rect (25, 28, 4, 2);
                this.path3 = new Path2D ();
                this.path3.rect (23, 2, 3, 2);
                this.path3.rect (15, 4, 4, 2);
                this.path3.rect (8, 8, 3, 2);
                this.path3.rect (23, 8, 3, 2);
                this.path3.rect (15, 12, 4, 2);
                this.path3.rect (0, 18, 4, 2);
                this.path3.rect (8, 20, 3, 2);
                this.path3.rect (19, 22, 4, 2);
                this.path3.rect (26, 24, 4, 2);
                this.path3.rect (0, 28, 4, 2);
                this.path3.rect (11, 28, 4, 2);*/
                patternContext.fillStyle = "white";
                if (gameArea.frame % 20 == 0)
                {
                    this.move++;
                    if (this.move == 2) this.move = 0;
                }
                patternContext.fill (this ["path" + this.move]);
                this.pattern = ctx.createPattern (patternCanvas, "repeat");
                ctx.rect (this.x, this.y, this.width, this.height);
                ctx.fillStyle = this.pattern;
                ctx.fill ();
            }
            else
            {
                if (this.type == "sand")
                {
                    patternContext.fillStyle = "#88000044";
                    patternContext.fillRect (5, 5, 3, 2);
                    patternContext.fillRect (22, 5, 3, 2);
                    patternContext.fillRect (25, 10, 2, 3);
                    patternContext.fillRect (12, 28, 2, 3);
                    patternContext.fillRect (10, 2, 3, 2);
                    patternContext.fillRect (10, 20, 3, 2);
                    patternContext.fillRect (11, 12, 2, 3);
                    patternContext.fillRect (16, 15, 3, 2);
                    patternContext.fillRect (22, 22, 2, 3);
                    patternContext.fillRect (15, 10, 2, 3);
                    patternContext.fillRect (26, 26, 3, 2);
                    patternContext.fillRect (28, 17, 3, 2);
                }
                else if (this.type == "grass")
                {
                    patternContext.fillStyle = this.color;
                    patternContext.fillRect (0, 0, 18, 18);
                    patternContext.arc (0, 0, 12, 0, 0.5 * Math.PI);
                    patternContext.fillStyle = this.color;
                    patternContext.fill ();
                    patternContext.lineWidth = 1;
                    patternContext.strokeStyle = "#00000044";
                    patternContext.stroke ();
                }
                else if (this.type == "concrete")
                {
                    patternContext.fillStyle = "#00000022";
                    patternContext.fillRect (5, 5, 8, 8);
                    patternContext.fillRect (22, 5, 8, 8);
                    patternContext.fillRect (8, 10, 8, 8);
                    patternContext.fillRect (12, 23, 8, 8);
                    patternContext.fillRect (10, 2, 8, 8);
                    patternContext.fillRect (10, 20, 8, 8);
                    patternContext.fillRect (11, 12, 8, 8);
                    patternContext.fillRect (16, 15, 8, 8);
                    patternContext.fillRect (9, 23, 8, 8);
                    patternContext.fillRect (15, 10, 8, 8);
                    patternContext.fillRect (18, 23, 8, 8);
                    patternContext.fillRect (23, 17, 8, 8);
                }
                else if (this.type == "snow")
                {
                    patternContext.fillStyle = "#00000022";
                    patternContext.fillRect (10, 5, 2, 10);
                    patternContext.fillRect (15, 21, 2, 10);
                    patternContext.fillRect (25, 15, 2, 10);
                }
                else if (this.type == "lava")
                {
                    if (gameArea.frame % 5 == 0)
                    {
                        this.r1++;
                        this.r2++;
                        this.r3++;
                        this.r4++;
                        if (this.r1 > 10) this.r1 = 0;
                        if (this.r2 > 20) this.r2 = 0;
                        if (this.r3 > 30) this.r3 = 0;
                        if (this.r4 > 40) this.r4 = 0;
                    }
                    patternContext.strokeStyle = "orange";
                    patternContext.fillStyle = "orange";
                    patternContext.beginPath ();
                    patternContext.arc (5, 5, this.r3 / 10, 0, 2 * Math.PI);
                    patternContext.stroke ();
                    patternContext.beginPath ();
                    patternContext.arc (15, 15, this.r2 / 10, 0, 2 * Math.PI);
                    patternContext.fill ();
                    patternContext.beginPath ();
                    patternContext.arc (20, 10, this.r1 / 10, 0, 2 * Math.PI);
                    patternContext.fill ();
                    patternContext.beginPath ();
                    patternContext.arc (7, 25, this.r4 / 10, 0, 2 * Math.PI);
                    patternContext.fill ();
                    patternContext.beginPath ();
                    patternContext.arc (25, 27, this.r2 / 10, 0, 2 * Math.PI);
                    patternContext.fill ();
                }
                this.pattern = ctx.createPattern (patternCanvas, "repeat");
                ctx.moveTo (x, y);
                for (var vertex in width) ctx.lineTo (width [vertex], height [vertex]);
                ctx.fillStyle = this.pattern;
                ctx.fill ();
                if (this.type == "concrete")
                {
                    ctx.setLineDash ([6, 7]);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.stroke ();
                    ctx.setLineDash ([]);
                }
            }  
        }
        if (gameScreen == "game" && gameModal == null)
        {
            for (var gameChar in gameChars)
            {
                var pos = 
                {
                    x: gameChars [gameChar].x,
                    y: gameChars [gameChar].y
                }
                if (ctx.isPointInPath (pos.x, pos.y)) gameChars [gameChar].ground = this.type;
            }
        }
    }
}

function squares (color1, color2, x, y, width, height, squareWidth, squareHeight, fill)
{
    for (var i = 0, j = 0; j < height; i++)
    {
        if (i == width)
        {
            i = -1;
            j++;
        }
        else if (fill || i == 0 || j == 0 || i + 1 == width || j + 1 == height)
        {
            if (j % 2 == 0 && i % 2 == 0 || j % 2 != 0 && i % 2 != 0) ctx.fillStyle = color1;
            else ctx.fillStyle = color2;
            ctx.fillRect (x + squareWidth * i, y + squareHeight * j, squareWidth, squareHeight);
        }
    }
}