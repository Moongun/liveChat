var socket = io.connect();
var myType = 'client';

$("form").submit(function(e) {
    e.preventDefault();
    var newMessage = $(this).find("#msg-text").val();

    if("" !== newMessage) {
        var data = {
            type: myType,
            message: newMessage, 
            sender: socket.id
        }
        socket.emit("send message", data, function() {
            $("#msg-text").val("");
        });    
    }

});

socket.on("update messages", function(data){
    if(socket.id == data.sender || socket.id == data.receiver){
        if(socket.id == data.sender) {
            var newMessage = $('<div class="bubble my-bubble"/>').text(data.message);
            var div = $('<div class="flex my-bubble-position"/>').append(newMessage)
        } else {
            var newMessage = $('<div class="bubble not-my-bubble"/>').text(data.message);
            var div = $('<div class="flex not-my-bubble-position"/>').append(newMessage)
        }
       $(".history").append(div);    
    }
});