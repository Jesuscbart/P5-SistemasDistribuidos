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
      socket.emit("register success", user.username);
      // Setea el usuario como autenticado aquí si es necesario
    } catch (error) {
      socket.emit(
        "register failed",
        "Username already exists or another error",
      );
    }
  });

  socket.on("login", async (credentials) => {
    try {
      const user = await User.findOne({ username: credentials.username });
      if (user && (await bcrypt.compare(credentials.password, user.password))) {
        socket.emit("login success", user.username);
        socket.username = user.username;
        socket.isAuthenticated = true; // Ensure this is set correctly
        console.log("User authenticated:", user.username); // Debug: Check user authentication
      } else {
        socket.emit("login failed", "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      socket.emit("login failed", "Login error");
    }
  });

  socket.on("chat message", (msg) => {
    console.log("Received message from:", socket.username); // Debug: Who is sending the message?
    console.log("Authenticated:", socket.isAuthenticated); // Debug: Is the sender authenticated?

    if (socket.isAuthenticated) {
      const messageWithUsername = `${socket.username}: ${msg}`;
      console.log("Broadcasting message:", messageWithUsername); // Debug: What message is being sent?
      io.emit("chat message", messageWithUsername);
    } else {
      console.log("Message not sent, user not authenticated."); // Debug: Authentication failed
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
