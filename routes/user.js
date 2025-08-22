const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const path = require("path"); // Path modülünü içe aktar
const db = require("../data/db"); // Veritabanı bağlantısını içe aktar
const userController = require("../controllers/user"); // Kullanıcı kontrolcüsünü içe aktar



router.get("/blogs/category/:slug",userController.blogs_by_category);
  // Kategoriye göre blogları listeleyen middleware fonksiyonu


router.get("/blogs/:slug", userController.blog_detail); 
  // Blog detayını gösteren middleware fonksiyonu

router.get("/blogs", userController.blog_list);

router.get("/", userController.index);

module.exports = router; // Router nesnesini dışa aktar
