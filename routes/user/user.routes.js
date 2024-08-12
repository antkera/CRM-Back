const express = require("express");
const router = express.Router();
const User = require("../../models/User.model");

// '/user/profile' => Obtener el Perfil del Usuario
router.get("/profile", async (req, res, next) => {
  const userId = req.payload._id;

  try {
    const user = await User.findById(userId).select(
      "-password -clients -bills"
    );
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

//  '/user/billingInfo' => Actualizar Información de Facturación
router.put("/billingInfo", async (req, res, next) => {
  const { companyName, dniOrCif, address, phone } = req.body;
  const userId = req.payload._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        billingInfo: { companyName, dniOrCif, address, phone },
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        message: "Información de facturación actualizada",
        billingInfo: updatedUser.billingInfo,
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
