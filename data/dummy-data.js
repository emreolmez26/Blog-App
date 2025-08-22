const Category = require("../models/category"); // Kategori modelini içe aktar
const Blog = require("../models/blog"); // Blog modelini içe aktar
const slugify = require("../helpers/slugify"); // Slugify fonksiyonunu içe aktar
const User = require("../models/user"); // User modelini içe aktar
const bcrypt = require("bcrypt"); // Bcrypt modülünü içe aktar

async function sync() {
  const categoryCount = await Category.count(); // Kategori sayısını kontrol et
  const blogCount = await Blog.count(); // Blog sayısını kontrol et

  // Sadece hem kategoriler hem bloglar boşsa dummy data yükle
  if (categoryCount == 0 && blogCount == 0) {
    const categories = await Category.bulkCreate([
      { name: "Web Geliştirme", url: slugify("Web Geliştirme") },
      { name: "Mobil Uygulama", url: slugify("Mobil Uygulama") },
      { name: "Oyun Geliştirme", url: slugify("Oyun Geliştirme") },
    ]); // Kategorileri veritabanına ekle

    const blogs = await Blog.bulkCreate([
      {
        baslik: "Web Geliştirme",
        url: slugify("Web Geliştirme"),
        altbaslik: "Frontend ve Backend",
        aciklama: "Web geliştirme ile ilgili her şey.",
        resim: "2.webp",
        anasayfa: true,
        categoryId: "1", // Web Geliştirme kategorisi
      },
      {
        baslik: "Mobil Uygulama",
        url: slugify("Mobil Uygulama"),
        altbaslik: "iOS ve Android",
        aciklama: "Mobil uygulama geliştirme hakkında bilgiler.",
        resim: "3.png",
        anasayfa: false,
        categoryId: "2", // Mobil Uygulama kategorisi
      },
      {
        baslik: "Oyun Geliştirme",
        url: slugify("Oyun Geliştirme"),
        altbaslik: "Unity ve Unreal Engine",
        aciklama: "Oyun geliştirme süreçleri ve teknikleri.",
        resim: "5.png",
        anasayfa: false,
        categoryId: "3", // Oyun Geliştirme kategorisi
      },
      {
        baslik: "Ofis Uygulamaları",
        url: slugify("Ofis Uygulamaları"),
        altbaslik: "Excel",
        aciklama: "Ofis uygulamaları ile ilgili bilgiler.",
        resim: "Smart-City.jpg",
        anasayfa: false,
        categoryId: "2", // Mobil Uygulama kategorisi
      },
    ]);
    // Dummy kullanıcı oluşturma
    const hashedPassword = await bcrypt.hash("password", 10);
    await User.create({
      fullname: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    });

  } else {
    console.log("ℹ️ Dummy data zaten mevcut, yükleme atlandı");
  }
}

module.exports = sync; // Fonksiyonu dışa aktar
