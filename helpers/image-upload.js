const multer = require("multer"); // Dosya yükleme middleware'ini içe aktar
const path = require("path"); // Dosya yollarını yönetmek için path modülünü içe aktar

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); // Yüklenen dosyaların kaydedileceği dizin
    },
    filename: function (req, file, cb) {
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname)); // Dosya adını benzersiz hale getir
    }
}); // Disk üzerinde depolama için yapılandırma
const upload = multer(
     { storage: storage }

); // Yüklenen dosyaların kaydedileceği dizin
module.exports.upload = upload; // upload middleware'ini dışa aktar