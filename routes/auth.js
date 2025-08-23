const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const authController = require("../controllers/auth"); // ✅ DÜZELTME: auth controller'ı import et
const csrf = require("../middlewares/csrf"); // CSRF middleware'ini içe aktar

router.get("/register",csrf, authController.get_register);
router.post("/register", authController.post_register);

router.get("/login", csrf, authController.get_login);
router.post("/login", authController.post_login);
router.get("/logout", csrf, authController.get_logout);
module.exports = router;
