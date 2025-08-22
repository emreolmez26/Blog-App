const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const authController = require("../controllers/auth"); // ✅ DÜZELTME: auth controller'ı import et

router.get("/register", authController.get_register);
router.post("/register", authController.post_register);

router.get("/login", authController.get_login);
router.post("/login", authController.post_login);
router.get("/logout", authController.get_logout);
module.exports = router;