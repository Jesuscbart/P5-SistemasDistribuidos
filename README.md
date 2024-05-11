# chat-example

This is the source code for a very simple chat example used for
the [Getting Started](http://socket.io/get-started/chat/) guide
of the Socket.IO website.

Please refer to it to learn how to run this application.

You can also spin up a free Heroku dyno to test it out:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/socketio/chat-example)

Or run it on [Repl.it](https://repl.it/):

[![Run on Repl.it](https://repl.it/badge/github/socketio/chat-example)](https://repl.it/github/socketio/chat-example)

-------

## Funcionalidades extra

* Botón de cerrar conexión
* Contraseña de acceso

-------

## Temas a solucionar

* Coger estilos del proyecto robado
* Comentar código
* Mirar si se puede desplegar la aplicación (Heroku o como se llame)
* Hacer un readme
* Hacer memoria con diagrama


Muy bien. Ahora te voy a pedir que mejores los estilo. En primer lugar quiero que nada mas entrar, los botones Login y Sign Up estén centrados. En segundo lugar, quiero que los mensajes se vean mejor y se vaya deslizando la pantalla conforme aparecen mensajes nuevos en la parte inferior de la misma. Quiero que mejores el css en general. 

Te pongo en contexto de los nombres de las clases y todo:
index.html:
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Socket.IO chat</title>
    <link rel="stylesheet" type="text/css" href="/styles.css" />
  </head>
  <body>
    <button class="button" onclick="showForm('login')">Login</button>
    <button class="button" onclick="showForm('register')">Sign Up</button>

    <form id="login-form">
      <input type="text" id="username" placeholder="Username" autocomplete="off" required/>
      <input type="password" id="password" placeholder="Password" autocomplete="off" required/>
      <button type="submit">Login</button>
    </form>

    <form id="register-form">
      <input type="text" id="register-username" placeholder="Username" autocomplete="off" required/>
      <input type="password" id="register-password" placeholder="Password" autocomplete="off" required/>
      <button type="submit">Register</button>
    </form>

    <ul id="messages"></ul>
    <form id="form" action="" style="display: none">
      <input id="input" placeholder="Enter message" autocomplete="off" />
      <button type="submit">Send</button>
      <button type="button" id="close">Close Connection</button>
    </form>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/scripts.js"></script>
  </body>
</html>

scripts.js: 
const socket = io();
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const chatForm = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const loginButton = document.querySelector(
  "button[onclick=\"showForm('login')\"]",
);
const registerButton = document.querySelector(
  "button[onclick=\"showForm('register')\"]",
);

let isAuthenticated = false;

function showForm(type) {
  if (type === "login") {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  } else if (type === "register") {
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
  }
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  socket.emit("login", { username, password });
});

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  socket.emit("register", { username, password });
});

socket.on("login success", function () {
  isAuthenticated = true;
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  chatForm.style.display = "flex"; // Mostrar formulario de chat
  loginButton.style.display = "none"; // Ocultar botón de login
  registerButton.style.display = "none"; // Ocultar botón de registro
});

socket.on("login failed", function (message) {
  alert("Login failed: " + message);
});

socket.on("register success", function (message) {
  alert("Register successful: " + message);
  showForm("login"); // After successful registration, show the login form
});

socket.on("register failed", function (message) {
  alert("Register failed: " + message);
});

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value.trim() !== "") {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  if (!isAuthenticated) {
    console.log("Received message but user is not authenticated.");
    return; // No mostrar mensajes si no está autenticado
  }
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

document.getElementById("close").addEventListener("click", function () {
  socket.disconnect();
  chatForm.style.display = "none"; // Ocultar formulario de chat
  input.disabled = true; // Desactivar entrada de mensaje
  alert("You have been disconnected.");
});

styles.css: 
body {
  margin: 0;
  padding-bottom: 3rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

#login-form, #register-form, #form {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 3rem;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  display: none;
}

#input, #username, #register-username, #password, #register-password {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}

#input:focus, #username:focus, #register-username:focus, #password:focus, #register-password:focus {
  outline: none;
}

#login-form > button, #register-form > button, #form > button {
  background: #333;
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
  color: #fff;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding-top: 3rem;
  width: 100%; /* Full width */
  max-width: 800px; /* Maximum width */
  overflow: auto; /* Allow scrolling */
}

#messages > li {
  background-color: #fff; /* White background */
  padding: 10px 15px; /* Larger padding */
  margin-bottom: 8px; /* Space between messages */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Subtle shadow */
  max-width: 70%; /* Max width */
  word-wrap: break-word; /* Break long words */
}

#messages > li:nth-child(odd) {
  background: #efefef; /* Light grey for odd messages */
}

.button {
  padding: 10px 20px;
  margin: 10px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #003d7a;
}

index.js:
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

User.js: 
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
