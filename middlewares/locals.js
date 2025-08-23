module.exports = (req, res, next) => { //middleware
  res.locals.isLoggedIn = req.session.isLoggedIn // Oturum bilgisini yerel değişken olarak ayarla
  res.locals.fullName = req.session.fullName || ""; // Kullanıcının tam adını yerel değişken olarak ayarla
  next();
}