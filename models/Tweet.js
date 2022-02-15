var tweetData = require('../data/tweet.json')
const path = require('path');
const fs = require('fs');
const config = require('../config/config.json');

const Tweet = {
    findAll: (query, callback) => callback(false, tweetData),
    findTweetsby: function (data, callback) {
        var results = [];
        if (data.query && data.value) {
            if ('user' === data.query) {
                results = tweetData.filter(elem => elem.username == data.value)
            } else if ('location' === data.query) {
                results = tweetData.filter(elem => elem.location.toLowerCase() == data.value.toLowerCase())
            } else if ('hashtag' === data.query) {
                results = tweetData.filter(elem => elem.text.includes(`#${data.value}`))
            }
            callback(false, results);
        } else {
            callback(1, { error: "Missing required parameter" });
        }
    },
    searchTweets: function (data, callback) {
        var results = [];
        if (Object.keys(data).length > 0) {
            results = tweetData.filter(elem => {
                let matchedLoc, hash, text = false;
                if (data.location && elem.location == data.location)
                    matchedLoc = true;
                if (data.hashtag && elem.text.includes(data.hashtag))
                    hash = true;
                if (data.text && elem.text.includes(data.text))
                    text = true;
                if (matchedLoc || hash || text) {
                    return elem;
                }
            })
            callback(false, results);
        } else {
            callback(1, { error: "Missing required parameter" });
        }
    },
    add: async function (tweet, callback) {
        let limitReached = false, loc_alert = false; 
        if (tweet) {
            if(tweet.location.toLowerCase() === config.loc_alert.toLowerCase()) {
                loc_alert = true;
            }
            var total = tweetData.filter(elem => elem.username == tweet.username);
            if (total.length + 1 == config.tweet_limit) {
                tweet.limit_reached = true;
                limitReached = true;
            }
            tweetData.push({ ...tweet, id: tweetData.length + 1 });
            fs.writeFile(path.resolve('data/tweet.json'), JSON.stringify(tweetData), function writeJSON(err) {
                if (err) {
                    callback(true, err)
                }
                callback(false, { ...tweet, addBadge: limitReached, loc_alert: loc_alert })
            });
        } else {
            callback(true, { error: "Missing required parameters" });
        }
    }
}

module.exports = Tweet