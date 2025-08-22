const { DataTypes } = require("sequelize");
const sequelize = require("../data/db"); // Sequelize veritabanı bağlantısını içe aktar

const User = sequelize.define("user", {

    fullname:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true // Oluşturulma ve güncellenme tarihlerini otomatik ekler
})

module.exports = User; // User modelini dışa aktar