const express = require('express');
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);


app.set("view engine","ejs");
// ststic file html css
// app.set(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname, "public")));


// Handle socket connections
io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit("user-disconnected", socket.id);
    });
});

// Render the main page
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});