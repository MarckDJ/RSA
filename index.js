const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const RSA = require("./rsa");

app.set("port", 8080);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
io.on("connection", (socket) => {
    socket.on("send msg", (data) => {
        var secreto = RSA.encriptar(data);
        io.emit("cipher", {
            msg: secreto.mensaje,
            p: secreto.p,
            q: secreto.q,
            e: secreto.e,
        });
    });
    socket.on("send secret", (data) => {
        var secreto = RSA.desencriptar(data.e, data.q, data.p, data.msg);
        io.emit("clear", {
            msg: secreto,
        });
    });
});

http.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});
