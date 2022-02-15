const Tweet = require('../models/Tweet');
const config = require('../config/config.json');

var onlineUsers = {};
module.exports = function (io) {
    var socket = io.of("/");
    socket.use(function (nsSocket, next) {
        /**
         * @todo implement authentication OAuth 
         * Add all auth related middlewares here. OAuth or JWT
         * 
         * NOTE: this can also be done in app.js on global level
         */
        if (nsSocket.handshake.query && nsSocket.handshake.query.username) {
            var username = nsSocket.handshake.query.username;
            nsSocket.username = username;
            onlineUsers[username] = nsSocket;
        } else {
            next(new Error('Authentication error'));
        }
        next();
    }).on("connection", nsSocket => {

        /**
         * when a new connection joins we store its username (assuming it to be unique for now)
         * then adding the username as a 'key' in "onlineUser" object, to use that for finding
         * list of online users. 
         * For eg. All keys in the 'onlineUser' object will be the users currently online.
         * NOTE: Upon disconncting the username/key from the object will be removed, means the 
         * user is no longer online. 
         */
        var username = nsSocket.handshake.query.username;
        nsSocket.join(username);

        /** 
         * sending current list of tweets the newly joined user. 
         * @TODO Depending upon app's requirement we can implement RBAC here
         */
        Tweet.findAll({}, function (err, data) {
            if (!err) {
                nsSocket.emit('history', data)
            }
        })
        /**
         * upon disconnection releasing the socket and removing the user from onlineUser object
         */
        nsSocket.on('disconnect', function (data) {
            delete onlineUsers[username];
            nsSocket.leave(username);
            /** 
             * Broadcasting 'user_offline' event to all clients incase any actions need to perform
             */
            io.emit('user_offline', { username: username })
        })

        /**
         * "new_tweet" event is triggered whenver a new tweet is posted by any user
         * 
         */
        nsSocket.on('new_tweet', function (data) {
            Tweet.add(data, function (err, data) {
                // check if tweet is from preferred location 
                if (data.location == config.loc_alert) {
                    // perform action here like triggering third party API 
                }
                if (!err) {
                    io.emit("new_tweet", data);
                }
            })
        })
    });
};