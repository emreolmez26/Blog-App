const express = require("express"); // Express modülünü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const path = require("path"); // Path modülünü içe aktar
const db = require("../data/db"); // Veritabanı bağlantısını içe aktar
const Blog = require("../models/blog"); // Blog modelini içe aktar
const Category = require("../models/category"); // Kategori modelini içe aktar
const {Op} = require("sequelize"); // Sequelize operatörlerini içe aktar



router.use("/blogs/category/:categoryid",async function (req, res, next) {
  const categoryId = req.params.categoryid; // URL'den kategori ID'sini al

  try {
    const blogs = await Blog.findAll({ where: { categoryid: categoryId }, raw: true }); // Veritabanından kategoriye göre blogları al
    const categories = await Category.findAll({ raw: true }); // Kategorileri al

    res.render("users/blogs", {
      // Belirtilen kategoriye ait blogları listele
      title: "Kategori Blogları",
      blogs: blogs, // blogs - blog kayıtları
      categories: categories, // categories - kategori kayıtları
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
    const blog = await Blog.findOne({ where: { blogid: blogId }, raw: true }); // Veritabanından blogu al

    if (!blog) {
      // Eğer blog bulunamazsa, 404 sayfası göster
      return res.status(404).render("404", { title: "Blog Bulunamadı" });
    }

    res.render("users/blog-details",{
      blog: blog, // blog[0][0] - ilk kayıt
      title: blog.baslik // İlk kaydın başlığı
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
    const blogs = await Blog.findAll({ raw: true }); // Veritabanından blogları al
    const categories = await Category.findAll({ raw: true }); // Kategorileri al
    res.render("users/blogs", {
      // Anasayfaya erişildiğinde cevap gönder
      title: "Özel Kurslar",
      blogs: blogs, // blogs[0] doğru
      categories: categories, // categories[0] doğru
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
    const blogs = await Blog.findAll({ where: { anasayfa: 1 }, }, { raw: true }); // Anasayfa bloglarını al
    const categories = await Category.findAll({ raw: true }); // Kategorileri al

    console.log(categories[0]);
    res.render("users/index", {
      // Anasayfaya erişildiğinde cevap gönder
      title: "Popüler Bloglar",
      blogs: blogs, // Database'den gelen blog verilerini kullan
      categories: categories, // Database'den gelen kategori verilerini kullan
      selectedCategory: null // Seçilen kategori yok
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
});

module.exports = router; // Router nesnesini dışa aktar
