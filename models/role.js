const {DataTypes} = require("sequelize");
const sequelize = require("../data/db"); // Sequelize veritabanı bağlantısını içe aktar


const Role = sequelize.define("role", {
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});




module.exports = Role;
