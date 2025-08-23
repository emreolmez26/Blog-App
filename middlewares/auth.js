module.exports = (req,res, next) =>  {
  if (!req.session.isLoggedIn) {
    return res.redirect("/account/login?returnUrl="+req.originalUrl);
  }
  next();
}