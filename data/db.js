const config = require('../config'); // Yapılandırma dosyasını içe aktar

const Sequelize = require('sequelize'); // Sequelize modülünü içe aktar

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, { //config dosyası
  host: config.db.host,
  dialect: 'mysql',
  storage: './session.mysql' // SQLite için storage yolu

});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize bağlantısı başarılı!');
  } catch (error) {
    console.error('Sequelize bağlantısı başarısız:', error);
  }
}

testConnection();



module.exports = sequelize;

// let connection = mysql.createConnection(config.db); // MySQL bağlantısını oluştur 

// connection.connect((err) => {
//   if (err) {
//     console.error('MySQL bağlantısı başarısız:', err);
//   } else {
    
//     console.log('MySQL bağlantısı başarılı!');
//   }
// });

// module.exports = connection.promise(); // Bağlantıyı dışa aktar