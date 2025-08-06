const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const path = require("path"); // Path modülünü içe aktar
const db = require("../data/db"); // Veritabanı bağlantısını içe aktar



router.use("/blogs/category/:categoryid",async function (req, res, next) {
  const categoryId = req.params.categoryid; // URL'den kategori ID'sini al

  try {
    const blogs = await db.query("SELECT * FROM blog WHERE categoryid = ?",[categoryId]); // Veritabanından kategoriye göre blogları al
    const categories = await db.query("SELECT * FROM category"); // Kategorileri al
    
    res.render("users/blogs", {
      // Belirtilen kategoriye ait blogları listele
      title: "Kategori Blogları",
      blogs: blogs[0], // blogs[0] - blog kayıtları
      categories: categories[0], // categories[0] - kategori kayıtları
      selectedCategory: categoryId // Seçilen kategori ID'si
    });
  }
  catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
})
  // Kategoriye göre blogları listeleyen middleware fonksiyonu


router.use("/blogs/:id",  async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  const blogId = req.params.id; // URL'den blog ID'sini al

  try {
    const blog = await db.query("SELECT * FROM blog WHERE blogid = ?",[blogId]); // Veritabanından blogu al

    if (blog[0].length === 0) {
      // Eğer blog bulunamazsa, 404 sayfası göster
      return res.status(404).render("404", { title: "Blog Bulunamadı" });
    }

    res.render("users/blog-details",{
      blog: blog[0][0], // blog[0][0] - ilk kayıt
      title: blog[0][0].baslik // İlk kaydın başlığı
    }); // Belirtilen blog sayfasına erişildiğinde cevap gönder

  }
  catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }

  
});

router.use("/blogs", async function (req, res, next) {
  // İkinci middleware fonksiyonu

  try {
    const blogs = await db.execute("SELECT * FROM blog"); // Veritabanından blogları al
    const categories = await db.execute("SELECT * FROM category"); // Kategorileri al
    res.render("users/blogs", {
      // Anasayfaya erişildiğinde cevap gönder
      title: "Özel Kurslar",
      blogs: blogs[0], // blogs[0] doğru
      categories: categories[0], // categories[0] doğru
      selectedCategory: null // Seçilen kategori yok
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
});

router.use("/", async function (req, res, next) {
  // Middleware fonksiyonu tanımla.
  try {
    const blogs = await db.query("SELECT * FROM blog where anasayfa = 1"); // Anasayfa bloglarını al
    const categories = await db.query("SELECT * FROM category"); // Kategorileri al

    console.log(categories[0]);
    res.render("users/index", {
      // Anasayfaya erişildiğinde cevap gönder
      title: "Popüler Bloglar",
      blogs: blogs[0], // Database'den gelen blog verilerini kullan
      categories: categories[0], // Database'den gelen kategori verilerini kullan
      selectedCategory: null // Seçilen kategori yok
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
});

module.exports = router; // Router nesnesini dışa aktar
