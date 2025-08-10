const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const { Server } = require("socket.io");
const cluster = require("cluster");
const os = require("os");
const redisAdapter = require("socket.io-redis");

app.use(express.static(path.join(__dirname + "/public")));
app.use(cors());

if (cluster.isMaster) {
    const cpuCount = os.cpus().length;
    console.log("cpuCount", cpuCount);
    console.log(`Master ${process.pid} is running`);

    // Fork workers equal to CPU cores
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        // console.log(`Worker ${worker.process.pid} died, starting a new worker`);
        cluster.fork();
    });
} else {
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    // Use socket.io-redis adapter with Redis server on localhost:6379
    io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

    io.on("connection", (socket) => {
        console.log(`User Connected : ${socket.id} on worker ${process.pid}`);

        socket.on("join_room", (data, name) => {
            socket.join(data);
            console.log(`${name} joined room: ${data}`);
        });

        socket.on("send_message", (data) => {
            console.log("send_message ", data);
            io.in(data.room).emit("messageRecieve", data);
            console.log("messageRecieve event emitted to room:", data.room);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });

    server.listen(3001, () => {
        // console.log(`Server Running on port 3001 by worker ${process.pid}`);
    });
}
