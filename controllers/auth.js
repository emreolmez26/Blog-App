const e = require("express");
const User = require("../models/user"); // User modelini içe aktar
const bcrypt = require("bcrypt"); // Bcrypt modülünü içe aktar
const emailService = require("../helpers/send-mail");
const crypto = require("crypto");

exports.get_register = async function (req, res) {
  try {
    return res.render("auth/register", {
      title: "Register",
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error("Error rendering register page:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.post_register = async function (req, res) {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.session.message = "Bu e-posta adresi zaten kayıtlı.";
      return res.redirect("/account/login");
    }
    const newUser = await User.create({
      fullname: name,
      email,
      password: hashedPassword,
    });

    emailService.sendEmail({
      from: config.email.auth.user,
      to: newUser.email,
      subject: "Kayıt Başarılı",
      text: "Kayıt işleminiz başarıyla tamamlandı."
    });

    return res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    return res.render("auth/register", {
      title: "Register",
      error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      csrfToken: req.csrfToken(),
    });
  }
};

exports.get_login = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "Login",
      error: message,
      csrfToken: req.csrfToken(), // CSRF token'ını template'e gönder
    });
  } catch (error) {
    console.error("Error rendering login page:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.get_logout = async function (req, res) {
  try {
    req.session.destroy();
    return res.redirect("/account/login");
  } catch (error) {
    console.error("Error rendering login page:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.post_login = async function (req, res) {
  const { email, password } = req.body;
  try {
    console.log("Login attempt:", { email, password }); // Debug
    
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user ? "Yes" : "No"); // Debug

    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        error: "Kullanıcı bulunamadı.",
        csrfToken: req.csrfToken(),
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
  

    if (isValid) {
      req.session.isLoggedIn = true; 
      req.session.fullName = user.fullname;

      // Session'ı kaydetmeyi force edelim
      req.session.save((err) => {
        if (err) {
          console.log("Session save error:", err);
          return res.render("auth/login", {
            title: "Login",
            error: "Session kaydedilemedi.",
            csrfToken: req.csrfToken(),
          });
        }
        console.log("Session saved successfully");
        return res.redirect("/");
      });
    } else {
      return res.render("auth/login", {
        title: "Login",
        error: "Geçersiz şifre.",
        csrfToken: req.csrfToken(),
      });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.render("auth/login", {
      title: "Login",
      error: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      csrfToken: req.csrfToken(),
    });
  }
};

exports.get_reset_password = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/reset-password", {
      title: "Reset Password",
      error: message,
    });
  } catch (error) {
    console.error("Error rendering reset password page:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.post_reset_password = async function (req, res) {
  const email = req.body.email;
  try{
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email } });

    if (!user) {
      req.session.message = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
      return res.redirect("/account/login");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 saat sonra geçerliliği bitecek

    await user.save();

      emailService.sendEmail({
      from: config.email.auth.user,
      to: user.email,
      subject: "Şifre Sıfırlama",
      text: `Şifre sıfırlama linkiniz: ${config.app.url}/account/reset-password/${token}`
    });

    req.session.message = "Şifre sıfırlama linki e-posta adresinize gönderildi.";
    res.redirect("/account/login");
  }
  catch{
    req.session.message = "Şifre sıfırlama işlemi sırasında bir hata oluştu.";
    return res.redirect("/account/login");
  }
};
