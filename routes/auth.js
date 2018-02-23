const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

const router = express.Router();

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('auth-views/signup-view.ejs');
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

router.get("/login", ensureLoggedOut(), (req, res) => {
  res.render("auth-views/login-view");
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});



module.exports = router;
