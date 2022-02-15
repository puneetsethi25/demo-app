var mongoose = require("mongoose");
var fs = require("fs");
const Tweet = require('../models/Tweet');

var onlineUsers = {};
module.exports = function (io) {
    var socket = io.of("/");
    socket.use(function (nsSocket, next) {
        // add all auth related validations here
        if (nsSocket.handshake.query && nsSocket.handshake.query.username) {
            var username = nsSocket.handshake.query.username;
            nsSocket.username = username;
            onlineUsers[username] = nsSocket;
        } else {
            next(new Error('Authentication error'));
        }
        next();
    }).on("connection", nsSocket => {
        var username = nsSocket.handshake.query.username;
        nsSocket.join(username);

        Tweet.findAll({}, function(err, data){
            if(!err){
                nsSocket.emit('history', data)
            }
        })
        nsSocket.on('disconnect', function (data) {
            delete onlineUsers[username];
            nsSocket.leave(username);
            io.emit('user_offline', { username: username })
        })

        nsSocket.on('new_tweet', function (data) {
            Tweet.add(data, function (err, data) {
                data
                if (!err) {
                    io.emit("new_tweet", data);
                }
            })
        })
    });
};