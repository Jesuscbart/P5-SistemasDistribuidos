// Inicialización del socket en el lado del cliente.
const socket = io(); // Socket.IO es una biblioteca que permite la comunicación en tiempo real
// Referencias a los elementos del formulario y mensajes
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const chatForm = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

// Boton que onclick nos muestra el formulario de login
const loginButton = document.querySelector(
  "button[onclick=\"showForm('login')\"]",
);

// Boton que onclick nos muestra el formulario de registro
const registerButton = document.querySelector(
  "button[onclick=\"showForm('register')\"]",
);

// Booleano que nos indica si el usuario está autenticado
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
  isAuthenticated = true; // Cambiamos a true para indicar que el usuario está autenticado
  loginForm.style.display = "none"; // Ocultamos el formulario de login
  registerForm.style.display = "none"; // Ocultamos el formulario de registro
  chatForm.style.display = "flex"; // Mostramos el formulario de chat
  loginButton.style.display = "none"; // Ocultamos el botón de login
  registerButton.style.display = "none"; // Ocultamos el botón de registro
});

// Evento de socket para mostrar un mensaje de error de inicio de sesión
socket.on("login failed", function (message) {
  alert("Login failed: " + message);
});

// Evento de socket para mostrar que un usuario se ha registrado correctamente
socket.on("register success", function (message) {
  alert("Register successful: " + message);
  showForm("login"); // Después del registro, automáticamente se muestra el formulario de login
});

// Evento de socket para mostrar un mensaje de error de registro
socket.on("register failed", function (message) {
  alert("Register failed: " + message);
});

// Evento de socket para enviar un mensaje de chat
chatForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que la página se recargue al enviar el formulario
  if (input.value.trim() !== "") {
    // Si el mensaje no está vacío
    socket.emit("chat message", input.value); // Enviamos el mensaje al servidor
    input.value = ""; // Limpiamos el campo de entrada
  }
});

// Evento de socket para manejar la recepción de mensajes
socket.on("chat message", function (msg) {
  // Si por lo que sea el usuario no esta auteciado, no se muestra el mensaje
  if (!isAuthenticated) {
    console.log("Received message but user is not authenticated.");
    return;
  }
  const item = document.createElement("li"); // Creamos un elemento <li> (lista)
  item.textContent = msg; // Añadimos el mensaje al elemento <li>
  messages.appendChild(item); // Añadimos el elemento <li> al final de la lista de mensajes
  messages.scrollTop = messages.scrollHeight; // Desplazamos automáticamente al final de la lista de mensajes
});

// Evento para desconectar el socket y limpiar la interfaz
document.getElementById("close").addEventListener("click", function () {
  socket.disconnect(); // Desconectamos el socket
  chatForm.style.display = "none"; // Ocultar formulario de chat
  input.disabled = true; // Desactivar entrada de mensaje
  alert("You have been disconnected.");
});
