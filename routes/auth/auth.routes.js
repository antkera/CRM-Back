const router = require("express").Router();
const User = require("../../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isTokenValid = require("../../middlewares/auth.middlewares");
require('dotenv').config();

// POST "/api/auth/signup" => recibir data del usuario y lo crea en la DB
router.post("/signup", async (req, res, next) => {
  const { username, email, password, billingInfo } = req.body;

  // Validaciones
  if (!username || !email || !password) {
    return res.status(401).json({ errorMessage: "Todos los campos deben estar llenos" });
  }
  if (!billingInfo || !billingInfo.companyName || !billingInfo.dniOrCif || !billingInfo.address || !billingInfo.phone) {
    return res.status(401).json({ errorMessage: "Todos los campos de información de facturación deben estar llenos" });
  }

  try {
    // Verificar si el usuario ya existe
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(400).json({ errorMessage: "Este email ya está registrado" });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // Crear y guardar el nuevo usuario
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      billingInfo // Guardar la información de facturación
    });

    // Crear el payload para el token
    const payload = {
      username: newUser.username,
      _id: newUser._id,
      email: newUser.email,
    };

    // Generar el token de autenticación
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    // Enviar el token al frontend para mantener la sesión iniciada
    res.status(201).json({ message: "Usuario creado", authToken });
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => recibir credenciales del usuario y validarlo
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ errorMessage: "Todos los campos deben estar llenos" });
  }

  try {
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.status(400).json({ errorMessage: "Usuario no registrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ errorMessage: "Contraseña no válida" });
    }

    const payload = {
      username: foundUser.username,
      _id: foundUser._id,
      email: foundUser.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    res.json({ authToken });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Indicar al FE si el token es válido y quién es el usuario
router.get("/verify", isTokenValid, (req, res, next) => {
  res.json({ payload: req.payload });
});

module.exports = router;
