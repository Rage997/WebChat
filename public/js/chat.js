var socket = io.connect();

var messages = document.getElementById("messages");
var messageInput = document.getElementById("message_input");
var typing = document.getElementById("typing");

// Send message
$("form").submit( (e)=>{
    let message = messageInput.value
    let username = $("#username").val()
    e.preventDefault(); // prevents page reloading
    let data = { msg:  message, user: username }
    socket.emit("message", data);
    console.log('Sent message:' + data.msg + ' from ' + data.user)
    // add the sent message to the chat
    let li = document.createElement("li");
    let span = document.createElement("span");
    messages.appendChild(li).append(data.msg);
    messages.appendChild(span).append("by you"  + ": just now");
    messageInput.value = ""
}); 

// Receive message
socket.on("received", (data)=>{
    let li = document.createElement("li");
    let span = document.createElement("span");
    messages.appendChild(li).append(data.msg);
    messages.appendChild(span).append("by " + data.user + ": " + "just now");
    console.log('Received message:' + data.msg + ' from ' + data.user)
})

// Get chat history
fetch("/chats").then( data => {
    data.json().then(dataJson => {
        dataJson.map( data => {
            let li = document.createElement("li");
            let span = document.createElement("span");
            messages.appendChild(li).append(data.message);
            messages.appendChild(span).append("by " + data.sender + " at: " + data.createdAt);
        })
    })
})

// Someone typing
// TODO how to handle multiple users typing?
messageInput.addEventListener("keypress", () => {
    let username = $("#username").val()
    socket.emit('isTyping', {user: username})
})

socket.on('isTyping', data => {
    typing.innerHTML = "<p><em>" + data.user + " is typing</em></p>";
    console.log(data.user + " is typing")
})

messageInput.addEventListener("keyup", () => {
    if (messageInput.value == ""){
        socket.emit("stopTyping", "");
    }
});

socket.on("notifyStopTyping", () => {
    typing.innerHTML = "";
});
