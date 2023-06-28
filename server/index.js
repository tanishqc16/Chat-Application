const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const {Server} = require("socket.io");              //import Server class which is already present in socketio.

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {                     // create Instance of Server class imported form socketio.
    cors:{                                          // To resolve cors issue, just tell cors which server and methods to accept
        origin:"http://localhost:3000",
        method : ["GET", "POST"],
    },
}); 

io.on("connection", (socket)=>{                     // Listen event when user is connected and disconnected form Server
    console.log(`User Connected : ${socket.id}`);
                                      
    socket.on("join_room", (data, name) => {        // This function is to join room when someone enters roomcode and username.
        socket.join(data);                          // join() is function in socket.io
        console.log(`${name} joined room: ${data}`);
    });

    socket.on("send_message", (data) =>{            // data in each socket function is coming from user(fronend) 
        console.log(data)
        socket.to(data.room).emit("messageRecieve", data)       // When someone types the msg this function transmits
                                                                //  that message to the users in same room.
    });

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id);
    });
});


server.listen(3001, ()=>{
    console.log("Server Running......")
})

