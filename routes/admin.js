const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const path = require("path"); // Path modülünü içe aktar
const db = require("../data/db"); // Veritabanı bağlantısını içe aktar
const { upload } = require("../helpers/image-upload"); // Dosya yükleme middleware'ini içe aktar
const adminController = require("../controllers/admin"); // Admin kontrolcüsünü içe aktar
const authMiddleware = require("../middlewares/auth"); // Auth middleware'ini içe aktar
const csrf = require("../middlewares/csrf"); // CSRF middleware'ini içe aktar  

// Tüm admin rotalarına auth middleware'ini uygula

// DELETE onay sayfasını göster - GET isteği
router.get(
  "/admin/blogs/:blogid/delete",
  authMiddleware,
  csrf,
  adminController.get_blog_delete
);
// DELETE isteği ile blogu sil
router.post(
  "/admin/blogs/:blogid/delete",
  authMiddleware,
  csrf,
  adminController.post_blog_delete
);

//Kategori silme işlemi için GET isteği
router.get(
  "/admin/categories/:categoryid/delete",
  authMiddleware,
  csrf,
  adminController.get_category_delete
);

// DELETE isteği ile kategoriyi sil
// Kategori silme işlemi için POST isteği
// category-delete.ejs dosyasındaki formdan gelen veriyi al
router.post(
  "/admin/categories/:categoryid/delete",
  authMiddleware,
  csrf,
  adminController.post_category_delete
);

router.get(
  "/admin/blog/create",
  authMiddleware,
  csrf,
  adminController.get_blog_create
);

router.post(
  "/admin/blog/create",
  authMiddleware,
  csrf,
  upload.single("resim"),
  adminController.post_blog_create
);

router.get(
  "/admin/category/create",
  authMiddleware,
  csrf,
  adminController.get_category_create
);

router.post(
  "/admin/category/create",
  authMiddleware,
  csrf,
  adminController.post_category_create
);

router.get(
  "/admin/blogs/:blogid",
  authMiddleware,
  csrf,
  adminController.get_blog_edit
);

router.post(
  "/admin/blogs/:blogid",
  authMiddleware,
  csrf,
  upload.single("resim"),
  adminController.post_blog_edit
);

router.get(
  "/admin/categories/:categoryid",
  authMiddleware,
  csrf,
  adminController.get_category_edit
);

router.post(
  "/admin/categories/:categoryid",
  authMiddleware,
  csrf,
  adminController.post_category_edit
);

router.get("/admin/blogs", authMiddleware, adminController.get_blog_list);

router.get(
  "/admin/categories",
  authMiddleware,
  adminController.get_category_list
);

module.exports = router; // Router nesnesini dışa aktar
