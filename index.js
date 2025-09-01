//express
const express = require("express");
const app = express(); // Express uygulamasını başlat.

//node modules
const path = require("path");

//routes
const userRoutes = require("./routes/user"); // Kullanıcı rotalarını içe aktar
const adminRoutes = require("./routes/admin"); // Admin rotalarını içe aktar
const authRoutes = require("./routes/auth"); // Auth rotalarını içe aktar

const cookieParser = require("cookie-parser"); // Cookie parser modülünü içe aktar
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");

//custom modules
const sequelize = require("./data/db"); // Sequelize veritabanı bağlantısını içe aktarc
const dummyData = require("./data/dummy-data"); // Dummy verileri içe aktar
const locals = require("./middlewares/locals"); //middleware

//template engine
app.set("view engine", "ejs"); // Görünüm motoru olarak EJS kullan

//middleware
app.use(express.urlencoded({ extended: true })); // URL kodlamasını kullanmak için middleware ekle.
app.use(cookieParser()); // Cookie parser middleware'ini ekle
app.use(
  session({
    secret: "hello world",
    resave: false, // session üzerinde değişiklik yapılmadıysa tekrar kaydetme
    saveUninitialized: false, // yeni bir oturum oluşturulduğunda hemen kaydet
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 gün (24 saat * 60 dakika * 60 saniye * 1000 ms)
    },
    store: new SequelizeStore({
      db: sequelize, // Sequelize instance'ını ver
      tableName: "sessions", // Oturumları saklamak için tablo adı
      checkExpirationInterval: 15 * 60 * 1000, // Oturumların süresini kontrol etme aralığı (15 dakika)
      expiration: 24 * 60 * 60 * 1000, // Oturum süresi (1 gün)
    }),
  })
);
app.use(csurf()); // CSRF koruma middleware'ini ekle (locals'dan önce!)
app.use(locals); // Session ve CSRF'den sonra locals middleware'ini kullan

app.use("/libs", express.static("node_modules")); // Statik dosyaları sunmak için middleware ekle.
app.use("/assets", express.static(path.join(__dirname, "/public"))); // Statik dosyaları sunmak için middleware ekle.

//models
app.use(adminRoutes); // Admin rotalarını uygulamaya ekle.
app.use(userRoutes); // Kullanıcı rotalarını uygulamaya ekle.
app.use("/account", authRoutes); // Auth rotalarını uygulamaya ekle.

const Category = require("./models/category"); // Kategori modelini içe aktar
const Blog = require("./models/blog"); // Blog modelini içe aktar
const User = require("./models/user"); // User modelini içe aktar
const Role = require("./models/role"); // Role modelini içe aktar

//İlişkiler
//one to many - Bir kategori birden fazla bloga sahip, bir blog bir kategoriye ait
Category.hasMany(Blog, { foreignKey: "categoryId", allowNull: false });
Blog.belongsTo(Category, { foreignKey: "categoryId" });

//one to many - Bir user birden fazla bloga sahip, bir blog bir user'a ait
User.hasMany(Blog, { foreignKey: "userId", allowNull: true }); // userId kolonu ekle
Blog.belongsTo(User, { foreignKey: "userId" }); // Blog modeline User ile ilişki ekle

Role.belongsToMany(User, { through: "UserRoles" });
User.belongsToMany(Role, { through: "UserRoles" });

//Uygulanması -sync

//ııef
(async () => {
  // await sequelize.sync({ force: true }); // 🔄 Bir kerelik: userId kolonu eklemek için
  // await dummyData(); // Dummy data yükle
})();

app.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor...");
});
