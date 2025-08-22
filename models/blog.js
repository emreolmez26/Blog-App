const {DataTypes} = require("sequelize");
const sequelize = require("../data/db"); // Sequelize veritabanı bağlantısını içe aktar

const Blog = sequelize.define("blog", {
  baslik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    url: {
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
});



module.exports = Blog;
 