/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const passport = require('../helpers/passport');
const bcryptSalt = 10;

//
// ──────────────────────────────────────────────────── I ──────────
//   :::::: S I G N U P : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//

router.get('/signup', function(req, res, next) {
  res.render('signup', { "message": req.flash("error") });
});

router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  if (username === "" || password === "") {
  	req.flash('error', 'Indicate username and password' );
    res.render("signup", { "message": req.flash("error") });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
    	req.flash('error', 'The username already exists' );
      res.render("signup", { message: req.flash("error") });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass,
      firstName,
      lastName,
    });

    newUser.save((err) => {
      if (err) {
      	req.flash('error', 'The username already exists' );
        res.render("signup", { message: req.flash('error') });
      } else {
        passport.authenticate("local")(req, res, function () {
           res.redirect('/userProfile');
        });
      }
    });
  });
});
//
// ──────────────────────────────────────────────────── II ──────────
//   :::::: L O G O U T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
router.get("/logout", (req, res) => {
  req.logout();
  delete res.locals.currentUser;
  delete req.session.passport;
  // delete currentUser and passport properties
  // becasuse when we calling req.logout() is leaving an empty object inside both properties.
  res.redirect('/');
});

//
// ──────────────────────────────────────────────────────────────────── III ──────────
//   :::::: A U T H E N T I C A T I O N : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
//
router.get("/auth/facebook",          passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/userProfile",
  failureRedirect: "/"
}));

router.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

router.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/userProfile",
  failureRedirect: "/"
}));

module.exports = router;
