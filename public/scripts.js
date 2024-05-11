// Inicialización del socket
const socket = io();
// Referencias a los elementos del formulario y mensajes en el DOM
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

// Función para mostrar los formularios de login o registro
function showForm(type) {
  if (type === "login") {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  } else if (type === "register") {
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
  }
}

// Manejador de eventos para el formulario de login
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  socket.emit("login", { username, password });
});

// Manejador de eventos para el formulario de registro
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  socket.emit("register", { username, password });
});

//Eventos de socket para manejar el inicio de sesión y registro
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

// Evento de socket para manejar la recepción de mensajes
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

// Evento para desconectar el socket y limpiar la interfaz
document.getElementById("close").addEventListener("click", function () {
  socket.disconnect();
  chatForm.style.display = "none"; // Ocultar formulario de chat
  input.disabled = true; // Desactivar entrada de mensaje
  alert("You have been disconnected.");
});
