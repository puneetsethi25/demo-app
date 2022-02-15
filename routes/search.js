var express = require('express');
const Tweet = require("../models/Tweet");
var router = express.Router();

router.get('/tweets', function (req, res, next) {
    Tweet.searchTweets(req.query, (err, data) => {
        if (err) {
            res.send({ success: false, error: data })
        } else {
            res.send({ success: true, data: data });
        }
    })
});

module.exports = router;
