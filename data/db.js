const mysql = require('mysql2'); // MySQL modülünü içe aktar
const config = require('../config'); // Yapılandırma dosyasını içe aktar

let connection = mysql.createConnection(config.db); // MySQL bağlantısını oluştur 

connection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantısı başarısız:', err);
  } else {
    
    console.log('MySQL bağlantısı başarılı!');
  }
});

module.exports = connection.promise(); // Bağlantıyı dışa aktar