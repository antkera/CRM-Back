const express = require("express");
const router = express.Router();
const Client = require("../../models/Client.model");
const User = require("../../models/User.model");
const { body, validationResult } = require("express-validator");

// Middleware de validación para la creación y actualización de clientes
const clientValidation = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("dni")
    .matches(/^([0-9]{8}[A-Z])|([A-Z][0-9]{7}[0-9A-Z])$/)
    .withMessage(
      "El campo debe ser un DNI válido (8 dígitos + letra) o un CIF válido (letra + 7 dígitos + dígito/letra)"
    ),
  body("direccion").notEmpty().withMessage("La dirección es requerida"),
  body("telefono").notEmpty().withMessage("El teléfono es requerido"),
  body("email")
    .isEmail()
    .withMessage("Email no válido. Debe seguir el formato usuario@dominio.com"),
  body("hijos").isArray().withMessage("Hijos debe ser un array de nombres"),
];

// Todas las rutas se les añade "/api/client"

// Crear un nuevo cliente y asignarlo al usuario
router.post("/newClient", clientValidation, async (req, res, next) => {
  console.log("creando cliente");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, apellidos, dni, direccion, telefono, email, hijos } =
    req.body;
  const userId = req.payload._id;

  try {
    const existingClient = await Client.findOne({ dni });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Ya existe un cliente con este DNI" }); // Devuelve un error si el DNI ya está en uso
    }
  } catch (error) {
    next(error);
  }

  try {
    const newClient = new Client({
      nombre,
      apellidos,
      dni,
      direccion,
      telefono,
      email,
      hijos,
    });

    const client = await newClient.save();

    // Asignar el cliente al usuario
    await User.findByIdAndUpdate(userId, { $push: { clients: client._id } });

    res.status(201).json({ message: "Cliente creado", client });
  } catch (error) {
    next(error);
  }
});

// Leer todos los clientes asignados al usuario
router.get("/showClients", async (req, res, next) => {
  const userId = req.payload._id;

  try {
    const user = await User.findById(userId).populate("clients");
    res.status(200).json(user.clients);
  } catch (error) {
    next(error);
  }
});

// Actualizar un cliente
router.put("/updateClient/:id", clientValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { nombre, apellidos, dni, direccion, telefono, email, hijos } =
    req.body;
  const userId = req.payload._id;

  try {
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const user = await User.findById(userId);
    if (!user.clients.includes(id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este cliente" });
    }

    client.nombre = nombre;
    client.apellidos = apellidos;
    client.dni = dni;
    client.direccion = direccion;
    client.telefono = telefono;
    client.email = email;
    client.hijos = hijos;

    await client.save();
    res.status(200).json({ message: "Cliente actualizado", client });
  } catch (error) {
    next(error);
  }
});

// Eliminar un cliente y desasignarlo del usuario
router.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  const userId = req.payload._id;

  try {
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const user = await User.findById(userId);
    if (!user.clients.includes(id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este cliente" });
    }

    await Client.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { clients: id } });

    res.status(200).json({ message: "Cliente eliminado" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
