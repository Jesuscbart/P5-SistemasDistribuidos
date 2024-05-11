# Práctica 5 - Programación de sistemas distribuidos

Jesús Cuesta Bartolomé  
10/05/2024

## Chat en Tiempo Real

### Descripción
Este proyecto es una aplicación de chat en tiempo real construida con Node.js, que utiliza Socket.IO para la comunicación en tiempo real entre el servidor y los clientes, y MongoDB para almacenar datos de los usuarios. La aplicación permite a los usuarios registrarse, iniciar sesión, enviar mensajes y desconectarse, todo en tiempo real.

### Tecnologías Utilizadas
- **Node.js**: Plataforma de ejecución para JavaScript del lado del servidor.
- **Express**: Framework para aplicaciones web para Node.js.
- **Socket.IO**: Biblioteca para aplicaciones web en tiempo real.
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos de usuario.
- **Mongoose**: Biblioteca para modelar datos de MongoDB en aplicaciones Node.js.
- **Bcrypt**: Biblioteca para ayudar a hash contraseñas de manera segura.

### Características
- **Registro de Usuario**: Los usuarios pueden registrarse proporcionando un nombre de usuario y contraseña.
- **Inicio de Sesión de Usuario**: Los usuarios registrados pueden iniciar sesión utilizando sus credenciales.
- **Chat en Tiempo Real**: Los usuarios pueden enviar y recibir mensajes instantáneamente sin recargar la página.
- **Desconexión Segura**: Los usuarios pueden desconectarse y el sistema notifica a otros usuarios.
