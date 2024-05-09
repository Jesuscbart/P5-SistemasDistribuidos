const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Credenciales válidas
const VALID_USERNAME = "admin"; // Cambia esto por el usuario que quieras
const VALID_PASSWORD = "pass"; // Cambia esto por la contraseña que quieras

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.isAuthenticated = false; // Estado inicial de autenticación

  socket.on("login", (credentials) => {
    if (
      credentials.username === VALID_USERNAME &&
      credentials.password === VALID_PASSWORD
    ) {
      socket.emit("login success");
      socket.isAuthenticated = true;
      socket.username = VALID_USERNAME; // Almacenamos el nombre de usuario en el socket
    } else {
      socket.emit("login failed");
    }
  });

  socket.on("chat message", (msg) => {
    if (socket.isAuthenticated) {
      const messageWithUsername = `${socket.username}: ${msg}`; // Formato del mensaje con el nombre de usuario
      io.emit("chat message", messageWithUsername);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
