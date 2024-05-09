const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users = []; // Almacena los usuarios registrados

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("register", (credentials) => {
    const userExists = users.find(
      (user) => user.username === credentials.username,
    );
    if (!userExists) {
      users.push({
        username: credentials.username,
        password: credentials.password,
      });
      socket.emit("register success", credentials.username);
      socket.isAuthenticated = true; // Marcar el usuario como autenticado
      socket.username = credentials.username; // Almacenar el nombre de usuario en el socket
    } else {
      socket.emit("register failed", "Username already exists");
    }
  });

  socket.on("login", (credentials) => {
    const user = users.find(
      (user) =>
        user.username === credentials.username &&
        user.password === credentials.password,
    );
    if (user) {
      socket.emit("login success", credentials.username);
      socket.isAuthenticated = true;
      socket.username = credentials.username;
    } else {
      socket.emit("login failed", "Invalid username or password");
    }
  });

  socket.on("chat message", (msg) => {
    if (socket.isAuthenticated) {
      const messageWithUsername = `${socket.username}: ${msg}`;
      io.emit("chat message", messageWithUsername);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
