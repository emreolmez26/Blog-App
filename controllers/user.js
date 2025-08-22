const Blog = require("../models/blog"); // Blog modelini içe aktar
const Category = require("../models/category"); // Kategori modelini içe aktar

const { Op } = require("sequelize"); // Sequelize operatörlerini içe aktar

module.exports.blogs_by_category = async function (req, res, next) {
  const slug = req.params.slug; // URL'den kategori slug'ını al
  const size = 3; // Sayfa başına blog sayısı
  const { page = 0 } = req.query; // URL'den sayfa numarasını al

  try {
    // Önce slug ile kategoriyi bul
    const category = await Category.findOne({
      where: { url: slug },
      raw: true,
    });

    if (!category) {
      return res.status(404).render("404", { title: "Kategori Bulunamadı" });
    }

    // Kategori ID'si ile blogları bul (sayfalama ile)
    const { count, rows } = await Blog.findAndCountAll({
      where: { categoryId: category.id }, // ✅ DÜZELTME: categoryId ile filtrele
      include: [
        {
          model: Category,
          attributes: ["name", "url"],
        },
      ],
      raw: false,
      limit: size, // ✅ Sayfa başına blog sayısı
      offset: page * size, // ✅ Kaç tane blog atlanacak
    });

    const categories = await Category.findAll({ raw: true }); // Kategorileri al

    console.log(
      `${category.name} kategorisinde ${count} toplam blog, ${rows.length} blog gösteriliyor (Sayfa: ${
        parseInt(page) + 1
      })`
    ); // Debug için

    res.render("users/blogs", {
      // Belirtilen kategoriye ait blogları listele
      title: `${category.name} Blogları`,
      blogs: rows, // ✅ findAndCountAll'dan gelen rows
      totalItems: count, // ✅ Toplam blog sayısı
      totalPages: Math.ceil(count / size), // ✅ Toplam sayfa sayısı
      currentPage: parseInt(page) + 1, // ✅ Mevcut sayfa (1'den başlar)
      categories: categories,
      selectedCategory: category.url, // Seçilen kategori URL'si
      
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
};

module.exports.blog_detail = async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  const slug = req.params.slug; // URL'den blog ID'sini al

  try {
    const blog = await Blog.findOne({ where: { url: slug }, raw: true }); // ✅ DÜZELTME: 'id' kullan, 'blogid' değil

    if (!blog) {
      // Eğer blog bulunamazsa, 404 sayfası göster
      return res.status(404).render("404", { title: "Blog Bulunamadı" });
    }

    res.render("users/blog-details", {
      blog: blog, // blog[0][0] - ilk kayıt
      title: blog.baslik, // İlk kaydın başlığı
      
    }); // Belirtilen blog sayfasına erişildiğinde cevap gönder
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
};

module.exports.blog_list = async function (req, res, next) {
  // İkinci middleware fonksiyonu
  const size = 3;
  const { page = 0 } = req.query;

  try {
    const { count, rows } = await Blog.findAndCountAll({
      raw: true,
      limit: size,
      offset: page * size,
    }); // Veritabanından blogları al
    const categories = await Category.findAll({ raw: true }); // Kategorileri al
    res.render("users/blogs", {
      // Anasayfaya erişildiğinde cevap gönder
      title: "Özel Kurslar",
      blogs: rows, // blogs[0] doğru
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: parseInt(page) + 1, // Sayfa numarasını 1'den başlat
      categories: categories, // categories[0] doğru
      selectedCategory: null, // Seçilen kategori yok
      
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
};

module.exports.index = async function (req, res, next) {
  console.log(req.cookies);
  // Middleware fonksiyonu tanımla.
  const size = 3; // Sayfa başına blog sayısı
  const { page = 0 } = req.query; // URL'den sayfa numarasını al

  try {
    const { count, rows } = await Blog.findAndCountAll({ 
      where: { anasayfa: 1 }, 
      raw: true,
      limit: size,
      offset: page * size
    }); // Anasayfa bloglarını al
    const categories = await Category.findAll({ raw: true }); // Kategorileri al

    console.log(`Anasayfada ${count} toplam blog, ${rows.length} blog gösteriliyor (Sayfa: ${parseInt(page) + 1})`);
    res.render("users/index", {
      // Anasayfaya erişildiğinde cevap gönder
      title: "Popüler Bloglar",
      blogs: rows, // ✅ findAndCountAll'dan gelen rows
      totalItems: count, // ✅ Toplam blog sayısı
      totalPages: Math.ceil(count / size), // ✅ Toplam sayfa sayısı
      currentPage: parseInt(page) + 1, // ✅ Mevcut sayfa (1'den başlar)
      categories: categories, // Database'den gelen kategori verilerini kullan
      selectedCategory: null, // Seçilen kategori yok
      
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Veritabanı hatası");
  }
};
