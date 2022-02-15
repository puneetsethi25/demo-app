const express = require("express");
const User = require("../models/User");
var router = express.Router();

/* GET users listing. */
router.get('/user', function (req, res, next) {
  User.findAll({}, (err, data) => {
    if (err) {
      res.send({ success: false, error: data })
    } else {
      res.send({ success: true, data: data });
    }
  });
});

router.post('/user/register', function (req, res, next) {
  User.register(req.body, (err, data) => {
    if (err) {
      res.send({ success: false, errorF: data })
    } else {
      res.send({ success: true, data: data });
    }
  })
});