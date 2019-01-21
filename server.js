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

io.on("connection", function(socket){
    var socketIds = Object.keys(io.sockets.sockets);

    socket.on("init host", function(){
        var clientIds = socketIds.filter(function(id){
            return id !== socket.id;
        })
        if (clientIds.length > -1) {
            for (var key in clientIds) {
                io.sockets.emit("new chat", {id: clientIds[key]})
            }    
        }
        
    })

    io.sockets.emit("new chat", {id: socket.id});
    
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
