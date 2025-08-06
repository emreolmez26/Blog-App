const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user'); // Kullanıcı rotalarını içe aktar
const adminRoutes = require('./routes/admin'); // Admin rotalarını içe aktar


const app = express(); // Express uygulamasını başlat.
app.set('view engine', 'ejs'); // Görünüm motoru olarak EJS kullan
app.use(express.urlencoded({ extended: true })); // URL kodlamasını kullanmak için middleware ekle.



app.use("/libs", express.static('node_modules')); // Statik dosyaları sunmak için middleware ekle.
app.use("/assets", express.static(path.join(__dirname, "/public"))); // Statik dosyaları sunmak için middleware ekle.

app.use(adminRoutes); // Admin rotalarını uygulamaya ekle.
app.use(userRoutes); // Kullanıcı rotalarını uygulamaya ekle.




app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor...');
});