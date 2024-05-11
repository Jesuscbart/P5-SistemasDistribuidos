const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./User");

const mongoURI = process.env["mongoURI"];

// Definición correcta de activeUsers en un ámbito que es global a todo el archivo
const activeUsers = new Map();

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("register", async (credentials) => {
    try {
      const user = new User(credentials);
      await user.save();
      socket.isAuthenticated = true;
      socket.username = user.username;
      socket.emit("register success", user.username);
    } catch (error) {
      socket.emit("register failed", error.message);
    }
  });

  socket.on("login", async (credentials) => {
    const user = await User.findOne({ username: credentials.username });
    if (user && (await bcrypt.compare(credentials.password, user.password))) {
      if (activeUsers.has(user.username)) {
        socket.emit("login failed", "User already logged in");
        return;
      }

      // Añadir el usuario al mapa de usuarios activos
      activeUsers.set(user.username, socket.id);
      socket.username = user.username;
      socket.isAuthenticated = true;

      socket.emit("login success", user.username);
      io.emit("chat message", `${user.username} has joined the chat`); // Notificar a todos los usuarios

      // Escuchar desconexiones para eliminar al usuario del mapa
      socket.on("disconnect", () => {
        activeUsers.delete(socket.username);
        io.emit("chat message", `${socket.username} has disconnected`); // Notificar desconexión
        console.log(`${socket.username} has disconnected`);
      });
    } else {
      socket.emit("login failed", "Invalid username or password");
    }
  });

  socket.on("chat message", (msg) => {
    if (socket.isAuthenticated) {
      const messageWithUsername = `${socket.username}: ${msg}`;
      // Usar io.emit para enviar a todos los clientes, incluido el remitente
      io.emit("chat message", messageWithUsername);
    } else {
      console.log("Attempt to send message by unauthenticated user.");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
