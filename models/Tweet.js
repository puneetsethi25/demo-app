var tweetData = require('../db/tweet.json')
const path = require('path');
const fs = require('fs');
const config = require('../config/config.json');

/**
 * Base Tweet Model. Has all methods needed to be operted on Tweets.
 * 
 * CRUD operations related to Tweets exist in this model. 
 * 
 * @todo Move the operations to PostgresQL
 * 
 */
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
    /**
     * 
     * @param {*} data 
     * @param {*} callback 
     */
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
    /**
     * adds a new tweet into the database. Adds the incremented `id` for each tweet entered
     * @returns void
     * 
     * @param {*} tweet Object with keys - text, location, username  
     * @param {*} callback function that is called upon execution with 2 arguments. `arg1`=`error?` and `arg2`=data
     */
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
            fs.writeFile(path.resolve('db/tweet.json'), JSON.stringify(tweetData), function writeJSON(err) {
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