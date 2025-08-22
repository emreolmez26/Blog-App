const e = require("express");
const User = require("../models/user"); // User modelini içe aktar
const bcrypt = require("bcrypt"); // Bcrypt modülünü içe aktar

exports.get_register = async function (req, res) {
  try {
    return res.render("auth/register", {
      title: "Register",
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
    await User.create({
      fullname: name,
      email,
      password: hashedPassword,
    });
    return res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    return res.render("auth/register", {
      title: "Register",
      error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    });
  }
};

exports.get_login = async function (req, res) {
  try {
    return res.render("auth/login", {
      title: "Login",
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
          });
        }
        console.log("Session saved successfully");
        return res.redirect("/");
      });
    } else {
      return res.render("auth/login", {
        title: "Login",
        error: "Geçersiz şifre.",
      });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.render("auth/login", {
      title: "Login",
      error: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.",
    });
  }
};
