console.log("checking mongodb connection...");
var mongoose = require('mongoose');
const DB_STRING = 'mongodb://localhost:27017/swym_test';

mongoose.connect(DB_STRING, {},
    function (error, result) {
        if (error) {
            console.log("[!][!][!][!][!][!]MongoDB connection error: [!][!][!][!][!][!]", error);
        }else{
            console.log(`
            √√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√
            √√                             √√
            √√      MongoDB Connected!     √√
            √√                             √√
            √√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√√`);
        }
    }
);

