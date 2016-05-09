var wsUri ="ws://"+document.location.host+document.location.pathname+"drawWS";
var websocket= new WebSocket(wsUri);
//39431234
websocket.onopen=function(evt){
    console.log("Conectado a "+wsUri);
};

websocket.onmessage=function(evt){
    console.log("INFO: onMessage");
    console.log(evt.data);
    /*var message = {
            'res': state,
            'prevX': prevX,
            'prevY': prevY,
            'currX': currX,
            'currY': currY,
            'strokeStyle': x,
            'lineWidth': y
        }*/
    console.log(evt.data.res);
    var msg = JSON.parse(evt.data);
    ctx.beginPath();
    ctx.moveTo(msg.prevX, msg.prevY);
    ctx.lineTo(msg.currX, msg.currY);
    ctx.strokeStyle = msg.x;
    ctx.lineWidth = msg.y;
    ctx.stroke();
    ctx.closePath();
};

websocket.onerror=function(evt){
    console.log("INFO: onError");
    
};

var canvas, ctx, flag = false,
        state,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

    var x = "black",
        y = 2;
    
    function init() {
        canvas = document.getElementById('can');
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;
    
        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
    }
    
    function findxy(res, e) {
        state= res;
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
    
            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();
            }
        }
    }
    
    function color(obj) {
        switch (obj.id) {
            case "green":
                x = "green";
                break;
            case "blue":
                x = "blue";
                break;
            case "red":
                x = "red";
                break;
            case "yellow":
                x = "yellow";
                break;
            case "orange":
                x = "orange";
                break;
            case "black":
                x = "black";
                break;
            case "white":
                x = "white";
                break;
        }
        if (x == "white") y = 14;
        else y = 2;
    
    }
    
    function draw() {
        var message = {
            'res': state,
            'prevX': prevX,
            'prevY': prevY,
            'currX': currX,
            'currY': currY,
            'strokeStyle': x,
            'lineWidth': y
        }
        websocket.send(JSON.stringify(message));
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }
    
    function erase() {
        var m = confirm("Want to clear");
        if (m) {
            ctx.clearRect(0, 0, w, h);
            document.getElementById("canvasimg").style.display = "none";
        }
    }
    
    
    





