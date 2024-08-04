const router = require("express").Router();
const isTokenValid = require("../middlewares/auth.middlewares");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// const authRoutes = require("./auth/auth.routes");
// router.use("/auth", authRoutes);

// const userRoutes = require("./user/user.routes");
// router.use("/user", isTokenValid, userRoutes);

// const uploadRoutes = require("./upload.routes");
// router.use("/upload",isTokenValid, uploadRoutes);


module.exports = router;
