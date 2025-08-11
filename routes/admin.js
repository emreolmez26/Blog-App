const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const path = require("path"); // Path modülünü içe aktar
const db = require("../data/db"); // Veritabanı bağlantısını içe aktar
const { upload } = require("../helpers/image-upload"); // Dosya yükleme middleware'ini içe aktar
const fs = require("fs"); // Dosya sistemi modülünü içe aktar
const Blog = require("../models/blog"); // Blog modelini içe aktar
const Category = require("../models/category"); // Kategori modelini içe aktar

// DELETE onay sayfasını göster - GET isteği
router.get("/admin/blogs/:blogid/delete", async function (req, res, next) {
  const blogId = req.params.blogid; // URL'den blog ID'sini al

  try {
    const blog = await Blog.findOne({ where: { blogid: blogId }, raw: true }); // Veritabanından blogu al

    res.render("admin/blog-delete", {
      // blog-delete.ejs dosyasını render et
      title: "Blog Sil",
      blog: blog, // blog - silinecek blog kaydı
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Blog silinirken bir hata oluştu.");
  }
});
// DELETE isteği ile blogu sil
router.post("/admin/blogs/:blogid/delete", async function (req, res, next) {
  // Blog silme işlemi için POST isteği
  // blog-delete.ejs dosyasındaki formdan gelen veriyi al
  const blogId = req.body.blogid; // Formdan blog ID'sini al

  try {
    await Blog.destroy({ where: { blogid: blogId } }); // Veritabanından blogu sil
    res.redirect("/admin/blogs?action=delete"); // Başarılıysa blog listesine yönlendir
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Blog silinirken bir hata oluştu.");
  }
});

//Kategori silme işlemi için GET isteği
router.get(
  "/admin/categories/:categoryid/delete",
  async function (req, res, next) {
    const categoryId = req.params.categoryid; // URL'den kategori ID'sini al

    try {
      const category = await Category.findOne({ where: { categoryid: categoryId }, raw: true }); // Veritabanından kategoriyi al

      res.render("admin/category-delete", {
        // category-delete.ejs dosyasını render et
        title: "Kategori Sil",
        category: category, // category - silinecek kategori kaydı
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).send("Kategori silinirken bir hata oluştu.");
    }
  }
);

// DELETE isteği ile kategoriyi sil
// Kategori silme işlemi için POST isteği
// category-delete.ejs dosyasındaki formdan gelen veriyi al
router.post(
  "/admin/categories/:categoryid/delete",
  async function (req, res, next) {
    // Kategori silme işlemi için POST isteği
    // category-delete.ejs dosyasındaki formdan gelen veriyi al
    const categoryId = req.body.categoryid; // Formdan kategori ID'sini al

    try {
      await Category.destroy({ where: { categoryid: categoryId } }); // Veritabanından kategoriyi sil
      res.redirect("/admin/categories?action=delete"); // Başarılıysa kategori listesine yönlendir
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).send("Kategori silinirken bir hata oluştu.");
    }
  }
);

router.get("/admin/blog/create", async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  try {
    const categories = await Category.findAll(); // Kategorileri al
    res.render("admin/blog-create", {
      title: "Yeni Blog Oluştur",
      categories: categories, // categories - kategori kayıtları
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.render("admin/blog-create", { title: "Yeni Blog Oluştur" });
  }
});

router.post(
  "/admin/blog/create",
  upload.single("resim"),
  async function (req, res, next) {
    const baslik = req.body.baslik; // Formdan başlığı al
    const aciklama = req.body.aciklama; // Formdan içeriği al
    const resim = req.file ? req.file.filename : "default.jpg"; // Dosya varsa filename'i al, yoksa default kullan
    const kategori = req.body.kategori; // Formdan kategoriyi al
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0; // Anasayfa seçeneğini kontrol et
    const altbaslik = req.body.altbaslik; // Formdan alt başlığı al

    console.log("Form verileri:", {
      baslik,
      aciklama,
      resim,
      kategori,
      anasayfa,
    }); // Debug için

    try {
      // Veritabanına yeni blog kaydı ekle
      await Blog.create({
        baslik,
        altbaslik,
        aciklama,
        resim,
        anasayfa,
        categoryid: kategori,
      });
      res.redirect("/admin/blogs?action=create"); // Başarılıysa blog listesine yönlendir
    } catch (error) {
      console.error("Error creating blog:", error);
      res
        .status(500)
        .send("Blog oluşturulurken bir hata oluştu: " + error.message);
    }
  }
);
router.get("/admin/category/create", async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  try {
    res.render("admin/category-create", {
      // category-create.ejs dosyasını render et
      title: "Yeni Kategori Oluştur",
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

router.post("/admin/category/create", async function (req, res, next) {
  const name = req.body.name; // Formdan başlığı al
  try {
    // Veritabanına yeni kategori kaydı ekle
    await Category.create({ name });
    res.redirect("/admin/categories?action=create"); // Başarılıysa kategori listesine yönlendir
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("Kategori oluşturulurken bir hata oluştu.");
  }
  console.log(req.body); // Form verilerini konsola yazdır
});

router.get("/admin/blogs/:blogid", async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  const blogId = req.params.blogid; // URL'den blog ID'sini al

  try {
    const blog = await Blog.findByPk(blogId); // Veritabanından blogu al
    const categories = await Category.findAll(); // Kategorileri al
    res.render("admin/blog-edit", {
      title: blog.dataValues.baslik,
      blog: blog.dataValues, // blog - düzenlenecek blog kaydı
      // Sequelize findAll() bir dizi döndürür; .dataValues sadece tek bir kayıt içindir.
      // EJS içerisinde forEach ile dönebilmek için doğrudan diziyi gönderiyoruz.
      categories: categories,
    }); // Belirtilen blog sayfasına erişildiğinde cevap gönder
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).send("Blog alınırken bir hata oluştu.");
  }
});

router.post(
  "/admin/blogs/:blogid",
  upload.single("resim"),
  async function (req, res, next) {
    const blogid = req.params.blogid; // ✅ DOĞRU - URL'den blog ID'sini al
    const baslik = req.body.baslik; // Formdan başlığı al
    const aciklama = req.body.aciklama; // Formdan içeriği al
    const resim = req.file ? req.file.filename : req.body.resim; // Yeni dosya varsa onu al, yoksa mevcut resmi koru
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0; // Anasayfa seçeneğini kontrol et
    const kategoriid = req.body.kategori; // Formdan kategoriyi al
    const altbaslik = req.body.altbaslik; // Formdan alt başlığı al

    console.log("Güncellenecek blog ID:", blogid); // Debug için
    console.log("Dosya bilgisi:", req.file); // Debug için

    try {
      // Veritabanında blog kaydını güncelle
      await Blog.update(
        {
          baslik,
          altbaslik,
          aciklama,
          resim,
          anasayfa,
          categoryid: kategoriid
        },
        {
          where: { blogid: blogid }
        }
      );
      res.redirect("/admin/blogs?action=edit"); // Başarılıysa blog listesine yönlendir
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).send("Blog güncellenirken bir hata oluştu.");
    }
  }
);

router.get("/admin/categories/:categoryid", async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  const categoryId = req.params.categoryid; // URL'den kategori ID'sini al
  try {
    // Kategori ID'sine göre kategoriyi bul
    const category = await Category.findByPk(categoryId); // Kategori ID'sine göre kategoriyi bul
    console.log(category);
    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.name,
        category: category.dataValues, // Kategori verilerini gönder. dataValues kullanma sebebi
      }); // Belirtilen kategori sayfasına erişildiğinde cevap gönder
    }
    res.redirect("/admin/categories");
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Kategori alınırken bir hata oluştu.");
  }
});
router.post("/admin/categories/:categoryid", async function (req, res, next) {
  const categoryid = req.params.categoryid; // ✅ DOĞRU - URL'den kategori ID'sini al
  const name = req.body.name; // Formdan başlığı al
  try {
    // Veritabanında kategori kaydını güncelle
    await Category.update(
      { name },
      { where: { categoryid } }
    );
    res.redirect("/admin/categories?action=edit"); // Başarılıysa kategori listesine yönlendir
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Kategori güncellenirken bir hata oluştu.");
  }
});

router.get("/admin/blogs", async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  try {
    const blogs = await Blog.findAll({
      attributes: ["blogid", "baslik", "altbaslik", "resim"],
    }); // Veritabanından bloglar
    res.render("admin/blog-list", {
      title: "Blog Listesi",
      blogs: blogs,
      action: req.query.action,
    }); // Belirtilen blog sayfasına erişildiğinde cevap gönderir.req.query.action - yönlendirme için kullanılan query parametresi
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Bloglar alınırken bir hata oluştu.");
  }
});
router.get("/admin/categories", async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  try {
    const categories = await Category.findAll(); // Veritabanından kategoriler

    res.render("admin/category-list", {
      title: "Kategori Listesi",
      categories: categories,
      action: req.query.action,
    }); // Belirtilen kategori sayfasına erişildiğinde cevap gönderir.req.query.action - yönlendirme için kullanılan query parametresi
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Kategoriler alınırken bir hata oluştu.");
  }
});

module.exports = router; // Router nesnesini dışa aktar
