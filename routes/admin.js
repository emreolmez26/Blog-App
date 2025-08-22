const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const path = require("path"); // Path modülünü içe aktar
const db = require("../data/db"); // Veritabanı bağlantısını içe aktar
const { upload } = require("../helpers/image-upload"); // Dosya yükleme middleware'ini içe aktar
const adminController = require("../controllers/admin"); // Admin kontrolcüsünü içe aktar



// DELETE onay sayfasını göster - GET isteği
router.get("/admin/blogs/:blogid/delete", adminController.get_blog_delete);
// DELETE isteği ile blogu sil
router.post("/admin/blogs/:blogid/delete", adminController.post_blog_delete);

//Kategori silme işlemi için GET isteği
router.get("/admin/categories/:categoryid/delete", adminController.get_category_delete);

// DELETE isteği ile kategoriyi sil
// Kategori silme işlemi için POST isteği
// category-delete.ejs dosyasındaki formdan gelen veriyi al
router.post("/admin/categories/:categoryid/delete", adminController.post_category_delete);

router.get("/admin/blog/create", adminController.get_blog_create);

router.post("/admin/blog/create",upload.single("resim"),adminController.post_blog_create);

router.get("/admin/category/create",adminController.get_category_create);

router.post("/admin/category/create",adminController.post_category_create);

router.get("/admin/blogs/:blogid",adminController.get_blog_edit);

router.post("/admin/blogs/:blogid",upload.single("resim"),adminController.post_blog_edit);

router.get("/admin/categories/:categoryid",adminController.get_category_edit);

router.post("/admin/categories/:categoryid",adminController.post_category_edit);

router.get("/admin/blogs",adminController.get_blog_list);

router.get("/admin/categories",adminController.get_category_list);

module.exports = router; // Router nesnesini dışa aktar
