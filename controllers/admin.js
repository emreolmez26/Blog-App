const Blog = require("../models/blog"); // Blog modelini içe aktar
const Category = require("../models/category"); // Kategori modelini içe aktar
const fs = require("fs"); // Dosya sistemi modülünü içe aktar
const slugify = require("../helpers/slugify"); // Slugify fonksiyonunu içe aktar


exports.get_blog_delete = async function (req, res, next) {
  const blogId = req.params.blogid; // URL'den blog ID'sini al

  try {
    const blog = await Blog.findOne({ where: { id: blogId }, raw: true }); // Veritabanından blogu al

    res.render("admin/blog-delete", {
      // blog-delete.ejs dosyasını render et
      title: "Blog Sil",
      blog: blog, // blog - silinecek blog kaydı
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Blog silinirken bir hata oluştu.");
  }
};
exports.post_blog_delete = async function (req, res, next) {
  // Blog silme işlemi için POST isteği
  // blog-delete.ejs dosyasındaki formdan gelen veriyi al
  const blogId = req.body.blogid; // Formdan blog ID'sini al

  try {
    await Blog.destroy({ where: { id: blogId } }); // Veritabanından blogu sil
    res.redirect("/admin/blogs?action=delete"); // Başarılıysa blog listesine yönlendir
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Blog silinirken bir hata oluştu.");
  }
};

exports.get_category_delete = async function (req, res, next) {
  const categoryId = req.params.categoryid; // URL'den kategori ID'sini al

  try {
    const category = await Category.findOne({
      where: { id: categoryId }, // ✅ DÜZELTME: 'id' kullan, 'categoryid' değil
      raw: true,
    }); // Veritabanından kategoriyi al

    res.render("admin/category-delete", {
      // category-delete.ejs dosyasını render et
      title: "Kategori Sil",
      category: category, // category - silinecek kategori kaydı
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Kategori silinirken bir hata oluştu.");
  }
};

exports.post_category_delete = async function (req, res, next) {
  // Kategori silme işlemi için POST isteği
  // category-delete.ejs dosyasındaki formdan gelen veriyi al
  const categoryId = req.body.categoryid; // Formdan kategori ID'sini al

  try {
    // Önce bu kategoriye ait blog var mı kontrol et
    const blogsInCategory = await Blog.findAll({
      where: { categoryId: categoryId },
    });

    if (blogsInCategory.length > 0) {
      // Bu kategoriye ait bloglar varsa uyarı ver
      const category = await Category.findOne({
        where: { id: categoryId },
        raw: true,
      });

      return res.render("admin/category-delete", {
        title: "Kategori Sil",
        category: category,
        error: `Bu kategoriye ait ${blogsInCategory.length} adet blog bulunmaktadır. Önce bu blogları silmeniz veya başka kategoriye taşımanız gerekmektedir.`,
      });
    }

    // Kategoriye ait blog yoksa güvenle sil
    await Category.destroy({ where: { id: categoryId } }); // Veritabanından kategoriyi sil
    res.redirect("/admin/categories?action=delete"); // Başarılıysa kategori listesine yönlendir
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Kategori silinirken bir hata oluştu.");
  }
};

exports.get_blog_create = async function (req, res, next) {
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
};

exports.post_blog_create = async function (req, res, next) {
  const baslik = req.body.baslik; // Formdan başlığı al
  const url = slugify(baslik); // Slugify ile başlıktan URL oluştur
  const aciklama = req.body.aciklama; // Formdan içeriği al
  const resim = req.file ? req.file.filename : "default.jpg"; // Dosya varsa filename'i al, yoksa default kullan
  const kategori = req.body.kategori; // Formdan kategoriyi al
  const anasayfa = req.body.anasayfa == "on" ? 1 : 0; // Anasayfa seçeneğini kontrol et
  const altbaslik = req.body.altbaslik; // Formdan alt başlığı al

  // ✅ DÜZELTME: Kategori kontrolü ekledik
  if (!kategori || kategori === '') {
    const categories = await Category.findAll({ raw: true });
    return res.render("admin/blog-create", {
      title: "Yeni Blog Oluştur",
      categories: categories,
      error: "Lütfen bir kategori seçin!"
    });
  }

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
      url, // ✅ DÜZELTME: url alanını ekledik
      altbaslik,
      aciklama,
      resim,
      anasayfa,
      categoryId: kategori,
    });
    res.redirect("/admin/blogs?action=create"); // Başarılıysa blog listesine yönlendir
  } catch (error) {
    console.error("Error creating blog:", error);
    res
      .status(500)
      .send("Blog oluşturulurken bir hata oluştu: " + error.message);
  }
};

exports.get_category_create = async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  try {
    res.render("admin/category-create", {
      // category-create.ejs dosyasını render et
      title: "Yeni Kategori Oluştur",
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

exports.post_category_create = async function (req, res, next) {
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
};

exports.get_blog_edit = async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  const blogId = req.params.blogid; // URL'den blog ID'sini al

  try {
    const blog = await Blog.findByPk(blogId); // Veritabanından blogu al (findByPk otomatik olarak 'id' kolonunu kullanır)
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
};

exports.post_blog_edit = async function (req, res, next) {
  const blogid = req.params.blogid; // ✅ DOĞRU - URL'den blog ID'sini al
  const baslik = req.body.baslik; // Formdan başlığı al
  const url = slugify(baslik); // ✅ DÜZELTME: Başlıktan URL oluştur
  const aciklama = req.body.aciklama; // Formdan içeriği al
  const resim = req.file ? req.file.filename : req.body.resim; // Yeni dosya varsa onu al, yoksa mevcut resmi koru
  const anasayfa = req.body.anasayfa == "on" ? 1 : 0; // Anasayfa seçeneğini kontrol et
  const kategoriid = req.body.kategori; // Formdan kategoriyi al
  const altbaslik = req.body.altbaslik; // Formdan alt başlığı al

  // ✅ DÜZELTME: Kategori kontrolü ekledik
  if (!kategoriid || kategoriid === '') {
    const blog = await Blog.findOne({ where: { id: blogid }, raw: true });
    const categories = await Category.findAll({ raw: true });
    return res.render("admin/blog-edit", {
      title: "Blog Düzenle",
      blog: blog,
      categories: categories,
      error: "Lütfen bir kategori seçin!"
    });
  }

  console.log("Güncellenecek blog ID:", blogid); // Debug için
  console.log("Dosya bilgisi:", req.file); // Debug için
  console.log("Kaydedilecek resim adı:", resim); // Debug için resim adını göster
  console.log("Mevcut resim (hidden input):", req.body.resim); // Debug için mevcut resim adını göster

  try {
    // Veritabanında blog kaydını güncelle
    await Blog.update(
      {
        baslik,
        url, // ✅ DÜZELTME: url alanını ekledik
        altbaslik,
        aciklama,
        resim,
        anasayfa,
        categoryId: kategoriid,
      },
      {
        where: { id: blogid },
      }
    );

    console.log("Blog başarıyla güncellendi, yeni resim:", resim); // Debug için
    res.redirect("/admin/blogs?action=edit"); // Başarılıysa blog listesine yönlendir
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).send("Blog güncellenirken bir hata oluştu.");
  }
};

exports.get_category_edit = async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  const categoryId = req.params.categoryid; // URL'den kategori ID'sini al
  try {
    // Kategori ID'sine göre kategoriyi bul
    const category = await Category.findByPk(categoryId); // Kategori ID'sine göre kategoriyi bul
    const blogs = await category.getBlogs(); // Kategoriye ait blogları al
    console.log(category);
    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.name,
        category: category.dataValues, // Kategori verilerini gönder. dataValues kullanma sebebi
        blogs: blogs, // Kategoriye ait blogları gönder
      }); // Belirtilen kategori sayfasına erişildiğinde cevap gönder
    }
    res.redirect("/admin/categories");
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send("Kategori alınırken bir hata oluştu.");
  }
};
exports.post_category_edit = async function (req, res, next) {
  const categoryid = req.params.categoryid; // ✅ DOĞRU - URL'den kategori ID'sini al
  const name = req.body.name; // Formdan başlığı al
  try {
    // Veritabanında kategori kaydını güncelle
    await Category.update({ name }, { where: { id: categoryid } }); // ✅ DÜZELTME: categoryid değişkenini kullan
    res.redirect("/admin/categories?action=edit"); // Başarılıysa kategori listesine yönlendir
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Kategori güncellenirken bir hata oluştu.");
  }
};

exports.get_blog_list = async function (req, res, next) {
  // Üçüncü middleware fonksiyonu
  try {
    const blogs = await Blog.findAll({
      attributes: ["id", "baslik", "altbaslik", "resim"],
      include: [
        {
          model: Category,
          attributes: ["name"],
          required: false, // ✅ DÜZELTME: LEFT JOIN yaparak kategorisi olmayan blogları da getir
        },
      ],
    }); // Veritabanından bloglar
    
    console.log("Bloglar:", blogs.map(blog => ({ 
      id: blog.id, 
      baslik: blog.baslik, 
      category: blog.category ? blog.category.name : 'NULL' 
    }))); // Debug için
    
    res.render("admin/blog-list", {
      title: "Blog Listesi",
      blogs: blogs,
      action: req.query.action,
    }); // Belirtilen blog sayfasına erişildiğinde cevap gönderir.req.query.action - yönlendirme için kullanılan query parametresi
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Bloglar alınırken bir hata oluştu.");
  }
};

exports.get_category_list = async function (req, res, next) {
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
};
