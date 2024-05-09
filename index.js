const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const path = require("path");

// Configuración de la ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Objeto que almacenará los clientes conectados
const clients = {};

// Configuración de autenticación y envío de mensajes
io.on("connection", (socket) => {
  clients[socket.id] = { isAuthenticated: false }; // Almacena el estado de autenticación

  // Recepción de mensajes de los clientes autenticados
  socket.on("chat message", (msg) => {
    if (clients[socket.id].isAuthenticated) {
      io.emit("chat message", msg);
    }
  });

  // Autenticación
  socket.on("check password", (password) => {
    const VALID_PASSWORD = "pass"; // CONTRASEÑA
    if (password === VALID_PASSWORD) {
      clients[socket.id].isAuthenticated = true;
      socket.emit("password correct");
    } else {
      socket.emit("password incorrect");
    }
  });

  // Desconexión
  socket.on("disconnect", () => {
    delete clients[socket.id];
  });
});

// Inicio del servidor en el puerto y host especificados
http.listen(port, host, () => {
  console.log(`Socket.IO server running at http://${host}:${port}/`);
});
