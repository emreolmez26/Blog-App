const {DataTypes} = require("sequelize");
const sequelize = require("../data/db"); // Sequelize veritabanı bağlantısını içe aktar


const Category = sequelize.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false
});




module.exports = Category;
