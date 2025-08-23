module.exports = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken(); // CSRF tokenini yerel değişken olarak ayarla
  next();
};
