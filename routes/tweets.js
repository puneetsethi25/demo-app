const express = require("express");
var router = express.Router();
const Tweet = require("../models/Tweet");

/* GET tweets listing. */
router.get('/', function (req, res, next) {
    Tweet.findAll({}, (err, data) => {
        if (err) {
            res.send({ success: false, error: data })
        } else {
            res.send({ success: true, data: data });
        }
    });
});

router.get('/by/user/:username', function (req, res, next) {
    Tweet.findTweetsby({ query: 'user', value: req.params.username }, (err, data) => {
        if (err) {
            res.send({ success: false, error: data })
        } else {
            res.send({ success: true, data: data });
        }
    })
});

router.get('/by/location/:location', function (req, res, next) {
    Tweet.findTweetsby({ query: 'location', value: req.params.location }, (err, data) => {
        if (err) {
            res.send({ success: false, error: data })
        } else {
            res.send({ success: true, data: data });
        }
    })
});

router.get('/by/hashtag/:hashtag', function (req, res, next) {
    Tweet.findTweetsby({ query: 'hashtag', value: req.params.hashtag }, (err, data) => {
        if (err) {
            res.send({ success: false, error: data })
        } else {
            res.send({ success: true, data: data });
        }
    })
});

module.exports = router;
