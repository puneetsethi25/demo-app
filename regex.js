var regEx = /^(\d+)\s+tweets\s+from\s+user\s+(\w+)/gm
var data = "10 tweets from user pouneet";

var match = regEx.exec(data);
var query = {};
if (match !== null) {
    query = { username: match[2], tweets: match[1] };
} else {
    query = "Not a graph search";
}
console.log(query);