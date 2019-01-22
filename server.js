var app = require('http').createServer(response);
var fs = require('fs');
var io = require('socket.io')(app);

var port = 3000;
var domain = '127.0.0.1';
app.listen(port, domain);
console.log(`Server is running at http://${domain}:${port}/`)

function response(req, res) {
    var file = "";
    
    if(req.url == "/" || req.url =="/client"){
        file = `${__dirname}/pages/client.html`;
    } else if (req.url =="/host") {
        file = `${__dirname}/pages/host.html`;
    } else {
        file = `${__dirname}/${req.url}`;
    }
   
    fs.readFile(file, function (err, data) {
        if (err) {
            res.writeHead(404);
            return res.end('Page or file not found');
        }

        res.writeHead(200);
        res.end(data);
    });
}

function generateRandomNumber(min, max){
    return Math.floor(Math.random() * (max-min) + min);
}

function getRandomName(){
    var fakeNames = ['Piotr', 'Grażyna', 'Bożena', 'Witkacy', 'Fabian', 'James', 'Filip'];

    return fakeNames[Math.floor(Math.random()*fakeNames.length)];
}

function findSocketById(sockets, id){
    return sockets[id]
}

io.on("connection", function(socket){
    socket.fakeName =  getRandomName() + generateRandomNumber(100,999);
    socket.on("create title", function(){
        socket.emit("update title tag", {fakeName: socket.fakeName})
    })
    
    var socketIds = Object.keys(io.sockets.sockets);

    socket.on("init host", function(){
        var clientIds = socketIds.filter(function(id){
            return id !== socket.id;
        })
        if (clientIds.length > -1) {
            for (var key in clientIds) {
                var client = findSocketById(io.sockets.sockets, clientIds[key]);
                io.sockets.emit("new chat", {id: clientIds[key], fakeName: client.fakeName})
            }    
        }
    });

    io.sockets.emit("new chat", {id: socket.id, fakeName: socket.fakeName});
    
    socket.on('disconnect', function() {
        io.sockets.emit("close chat", {id: socket.id})
    });
    
    socket.on("send message", function(data, callback){
        if(data.message){
            io.sockets.emit("update messages", data);
        }
        callback();
    });
});
