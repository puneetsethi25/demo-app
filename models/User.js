
var userData = require('../db/user.json')
const path = require('path');
const fs = require('fs');

/**
 * Basic User model for all user related operations
 */
const User = {
    findAll: (query, callback) => callback(false, userData),
    register: function (post, callback) {
        if (post) {
            userData.push(post);
            fs.writeFile(path.resolve('db/user.json'), JSON.stringify(userData), function writeJSON(err) {
                if (err) {
                    callback(true, err)
                }
                callback(false, userData)
            });
        } else {
            callback(true, { error: "Missing required parameters" });
        }
    },
    userupdate: function (post, callback) {
        if (!post.user_id) {
            callback(true, { error: "Missing required Parameter" })
        } else {
            
        }
    },
    findUsers: function (data, callback) {
        if (data.keyword && data.user_id) {
            
        } else {
            callback(1, { error: "Missing required parameter" });
        }
    }
}

module.exports = User