var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve('views/admin.html'), { data: 123 })
})

router.post('/save-settings', function (req, res, next) {
    fs.writeFile(path.resolve('config/config.json'), JSON.stringify(req.body), function writeJSON(err) {
        if (err) {
            res.send({ success: false, data: err })
        } else {
            res.send({ success: true, data: req.body })
        }
    });
})
module.exports = router;