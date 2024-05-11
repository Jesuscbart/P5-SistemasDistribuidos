// Importar el módulo mongoose para trabajar con MongoDB
const mongoose = require("mongoose");

// Importar bcryptjs para hash de contraseñas, proporcionando seguridad al almacenar contraseñas
const bcrypt = require("bcryptjs");

// Definición del esquema de usuario en Mongoose
const UserSchema = new mongoose.Schema({
  // Campo 'username', que debe ser un string, es obligatorio y único
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Campo 'password', que debe ser un string y es obligatorio
  password: {
    type: String,
    required: true,
  },
});

// Middleware de Mongoose que se ejecuta antes del evento 'save' (guardar)
UserSchema.pre("save", async function (next) {
  const user = this;
  // Si la contraseña del usuario ha sido modificada (o es nueva), procede a encriptarla
  if (user.isModified("password")) {
    // Encriptar la contraseña usando bcrypt con un 'salt' de 8 rondas
    user.password = await bcrypt.hash(user.password, 8);
  }
  next(); // Continuar con el guardado del documento después de la encriptación
});

// Crear el modelo de usuario basado en el esquema definido anteriormente
const User = mongoose.model("User", UserSchema);

// Exportar el modelo para que pueda ser utilizado en otras partes de la aplicación
module.exports = User;
