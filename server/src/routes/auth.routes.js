const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/authenticate");

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);         // gera novo accessToken
router.get("/me", authenticate, authController.getMe);   // rota protegida

module.exports = router;