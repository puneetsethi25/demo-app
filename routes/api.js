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

router.get('/tweets', function (req, res, next) {
  Tweet.findAll({}, (err, data) => {
    if (err) {
      res.send({ success: false, error: data })
    } else {
      res.send({ success: true, data: data });
    }
  });
});

router.get('tweets/by-user/:username', function (req, res, next) {
  Tweet.findTweetsby({ query: 'user', value: req.params.username }, (err, data) => {
    if (err) {
      res.send({ success: false, error: data })
    } else {
      res.send({ success: true, data: data });
    }
  })
});

router.get('tweets/by-location/:location', function (req, res, next) {
  Tweet.findTweetsby({ query: 'location', value: req.params.location }, (err, data) => {
    if (err) {
      res.send({ success: false, error: data })
    } else {
      res.send({ success: true, data: data });
    }
  })
});

router.get('tweets/by-hashtag/:hashtag', function (req, res, next) {
  Tweet.findTweetsby({ query: 'hashtag', value: req.params.hashtag }, (err, data) => {
    if (err) {
      res.send({ success: false, error: data })
    } else {
      res.send({ success: true, data: data });
    }
  })
});

module.exports = router;
