// Importamos los módulos necesarios de Node.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

// Express app setup
const app = express();

// Crear un servidor HTTP usando Express
const server = http.createServer(app);

// Inicializar una nueva instancia de socket.io pasando el servidor HTTP
const io = socketIO(server);

// Importar mongoose y bcrypt para manejar la base de datos y la encriptación
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Importar el modelo de la base de datos
const User = require("./User");

// String de conexión a la base de datos
const mongoURI = process.env["mongoURI"];

// Definición correcta de activeUsers en un ámbito que es global a todo el archivo
const activeUsers = new Map();

// Conectar a MongoDB usando mongoose
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static("public"));

// Ruta para la página principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Manejo de conexiones socket.io
io.on("connection", (socket) => {

  // Escuchar eventos 'register' (registro)
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

  // Escuchar eventos 'login' (inicio de sesión)
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

      // Manejar desconexiones
      socket.on("disconnect", () => {
        activeUsers.delete(socket.username);
        io.emit("chat message", `${socket.username} has disconnected`); // Notificar desconexión
        console.log(`${socket.username} has disconnected`);
      });
    } else {
      socket.emit("login failed", "Invalid username or password");
    }
  });

  // Escuchar eventos 'chat message' (mensaje de chat)
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

// El servidor escucha en el puerto especificado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
