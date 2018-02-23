const express = require("express");
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('auth-views/signup-view.ejs');
})





module.exports = router;
