
/**
 * Script for admin page. This file has all methods needed for operations on admin page
 * 
 * Also, the graph search impemented here. Based on the input valuein the search bar. The text is parsed and 
 * sent to the /graphql route.
 */
var form = document.getElementById('app-config');

var input = document.getElementById('tweets_limit');
var tweetLoc = document.getElementById('loc_alert');

var search = document.getElementById('search');
var searchInput = document.getElementById('search-input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value || tweetLoc.value) {
        $.ajax({
            url: `/admin/save-settings`,
            method: 'post',
            data: { loc_alert: tweetLoc.value, tweet_limit: input.value },
            success: function (data) {
                if (data.success) {
                    alert("Settings saved");
                } else {
                    alert("Error saving settings!");
                }
            }
        })
    }
});

search.addEventListener('submit', function (e) {
    e.preventDefault();
    if (searchInput.value) {
        var regEx = /^(\d+)\s+tweets\s+from\s+user\s+(\w+)/gm
        var data = searchInput.value;
        let queryData = "", limit = 20, username = '', location = '', text = '', hashtag = '';

        var match = regEx.exec(data);
        if (match !== null) {
            username = match[2];
            limit = match[1];
        } else {
            if (searchInput.value.includes('#')) {
                hashtag = searchInput.value;
            } else if (searchInput.value.includes('@')) {
                username = searchInput.value.replace('@', '');
            } else {
                text = searchInput.value;
            }
        }

        queryData = {
            query: ` query ($limit: Int, $text: String, $username: String, $location: String, $hashtag: String ) {\n        Tweets(limit: $limit, username: $username, text: $text, hashtag: $hashtag, location: $location) {\n            fetch {\n            id\n            text\n            username\n            location\n            }\n        }\n    } `,
            variables: { "limit": parseInt(limit), "text": text, "hashtag": hashtag, "username": username, "location": location }
        };

        var settings = {
            "url": "/graphql",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(queryData)
        };

        $.ajax(settings)
            .done(function (response) {
                document.getElementById("search-results").innerHTML = JSON.stringify({results: response.data.Tweets.fetch}, null, '\t');
            });
    }
});