const express = require('express');
const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server);
//database connection
const  DBChat  = require("./models/ChatSchema");
const  dbconnect  = require("./mongoConnect");
const chatRoute  = require("./route/chatsRoute")

const port = 500;


app.use(express.static(__dirname + "/public"));
app.use("/chats", chatRoute) // chat history

//To listen to messages
socket.on("connection", (socket)=>{
    console.log("user connected");
    socket.on("disconnect", ()=>{
        console.log("Disconnected")
    })

    socket.on("message", function(data) {
        console.log('Received message:' + data.msg + ' from ' + data.user)
        socket.broadcast.emit("received", data);
        
        // save message into the database
        dbconnect.then(db =>{
            let dbMessage = new DBChat({message: data.msg, sender: data.user});
            dbMessage.save();
        })
    });
    // Handle isTyiping
    socket.on("isTyping", data => { 
        console.log(data.user + " is typing")
        socket.broadcast.emit("isTyping", 
        {user: data.user}); 
    }); 

    socket.on("stopTyping", () => { 
        console.log("Stop!")
        socket.broadcast.emit("notifyStopTyping"); 
    });

});



server.listen(port, ()=>{
    console.log("connected to port: "+ port)
});