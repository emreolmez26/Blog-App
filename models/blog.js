const {DataTypes} = require("sequelize");
const sequelize = require("../data/db"); // Sequelize veritabanı bağlantısını içe aktar
const { all } = require("../routes/user");

const Blog = sequelize.define("blog", {
    blogid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  baslik: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  altbaslik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  anasayfa: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  categoryid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

async function syncBlogModel() {
  await Blog.sync({alter: true}); // Modeli veritabanında oluştur
  console.log("Blog modeli veritabanında oluşturuldu.");

  const count = await Blog.count(); // Blog tablosundaki kayıt sayısını al

  if (count == 0) {
    await Blog.bulkCreate([
      {
      baslik: "Web Geliştirme",
      altbaslik: "Frontend ve Backend",
      aciklama: "Web geliştirme ile ilgili her şey.",
      resim: "web-gelistirme.jpg",
      anasayfa: true,
      categoryid: 1,
    },
    {
      baslik: "Mobil Uygulama",
      altbaslik: "iOS ve Android",
      aciklama: "Mobil uygulama geliştirme hakkında bilgiler.",
      resim: "mobil-uygulama.jpg",
      anasayfa: false,
      categoryid: 2,
    },
    {
      baslik: "Oyun Geliştirme",
      altbaslik: "Unity ve Unreal Engine",
      aciklama: "Oyun geliştirme süreçleri ve teknikleri.",
      resim: "oyun-gelistirme.jpg",
      anasayfa: false,
      categoryid: 3,
    },
  ]);
}

}

syncBlogModel();

module.exports = Blog;
 