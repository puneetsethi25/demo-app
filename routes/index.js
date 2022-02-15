var express = require('express');
var router = express.Router();
const path = require('path');

/* GET renders home page for users */
router.get('/', function (req, res, next) {
  res.sendFile(path.resolve('views/index.html'))
});
router.get('/home', function (req, res, next) {
  if (req.query.username && req.query.location) {
    res.sendFile(path.resolve('views/tweets.html'))
  } else {
    res.redirect("/");
  }
});

module.exports = router;
