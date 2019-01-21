var socket = io.connect();
var myType = 'host';

$("body").on('click', function(e) {
    e.preventDefault();
    var receiver = e.target.id.replace('send_', '');
    var newMessage = $(this).find(`#message_${receiver}`).val();

    if("" !== newMessage) {
        var data = {
            type: myType, 
            message: newMessage, 
            sender: socket.id,
            receiver: receiver
        };
        
        socket.emit("send message", data, function() {
            $(`form #message_${receiver}`).val("");
        });    
    }

});

socket.on("new chat", function(data){
    if(data.id !== socket.id) {
        var chat = `<div id="chat_${data.id}" class="container">
            <div class="client-name">
                <span>Client_${data.id.slice(1,4)}</span>
            </div>
            <div class="history"></div>
            <div class="chat">
                <form>
                    <div class="flex-element message">
                        <input type="text" class="input-msg" id="message_${data.id}" name="msg_text" autofocus autocomplete="off"/>
                    </div>
                    <div class="flex-element button">
                        <input type="submit" class="submit-btn" id="send_${data.id}" value="Send!" />
                        <label for="send_${data.id}">
                            <i class="fas fa-arrow-circle-right"></i>
                        </label>
                    </div>
                </form> 
            </div>
        </div>`
    };
    
    $(document.body).append(chat);
});

socket.on("close chat", function(data){
    $(`#chat_${data.id}`).remove();
})

socket.on("update messages", function(data){
    if(socket.id == data.sender) {
        var newMessage = $('<div class="bubble my-bubble"/>').text(data.message);
        var div = $('<div class="flex my-bubble-position"/>').append(newMessage)
    } else {
        var newMessage = $('<div class="bubble not-my-bubble"/>').text(data.message);
        var div = $('<div class="flex not-my-bubble-position"/>').append(newMessage)
    }
    
    var chatId = socket.id == data.sender ? data.receiver : data.sender;
   $(`#chat_${chatId} .history`).append(div);
});

