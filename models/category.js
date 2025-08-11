const {DataTypes} = require("sequelize");
const sequelize = require("../data/db"); // Sequelize veritabanı bağlantısını içe aktar

const Category = sequelize.define("category", {
  categoryid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false
});

async function syncCategoryModel() {
  await Category.sync({alter: true}); // Modeli veritabanında oluştur
  console.log("Category modeli veritabanında oluşturuldu.");
  // const c1 = await Category.create({ name: "Web Geliştirme" });
  // const c2 = await Category.create({ name: "Mobil Uygulama" });
  // const c3 = await Category.create({ name: "Oyun Geliştirme" });

  const count = await Category.count(); // Kategori tablosundaki kayıt sayısını al

  if (count == 0) {
    await Category.bulkCreate([
      { name: "Web Geliştirme" },
      { name: "Mobil Uygulama" },
      { name: "Oyun Geliştirme" }
    ]); // Kategorileri veritabanına ekle
  }
}

syncCategoryModel();

module.exports = Category;
